/**
 * DreamyHeroCard - Large CTA card with pulsing heart icon and gradient buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { dreamyColors, sharedStyles } from './dreamy-ui-styles';

interface DreamyHeroCardProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const DreamyHeroCard: React.FC<DreamyHeroCardProps> = ({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const heartScale = useSharedValue(1);

  React.useEffect(() => {
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [heartScale]);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(600).duration(800).springify()}>
      <View style={sharedStyles.heroCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', dreamyColors.pink50, dreamyColors.purple50]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={sharedStyles.heroCardGradient}
        >
          {/* Animated Heart Icon */}
          <Animated.View style={[sharedStyles.heroIconContainer, heartAnimatedStyle]}>
            <LinearGradient
              colors={['rgba(249, 168, 212, 0.4)', 'rgba(216, 180, 254, 0.4)']}
              style={sharedStyles.heroIconGradient}
            >
              <Heart size={48} color={dreamyColors.pink500} fill={dreamyColors.pink500} />
            </LinearGradient>
          </Animated.View>

          <Text style={sharedStyles.heroTitle}>{title}</Text>
          <Text style={sharedStyles.heroSubtitle}>{subtitle}</Text>

          {/* Buttons */}
          <View style={sharedStyles.heroButtons}>
            <TouchableOpacity onPress={onPrimaryPress} activeOpacity={0.8}>
              <LinearGradient
                colors={[dreamyColors.pink400, dreamyColors.purple400]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={sharedStyles.primaryButton}
              >
                <Text style={sharedStyles.primaryButtonText}>{primaryButtonText}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {secondaryButtonText && (
              <TouchableOpacity
                onPress={onSecondaryPress}
                style={sharedStyles.secondaryButton}
                activeOpacity={0.7}
              >
                <Text style={sharedStyles.secondaryButtonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};
