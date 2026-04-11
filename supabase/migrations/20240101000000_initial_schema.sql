-- Products
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  description text,
  images text[],
  price integer not null default 5000,
  status text check (status in ('available', 'preorder', 'unavailable')) default 'available',
  delivery_days integer default 7,
  specs jsonb,
  years text,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  product_id uuid references products(id),
  customization jsonb,
  price integer not null,
  payment_status text check (payment_status in ('pending', 'paid', 'failed')) default 'pending',
  order_status text check (order_status in ('pending', 'confirmed', 'in_production', 'shipped', 'delivered')) default 'pending',
  payfast_payment_id text,
  notes text,
  created_at timestamptz default now()
);

-- Customization options (per product)
create table customization_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  type text not null, -- 'background_color', 'background_design'
  label text not null,
  value text not null,
  preview_url text,
  swatch text
);

-- Note: Admin users handled by Supabase Auth (auth.users)
