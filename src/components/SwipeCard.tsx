import React, { useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProfileCard, ProfileCardProps } from './Card';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { borderRadius, fontFamily } from '../theme/tokens';
import { useThemeColors } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../contexts/theme-colors';
import { CARD_MAX_WIDTH, CARD_ASPECT_RATIO } from '../theme/breakpoints';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, CARD_MAX_WIDTH);

export interface SwipeCardProps extends ProfileCardProps {
  swipeThreshold?: number;
  onSwipeComplete?: () => void;
  showOverlays?: boolean;
  cardWidth?: number;
}

export interface SwipeCardRef {
  swipe: (direction: 'left' | 'right') => void;
  reset: () => void;
}

interface SwipeOverlayProps {
  type: 'like' | 'nope';
  translateX: { value: number };
  threshold: number;
}

const SwipeOverlay = React.memo(({ type, translateX, threshold }: SwipeOverlayProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const isLike = type === 'like';

  // Pre-compute ranges outside worklet - they only depend on props
  const inputRange = isLike ? [0, threshold * 0.5, threshold] : [-threshold, -threshold * 0.5, 0];
  const opacityRange = isLike ? [0, 0.5, 1] : [1, 0.5, 0];
  const scaleRange = isLike ? [0.5, 0.8, 1] : [1, 0.8, 0.5];
  const rotate = isLike ? '-15deg' : '15deg';

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, inputRange, opacityRange, Extrapolate.CLAMP);
    const scale = interpolate(translateX.value, inputRange, scaleRange, Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ scale }, { rotate }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.overlayContainer,
        isLike ? styles.likeOverlay : styles.nopeOverlay,
        animatedStyle,
      ]}
    >
      <View
        style={[styles.overlayBadge, { borderColor: isLike ? colors.secondary : colors.error }]}
      >
        <Text style={[styles.overlayText, { color: isLike ? colors.secondary : colors.error }]}>
          {isLike ? 'LIKE' : 'NOPE'}
        </Text>
      </View>
    </Animated.View>
  );
});

SwipeOverlay.displayName = 'SwipeOverlay';

interface SuperLikeOverlayProps {
  translateY: { value: number };
  threshold: number;
}

const SuperLikeOverlay = React.memo(({ translateY, threshold }: SuperLikeOverlayProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  // Pre-compute ranges outside worklet
  const inputRange = [-threshold, -threshold * 0.5, 0];

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, inputRange, [1, 0.5, 0], Extrapolate.CLAMP);
    const scale = interpolate(translateY.value, inputRange, [1, 0.8, 0.5], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.superLikeOverlay, animatedStyle]}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.superLikeBadge}>
        <Ionicons name="star" size={28} color={colors.white} />
        <Text style={styles.superLikeText}>SUPER LIKE</Text>
      </LinearGradient>
    </Animated.View>
  );
});

SuperLikeOverlay.displayName = 'SuperLikeOverlay';

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  (
    {
      user,
      onLike,
      onPass,
      onPress,
      swipeThreshold,
      onSwipeComplete,
      showOverlays = true,
      cardWidth,
      ...profileCardProps
    },
    ref
  ) => {
    // Use passed width or default
    const width = cardWidth || DEFAULT_CARD_WIDTH;
    const threshold = swipeThreshold || width * 0.35;
    // Swipe gesture hook
    const { gestureHandler, animatedStyle, translateX, translateY, swipe, reset } = useSwipeGesture(
      {
        onSwipeRight: onLike,
        onSwipeLeft: onPass,
        threshold,
        maxRotation: 15,
        enableHaptic: true,
        onSwipeComplete,
      }
    );

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      swipe,
      reset,
    }));

    // Dynamic container style with responsive width
    const containerStyle = {
      width,
      aspectRatio: CARD_ASPECT_RATIO,
    };

    return (
      <GestureDetector gesture={gestureHandler}>
        <Animated.View style={[containerStyle, animatedStyle]}>
          {/* Profile Card */}
          <ProfileCard user={user} onPress={onPress} cardWidth={width} {...profileCardProps} />

          {/* LIKE/NOPE Overlays */}
          {showOverlays && (
            <>
              <SwipeOverlay type="like" translateX={translateX} threshold={threshold} />
              <SwipeOverlay type="nope" translateX={translateX} threshold={threshold} />
              <SuperLikeOverlay translateY={translateY} threshold={100} />
            </>
          )}
        </Animated.View>
      </GestureDetector>
    );
  }
);

SwipeCard.displayName = 'SwipeCard';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlayContainer: {
      position: 'absolute',
      top: 50,
      zIndex: 100,
    },
    likeOverlay: {
      left: 20,
    },
    nopeOverlay: {
      right: 20,
    },
    overlayBadge: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderWidth: 3,
      borderRadius: borderRadius.lg, // More rounded
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    overlayText: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 1.5,
      fontFamily: fontFamily.heading, // Barlow-Bold for Vibrant Sport
      textTransform: 'uppercase' as const,
    },
    superLikeOverlay: {
      position: 'absolute',
      bottom: 110,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 100,
    },
    superLikeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 22,
      paddingVertical: 14,
      borderRadius: 24, // More rounded - bento style
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
    superLikeText: {
      color: colors.white,
      fontSize: 22,
      fontWeight: '800',
      letterSpacing: 0.5,
      fontFamily: fontFamily.heading, // Barlow-Bold for Vibrant Sport
      textTransform: 'uppercase' as const,
    },
  });

// Default export
export default SwipeCard;
