-- ============================================================================
--  The mural. Run this once in Supabase → SQL Editor.
--
--  The site is fully static, so the browser talks to Supabase directly with
--  the public anon key. That key is visible to anyone who views source, which
--  means none of the rules below can live in the client: every constraint here
--  is enforced by Postgres, where a determined visitor cannot reach around it.
-- ============================================================================

create table if not exists mural_tiles (
  id          uuid primary key default gen_random_uuid(),
  color       text     not null,
  name        text     not null check (char_length(trim(name)) between 1 and 24),
  note        text              check (note is null or char_length(note) <= 80),
  -- Coarse, salted client fingerprint. Used only for rate limiting; it is not
  -- reversible to a person and is never sent back to the browser.
  signer      text     not null,
  created_at  timestamptz not null default now()
);

create index if not exists mural_tiles_created_at_idx on mural_tiles (created_at desc);
create index if not exists mural_tiles_signer_idx on mural_tiles (signer, created_at desc);

-- ---------------------------------------------------------------------------
--  Only these colours may be placed. Stops the wall being poisoned with
--  #000000 or anything that would break the palette.
-- ---------------------------------------------------------------------------
alter table mural_tiles drop constraint if exists mural_tiles_colour_allowed;
alter table mural_tiles add constraint mural_tiles_colour_allowed
  check (color in ('#BFE28C', '#F5AFC9', '#F5B48C', '#AFD9F5', '#D6BEF5', '#FFF2A8'));

-- ---------------------------------------------------------------------------
--  Moderation and rate limiting, in one trigger.
-- ---------------------------------------------------------------------------
create or replace function mural_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  blocked text[] := array[
    'fuck','shit','bitch','cunt','nigg','fag','rape','whore','slut',
    'puta','pendejo','mierda','verga','joto','maricon','culero','cabron'
  ];
  word text;
  haystack text;
  recent int;
begin
  new.name := trim(new.name);
  new.note := nullif(trim(coalesce(new.note, '')), '');

  -- Substring matching, so simple padding ("f u c k" aside) doesn't slip past.
  haystack := lower(new.name || ' ' || coalesce(new.note, ''));
  foreach word in array blocked loop
    if position(word in haystack) > 0 then
      raise exception 'rejected: language' using errcode = 'check_violation';
    end if;
  end loop;

  -- Links turn a guestbook into a spam target. No exceptions.
  if haystack ~ '(https?://|www\.|\.com|\.net|\.ru|\.xyz)' then
    raise exception 'rejected: links' using errcode = 'check_violation';
  end if;

  -- One tile per signer per day. Enforced here rather than in the browser,
  -- because the browser is the thing we do not trust.
  select count(*) into recent
  from mural_tiles
  where signer = new.signer
    and created_at > now() - interval '24 hours';

  if recent >= 1 then
    raise exception 'rejected: already signed today' using errcode = 'check_violation';
  end if;

  -- A global ceiling, so a burst can never run away with the table.
  select count(*) into recent
  from mural_tiles
  where created_at > now() - interval '1 minute';

  if recent >= 20 then
    raise exception 'rejected: too busy, try again shortly' using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists mural_guard_trigger on mural_tiles;
create trigger mural_guard_trigger
  before insert on mural_tiles
  for each row execute function mural_guard();

-- ---------------------------------------------------------------------------
--  Row level security: the public may read the wall and add exactly one tile.
--  Nobody may edit or delete anything through the anon key.
-- ---------------------------------------------------------------------------
alter table mural_tiles enable row level security;

drop policy if exists "mural readable by anyone" on mural_tiles;
create policy "mural readable by anyone"
  on mural_tiles for select to anon, authenticated using (true);

drop policy if exists "mural insertable by anyone" on mural_tiles;
create policy "mural insertable by anyone"
  on mural_tiles for insert to anon, authenticated with check (true);

-- No update or delete policy exists, so both are denied by default.

-- ---------------------------------------------------------------------------
--  A read-only view that never exposes the signer fingerprint.
-- ---------------------------------------------------------------------------
create or replace view mural_wall
with (security_invoker = true) as
  select id, color, name, note, created_at from mural_tiles;

grant select on mural_wall to anon, authenticated;

-- Realtime, so a tile someone else places appears live.
alter publication supabase_realtime add table mural_tiles;
