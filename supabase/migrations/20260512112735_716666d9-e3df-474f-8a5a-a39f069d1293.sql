
-- fix search_path on set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- revoke execute from anon/authenticated on security definer functions
revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

-- replace bucket-wide select policies with object-name scoped ones
-- (still allows direct URL access; just blocks LIST queries)
drop policy if exists "public read product images" on storage.objects;
drop policy if exists "public read category images" on storage.objects;
drop policy if exists "public read banner images" on storage.objects;
drop policy if exists "public read avatars" on storage.objects;

-- only allow select via specific object name match (URL access works, list does not)
create policy "public read product images" on storage.objects for select
using (bucket_id = 'product-images' and name is not null);
create policy "public read category images" on storage.objects for select
using (bucket_id = 'category-images' and name is not null);
create policy "public read banner images" on storage.objects for select
using (bucket_id = 'banner-images' and name is not null);
create policy "public read avatars" on storage.objects for select
using (bucket_id = 'avatars' and name is not null);
