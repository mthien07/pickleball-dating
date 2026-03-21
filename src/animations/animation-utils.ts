/**
 * Animation utility helpers shared across animation hooks.
 *
 * These are worklet-compatible style builders and timing presets
 * used to reduce boilerplate in animation hooks.
 */

import { Easing } from 'react-native-reanimated';

// ============================================
// SHARED TIMING PRESETS
// (for hooks that don't import animation-configs)
// ============================================

/** Spring config used across press/elevation/misc hooks */
export const HOOK_SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
} as const;

/** Standard ease timing for fade/ripple hooks */
export const HOOK_TIMING_EASE = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
} as const;

/** Ripple-specific timing (longer, ease-out) */
export const RIPPLE_TIMING = {
  duration: 600,
  easing: Easing.out(Easing.ease),
} as const;

/** Shimmer timing (linear sweep) */
export const SHIMMER_TIMING = {
  duration: 1500,
  easing: Easing.linear,
} as const;

// ============================================
// WORKLET-COMPATIBLE STYLE BUILDERS
// ============================================

/** Returns a transform style with a single scale value. Worklet-safe. */
export function scaleTransformStyle(scaleValue: number) {
  'worklet';
  return { transform: [{ scale: scaleValue }] };
}

/** Returns an opacity style. Worklet-safe. */
export function opacityStyle(opacityValue: number) {
  'worklet';
  return { opacity: opacityValue };
}

/** Returns a translateX transform style. Worklet-safe. */
export function translateXStyle(tx: number) {
  'worklet';
  return { transform: [{ translateX: tx }] };
}
