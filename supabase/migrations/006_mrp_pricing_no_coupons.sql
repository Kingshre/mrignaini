-- ============================================================
-- 006 — Slashed pricing (MRP + selling price) and no coupons
-- - products.price becomes the SELLING price (what customers pay)
-- - new products.mrp is the public MRP shown crossed out
-- - existing values: mrp := old price, price := old second_price
-- - all coupons deactivated (tables and order columns kept for history)
-- Run once in Supabase → SQL Editor after 005. Safe to re-run: the price
-- swap only touches products that have no MRP yet.
-- Old orders are not touched; their totals stay exactly as they were.
-- ============================================================
begin;

alter table public.products add column if not exists mrp integer;

alter table public.products drop constraint if exists products_mrp_check;
alter table public.products add constraint products_mrp_check
    check (mrp is null or mrp >= price);

-- One-time swap (guarded by mrp is null so a re-run can't swap twice)
update public.products p
   set mrp = p.price,
       price = pp.second_price
  from public.product_private pp
 where pp.product_id = p.id
   and p.mrp is null
   and pp.second_price is not null
   and pp.second_price <= p.price;

-- second_price now lives in products.price; the private copy is no longer used
comment on column public.product_private.second_price is
    'Unused since 006: the selling price is products.price, the MRP is products.mrp.';

-- No coupons
update public.coupons set is_active = false where is_active;

commit;

notify pgrst, 'reload schema';
