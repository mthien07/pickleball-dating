/**
 * Responsive Breakpoints
 *
 * Hinge-style editorial layout — wider content for vertical profile feeds
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const MAX_CONTENT_WIDTH = {
  mobile: '100%',
  tablet: 600,
  desktop: 600,
  wide: 600,
} as const;

/** Editorial feed width — wider than swipe cards for vertical scroll */
export const EDITORIAL_FEED_WIDTH = {
  mobile: '100%',
  tablet: 520,
  desktop: 520,
  wide: 520,
} as const;

/** Legacy swipe card width (kept for fallback) */
export const SWIPE_CONTENT_WIDTH = 500;

export const CONTAINER_PADDING = {
  mobile: 16,
  tablet: 24,
  desktop: 32,
  wide: 40,
} as const;

/** Editorial card width — full-width on mobile, constrained on desktop */
export const CARD_WIDTH = {
  mobile: 0.92,
  tablet: 480,
  desktop: 480,
  wide: 480,
} as const;

export const CARD_MAX_WIDTH = 480;

/** Legacy aspect ratio for swipe cards (kept for backward compat) */
export const CARD_ASPECT_RATIO = 4 / 5;
