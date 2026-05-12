
-- ============ ENUMS ============
create type public.app_role as enum ('admin', 'customer');
create type public.order_status as enum ('pending','processing','shipped','delivered','cancelled');
create type public.payment_status as enum ('pending','paid','failed','refunded');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- security definer function (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- profile auto-create trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

-- ============ CATEGORIES ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  description text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

-- ============ PRODUCTS ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null default 0,
  discount_price numeric(10,2),
  stock integer not null default 0,
  sku text,
  featured boolean not null default false,
  trending boolean not null default false,
  image_urls text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create index products_category_idx on public.products(category_id);
create index products_trending_idx on public.products(trending) where trending = true;
create index products_featured_idx on public.products(featured) where featured = true;

-- ============ BANNERS ============
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  button_text text,
  button_link text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.banners enable row level security;

-- ============ ORDERS ============
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount numeric(10,2) not null default 0,
  payment_status payment_status not null default 'pending',
  order_status order_status not null default 'pending',
  shipping_address jsonb,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create index orders_user_idx on public.orders(user_id);

-- ============ ORDER ITEMS ============
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0,
  size text,
  color text
);
alter table public.order_items enable row level security;
create index order_items_order_idx on public.order_items(order_id);

-- ============ WISHLIST ============
create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);
alter table public.wishlist enable row level security;

-- ============ CART ============
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  size text,
  color text,
  created_at timestamptz not null default now()
);
alter table public.cart_items enable row level security;
create index cart_user_idx on public.cart_items(user_id);

-- ============ POLICIES ============

-- profiles
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles admin read" on public.profiles for select using (public.has_role(auth.uid(),'admin'));
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);

-- user_roles
create policy "roles self read" on public.user_roles for select using (auth.uid() = user_id);
create policy "roles admin all" on public.user_roles for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- categories (public read, admin write)
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- products
create policy "products public read" on public.products for select using (true);
create policy "products admin write" on public.products for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- banners (public read of active, admin sees all + writes)
create policy "banners public read active" on public.banners for select using (active = true);
create policy "banners admin read all" on public.banners for select using (public.has_role(auth.uid(),'admin'));
create policy "banners admin write" on public.banners for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- orders
create policy "orders self read" on public.orders for select using (auth.uid() = user_id);
create policy "orders self insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders admin read" on public.orders for select using (public.has_role(auth.uid(),'admin'));
create policy "orders admin update" on public.orders for update using (public.has_role(auth.uid(),'admin'));

-- order_items
create policy "order_items self read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order_items self insert" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "order_items admin all" on public.order_items for all using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- wishlist
create policy "wishlist self all" on public.wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- cart
create policy "cart self all" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ STORAGE BUCKETS ============
insert into storage.buckets (id, name, public) values
  ('product-images','product-images', true),
  ('category-images','category-images', true),
  ('banner-images','banner-images', true),
  ('avatars','avatars', true)
on conflict (id) do nothing;

-- public read for all 4 buckets
create policy "public read product images" on storage.objects for select
using (bucket_id = 'product-images');
create policy "public read category images" on storage.objects for select
using (bucket_id = 'category-images');
create policy "public read banner images" on storage.objects for select
using (bucket_id = 'banner-images');
create policy "public read avatars" on storage.objects for select
using (bucket_id = 'avatars');

-- admin write product/category/banner
create policy "admin write product images" on storage.objects for all
using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'))
with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin write category images" on storage.objects for all
using (bucket_id = 'category-images' and public.has_role(auth.uid(),'admin'))
with check (bucket_id = 'category-images' and public.has_role(auth.uid(),'admin'));
create policy "admin write banner images" on storage.objects for all
using (bucket_id = 'banner-images' and public.has_role(auth.uid(),'admin'))
with check (bucket_id = 'banner-images' and public.has_role(auth.uid(),'admin'));

-- avatar self management (folder = user id)
create policy "avatar self write" on storage.objects for insert
with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar self update" on storage.objects for update
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatar self delete" on storage.objects for delete
using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
