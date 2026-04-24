-- ONE-SHOT: run once in Supabase → SQL Editor → New query → Run
-- Combines waitlist table + RLS and optional public count function.
-- Source migrations: migrations/20260424_waitlist_hardening.sql,
--                     migrations/20260424_waitlist_public_counter.sql

-- === 20260424_waitlist_hardening.sql ===

create extension if not exists citext;

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email citext not null,
  what_they_expect text,
  referrer text,
  source text not null default 'website',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint waitlist_email_basic_format check (position('@' in email::text) > 1),
  constraint waitlist_expectation_length check (
    what_they_expect is null or char_length(what_they_expect) <= 1200
  ),
  constraint waitlist_referrer_length check (
    referrer is null or char_length(referrer) <= 1024
  )
);

create unique index if not exists waitlist_email_unique_idx
  on public.waitlist (lower(email::text));

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_waitlist_updated_at on public.waitlist;
create trigger trg_waitlist_updated_at
before update on public.waitlist
for each row execute procedure public.set_updated_at();

alter table public.waitlist enable row level security;

drop policy if exists "waitlist_no_public_select" on public.waitlist;
create policy "waitlist_no_public_select"
on public.waitlist
for select
to anon, authenticated
using (false);

drop policy if exists "waitlist_no_public_insert" on public.waitlist;
create policy "waitlist_no_public_insert"
on public.waitlist
for insert
to anon, authenticated
with check (false);

drop policy if exists "waitlist_no_public_update" on public.waitlist;
create policy "waitlist_no_public_update"
on public.waitlist
for update
to anon, authenticated
using (false)
with check (false);

drop policy if exists "waitlist_no_public_delete" on public.waitlist;
create policy "waitlist_no_public_delete"
on public.waitlist
for delete
to anon, authenticated
using (false);

-- === 20260424_waitlist_public_counter.sql (optional aggregate RPC) ===

create or replace function public.waitlist_public_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  select count(*)::bigint from public.waitlist;
$$;

revoke all on function public.waitlist_public_count() from public;
grant execute on function public.waitlist_public_count() to anon, authenticated;
