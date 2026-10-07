-- Make an existing Supabase Auth user an admin.
-- 1. Create the account first: Supabase → Authentication → Users → "Add user"
--    (email + password, tick "Auto Confirm User").
-- 2. Replace the email below and run this in the SQL Editor.
insert into public.admins (user_id)
select id from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;

-- Check who is an admin:
-- select u.email, a.created_at from public.admins a join auth.users u on u.id = a.user_id;

-- Remove an admin:
-- delete from public.admins where user_id = (select id from auth.users where email = 'you@example.com');
