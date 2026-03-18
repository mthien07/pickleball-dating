/**
 * WelcomeBrandPanel - Reusable branding panel for auth screens (desktop split layout)
 *
 * Shows gradient background, app logo, title, and tagline with entrance animations.
 * Used as the left panel in desktop split layout.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { fontFamily } from '../../../theme/tokens';

interface WelcomeBrandPanelProps {
  style?: StyleProp<ViewStyle>;
}

export const WelcomeBrandPanel = ({ style }: WelcomeBrandPanelProps) => {
  const colors = useThemeColors();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const titleOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo: scale + fade in with spring
    logoScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Title: slide up + fade in after 300ms
    titleTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));

    // Tagline: slide up + fade in after 500ms
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
      style={[{ justifyContent: 'center', alignItems: 'center' }, style]}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        {/* Logo icon with spring scale animation */}
        <Animated.View style={logoStyle}>
          <Ionicons name="tennisball" size={56} color="#FFFFFF" />
        </Animated.View>

        {/* App title with slide-up animation */}
        <Animated.Text
          style={[
            {
              fontSize: 40,
              fontFamily: fontFamily.headingCondensed,
              color: '#FFFFFF',
              letterSpacing: 3,
            },
            titleStyle,
          ]}
        >
          PICKLEMATCH
        </Animated.Text>

        {/* Tagline with Vietnamese diacritics + slide-up animation */}
        <Animated.View style={[{ alignItems: 'center', gap: 4 }, taglineStyle]}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: fontFamily.bodyMedium,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: 0.5,
            }}
          >
            Tìm Đối Thủ Hoàn Hảo
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamily.body,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 0.3,
            }}
          >
            Trên & Ngoài Sân
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default WelcomeBrandPanel;
