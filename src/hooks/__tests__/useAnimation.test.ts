/**
 * Tests for useAnimation hook
 *
 * Tests the main animation utility hook
 */

import { renderHook, act } from '@testing-library/react-native';
import { useAnimation } from '../useAnimation';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('useAnimation', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useAnimation());

      expect(result.current.animatedStyle).toBeDefined();
      expect(result.current.fadeIn).toBeInstanceOf(Function);
      expect(result.current.fadeOut).toBeInstanceOf(Function);
      expect(result.current.scaleIn).toBeInstanceOf(Function);
      expect(result.current.scaleOut).toBeInstanceOf(Function);
      expect(result.current.slideUp).toBeInstanceOf(Function);
      expect(result.current.slideDown).toBeInstanceOf(Function);
      expect(result.current.slideLeft).toBeInstanceOf(Function);
      expect(result.current.slideRight).toBeInstanceOf(Function);
    });

    it('should accept custom initial opacity', () => {
      const { result } = renderHook(() => useAnimation({ initialOpacity: 0.5 }));

      expect(result.current).toBeDefined();
    });

    it('should accept custom initial scale', () => {
      const { result } = renderHook(() => useAnimation({ initialScale: 0.8 }));

      expect(result.current).toBeDefined();
    });

    it('should accept custom initial position', () => {
      const { result } = renderHook(() =>
        useAnimation({ initialTranslateX: 100, initialTranslateY: 50 })
      );

      expect(result.current).toBeDefined();
    });
  });

  describe('fade animations', () => {
    it('should fade in with default duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should fade in with custom duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn(500);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should fade out with default duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should fade out with custom duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeOut(500);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('scale animations', () => {
    it('should scale in', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.scaleIn();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should scale out', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.scaleOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('slide animations', () => {
    it('should slide up', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.slideUp();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should slide down', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.slideDown();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should slide left', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.slideLeft();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should slide right', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.slideRight();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should slide with custom distance', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.slideUp(100);
        result.current.slideDown(50);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('combined animations', () => {
    it('should handle fade and scale together', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn();
        result.current.scaleIn();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle all animations together', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn();
        result.current.scaleIn();
        result.current.slideUp();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should transition from in to out', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn();
        result.current.scaleIn();
      });

      act(() => {
        result.current.fadeOut();
        result.current.scaleOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });
  });

  describe('animated style', () => {
    it('should return style object with transform and opacity', () => {
      const { result } = renderHook(() => useAnimation());

      expect(result.current.animatedStyle).toEqual(
        expect.objectContaining({
          opacity: expect.anything(),
          transform: expect.any(Array),
        })
      );
    });
  });

  describe('hook cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useAnimation());

      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple mounts and unmounts', () => {
      const { unmount: unmount1 } = renderHook(() => useAnimation());
      const { unmount: unmount2 } = renderHook(() => useAnimation());

      expect(() => {
        unmount1();
        unmount2();
      }).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle rapid animation calls', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn();
        result.current.fadeOut();
        result.current.fadeIn();
        result.current.scaleIn();
        result.current.scaleOut();
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle zero duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn(0);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle very long duration', () => {
      const { result } = renderHook(() => useAnimation());

      act(() => {
        result.current.fadeIn(10000);
      });

      expect(result.current.animatedStyle).toBeDefined();
    });

    it('should handle extreme initial values', () => {
      const { result } = renderHook(() =>
        useAnimation({
          initialOpacity: 0,
          initialScale: 0,
          initialTranslateX: -1000,
          initialTranslateY: 1000,
        })
      );

      expect(result.current).toBeDefined();
    });
  });
});
