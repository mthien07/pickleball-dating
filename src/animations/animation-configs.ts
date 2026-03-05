/**
 * Animation timing and spring configuration objects
 */

import { Easing, WithTimingConfig, WithSpringConfig } from 'react-native-reanimated';
import { durations } from '../theme/tokens';

export const timingConfig = {
  fast: {
    duration: durations.fast,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  normal: {
    duration: durations.normal,
    easing: Easing.out(Easing.ease),
  } as WithTimingConfig,

  medium: {
    duration: durations.medium,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,

  slow: {
    duration: durations.slow,
    easing: Easing.inOut(Easing.ease),
  } as WithTimingConfig,

  smooth: {
    duration: durations.normal,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  } as WithTimingConfig,

  bounce: {
    duration: durations.medium,
    easing: Easing.bounce,
  } as WithTimingConfig,
};

export const springConfig = {
  gentle: {
    damping: 20,
    stiffness: 90,
  } as WithSpringConfig,

  normal: {
    damping: 15,
    stiffness: 150,
  } as WithSpringConfig,

  bouncy: {
    damping: 10,
    stiffness: 100,
  } as WithSpringConfig,

  stiff: {
    damping: 30,
    stiffness: 400,
  } as WithSpringConfig,
};
