/**
 * LikeButton Component
 *
 * Animated Like Button with heart explosion effect using Reanimated.
 *
 * Usage:
 * ```tsx
 * <LikeButton
 *   isActive={isLiked}
 *   onPress={toggleLike}
 *   size={32}
 * />
 * ```
 */

import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/tokens';
import { springConfig } from '../animations/presets';

// ============================================
// TYPES
// ============================================

export interface LikeButtonProps {
  /**
   * Is currently liked
   */
  isActive: boolean;

  /**
   * Toggle handler
   */
  onPress: () => void;

  /**
   * Size of the button
   * @default 24
   */
  size?: number;

  /**
   * Active color (filled heart)
   * @default colors.primary
   */
  activeColor?: string;

  /**
   * Inactive color (outline)
   * @default colors.textSecondary
   */
  inactiveColor?: string;

  /**
   * Custom container style
   */
  style?: ViewStyle;
}

// ============================================
// COMPONENT
// ============================================

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

export const LikeButton: React.FC<LikeButtonProps> = ({
  isActive,
  onPress,
  size = 24,
  activeColor = colors.primary,
  inactiveColor = colors.textSecondary,
  style,
}) => {
  // Shared values for animation
  const scale = useSharedValue(1);

  // Trigger animation when active state changes to true
  useEffect(() => {
    if (isActive) {
      // Use shared config for consistency
      scale.value = withSequence(
        withSpring(1.2, springConfig.bouncy),
        withSpring(1, springConfig.bouncy)
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // Optimistic update should be handled by parent, but we trigger animation here too
    if (!isActive) {
       // If becoming active, pop
       scale.value = withSequence(
        withSpring(0.8, springConfig.stiff),
        withSpring(1.2, springConfig.bouncy),
        withSpring(1, springConfig.normal)
      );
    }
    onPress();
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[styles.container, { width: size, height: size }, style]}
    >
      <AnimatedText
        style={[
          styles.icon,
          {
            fontSize: size,
            color: isActive ? activeColor : inactiveColor,
          },
          animatedStyle,
        ]}
      >
        {isActive ? '❤️' : '🤍'}
      </AnimatedText>
    </AnimatedTouchableOpacity>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default LikeButton;
