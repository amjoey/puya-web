-- Re-applies the reviews RLS policies idempotently (safe to run more than
-- once). Run this in the Supabase SQL Editor if guest review submission
-- fails with: "new row violates row-level security policy for table reviews".

drop policy if exists "reviews_select_approved_public" on reviews;
drop policy if exists "reviews_insert_public" on reviews;
drop policy if exists "reviews_select_all_admin" on reviews;
drop policy if exists "reviews_update_admin" on reviews;
drop policy if exists "reviews_delete_admin" on reviews;

create policy "reviews_select_approved_public"
on reviews for select
to anon, authenticated
using (approved = true);

create policy "reviews_insert_public"
on reviews for insert
to anon, authenticated
with check (approved = false);

create policy "reviews_select_all_admin"
on reviews for select
to authenticated
using (is_admin());

create policy "reviews_update_admin"
on reviews for update
to authenticated
using (is_admin())
with check (is_admin());

create policy "reviews_delete_admin"
on reviews for delete
to authenticated
using (is_admin());
