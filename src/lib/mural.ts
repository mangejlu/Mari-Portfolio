/**
 * The mural's data layer.
 *
 * Two interchangeable backends behind one interface:
 *
 *   - Supabase, when the two public env vars are set. Shared, persistent,
 *     realtime.
 *   - Browser storage, when they are not. Lets the whole experience be built
 *     and reviewed before anyone creates an account, and keeps the swap to a
 *     single conditional rather than a rewrite.
 *
 * The site is static, so this runs in the browser with the anon key. Every
 * rule that actually matters (colour allowlist, length caps, profanity, rate
 * limits, one-tile-per-cell) is enforced by Postgres. Nothing here is a
 * security boundary; it exists to give fast feedback before the round trip.
 */

export const PALETTE = [
  { hex: '#BFE28C', name: 'sprout' },
  { hex: '#F5AFC9', name: 'blush' },
  { hex: '#F5B48C', name: 'peach' },
  { hex: '#AFD9F5', name: 'sky' },
  { hex: '#D6BEF5', name: 'lilac' },
  { hex: '#FFF2A8', name: 'butter' },
] as const;

export interface Tile {
  id: string;
  color: string;
  name: string;
  note: string | null;
  created_at: string;
}

/**
 * Mari's own note, always first on the wall.
 *
 * A guestbook with nothing in it reads as "nobody came", which is a worse
 * first impression than having no guestbook. This is a real note from the
 * owner rather than invented traffic, so the wall opens warm without
 * pretending anyone else has been here. Edit the text freely.
 */
export const FIRST_NOTE: Tile = {
  id: 'first-note',
  color: '#F5AFC9',
  name: 'mari',
  note: 'started the wall. leave a colour so it is not just me here.',
  created_at: '2026-08-29T00:00:00.000Z',
};

/**
 * How many visitor notes before everyone's notes are shown.
 *
 * Below this the wall shows only Mari's note and your own, because two lonely
 * squares look like a failed launch. Your own note always appears the moment
 * you sign: an action that produces no visible result reads as broken, and no
 * amount of tidiness is worth that.
 */
export const WALL_OPENS_AT = 3;

export interface DraftTile {
  color: string;
  name: string;
  note: string;
}

const URL_KEY = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isShared = Boolean(URL_KEY && ANON_KEY);

/* ------------------------------------------------------------------ *
 *  Signer fingerprint
 * ------------------------------------------------------------------ */

/**
 * A stable, salted, non-reversible id for rate limiting.
 *
 * Deliberately not a device fingerprint: it is a random value this browser
 * generates once and keeps. It identifies a browser to itself, tells us
 * nothing about the person, and clearing site data resets it. That is the
 * right trade for a guestbook, where the cost of a determined duplicate is
 * one extra coloured square.
 */
export function signerId(): string {
  const KEY = 'mural:signer';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Private mode with storage disabled. Ephemeral id, still rate limited
    // by the global ceiling in the database.
    return crypto.randomUUID();
  }
}

/** Records locally that this browser has signed, for instant UI feedback. */
export function markSigned(tile: Tile) {
  try {
    localStorage.setItem('mural:mine', JSON.stringify({ id: tile.id }));
  } catch { /* storage unavailable; the wall still works */ }
}

export function mySignature(): { id: string } | null {
  try {
    const raw = localStorage.getItem('mural:mine');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 *  Client-side pre-checks (feedback only, never trusted)
 * ------------------------------------------------------------------ */

const BLOCKED = [
  'fuck', 'shit', 'bitch', 'cunt', 'nigg', 'fag', 'rape', 'whore', 'slut',
  'puta', 'pendejo', 'mierda', 'verga', 'joto', 'maricon', 'culero', 'cabron',
];

export function validate(draft: DraftTile): string | null {
  const name = draft.name.trim();
  if (!name) return 'Your name, first.';
  if (name.length > 24) return "That name's a bit long for a tile.";
  if (draft.note.length > 80) return 'Keep the note under 80 characters.';
  if (!PALETTE.some((p) => p.hex === draft.color)) return 'Pick one of the colours.';

  const haystack = `${name} ${draft.note}`.toLowerCase();
  if (BLOCKED.some((w) => haystack.includes(w))) return "Let's keep the wall friendly.";
  if (/(https?:\/\/|www\.|\.com|\.net)/.test(haystack)) return 'No links on the wall, sorry.';
  return null;
}

/* ------------------------------------------------------------------ *
 *  Backends
 * ------------------------------------------------------------------ */

type Client = import('@supabase/supabase-js').SupabaseClient;
let client: Client | null = null;

async function supabase(): Promise<Client> {
  if (client) return client;
  const { createClient } = await import('@supabase/supabase-js');
  client = createClient(URL_KEY!, ANON_KEY!, {
    auth: { persistSession: false },
  });
  return client;
}

const LOCAL_KEY = 'mural:local-wall';

function localWall(): Tile[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Every tile on the wall, oldest first. */
export async function loadWall(): Promise<Tile[]> {
  if (!isShared) return localWall();

  const db = await supabase();
  const { data, error } = await db
    .from('mural_wall')
    .select('id, color, name, note, created_at')
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Tile[];
}

export class MuralError extends Error {
  constructor(message: string, readonly kind: 'rejected' | 'network') {
    super(message);
  }
}

export async function placeTile(draft: DraftTile): Promise<Tile> {
  if (!isShared) {
    const wall = localWall();
    const tile: Tile = {
      id: crypto.randomUUID(),
      color: draft.color,
      name: draft.name.trim(),
      note: draft.note.trim() || null,
      created_at: new Date().toISOString(),
    };
    wall.push(tile);
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(wall));
    } catch { /* nothing to do */ }
    return tile;
  }

  const db = await supabase();
  const { data, error } = await db
    .from('mural_tiles')
    .insert({
      color: draft.color,
      name: draft.name.trim(),
      note: draft.note.trim() || null,
      signer: signerId(),
    })
    .select('id, color, name, note, created_at')
    .single();

  if (error) {
    if (/already signed today/i.test(error.message)) {
      throw new MuralError("You've already left a colour today. Come back tomorrow.", 'rejected');
    }
    if (/language|links/i.test(error.message)) {
      throw new MuralError("Let's keep the wall friendly.", 'rejected');
    }
    if (/too busy/i.test(error.message)) {
      throw new MuralError('The wall is busy right now. Try again in a moment.', 'rejected');
    }
    throw new MuralError("Couldn't reach the wall. Check your connection.", 'network');
  }

  return data as Tile;
}

/**
 * Calls `onTile` when anyone else places one. Returns an unsubscribe function.
 * A no-op without Supabase, since there is nobody else to hear from.
 */
export async function watchWall(onTile: (tile: Tile) => void): Promise<() => void> {
  if (!isShared) return () => {};

  const db = await supabase();
  const channel = db
    .channel('mural')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'mural_tiles' },
      (payload) => onTile(payload.new as Tile),
    )
    .subscribe();

  return () => { db.removeChannel(channel); };
}
