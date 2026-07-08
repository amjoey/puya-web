// Demo-only gallery images keyed by villa slug, for the Villa Detail page
// gallery (see UI_UX_SPEC.md > Villa Detail Page > Gallery). A real
// implementation will need a villa_images table (or array column) —
// out of scope for this UI pass.
export const DEMO_VILLA_GALLERIES: Record<string, string[]> = {
  "villa-1": [
    "/demo/villa-1.svg",
    "/demo/villa-1-gallery-2.svg",
    "/demo/villa-1-gallery-3.svg",
    "/demo/villa-1-gallery-4.svg",
  ],
  "villa-2": [
    "/demo/villa-2.svg",
    "/demo/villa-2-gallery-2.svg",
    "/demo/villa-2-gallery-3.svg",
    "/demo/villa-2-gallery-4.svg",
  ],
};
