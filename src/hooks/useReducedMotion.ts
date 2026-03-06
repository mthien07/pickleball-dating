/**
 * useReducedMotion - Respects user's reduced motion accessibility preference.
 *
 * Wraps reanimated's useReducedMotion and provides helper to conditionally
 * disable or simplify animations for users with motion sensitivity.
 *
 * Usage:
 * ```tsx
 * const { shouldReduceMotion, getEntering } = useReducedMotion();
 * <Animated.View entering={getEntering(FadeInUp.delay(100))} />
 * ```
 */

import { useReducedMotion as useReanimatedReducedMotion } from 'react-native-reanimated';
import type { BaseAnimationBuilder } from 'react-native-reanimated';

type AnimationInput = BaseAnimationBuilder | typeof BaseAnimationBuilder;

export function useReducedMotion() {
  const shouldReduceMotion = useReanimatedReducedMotion();

  // Returns the animation or undefined if reduced motion is preferred
  const getEntering = (animation: AnimationInput): AnimationInput | undefined => {
    return shouldReduceMotion ? undefined : animation;
  };

  // Returns duration multiplier (0 for reduced motion, 1 for normal)
  const durationMultiplier = shouldReduceMotion ? 0 : 1;

  return { shouldReduceMotion, getEntering, durationMultiplier };
}
