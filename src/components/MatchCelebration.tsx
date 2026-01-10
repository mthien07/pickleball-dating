/**
 * MatchCelebration Component
 *
 * Confetti celebration modal when match is successful
 * Features particle explosion and avatar animations
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Avatar } from './Avatar';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

export interface MatchCelebrationProps {
  visible: boolean;
  currentUserAvatar: string;
  matchedUserAvatar: string;
  matchedUserName: string;
  onClose: () => void;
  onSendMessage?: () => void;
}

// ============================================
// CONFETTI PARTICLE
// ============================================

interface ConfettiParticleProps {
  delay: number;
  color: string;
}

const ConfettiParticle: React.FC<ConfettiParticleProps> = ({ delay, color }) => {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Random initial position
    const startX = (Math.random() - 0.5) * SCREEN_WIDTH * 0.4;
    const endX = startX + (Math.random() - 0.5) * 200;

    translateX.value = startX;

    // Animate
    opacity.value = withDelay(delay, withTiming(1, { duration: 100 }));

    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: 2000 + Math.random() * 1000,
      })
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
          duration: 1000 + Math.random() * 1000,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confettiParticle, { backgroundColor: color }, animatedStyle]} />
  );
};

// ============================================
// COMPONENT
// ============================================

export const MatchCelebration: React.FC<MatchCelebrationProps> = ({
  visible,
  currentUserAvatar,
  matchedUserAvatar,
  matchedUserName,
  onClose,
  onSendMessage,
}) => {
  const scale = useSharedValue(0);
  const avatarScale = useSharedValue(0);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Entrance animations
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      // Avatar animations with delay
      avatarScale.value = withDelay(
        200,
        withSequence(withSpring(1.2, { damping: 10 }), withSpring(1, { damping: 15 }))
      );

      // Heart pulse animation
      heartScale.value = withDelay(
        400,
        withRepeat(
          withSequence(withTiming(1.2, { duration: 400 }), withTiming(1, { duration: 400 })),
          -1,
          true
        )
      );
    } else {
      scale.value = 0;
      avatarScale.value = 0;
      heartScale.value = 0;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  if (!visible) {
    return null;
  }

  // Confetti colors
  const confettiColors = [colors.primary, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        {/* Blur Background */}
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />

        {/* Confetti Particles */}
        {Array.from({ length: 50 }).map((_, index) => (
          <ConfettiParticle
            key={index}
            delay={index * 30}
            color={confettiColors[index % confettiColors.length]}
          />
        ))}

        {/* Content */}
        <Animated.View style={[styles.content, containerStyle]}>
          {/* Title */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.titleBadge}
          >
            <Text style={styles.titleText}>IT'S A MATCH!</Text>
          </LinearGradient>

          {/* Avatars */}
          <View style={styles.avatarsContainer}>
            <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
              <Avatar
                size="xl"
                imageUrl={currentUserAvatar}
                name="You"
                showBorder
                borderColor={colors.primary}
              />
            </Animated.View>

            {/* Heart Icon */}
            <Animated.View style={[styles.heartIcon, heartStyle]}>
              <LinearGradient colors={['#EC4899', '#EF4444']} style={styles.heartGradient}>
                <Text style={styles.heartEmoji}>💗</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View style={[styles.avatarWrapper, avatarStyle]}>
              <Avatar
                size="xl"
                imageUrl={matchedUserAvatar}
                name={matchedUserName}
                showBorder
                borderColor={colors.primary}
              />
            </Animated.View>
          </View>

          {/* Message */}
          <Text style={styles.message}>You and {matchedUserName} liked each other!</Text>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.sendMessageButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onSendMessage?.();
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendMessageText}>SEND MESSAGE</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>KEEP SWIPING</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },

  // Title
  titleBadge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
  },
  titleText: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
    letterSpacing: 2,
  },

  // Avatars
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    marginHorizontal: spacing.sm,
  },
  heartIcon: {
    marginHorizontal: spacing.md,
  },
  heartGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartEmoji: {
    fontSize: 32,
  },

  // Message
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },

  // Actions
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  sendMessageButton: {
    width: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  sendMessageText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Confetti
  confettiParticle: {
    position: 'absolute',
    top: 0,
    left: SCREEN_WIDTH / 2,
    width: 8,
    height: 12,
    borderRadius: 2,
  },
});

export default MatchCelebration;
