import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './onboarding-styles';

// Animated background blob with rotation and scale
export const AnimatedBlob = React.memo(
  ({
    top,
    bottom,
    left,
    right,
    colors: gradientColors,
    duration,
    initialRotate = 0,
  }: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    colors: readonly [string, string, ...string[]];
    duration: number;
    initialRotate?: number;
  }) => {
    const styles = useThemedStyles(createStyles);
    const rotation = useSharedValue(initialRotate);
    const scale = useSharedValue(1);

    useEffect(() => {
      rotation.value = withRepeat(
        withSequence(
          withTiming(initialRotate + 90, { duration: duration * 1000, easing: Easing.linear }),
          withTiming(initialRotate, { duration: duration * 1000, easing: Easing.linear })
        ),
        -1,
        false
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration * 1000, easing: Easing.linear }),
          withTiming(1, { duration: duration * 1000, easing: Easing.linear })
        ),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    }));

    return (
      <Animated.View style={[styles.blob, animatedStyle, { top, bottom, left, right }]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.blobGradient}
        />
      </Animated.View>
    );
  }
);
AnimatedBlob.displayName = 'AnimatedBlob';

// Pulsing heart logo with SVG icon
export const PulsingHeartLogo = React.memo(
  ({
    gradientColors,
    pulseColor,
    pulseBorderColor,
  }: {
    gradientColors: readonly [string, string];
    pulseColor: string;
    pulseBorderColor: string;
  }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const pulseScale = useSharedValue(1);

    useEffect(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withSpring(1.2, { damping: 2, stiffness: 100 }),
          withSpring(1, { damping: 2, stiffness: 100 })
        ),
        -1,
        false
      );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulseScale.value }],
    }));

    return (
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.logoBackground, { shadowColor: gradientColors[0] }]}
        >
          <Heart size={36} color={colors.white} fill={colors.white} strokeWidth={0} />
        </LinearGradient>
        <Animated.View
          style={[
            styles.pulseDot,
            pulseStyle,
            { backgroundColor: pulseColor, borderColor: pulseBorderColor },
          ]}
        />
      </View>
    );
  }
);
PulsingHeartLogo.displayName = 'PulsingHeartLogo';

// Floating profile card with gentle animation
export const FloatingCard = React.memo(
  ({
    imageUrl,
    name,
    age,
    rotation,
    delay,
    showLike = false,
    likeGradient,
    iconColor,
  }: {
    imageUrl: string;
    name?: string;
    age?: number;
    rotation: number;
    delay: number;
    showLike?: boolean;
    likeGradient?: readonly [string, string];
    iconColor?: string;
  }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const floatY = useSharedValue(0);

    useEffect(() => {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation}deg` }, { translateY: floatY.value }],
    }));

    return (
      <Animated.View style={[styles.floatingCard, animatedStyle]}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.cardGradient} />
        {name && (
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {name}, {age}
            </Text>
          </View>
        )}
        {showLike && likeGradient && (
          <View style={styles.cardLikeIcon}>
            <LinearGradient colors={likeGradient} style={styles.likeIconGradient}>
              <Heart size={16} color={colors.white} fill={colors.white} strokeWidth={0} />
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    );
  }
);
FloatingCard.displayName = 'FloatingCard';
