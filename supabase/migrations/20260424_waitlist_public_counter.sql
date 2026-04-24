-- Optional: expose only aggregate waitlist count to anon/authenticated
-- without granting direct SELECT access to public.waitlist.

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
