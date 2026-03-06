import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { spacing, typography, borderRadius, fontFamily } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { useThemeColors } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../contexts/theme-colors';
import { Court } from '@data/mockData';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CourtCardProps {
  court: Court;
  onPress?: () => void;
  onBookPress?: () => void;
}

export const CourtCard = React.memo<CourtCardProps>(
  ({ court, onPress, onBookPress }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.08)' }}
        style={[styles.courtCard, animatedStyle]}
      >
        {/* Court Image */}
        <View style={styles.courtImageContainer}>
          <Image
            source={{ uri: court.images[0] }}
            style={styles.courtImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          {court.is_partner && (
            <View style={styles.partnerBadge}>
              <Text style={styles.partnerBadgeText}>Partner</Text>
            </View>
          )}
        </View>

        {/* Court Info */}
        <View style={styles.courtInfo}>
          <Text style={styles.courtName} numberOfLines={1}>
            {court.name}
          </Text>
          <Text style={styles.courtAddress} numberOfLines={2}>
            {court.address}
          </Text>

          <View style={styles.courtMeta}>
            <Text style={styles.courtDistance}>📍 {court.distance_km} km</Text>
            <Text style={styles.courtRating}>
              ⭐ {court.rating} ({court.review_count})
            </Text>
          </View>

          <View style={styles.courtFooter}>
            <Text style={styles.courtPrice}>
              {(court.price_per_hour / 1000).toFixed(0)}k VND/giờ
            </Text>
            {onBookPress && (
              <Pressable
                onPress={onBookPress}
                style={({ pressed }) => [styles.bookButton, pressed && { opacity: 0.8 }]}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Text style={styles.bookButtonText}>Đặt ngay</Text>
              </Pressable>
            )}
          </View>
        </View>
      </AnimatedPressable>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if court.id changes
    return prevProps.court.id === nextProps.court.id;
  }
);
CourtCard.displayName = 'CourtCard';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Court Card - Bento style with green shadow
    courtCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.bentoCard, // 24px - bento style
      ...shadows.courtCard,
      padding: 14,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    courtImageContainer: {
      position: 'relative',
      width: 110,
      height: 85,
      borderRadius: borderRadius.md, // 16px
      overflow: 'hidden',
      marginRight: 14,
    },
    courtImage: {
      width: '100%',
      height: '100%',
    },
    partnerBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: colors.secondary, // Green
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    partnerBadgeText: {
      ...typography.bodySmall,
      color: colors.white,
      fontSize: 10,
      fontWeight: '700',
    },
    courtInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    courtName: {
      ...typography.h4,
      color: colors.textPrimary,
      marginBottom: 3,
      fontWeight: '600',
      fontFamily: fontFamily.bodySemiBold,
    },
    courtAddress: {
      ...typography.bodySmall,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    courtMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 6,
    },
    courtDistance: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    courtRating: {
      ...typography.bodySmall,
      color: colors.textSecondary,
    },
    courtFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    courtPrice: {
      ...typography.h4,
      color: colors.primary, // Blue
      fontWeight: '700',
      fontFamily: fontFamily.heading,
    },
    bookButton: {
      backgroundColor: colors.primary, // Blue
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12, // More rounded
      ...shadows.button,
    },
    bookButtonText: {
      ...typography.button,
      fontSize: 13,
      color: colors.white,
      fontWeight: '700',
      textTransform: 'uppercase',
      fontFamily: fontFamily.heading,
    },
  });

export default CourtCard;
