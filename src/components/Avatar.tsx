/**
 * Avatar Component
 *
 * Circular avatar component with multiple sizes and online status indicator.
 * Implements design system from design/uiuxguides.md
 *
 * Features:
 * - Multiple sizes (XS, SM, MD, LG, XL)
 * - Online status indicator
 * - Fallback to initials if no image
 * - Border support
 *
 * Usage:
 * ```tsx
 * <Avatar
 *   size="md"
 *   imageUrl={user.avatar_url}
 *   isOnline={user.is_online}
 *   name={user.display_name}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, typography, borderRadius, avatarSizes } from '../theme/tokens';
import { shadows } from '../theme/shadows';

// ============================================
// TYPES
// ============================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Image URL
   */
  imageUrl?: string;

  /**
   * User's name (used for fallback initials)
   */
  name: string;

  /**
   * Show online status indicator
   * @default false
   */
  isOnline?: boolean;

  /**
   * Show border
   * @default false
   */
  showBorder?: boolean;

  /**
   * Border color
   * @default white
   */
  borderColor?: string;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

// ============================================
// COMPONENT
// ============================================

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  imageUrl,
  name,
  isOnline = false,
  showBorder = false,
  borderColor = colors.white,
  style,
}) => {
  // Get size value
  const sizeValue = avatarSizes[size];

  // Get initials from name
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  // Get background color based on name (consistent color per user)
  const getBackgroundColor = (fullName: string): string => {
    const colors = [
      '#5B9FE3', // Primary
      '#A8C8E8', // Secondary
      '#FFD700', // Accent
      '#4CAF50', // Success
      '#2196F3', // Info
      '#9C27B0', // Pro
      '#FF9800', // Warning
    ];
    const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const backgroundColor = getBackgroundColor(name);

  // Status indicator size (proportional to avatar size)
  const statusSize = Math.max(8, sizeValue * 0.2);

  // Container styles
  const containerStyles: ViewStyle[] = [
    styles.container,
    {
      width: sizeValue,
      height: sizeValue,
      borderRadius: sizeValue / 2,
    },
    ...(showBorder ? [{
      borderWidth: 2,
      borderColor: borderColor,
    }] : []),
    ...(style ? [style] : []),
  ].filter(Boolean);

  // Fallback styles
  const fallbackStyles: ViewStyle[] = [
    styles.fallback,
    {
      width: sizeValue,
      height: sizeValue,
      borderRadius: sizeValue / 2,
      backgroundColor: backgroundColor,
    },
  ];

  // Status indicator styles
  const statusStyles: ViewStyle = {
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: isOnline ? colors.success : colors.textTertiary,
    borderWidth: 2,
    borderColor: colors.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
  };

  return (
    <View style={containerStyles}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      ) : (
        <View style={fallbackStyles}>
          <Text
            style={[
              styles.initials,
              {
                fontSize: sizeValue * 0.4,
                lineHeight: sizeValue,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}

      {/* Online status indicator */}
      {isOnline !== undefined && (
        <View style={statusStyles} />
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    ...shadows.sm,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9999, // Will be overridden by inline style
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});

// ============================================
// SIZE VARIANTS
// ============================================

export const AvatarXS: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="xs" />
);

export const AvatarSM: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="sm" />
);

export const AvatarMD: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="md" />
);

export const AvatarLG: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="lg" />
);

export const AvatarXL: React.FC<Omit<AvatarProps, 'size'>> = (props) => (
  <Avatar {...props} size="xl" />
);

// Default export
export default Avatar;

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Basic avatar
<Avatar
  name="John Doe"
  imageUrl="https://..."
/>

// Avatar with online status
<Avatar
  size="md"
  name="Sarah Chen"
  imageUrl="https://..."
  isOnline={true}
/>

// Avatar with border
<Avatar
  size="lg"
  name="Mike Johnson"
  imageUrl="https://..."
  showBorder={true}
  borderColor="#FFFFFF"
/>

// Avatar without image (shows initials)
<Avatar
  size="sm"
  name="Emily Nguyen"
  isOnline={false}
/>

// Different sizes
<AvatarXS name="User" imageUrl="https://..." />
<AvatarSM name="User" imageUrl="https://..." />
<AvatarMD name="User" imageUrl="https://..." />
<AvatarLG name="User" imageUrl="https://..." />
<AvatarXL name="User" imageUrl="https://..." />

// Custom styling
<Avatar
  size="md"
  name="David Lee"
  imageUrl="https://..."
  style={{ marginRight: 12 }}
/>
*/
