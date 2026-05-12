# Full-Stack Luxury E-Commerce Upgrade

Transform the existing Zyentic frontend into a production-ready full-stack platform powered by Lovable Cloud. The current homepage stays visually intact but becomes fully dynamic.

> Note: The stack is **TanStack Start + React + Tailwind + Framer Motion** (this template doesn't use React Router DOM / Vite SPA). Routing uses file-based routes under `src/routes/`. State will be **Zustand** (lighter than Redux for this scope).

---

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud and provision the schema via migrations.

### Tables
- `profiles` — id (FK auth.users), full_name, email, phone, avatar_url, created_at. Auto-created via trigger on signup.
- `user_roles` — id, user_id, role (`app_role` enum: `admin` | `customer`). Separate table to prevent privilege escalation. `has_role()` security-definer function.
- `categories` — id, name, slug, image_url, description, featured, created_at
- `products` — id, category_id, title, slug, description, price, discount_price, stock, sku, featured, trending, image_urls (text[]), sizes (text[]), colors (text[]), created_at
- `banners` — id, title, subtitle, image_url, button_text, button_link, active, sort_order, created_at
- `orders` — id, user_id, total_amount, payment_status, order_status (enum), shipping_address (jsonb), phone, created_at
- `order_items` — id, order_id, product_id, quantity, price, size, color
- `wishlist` — id, user_id, product_id, created_at (unique on user+product)
- `cart_items` — id, user_id, product_id, quantity, size, color

### RLS Policies
- Public read on `categories`, `products`, `banners` (active only).
- `profiles`: user reads/updates own.
- `wishlist`, `cart_items`, `orders`, `order_items`: user CRUD on own rows.
- Admin (via `has_role(auth.uid(),'admin')`) gets full CRUD on all tables.

### Storage Buckets
- `product-images` (public read, admin write)
- `category-images` (public read, admin write)
- `banner-images` (public read, admin write)
- `avatars` (public read, owner write)

### Seed Data
Seed initial categories, banners, and ~10 products from the existing `src/data/site.ts` so the homepage doesn't go blank.

---

## 2. Authentication

- Email + password signup/login (auto-confirm enabled for fast dev).
- Pages: `/login`, `/register`, `/forgot-password`, `/reset-password`.
- Auth store (Zustand) with `onAuthStateChange` listener mounted in root.
- Protected layouts:
  - `_authenticated/` — requires logged-in user
  - `_admin/` — requires `admin` role (uses `has_role` RPC)

---

## 3. Dynamic Frontend (replace static data)

Refactor existing components to fetch from Cloud:
- `Hero` → `banners` where `active=true`
- `EditorsPicks` → `categories`
- `Trending` → `products` where `trending=true`
- New `/shop`, `/shop/$slug` (product detail), `/category/$slug` routes
- `/cart`, `/wishlist`, `/checkout` (creates order + order_items, clears cart)
- `/account`, `/account/orders`, `/account/profile`

Add cart + wishlist Zustand stores synced to Cloud for logged-in users.

---

## 4. Admin Panel (`/admin/*`)

Luxury minimalist admin layout (white bg, black outlines, sidebar nav, glass cards) consistent with site aesthetic.

- `/admin` — Dashboard: KPI cards (orders, revenue, users, products), recent orders table
- `/admin/products` — list + create/edit/delete modal, image upload (multi)
- `/admin/categories` — CRUD + image upload
- `/admin/banners` — CRUD + activate toggle
- `/admin/orders` — list, filter by status, detail drawer, status updater
- `/admin/users` — list, search, role toggle

All admin mutations go through `createServerFn` with `requireSupabaseAuth` + admin role check.

---

## 5. Tech Details

- **Routing**: TanStack file-based routes (not React Router DOM)
- **Forms**: react-hook-form + zod
- **State**: Zustand (`authStore`, `cartStore`, `wishlistStore`)
- **Data fetching**: TanStack Query + Supabase client / server fns
- **File uploads**: Supabase Storage via signed admin operations
- **Validation**: zod schemas shared client/server

---

## 6. Build Order

1. Enable Lovable Cloud + migrations (schema, RLS, triggers, seed)
2. Storage buckets + policies
3. Auth pages + Zustand auth store + route guards
4. Refactor Hero / EditorsPicks / Trending to use live data
5. Shop/product/cart/wishlist/checkout flows
6. Admin layout + dashboard + CRUD screens
7. Customer account pages
8. Polish, animations, empty states

---

This is a large multi-day scope. I'll execute it in the above order, shipping working slices and verifying each before moving on. Approve to proceed.
