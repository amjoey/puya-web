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
