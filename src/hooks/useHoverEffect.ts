/**
 * useHoverEffect
 *
 * Provides hover state for Pressable components on web.
 * On native: returns noop handlers so callers can use it safely cross-platform.
 */

import { useState } from 'react';
import { Platform } from 'react-native';

interface HoverConfig {
  scale?: number;
  opacity?: number;
}

interface HoverProps {
  onHoverIn: () => void;
  onHoverOut: () => void;
}

interface UseHoverEffectResult {
  isHovered: boolean;
  hoverProps: HoverProps;
}

const noop = () => {};

export const useHoverEffect = (_config?: HoverConfig): UseHoverEffectResult => {
  const [isHovered, setIsHovered] = useState(false);

  // Return noop handlers on native — no hover concept exists there
  if (Platform.OS !== 'web') {
    return {
      isHovered: false,
      hoverProps: { onHoverIn: noop, onHoverOut: noop },
    };
  }

  return {
    isHovered,
    hoverProps: {
      onHoverIn: () => setIsHovered(true),
      onHoverOut: () => setIsHovered(false),
    },
  };
};
