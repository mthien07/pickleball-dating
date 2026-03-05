/**
 * Enhanced Animation Hooks
 *
 * Re-exports all animation hooks from modular files.
 * - Press/Elevation/Fade: use-press-elevation-fade-animations.ts
 * - Ripple/Bounce/Shimmer/Slide: use-misc-animations.ts
 */

export {
  SPRING_CONFIG,
  TIMING_CONFIG,
  usePressAnimation,
  useElevationAnimation,
  useFadeAnimation,
} from './use-press-elevation-fade-animations';

export {
  useRippleAnimation,
  useBounceAnimation,
  useShimmerAnimation,
  useSlideAnimation,
} from './use-misc-animations';
