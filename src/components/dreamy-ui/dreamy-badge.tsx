/**
 * DreamyBadge - Pill-shaped label with pastel glassmorphism styling
 */

import React from 'react';
import { View, Text } from 'react-native';
import { dreamyColors, sharedStyles } from './dreamy-ui-styles';

interface DreamyBadgeProps {
  label: string;
  variant?: 'pink' | 'purple';
}

export const DreamyBadge: React.FC<DreamyBadgeProps> = ({ label, variant = 'pink' }) => {
  const bgColor = variant === 'pink' ? 'rgba(252, 231, 243, 0.6)' : 'rgba(243, 232, 255, 0.6)';
  const textColor = variant === 'pink' ? dreamyColors.pink500 : dreamyColors.purple700;
  const borderColor = variant === 'pink' ? 'rgba(249, 168, 212, 0.5)' : 'rgba(192, 132, 252, 0.5)';

  return (
    <View style={[sharedStyles.badge, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[sharedStyles.badgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
};
