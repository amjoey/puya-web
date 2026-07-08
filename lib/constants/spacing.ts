// Spacing system — see UI_UX_SPEC.md > Responsive Breakpoints, Mobile UX.
// Breakpoint values are also registered as Tailwind v4 breakpoints
// (--breakpoint-tablet / --breakpoint-desktop) in app/globals.css.
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1440,
} as const;

// Minimum touch target size (UI_UX_SPEC.md > Mobile UX).
export const TOUCH_TARGET_MIN = 44; // px

// Standard vertical rhythm / horizontal padding for page sections.
export const SECTION_SPACING = "py-12 tablet:py-16 desktop:py-24";
export const CONTAINER_PADDING = "px-4 tablet:px-6 desktop:px-8";
