/**
 * WelcomeBrandPanel - Branding panel for auth screens (desktop split layout)
 *
 * Gradient background with animated logo, tagline, and floating decorative emojis.
 * Uses plain text emojis instead of Ionicons to ensure cross-platform rendering on web.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { fontFamily } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';

// Floating decorative emojis (plain text = always renders on web + native)
const FLOATING_ITEMS = [
  { emoji: '🏓', size: 28, top: '8%', left: '12%', delay: 0, opacity: 0.25 },
  { emoji: '❤️', size: 22, top: '15%', right: '18%', delay: 200, opacity: 0.2 },
  { emoji: '🏓', size: 20, top: '25%', left: '8%', delay: 400, opacity: 0.18 },
  { emoji: '🤝', size: 24, top: '35%', right: '10%', delay: 100, opacity: 0.2 },
  { emoji: '🏆', size: 22, bottom: '35%', left: '15%', delay: 300, opacity: 0.18 },
  { emoji: '💕', size: 20, bottom: '25%', right: '15%', delay: 500, opacity: 0.2 },
  { emoji: '🎾', size: 32, bottom: '15%', left: '20%', delay: 150, opacity: 0.15 },
  { emoji: '⭐', size: 20, bottom: '10%', right: '22%', delay: 350, opacity: 0.18 },
  { emoji: '📍', size: 22, top: '45%', left: '5%', delay: 250, opacity: 0.15 },
  { emoji: '⚡', size: 20, top: '55%', right: '8%', delay: 450, opacity: 0.18 },
] as const;

// Single floating emoji with gentle bob animation
const FloatingEmoji = ({
  emoji,
  size,
  delay,
  opacity,
  ...pos
}: (typeof FLOATING_ITEMS)[number]) => {
  const translateY = useSharedValue(0);
  const emojiOpacity = useSharedValue(0);

  useEffect(() => {
    emojiOpacity.value = withDelay(600 + delay, withTiming(opacity, { duration: 800 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-10, { duration: 2500 + delay, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: emojiOpacity.value,
  }));

  const position: any = { position: 'absolute' };
  if ('top' in pos) {
    position.top = pos.top;
  }
  if ('bottom' in pos) {
    position.bottom = pos.bottom;
  }
  if ('left' in pos) {
    position.left = pos.left;
  }
  if ('right' in pos) {
    position.right = pos.right;
  }

  return (
    <Animated.View style={[position, animStyle]}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
};

interface WelcomeBrandPanelProps {
  style?: StyleProp<ViewStyle>;
}

export const WelcomeBrandPanel = ({ style }: WelcomeBrandPanelProps) => {
  const colors = useThemeColors();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    titleTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
    taglineTranslateY.value = withDelay(
      500,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: taglineTranslateY.value }],
    opacity: taglineOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {/* Floating decorative emojis */}
      {FLOATING_ITEMS.map((item, i) => (
        <FloatingEmoji key={i} {...item} />
      ))}

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Main content */}
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <Text style={{ fontSize: 56 }}>🏓</Text>
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>PICKLEMATCH</Animated.Text>

        <Animated.View style={[styles.taglineWrap, taglineStyle]}>
          <Text style={styles.tagline}>Tìm Đối Thủ Hoàn Hảo</Text>
          <Text style={styles.subtagline}>Trên & Ngoài Sân</Text>
        </Animated.View>

        {/* Feature pills with emoji icons */}
        <Animated.View style={[styles.featurePills, taglineStyle]}>
          <View style={styles.pill}>
            <Text style={{ fontSize: 14 }}>❤️</Text>
            <Text style={styles.pillText}>Hẹn hò</Text>
          </View>
          <View style={styles.pill}>
            <Text style={{ fontSize: 14 }}>🎾</Text>
            <Text style={styles.pillText}>Tìm đối</Text>
          </View>
          <View style={styles.pill}>
            <Text style={{ fontSize: 14 }}>📍</Text>
            <Text style={styles.pillText}>Đặt sân</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  content: { alignItems: 'center', gap: 16, zIndex: 2 },
  title: {
    fontSize: 40,
    fontFamily: fontFamily.headingCondensed,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  taglineWrap: { alignItems: 'center', gap: 4 },
  tagline: {
    fontSize: 17,
    fontFamily: fontFamily.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  subtagline: {
    fontSize: 14,
    fontFamily: fontFamily.body,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
  },
  featurePills: { flexDirection: 'row', gap: 12, marginTop: 24 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillText: {
    fontSize: 13,
    fontFamily: fontFamily.bodyMedium,
    color: 'rgba(255,255,255,0.9)',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleTopLeft: { width: 300, height: 300, top: -80, left: -80 },
  circleBottomRight: { width: 250, height: 250, bottom: -60, right: -60 },
});

export default WelcomeBrandPanel;
