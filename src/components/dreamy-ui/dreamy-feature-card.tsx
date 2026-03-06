/**
 * DreamyFeatureCard - Glassmorphism card with animated icon and spring press feedback
 */

import React from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { dreamyColors, sharedStyles } from './dreamy-ui-styles';

interface DreamyFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  onPress?: () => void;
}

export const DreamyFeatureCard: React.FC<DreamyFeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { rotate: `${(iconScale.value - 1) * 50}deg` }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    iconScale.value = withSpring(1.1, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    iconScale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify()}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: 'rgba(216, 180, 254, 0.2)' }}
      >
        <Animated.View style={[sharedStyles.featureCard, animatedCardStyle]}>
          <LinearGradient
            colors={[dreamyColors.pink50, dreamyColors.purple50, 'rgba(255,255,255,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={sharedStyles.featureCardGradient}
          >
            {/* Icon Container */}
            <Animated.View style={[sharedStyles.iconContainer, iconAnimatedStyle]}>
              <LinearGradient
                colors={['rgba(249, 168, 212, 0.4)', 'rgba(216, 180, 254, 0.4)']}
                style={sharedStyles.iconGradient}
              >
                {icon}
              </LinearGradient>
            </Animated.View>

            <Text style={sharedStyles.featureTitle}>{title}</Text>
            <Text style={sharedStyles.featureDescription}>{description}</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};
