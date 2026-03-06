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

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, ViewStyle, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../contexts/ThemeContext';
import { springConfig } from '../animations/presets';
import { HeartParticles } from './HeartParticles';

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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

export const LikeButton: React.FC<LikeButtonProps> = ({
  isActive,
  onPress,
  size = 24,
  activeColor,
  inactiveColor,
  style,
}) => {
  const colors = useThemeColors();
  const resolvedActiveColor = activeColor ?? colors.primary;
  const resolvedInactiveColor = inactiveColor ?? colors.textSecondary;
  // Shared values for animation
  const scale = useSharedValue(1);

  // ANTIGRAVITY: Heart particles burst state
  const [triggerParticles, setTriggerParticles] = useState(false);

  // Trigger animation when active state changes to true
  useEffect(() => {
    if (isActive) {
      // Use shared config for consistency
      scale.value = withSequence(
        withSpring(1.2, springConfig.bouncy),
        withSpring(1, springConfig.bouncy)
      );
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // ANTIGRAVITY: Trigger heart particles burst!
      setTriggerParticles(true);
      setTimeout(() => setTriggerParticles(false), 100);
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
    <View style={[{ width: size * 3, height: size * 3 }, style]}>
      {/* ANTIGRAVITY: Heart particles burst effect */}
      <HeartParticles trigger={triggerParticles} count={8} size={size * 0.6} />

      <AnimatedPressable
        onPress={handlePress}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
        style={[styles.container, { width: size, height: size }]}
      >
        <AnimatedText
          style={[
            styles.icon,
            {
              fontSize: size,
              color: isActive ? resolvedActiveColor : resolvedInactiveColor,
            },
            animatedStyle,
          ]}
        >
          {isActive ? '❤️' : '🤍'}
        </AnimatedText>
      </AnimatedPressable>
    </View>
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
