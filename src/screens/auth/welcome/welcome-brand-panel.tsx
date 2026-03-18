/**
 * WelcomeBrandPanel - Branding panel for auth screens (desktop split layout)
 *
 * Gradient background with animated logo, tagline, and floating decorative icons.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { fontFamily } from '../../../theme/tokens';

// Floating decorative icons scattered around the panel
const FLOATING_ICONS = [
  { name: 'tennisball', size: 28, top: '8%', left: '12%', delay: 0, opacity: 0.15 },
  { name: 'heart', size: 22, top: '15%', right: '18%', delay: 200, opacity: 0.12 },
  { name: 'tennisball', size: 20, top: '25%', left: '8%', delay: 400, opacity: 0.1 },
  { name: 'people', size: 24, top: '35%', right: '10%', delay: 100, opacity: 0.12 },
  { name: 'trophy', size: 20, bottom: '35%', left: '15%', delay: 300, opacity: 0.1 },
  { name: 'heart', size: 18, bottom: '25%', right: '15%', delay: 500, opacity: 0.12 },
  { name: 'tennisball', size: 32, bottom: '15%', left: '20%', delay: 150, opacity: 0.08 },
  { name: 'star', size: 20, bottom: '10%', right: '22%', delay: 350, opacity: 0.1 },
  { name: 'location', size: 22, top: '45%', left: '5%', delay: 250, opacity: 0.08 },
  { name: 'flash', size: 18, top: '55%', right: '8%', delay: 450, opacity: 0.1 },
] as const;

// Single floating icon with gentle bob animation
const FloatingIcon = ({ name, size, delay, opacity, ...pos }: (typeof FLOATING_ICONS)[number]) => {
  const translateY = useSharedValue(0);
  const iconOpacity = useSharedValue(0);

  useEffect(() => {
    // Fade in with delay
    iconOpacity.value = withDelay(600 + delay, withTiming(opacity, { duration: 800 }));
    // Gentle floating bob: up/down 8px, repeating
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-8, { duration: 2500 + delay, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: iconOpacity.value,
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
    <Animated.View style={[position, style]}>
      <Ionicons name={name as any} size={size} color="#FFFFFF" />
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
      {/* Floating decorative icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <FloatingIcon key={i} {...icon} />
      ))}

      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTopLeft]} />
      <View style={[styles.circle, styles.circleBottomRight]} />

      {/* Main content */}
      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <Ionicons name="tennisball" size={56} color="#FFFFFF" />
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>PICKLEMATCH</Animated.Text>

        <Animated.View style={[styles.taglineWrap, taglineStyle]}>
          <Text style={styles.tagline}>Tìm Đối Thủ Hoàn Hảo</Text>
          <Text style={styles.subtagline}>Trên & Ngoài Sân</Text>
        </Animated.View>

        {/* Feature pills */}
        <Animated.View style={[styles.featurePills, taglineStyle]}>
          <View style={styles.pill}>
            <Ionicons name="heart" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.pillText}>Hẹn hò</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="tennisball" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.pillText}>Tìm đối</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.pillText}>Đặt sân</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
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
  featurePills: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
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
  // Decorative translucent circles
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  circleTopLeft: {
    width: 300,
    height: 300,
    top: -80,
    left: -80,
  },
  circleBottomRight: {
    width: 250,
    height: 250,
    bottom: -60,
    right: -60,
  },
});

export default WelcomeBrandPanel;
