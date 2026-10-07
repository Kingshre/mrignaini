-- ============================================================
-- 002 — Catalog (products / colours / variants), coupons,
--        order pricing + payment fields, stock-safe "mark paid"
-- Run once in Supabase → SQL Editor after 001. Safe to re-run.
-- Non-destructive: existing orders are only ALTERed (no drops, no deletes).
-- ============================================================
begin;

-- Shared trigger: keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at := now();
    return new;
end $$;

-- ── Products ────────────────────────────────────────────────
create table if not exists public.products (
    id                text primary key,                 -- slug used in URLs, e.g. 'top-iktara'
    name              text not null,
    short_name        text,                             -- homepage card title
    short_description text,                             -- homepage card blurb
    category          text not null check (category in ('tops', 'layers', 'sets', 'test')),
    price             integer not null check (price >= 0),  -- rupees actually charged
    description       text not null default '',
    specs             jsonb not null default '[]'::jsonb,   -- [{title, items:[...]}]
    care              text,
    special_note      text,                             -- e.g. one-of-a-kind note
    care_note         text,                             -- highlighted care warning (indigo bleeding)
    tag               text,                             -- 'New Arrival', 'Upcycled', ...
    trust_badges      jsonb not null default '[]'::jsonb,   -- [{icon, label}]
    size_label        text,                             -- e.g. 'Select Top Size'
    size_note         text,                             -- e.g. 'Skirt is Free Size'
    sort_order        integer not null default 0,
    is_active         boolean not null default true,    -- false = hidden from shop
    is_test           boolean not null default false,   -- admin-only test product
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now()
);
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
    for each row execute function public.touch_updated_at();

-- Admin-only product fields (kept out of the public table on purpose)
create table if not exists public.product_private (
    product_id   text primary key references public.products(id) on delete cascade,
    second_price integer check (second_price >= 0),
    notes        text,
    updated_at   timestamptz not null default now()
);
drop trigger if exists product_private_touch on public.product_private;
create trigger product_private_touch before update on public.product_private
    for each row execute function public.touch_updated_at();

-- ── Colours (each with its own ordered photo gallery) ───────
create table if not exists public.product_colors (
    id         uuid primary key default gen_random_uuid(),
    product_id text not null references public.products(id) on delete cascade,
    name       text not null,
    hex        text,
    images     jsonb not null default '[]'::jsonb,   -- ordered URLs; first = card image
    sort_order integer not null default 0,
    is_active  boolean not null default true,
    unique (product_id, name)
);
create index if not exists product_colors_product_idx on public.product_colors (product_id);

-- ── Variants (colour + size + stock) ────────────────────────
create table if not exists public.variants (
    id          uuid primary key default gen_random_uuid(),
    product_id  text not null references public.products(id) on delete cascade,
    color_id    uuid not null references public.product_colors(id) on delete cascade,
    size        text not null,
    stock       integer not null default 0 check (stock >= 0),
    is_sold_out boolean not null default false,       -- manual "mark sold out"
    sort_order  integer not null default 0,
    updated_at  timestamptz not null default now(),
    unique (color_id, size)
);
create index if not exists variants_product_idx on public.variants (product_id);
drop trigger if exists variants_touch on public.variants;
create trigger variants_touch before update on public.variants
    for each row execute function public.touch_updated_at();

-- ── Coupons ─────────────────────────────────────────────────
create table if not exists public.coupons (
    code        text primary key check (code = upper(code)),
    type        text not null default 'flat' check (type in ('flat', 'percent')),
    value       numeric not null check (value > 0),
    min_order   numeric not null default 0,
    description text,
    is_active   boolean not null default true,
    starts_at   timestamptz,
    ends_at     timestamptz,
    max_uses    integer,
    uses        integer not null default 0,
    created_at  timestamptz not null default now()
);

insert into public.coupons (code, type, value, min_order, description) values
    ('MRIG200',  'flat', 200,  999,  '₹200 off on orders above ₹999'),
    ('MRIG500',  'flat', 500,  3999, '₹500 off on orders above ₹3,999'),
    ('MRIG1000', 'flat', 1000, 7999, '₹1,000 off on orders above ₹7,999')
on conflict (code) do nothing;

-- ── Orders: new columns (existing rows untouched except defaults) ──
alter table public.orders add column if not exists subtotal       numeric;
alter table public.orders add column if not exists shipping       numeric;
alter table public.orders add column if not exists discount       numeric not null default 0;
alter table public.orders add column if not exists coupon_code    text;
alter table public.orders add column if not exists payment_status text not null default 'pending';
alter table public.orders add column if not exists paid_at        timestamptz;
alter table public.orders add column if not exists user_id        uuid references auth.users(id) on delete set null;
alter table public.orders add column if not exists stock_applied  boolean not null default false;
alter table public.orders add column if not exists stock_issue    text;   -- set if a paid item was already out of stock
alter table public.orders add column if not exists is_test        boolean not null default false;

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
    check (payment_status in ('pending', 'paid', 'failed', 'refunded'));

-- The 2 existing orders were saved only after Razorpay verification → paid.
update public.orders
   set payment_status = 'paid', paid_at = coalesce(paid_at, created_at)
 where payment_id is not null and payment_status = 'pending' and paid_at is null;

-- The ₹2 test-product order is a test.
update public.orders set is_test = true
 where is_test = false
   and items @> '[{"productId": "test-product"}]'::jsonb;

-- Orders inserted with a payment id (the current live server only inserts
-- after verifying the payment) are paid. The new server inserts 'pending'
-- first without a payment id, so this never fires for it.
create or replace function public.orders_default_paid()
returns trigger language plpgsql as $$
begin
    if new.payment_id is not null and new.payment_status = 'pending' then
        new.payment_status := 'paid';
        new.paid_at := coalesce(new.paid_at, now());
    end if;
    return new;
end $$;
drop trigger if exists orders_default_paid on public.orders;
create trigger orders_default_paid before insert on public.orders
    for each row execute function public.orders_default_paid();

create unique index if not exists orders_order_number_key on public.orders (order_number);
create unique index if not exists orders_razorpay_order_id_key on public.orders (razorpay_order_id)
    where razorpay_order_id is not null;
create index if not exists orders_user_idx on public.orders (user_id);

-- ── Mark an order paid + decrement stock, atomically & idempotently ──
-- Called only by the server (service role) after verifying the payment.
create or replace function public.mark_order_paid(p_razorpay_order_id text, p_payment_id text)
returns public.orders
language plpgsql security definer
set search_path = public
as $$
declare
    o      public.orders;
    item   jsonb;
    qty    integer;
    issues text[] := '{}';
begin
    select * into o from public.orders
     where razorpay_order_id = p_razorpay_order_id
     for update;
    if not found then
        raise exception 'order not found for razorpay order %', p_razorpay_order_id;
    end if;

    -- Already processed (e.g. browser callback and webhook both arrived)
    if o.payment_status = 'paid' and o.stock_applied then
        return o;
    end if;

    for item in select * from jsonb_array_elements(o.items) loop
        qty := greatest(coalesce((item->>'qty')::integer, 1), 1);
        if item ? 'variantId' then
            update public.variants
               set stock = stock - qty
             where id = (item->>'variantId')::uuid
               and stock >= qty;
            if not found then
                -- Paid but not enough stock (two buyers raced): zero it and flag for the admin.
                update public.variants set stock = 0 where id = (item->>'variantId')::uuid;
                issues := issues || format('%s (%s / %s) x%s', item->>'name', item->>'color', item->>'size', qty);
            end if;
        end if;
    end loop;

    if o.coupon_code is not null then
        update public.coupons set uses = uses + 1 where code = o.coupon_code;
    end if;

    update public.orders
       set payment_status = 'paid',
           payment_id     = p_payment_id,
           paid_at        = coalesce(paid_at, now()),
           stock_applied  = true,
           stock_issue    = case when array_length(issues, 1) > 0
                                 then 'Oversold: ' || array_to_string(issues, '; ') end
     where id = o.id
    returning * into o;

    return o;
end $$;
revoke all on function public.mark_order_paid(text, text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(text, text) to service_role;

-- ── Row Level Security ──────────────────────────────────────
alter table public.products        enable row level security;
alter table public.product_private enable row level security;
alter table public.product_colors  enable row level security;
alter table public.variants        enable row level security;
alter table public.coupons         enable row level security;

-- Public can read active, non-test products; admins can read & edit everything.
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
    for select to anon, authenticated
    using ((is_active and not is_test) or public.is_admin());
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "colors_public_read" on public.product_colors;
create policy "colors_public_read" on public.product_colors
    for select to anon, authenticated
    using (public.is_admin() or (is_active and exists (
        select 1 from public.products p
         where p.id = product_id and p.is_active and not p.is_test)));
drop policy if exists "colors_admin_write" on public.product_colors;
create policy "colors_admin_write" on public.product_colors
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "variants_public_read" on public.variants;
create policy "variants_public_read" on public.variants
    for select to anon, authenticated
    using (public.is_admin() or exists (
        select 1 from public.products p
         where p.id = product_id and p.is_active and not p.is_test));
drop policy if exists "variants_admin_write" on public.variants;
create policy "variants_admin_write" on public.variants
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin-only tables
drop policy if exists "product_private_admin" on public.product_private;
create policy "product_private_admin" on public.product_private
    for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "coupons_admin" on public.coupons;
create policy "coupons_admin" on public.coupons
    for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Signed-in customers can see their own orders (profile page)
drop policy if exists "orders_owner_select" on public.orders;
create policy "orders_owner_select" on public.orders
    for select to authenticated using (user_id = auth.uid());

-- Table privileges (RLS decides which rows)
revoke all on public.products, public.product_colors, public.variants,
              public.product_private, public.coupons from anon;
grant select on public.products, public.product_colors, public.variants to anon;
grant select, insert, update, delete on public.products, public.product_colors,
              public.variants, public.product_private, public.coupons to authenticated;

commit;

notify pgrst, 'reload schema';
