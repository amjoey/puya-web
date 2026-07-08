-- ============================================
-- PUYA BEACH VILLA — Payment Slips Storage Bucket
-- ============================================
--
-- Private bucket: payment slips contain financial/PII data and must never
-- be publicly readable. Guest uploads go through the service-role client
-- (bypasses RLS — see lib/supabase/service.ts, services/payment.service.ts).
-- Admins view slips via short-lived signed URLs (see
-- lib/supabase/storage.ts > getPaymentSlipSignedUrl), never public URLs.

insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', false)
on conflict (id) do nothing;

-- Admins (and only admins) can read slip objects directly via the
-- RLS-respecting client; signed URLs are generated server-side, so this
-- policy is a defense-in-depth backstop rather than the primary access path.
-- Relies on is_admin() defined in 0001_enable_rls.sql.
create policy "payment_slips_select_admin"
on storage.objects for select
to authenticated
using (
  bucket_id = 'payment-slips'
  and is_admin()
);

-- No insert/update/delete policy for anon or authenticated — uploads happen
-- exclusively via the service-role client, which bypasses RLS entirely.
