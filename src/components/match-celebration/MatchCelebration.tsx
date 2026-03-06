import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Avatar } from '../Avatar';
import { colors } from '../../theme/tokens';
import { ConfettiParticle } from './confetti-particle';
import { styles } from './match-celebration-styles';

export interface MatchCelebrationProps {
  visible: boolean;
  currentUserAvatar: string;
  matchedUserAvatar: string;
  matchedUserName: string;
  onClose: () => void;
  onSendMessage?: () => void;
}

const CONFETTI_COLORS = [colors.primary, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const CONFETTI_COUNT = 50;

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      scale.value = withSpring(1, { damping: 15, stiffness: 150 });

      avatarScale.value = withDelay(
        200,
        withSequence(withSpring(1.2, { damping: 10 }), withSpring(1, { damping: 15 }))
      );

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

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <BlurView
          intensity={20}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />

        {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
          <ConfettiParticle
            key={index}
            delay={index * 30}
            color={CONFETTI_COLORS[index % CONFETTI_COLORS.length]}
          />
        ))}

        <Animated.View style={[styles.content, containerStyle]}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.titleBadge}
          >
            <Text style={styles.titleText}>IT'S A MATCH!</Text>
          </LinearGradient>

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

          <Text style={styles.message}>You and {matchedUserName} liked each other!</Text>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.sendMessageButton, pressed && { opacity: 0.8 }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onSendMessage?.();
              }}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendMessageText}>SEND MESSAGE</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              <Text style={styles.closeText}>KEEP SWIPING</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MatchCelebration;
