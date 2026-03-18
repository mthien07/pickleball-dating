/**
 * WelcomeBrandPanel - Reusable branding panel for auth screens (desktop split layout)
 *
 * Shows gradient background, app logo, title, and tagline.
 * Used as the left panel in desktop split layout.
 */

import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { fontFamily } from '../../../theme/tokens';

interface WelcomeBrandPanelProps {
  style?: StyleProp<ViewStyle>;
}

export const WelcomeBrandPanel = ({ style }: WelcomeBrandPanelProps) => {
  const colors = useThemeColors();

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ justifyContent: 'center', alignItems: 'center' }, style]}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Ionicons name="tennisball" size={48} color="#FFFFFF" />

        <Text
          style={{
            fontSize: 36,
            fontFamily: fontFamily.headingCondensed,
            color: '#FFFFFF',
            letterSpacing: 2,
          }}
        >
          PICKLEMATCH
        </Text>

        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamily.body,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: 0.5,
            }}
          >
            Tim Doi Thu Hoan Hao
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamily.body,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: 0.3,
            }}
          >
            Tren &amp; Ngoai San
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default WelcomeBrandPanel;
