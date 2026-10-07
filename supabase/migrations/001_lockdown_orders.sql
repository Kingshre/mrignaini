-- ============================================================
-- 001 — Lock down orders, fix timestamps, add order status
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- Non-destructive: no tables dropped, no rows deleted.
-- ============================================================
begin;

-- ── 1. Admins (who may read/manage orders) ──────────────────
create table if not exists public.admins (
    user_id    uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Admins can see that they are an admin; nobody can write via the API.
drop policy if exists "admins_read_self" on public.admins;
create policy "admins_read_self" on public.admins
    for select to authenticated using (user_id = auth.uid());
revoke all on public.admins from anon;
grant select on public.admins to authenticated;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
    select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ── 2. Orders: RLS on, remove any existing (permissive) policies ──
alter table public.orders enable row level security;

do $$
declare p record;
begin
    for p in select policyname from pg_policies
             where schemaname = 'public' and tablename = 'orders'
    loop
        execute format('drop policy %I on public.orders', p.policyname);
    end loop;
end $$;

-- The public never touches orders directly: the server creates them with
-- the service-role key (which bypasses RLS). Only admins read/update.
revoke all on public.orders from anon;
revoke all on public.orders from authenticated;
grant select, update on public.orders to authenticated;

create policy "orders_admin_select" on public.orders
    for select to authenticated using (public.is_admin());
create policy "orders_admin_update" on public.orders
    for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ── 3. created_at: timezone-aware, backfilled, defaulted ────
alter table public.orders
    alter column created_at type timestamptz using created_at at time zone 'UTC';

-- Order numbers are 'MRG' + epoch milliseconds, so recover the real time.
update public.orders
   set created_at = to_timestamp(substring(order_number from 4)::bigint / 1000.0)
 where created_at is null
   and order_number ~ '^MRG[0-9]{13}$';

alter table public.orders alter column created_at set default now();

-- Only enforce NOT NULL if the backfill covered every row.
do $$
begin
    if not exists (select 1 from public.orders where created_at is null) then
        alter table public.orders alter column created_at set not null;
    end if;
end $$;

-- ── 4. Order status ─────────────────────────────────────────
alter table public.orders
    add column if not exists status text not null default 'pending';

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

create index if not exists orders_created_at_idx on public.orders (created_at desc);

commit;

-- Ask PostgREST to pick up the changes immediately.
notify pgrst, 'reload schema';
