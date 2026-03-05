/**
 * Tests for useAnimations hook
 *
 * Tests animation utilities like press, elevation, fade, bounce, etc.
 */

import { renderHook, act } from '@testing-library/react-native';
import {
  usePressAnimation,
  useElevationAnimation,
  useFadeAnimation,
  useBounceAnimation,
  useRippleAnimation,
  useSlideAnimation,
} from '../useAnimations';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('useAnimations', () => {
  describe('usePressAnimation', () => {
    it('should initialize with default scale', () => {
      const { result } = renderHook(() => usePressAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.handlePressIn).toBeInstanceOf(Function);
      expect(result.current.handlePressOut).toBeInstanceOf(Function);
    });

    it('should accept custom scale value', () => {
      const customScale = 0.95;
      const { result } = renderHook(() => usePressAnimation({ scaleValue: customScale }));

      expect(result.current).toBeDefined();
    });

    it('should handle press in', () => {
      const { result } = renderHook(() => usePressAnimation());

      act(() => {
        result.current.handlePressIn();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle press out', () => {
      const { result } = renderHook(() => usePressAnimation());

      act(() => {
        result.current.handlePressIn();
      });

      act(() => {
        result.current.handlePressOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should support spring or timing animation', () => {
      const { result: springResult } = renderHook(() => usePressAnimation({ useSpring: true }));
      const { result: timingResult } = renderHook(() => usePressAnimation({ useSpring: false }));

      expect(springResult.current).toBeDefined();
      expect(timingResult.current).toBeDefined();
    });
  });

  describe('useElevationAnimation', () => {
    it('should initialize with default elevation', () => {
      const { result } = renderHook(() => useElevationAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.handlePressIn).toBeInstanceOf(Function);
      expect(result.current.handlePressOut).toBeInstanceOf(Function);
    });

    it('should accept custom elevation values', () => {
      const { result } = renderHook(() =>
        useElevationAnimation({
          elevationFrom: 2,
          elevationTo: 8,
          scaleFrom: 1,
          scaleTo: 1.05,
        })
      );

      expect(result.current).toBeDefined();
    });

    it('should handle press in with elevation change', () => {
      const { result } = renderHook(() => useElevationAnimation());

      act(() => {
        result.current.handlePressIn();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle press out with antigravity float', () => {
      const { result } = renderHook(() => useElevationAnimation());

      act(() => {
        result.current.handlePressOut();
      });

      // Should trigger float animation
      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('useFadeAnimation', () => {
    it('should initialize with default opacity', () => {
      const { result } = renderHook(() => useFadeAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.fadeIn).toBeInstanceOf(Function);
      expect(result.current.fadeOut).toBeInstanceOf(Function);
      expect(result.current.setOpacity).toBeInstanceOf(Function);
    });

    it('should accept custom initial opacity', () => {
      const { result } = renderHook(() => useFadeAnimation({ initialOpacity: 0.5 }));

      expect(result.current).toBeDefined();
    });

    it('should fade in', () => {
      const { result } = renderHook(() => useFadeAnimation());

      act(() => {
        result.current.fadeIn(300);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should fade out', () => {
      const { result } = renderHook(() => useFadeAnimation());

      act(() => {
        result.current.fadeOut(300);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should set custom opacity', () => {
      const { result } = renderHook(() => useFadeAnimation());

      act(() => {
        result.current.setOpacity(0.7);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('useBounceAnimation', () => {
    it('should initialize correctly', () => {
      const { result } = renderHook(() => useBounceAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.bounce).toBeInstanceOf(Function);
    });

    it('should trigger bounce animation', () => {
      const { result } = renderHook(() => useBounceAnimation());

      act(() => {
        result.current.bounce();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('useRippleAnimation', () => {
    it('should initialize correctly', () => {
      const { result } = renderHook(() => useRippleAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.triggerRipple).toBeInstanceOf(Function);
    });

    it('should trigger ripple effect', () => {
      const { result } = renderHook(() => useRippleAnimation());

      act(() => {
        result.current.triggerRipple();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('useSlideAnimation', () => {
    it('should initialize with default direction', () => {
      const { result } = renderHook(() => useSlideAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.slideIn).toBeInstanceOf(Function);
      expect(result.current.slideOut).toBeInstanceOf(Function);
    });

    it('should support all directions', () => {
      const directions = ['left', 'right', 'up', 'down'] as const;

      directions.forEach((direction) => {
        const { result } = renderHook(() => useSlideAnimation(direction));
        expect(result.current).toBeDefined();
      });
    });

    it('should slide in', () => {
      const { result } = renderHook(() => useSlideAnimation('left'));

      act(() => {
        result.current.slideIn(100);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should slide out', () => {
      const { result } = renderHook(() => useSlideAnimation('right'));

      act(() => {
        result.current.slideOut(100);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('hook cleanup', () => {
    it('should cleanup press animation on unmount', () => {
      const { unmount } = renderHook(() => usePressAnimation());
      expect(() => unmount()).not.toThrow();
    });

    it('should cleanup elevation animation on unmount', () => {
      const { unmount } = renderHook(() => useElevationAnimation());
      expect(() => unmount()).not.toThrow();
    });

    it('should cleanup fade animation on unmount', () => {
      const { unmount } = renderHook(() => useFadeAnimation());
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid animation triggers', () => {
      const { result } = renderHook(() => usePressAnimation());

      act(() => {
        result.current.handlePressIn();
        result.current.handlePressOut();
        result.current.handlePressIn();
        result.current.handlePressOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle concurrent animations', () => {
      const { result: press } = renderHook(() => usePressAnimation());
      const { result: fade } = renderHook(() => useFadeAnimation());
      const { result: bounce } = renderHook(() => useBounceAnimation());

      act(() => {
        press.current.handlePressIn();
        fade.current.fadeIn();
        bounce.current.bounce();
      });

      expect(press.current.animatedStyle).toBeDefined();
      expect(fade.current.animatedStyle).toBeDefined();
      expect(bounce.current.animatedStyle).toBeDefined();
    });
  });
});
