const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

// Shared SEO defaults — see CLAUDE.md > SEO ("metadata for every page: title,
// description, openGraph. Use JSON-LD.").
export const SEO = {
  siteUrl: SITE_URL,
  siteName: "PUYA Beach Villa",
  defaultTitle: "พูลวิลล่าเทพา สะกอม สงขลา | PUYA Beach Villa รับ 15 คน จองตรง",
  defaultDescription:
    "พูลวิลล่าริมทะเลส่วนตัว 2 หลัง โซนเทพา-สะกอม สงขลา รับได้ถึง 15 คน/หลัง เหมาะกับครอบครัวและหมู่คณะ Muslim-friendly ใกล้ปัตตานี ยะลา นราธิวาส จองตรงเริ่ม 6,900 บาท",
  defaultOgImage: "/demo/hero.svg",
} as const;
