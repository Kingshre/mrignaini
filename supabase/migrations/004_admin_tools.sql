-- ============================================================
-- 004 — Admin tools: photo uploads to Storage, restock on cancel
-- Run once in Supabase → SQL Editor after 002. Safe to re-run.
-- Does not touch existing orders or the live server's insert path.
-- ============================================================
begin;

-- ── Storage: only admins can add / replace / delete product photos ──
-- The bucket is public, so anyone can VIEW photos by URL; these policies
-- control writes through the API.
drop policy if exists "product_images_admin_select" on storage.objects;
create policy "product_images_admin_select" on storage.objects
    for select to authenticated
    using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
    for update to authenticated
    using (bucket_id = 'product-images' and public.is_admin())
    with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
    for delete to authenticated
    using (bucket_id = 'product-images' and public.is_admin());

-- ── Put a paid order's items back into stock (e.g. when cancelling) ──
-- Admin-only. Idempotent: only acts if stock was taken for this order.
create or replace function public.restock_order(p_order_id uuid)
returns public.orders
language plpgsql security definer
set search_path = public
as $$
declare
    o    public.orders;
    item jsonb;
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

    for item in select * from jsonb_array_elements(o.items) loop
        if item ? 'variantId' then
            update public.variants
               set stock = stock + greatest(coalesce((item->>'qty')::integer, 1), 1)
             where id = (item->>'variantId')::uuid;
        end if;
    end loop;

    update public.orders set stock_applied = false where id = o.id returning * into o;
    return o;
end $$;
revoke all on function public.restock_order(uuid) from public, anon;
grant execute on function public.restock_order(uuid) to authenticated;

commit;

notify pgrst, 'reload schema';
