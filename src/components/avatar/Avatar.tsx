import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, avatarSizes } from '../../theme/tokens';
import { styles, AVATAR_COLORS } from './avatar-styles';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  size?: AvatarSize;
  imageUrl?: string;
  name: string;
  isOnline?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  style?: ViewStyle;
}

const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getBackgroundColor = (fullName: string): string => {
  const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  imageUrl,
  name,
  isOnline = false,
  showBorder = false,
  borderColor = colors.white,
  style,
}) => {
  const sizeValue = avatarSizes[size];
  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);
  const statusSize = Math.max(8, sizeValue * 0.2);

  const containerStyles: ViewStyle[] = [
    styles.container,
    { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2 },
    ...(showBorder ? [{ borderWidth: 2, borderColor }] : []),
    ...(style ? [style] : []),
  ].filter(Boolean);

  const fallbackStyles: ViewStyle[] = [
    styles.fallback,
    { width: sizeValue, height: sizeValue, borderRadius: sizeValue / 2, backgroundColor },
  ];

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
          <Text style={[styles.initials, { fontSize: sizeValue * 0.4, lineHeight: sizeValue }]}>
            {initials}
          </Text>
        </View>
      )}
      {isOnline !== undefined && <View style={statusStyles} />}
    </View>
  );
};

export default Avatar;
