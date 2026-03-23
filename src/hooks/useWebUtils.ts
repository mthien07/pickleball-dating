/**
 * useWebUtils Hook
 *
 * Utilities for web-specific behaviors and optimizations
 */

import { Platform } from 'react-native';
import { useResponsive } from './useResponsive';

export const useWebUtils = () => {
  const { isWeb, isDesktop } = useResponsive();

  /**
   * Check if touch gestures should be enabled
   * On desktop web, prefer click/keyboard interactions
   */
  const shouldEnableTouch = isWeb ? !isDesktop : true;

  /**
   * Check if keyboard navigation should be enabled
   */
  const shouldEnableKeyboard = isWeb && isDesktop;

  /**
   * Get optimal card aspect ratio for device
   */
  const getCardAspectRatio = () => {
    if (!isWeb) {
      return 0.67;
    } // Mobile ratio — editorial portrait
    if (isDesktop) {
      return 0.75;
    } // Desktop: slightly taller editorial card
    return 0.67;
  };

  /**
   * Check if should show web-specific UI elements
   */
  const showWebUI = isWeb && isDesktop;

  return {
    isWeb,
    shouldEnableTouch,
    shouldEnableKeyboard,
    showWebUI,
    getCardAspectRatio,
  };
};
