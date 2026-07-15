import type { NextConfig } from "next";

// Supabase Storage signed URLs are the only remote images this app renders
// (payment slip previews in the admin dashboard) — everything else is a
// local /public asset. Hostname is derived from the Supabase project URL
// so this doesn't need hardcoding per environment.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (≈30% smaller than WebP for our hero/section photos),
    // falling back to WebP then the original. next/image resizes from the
    // source per device, so this format list is the main lever on delivered
    // image bytes — and the LCP hero on the Home page rides on it.
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/sign/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
