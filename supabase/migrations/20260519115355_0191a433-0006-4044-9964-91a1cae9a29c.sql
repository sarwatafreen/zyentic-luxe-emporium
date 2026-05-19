create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

grant execute on function private.has_role(uuid, public.app_role) to anon, authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;

alter policy "profiles admin read" on public.profiles
using (private.has_role(auth.uid(), 'admin'));

alter policy "roles admin all" on public.user_roles
using (private.has_role(auth.uid(), 'admin'))
with check (private.has_role(auth.uid(), 'admin'));

alter policy "categories admin write" on public.categories
using (private.has_role(auth.uid(), 'admin'))
with check (private.has_role(auth.uid(), 'admin'));

alter policy "products admin write" on public.products
using (private.has_role(auth.uid(), 'admin'))
with check (private.has_role(auth.uid(), 'admin'));

alter policy "banners admin read all" on public.banners
using (private.has_role(auth.uid(), 'admin'));

alter policy "banners admin write" on public.banners
using (private.has_role(auth.uid(), 'admin'))
with check (private.has_role(auth.uid(), 'admin'));

alter policy "orders admin read" on public.orders
using (private.has_role(auth.uid(), 'admin'));

alter policy "orders admin update" on public.orders
using (private.has_role(auth.uid(), 'admin'));

alter policy "order_items admin all" on public.order_items
using (private.has_role(auth.uid(), 'admin'))
with check (private.has_role(auth.uid(), 'admin'));

alter policy "admin write product images" on storage.objects
using (bucket_id = 'product-images' and private.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'product-images' and private.has_role(auth.uid(), 'admin'));

alter policy "admin write category images" on storage.objects
using (bucket_id = 'category-images' and private.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'category-images' and private.has_role(auth.uid(), 'admin'));

alter policy "admin write banner images" on storage.objects
using (bucket_id = 'banner-images' and private.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'banner-images' and private.has_role(auth.uid(), 'admin'));