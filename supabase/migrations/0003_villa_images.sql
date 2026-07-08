-- ============================================
-- PUYA BEACH VILLA — Villa Gallery Images
-- ============================================
--
-- Applies on top of DATABASE_SCHEMA.sql and 0001_enable_rls.sql.
--
-- Unlike payment-slips, villa photos are public marketing content with no
-- guest PII, so `villa_images` rows and the backing storage bucket are both
-- publicly readable. Only admins (is_admin(), defined in 0001_enable_rls.sql)
-- can add, reorder, or remove images — enforced by RLS on both the table
-- and storage.objects.

create table villa_images (
  id uuid primary key default uuid_generate_v4(),
  villa_id uuid not null references villas(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

create index idx_villa_images_villa on villa_images(villa_id, sort_order);

alter table villa_images enable row level security;

create policy "villa_images_select_public"
on villa_images for select
to anon, authenticated
using (true);

create policy "villa_images_all_admin"
on villa_images for all
to authenticated
using (is_admin())
with check (is_admin());

-- ----------------------------------------------------------
-- Storage bucket — public read (gallery photos), admin-only write.
-- ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('villa-images', 'villa-images', true)
on conflict (id) do nothing;

create policy "villa_images_storage_select_public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'villa-images');

create policy "villa_images_storage_insert_admin"
on storage.objects for insert
to authenticated
with check (bucket_id = 'villa-images' and is_admin());

create policy "villa_images_storage_update_admin"
on storage.objects for update
to authenticated
using (bucket_id = 'villa-images' and is_admin())
with check (bucket_id = 'villa-images' and is_admin());

create policy "villa_images_storage_delete_admin"
on storage.objects for delete
to authenticated
using (bucket_id = 'villa-images' and is_admin());
