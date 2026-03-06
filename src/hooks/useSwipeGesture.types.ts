/** Types for useSwipeGesture hook */

export interface UseSwipeGestureOptions {
  /** Callback when swiped right (like) */
  onSwipeRight?: () => void;
  /** Callback when swiped left (pass) */
  onSwipeLeft?: () => void;
  /** Swipe distance threshold to trigger action (default: 40% of screen) */
  threshold?: number;
  /** Maximum rotation angle in degrees (default: 15) */
  maxRotation?: number;
  /** Enable haptic feedback (default: true) */
  enableHaptic?: boolean;
  /** Callback when swipe completed (any direction) */
  onSwipeComplete?: () => void;
}

export interface UseSwipeGestureReturn {
  /** Gesture handler event */
  gestureHandler: any;
  /** Animated style object */
  animatedStyle: any;
  /** Shared value for translateX */
  translateX: any;
  /** Shared value for translateY */
  translateY: any;
  /** Reset position programmatically */
  reset: () => void;
  /** Trigger swipe programmatically */
  swipe: (direction: 'left' | 'right' | 'up') => void;
}
