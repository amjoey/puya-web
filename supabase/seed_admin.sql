-- Grants amjoey@gmail.com full admin access (super_admin role — see
-- supabase/migrations/0001_enable_rls.sql > is_super_admin(), the only
-- role allowed to manage the admins table itself).
--
-- The Supabase Auth user (email + password login) for this account was
-- already created via the Auth Admin API — this only adds the matching
-- row to our own `admins` table, which is what the app's RLS policies and
-- middleware (lib/supabase/middleware.ts) check to grant /admin/** access.
insert into admins (id, email, role)
values ('dce750da-6d65-4e79-830f-437f118b2f34', 'amjoey@gmail.com', 'super_admin')
on conflict (id) do update set role = excluded.role;
