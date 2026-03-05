/**
 * useResponsive Hook
 *
 * Provides responsive utilities for adapting UI based on screen size
 */

import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { BREAKPOINTS, MAX_CONTENT_WIDTH, CONTAINER_PADDING } from '../theme/breakpoints';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isWeb: boolean;
  deviceType: DeviceType;
  width: number;
  height: number;
  maxContentWidth: number | string;
  containerPadding: number;
}

export const useResponsive = (): ResponsiveValues => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;
  const isWeb = Platform.OS === 'web';

  // Determine device type based on width
  const deviceType: DeviceType =
    width >= BREAKPOINTS.wide
      ? 'wide'
      : width >= BREAKPOINTS.desktop
        ? 'desktop'
        : width >= BREAKPOINTS.tablet
          ? 'tablet'
          : 'mobile';

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop' || deviceType === 'wide';
  const isWide = deviceType === 'wide';

  const maxContentWidth = MAX_CONTENT_WIDTH[deviceType];
  const containerPadding = CONTAINER_PADDING[deviceType];

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isWeb,
    deviceType,
    width,
    height,
    maxContentWidth,
    containerPadding,
  };
};

/**
 * Responsive value selector
 * Returns different values based on device type
 */
export const useResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
  default: T;
}): T => {
  const { deviceType } = useResponsive();

  return values[deviceType] ?? values.default;
};
