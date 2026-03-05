/**
 * Responsive Breakpoints
 *
 * Following Tinder's responsive design approach
 * Ensures consistency between mobile and web
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
  desktop: 500, // Tinder-style centered content
  wide: 500,
} as const;

export const CONTAINER_PADDING = {
  mobile: 16,
  tablet: 24,
  desktop: 32,
  wide: 40,
} as const;

/**
 * Swipe Card Width - Unified across platforms
 * Mobile: 90% of screen width, max 380px
 * Tablet: Fixed 380px
 * Desktop/Web: Fixed 380px (Tinder-style)
 */
export const CARD_WIDTH = {
  mobile: 0.9, // Multiplier for screen width
  tablet: 380,
  desktop: 380,
  wide: 380,
} as const;

export const CARD_MAX_WIDTH = 380; // Maximum width on mobile
export const CARD_ASPECT_RATIO = 4 / 5; // 4:5 ratio (less tall, focus on face)
