import {
  loadWall, placeTile, watchWall, validate, markSigned, mySignature,
  isShared, MuralError, FIRST_NOTE, WALL_OPENS_AT,
  type Tile, type DraftTile,
} from '../lib/mural';

function timeAgo(iso: string): string {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** A small deterministic tilt, so a note looks the same on every render. */
function tiltFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return `${((Math.abs(hash) % 300) / 100 - 1.5).toFixed(2)}deg`;
}

export function initGuestBook() {
  const form = document.getElementById('signer') as HTMLFormElement | null;
  const list = document.getElementById('notes');
  if (!form || !list || form.dataset.wired === 'true') return;
  form.dataset.wired = 'true';

  const countEl = document.getElementById('gCount')!;
  const emptyEl = document.getElementById('gEmpty')!;
  const errorEl = document.getElementById('gError')!;
  const go = document.getElementById('gGo') as HTMLButtonElement;
  const nameInput = document.getElementById('gName') as HTMLInputElement;
  const noteInput = document.getElementById('gNote') as HTMLInputElement;

  let tiles: Tile[] = [];
  // Re-read on every render: signing updates it, and a value captured once at
  // init leaves the "yours" marker stuck on whatever was there before.
  let mine = mySignature();

  function render(freshId?: string) {
    mine = mySignature();
    emptyEl.hidden = true;

    const total = tiles.length;
    const open = total >= WALL_OPENS_AT;

    // Below the threshold the wall is just Mari's note plus yours, if you left
    // one. Your own note always shows: signing and seeing nothing happen is
    // the one failure this feature cannot afford.
    const shown = open
      ? [...tiles]
      : tiles.filter((t) => mine?.id === t.id);

    const bits: string[] = [];
    if (open) {
      bits.push(total === 1 ? '1 colour on the wall' : `${total} colours on the wall`);
    } else if (shown.length) {
      bits.push('yours is up. the rest of the wall opens once a few more people sign');
    } else {
      bits.push('be the first to leave a colour');
    }
    if (!isShared) bits.push('saved to this browser until the wall is connected');
    countEl.textContent = bits.join(' · ');

    // Newest first, with Mari's note anchored at the end as the wall's opener.
    const ordered = [...shown.reverse(), FIRST_NOTE];
    list.replaceChildren(
      ...ordered.map((t) => {
        const li = document.createElement('li');
        li.className = 'note';
        if (mine?.id === t.id) li.classList.add('note--mine');
        if (freshId === t.id) li.classList.add('note--fresh');
        li.style.setProperty('--note-colour', t.color);
        li.style.setProperty('--tilt', tiltFor(t.id));

        const text = document.createElement('p');
        text.className = 'note__text';
        text.textContent = t.note || '✦';

        const meta = document.createElement('p');
        meta.className = 'note__meta';
        const who = document.createElement('span');
        who.className = 'note__who';
        who.textContent = t.name;
        const when = document.createElement('span');
        when.textContent = timeAgo(t.created_at);
        meta.append(who, when);

        li.append(text, meta);
        return li;
      }),
    );
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const draft: DraftTile = {
      color: String(data.get('colour')),
      name: String(data.get('name') || ''),
      note: String(data.get('note') || ''),
    };

    const problem = validate(draft);
    if (problem) { errorEl.textContent = problem; return; }
    errorEl.textContent = '';

    go.disabled = true;
    const label = go.textContent;
    go.textContent = 'leaving it…';

    try {
      const tile = await placeTile(draft);
      tiles.push(tile);
      markSigned(tile);
      nameInput.value = '';
      noteInput.value = '';
      render(tile.id);

      const rect = go.getBoundingClientRect();
      (window as any).__sparkle?.(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
      (window as any).__toast?.('your colour is on the wall ✦');
    } catch (err) {
      errorEl.textContent = err instanceof MuralError ? err.message : 'Something went wrong.';
    } finally {
      go.disabled = false;
      go.textContent = label;
    }
  });

  (async () => {
    try {
      tiles = await loadWall();
    } catch {
      countEl.textContent = "Couldn't load the wall right now. Refresh to try again.";
    }
    render();

    // Somebody else signing while you're here is the point of it being shared.
    const stop = await watchWall((tile) => {
      if (tiles.some((t) => t.id === tile.id)) return;
      tiles.push(tile);
      render(tile.id);
    });
    document.addEventListener('astro:before-swap', stop, { once: true });
  })();
}
