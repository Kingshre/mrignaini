-- ============================================================
-- 003 — Run ONLY after the new server (rebuild branch) is live on Render.
-- Adds uniqueness that the old server (7903ea3) could trip over.
-- Safe to re-run. Non-destructive.
-- ============================================================

-- 1. Check for duplicates first. Both queries must return 0 rows;
--    if not, stop and resolve them before step 2.
select order_number, count(*) from public.orders
 group by order_number having count(*) > 1;
select razorpay_order_id, count(*) from public.orders
 where razorpay_order_id is not null
 group by razorpay_order_id having count(*) > 1;

-- 2. Enforce uniqueness
begin;
create unique index if not exists orders_order_number_key on public.orders (order_number);
create unique index if not exists orders_razorpay_order_id_key on public.orders (razorpay_order_id)
    where razorpay_order_id is not null;
drop index if exists public.orders_order_number_idx;
drop index if exists public.orders_razorpay_order_id_idx;
commit;

notify pgrst, 'reload schema';
