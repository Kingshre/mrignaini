-- ============================================================
-- 005 — Restock exactly what was taken from stock
-- Fixes: restocking an oversold order (two buyers raced for the last
-- piece) used to add back the full ordered quantity, not what was
-- actually deducted. mark_order_paid now records the exact amounts.
-- Run once in Supabase → SQL Editor after 004. Safe to re-run.
-- Does not touch the live server's insert path.
-- ============================================================
begin;

alter table public.orders add column if not exists stock_deducted jsonb;   -- { "<variant id>": units taken }

create or replace function public.mark_order_paid(p_razorpay_order_id text, p_payment_id text)
returns public.orders
language plpgsql security definer
set search_path = public
as $$
declare
    o        public.orders;
    item     jsonb;
    vid      uuid;
    qty      integer;
    have     integer;
    take     integer;
    deducted jsonb := '{}'::jsonb;
    issues   text[] := '{}';
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
        continue when not (item ? 'variantId');
        vid := (item->>'variantId')::uuid;
        qty := greatest(coalesce((item->>'qty')::integer, 1), 1);

        select stock into have from public.variants where id = vid for update;
        if not found then
            issues := issues || format('%s (%s / %s) x%s: variant no longer exists', item->>'name', item->>'color', item->>'size', qty);
            continue;
        end if;

        take := least(have, qty);
        update public.variants set stock = stock - take where id = vid;
        deducted := jsonb_set(deducted, array[vid::text], to_jsonb(coalesce((deducted->>vid::text)::integer, 0) + take));
        if take < qty then
            -- Paid but not enough stock: take what's there and flag it for the admin
            issues := issues || format('%s (%s / %s) x%s, only %s in stock', item->>'name', item->>'color', item->>'size', qty, have);
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
           stock_deducted = deducted,
           stock_issue    = case when array_length(issues, 1) > 0
                                 then 'Oversold: ' || array_to_string(issues, '; ') end
     where id = o.id
    returning * into o;

    return o;
end $$;
revoke all on function public.mark_order_paid(text, text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(text, text) to service_role;

create or replace function public.restock_order(p_order_id uuid)
returns public.orders
language plpgsql security definer
set search_path = public
as $$
declare
    o    public.orders;
    item jsonb;
    rec  record;
begin
    if not public.is_admin() then
        raise exception 'not allowed';
    end if;

    select * into o from public.orders where id = p_order_id for update;
    if not found then
        raise exception 'order not found';
    end if;
    if not o.stock_applied then
        return o;
    end if;

    if o.stock_deducted is not null then
        -- Exact amounts recorded when the order was paid
        for rec in select key, value from jsonb_each_text(o.stock_deducted) loop
            update public.variants set stock = stock + rec.value::integer where id = rec.key::uuid;
        end loop;
    elsif o.stock_issue is not null then
        -- Paid before 005 and oversold: the amount actually taken is unknown
        raise exception 'This order was oversold, so the exact amount taken from stock is unknown. Please adjust stock manually in Products.';
    else
        for item in select * from jsonb_array_elements(o.items) loop
            if item ? 'variantId' then
                update public.variants
                   set stock = stock + greatest(coalesce((item->>'qty')::integer, 1), 1)
                 where id = (item->>'variantId')::uuid;
            end if;
        end loop;
    end if;

    update public.orders set stock_applied = false where id = o.id returning * into o;
    return o;
end $$;
revoke all on function public.restock_order(uuid) from public, anon;
grant execute on function public.restock_order(uuid) to authenticated;

commit;

notify pgrst, 'reload schema';
