/**
 * CourtDiscovery - Reusable card and helper components
 */

import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './court-discovery-styles';

// ============================================
// STAR RATING
// ============================================

export const StarRating = React.memo(({ rating, count }: { rating: number; count: number }) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.starContainer}>
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={14}
            color={colors.accent}
          />
        ))}
      </View>
      <Text style={styles.reviewCount}>({count})</Text>
    </View>
  );
});

// ============================================
// COURT CARD
// ============================================

interface CourtCardProps {
  court: any;
  onPress: () => void;
  onBook: () => void;
}

export const CourtCard = React.memo(({ court, onPress, onBook }: CourtCardProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const imageUrl =
    court.images && court.images.length > 0
      ? court.images[0]
      : 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&h=600&fit=crop';

  const priceDisplay = court.price_per_hour
    ? `${(court.price_per_hour / 1000).toFixed(0)}k/hr`
    : court.price || '$15/hr';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(59, 89, 152, 0.15)' }}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{priceDisplay}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {court.name}
          </Text>
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate" size={12} color={colors.primary} />
            <Text style={styles.distanceText}>{court.distance || '1.2 km'}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>
            {court.address || court.location}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <StarRating rating={court.rating} count={court.reviews || court.review_count || 0} />
          <Pressable
            style={({ pressed }) => [styles.bookButton, pressed && { opacity: 0.7 }]}
            onPress={onBook}
            android_ripple={{ color: 'rgba(59, 89, 152, 0.15)' }}
          >
            <Text style={styles.bookButtonText}>Đặt Ngay</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

// ============================================
// COURT MAP LIST (map-style distance view)
// ============================================

interface CourtMapListProps {
  courts: any[];
  onPress: (id: string) => void;
  onBook: (id: string) => void;
}

export const CourtMapList = React.memo(({ courts, onPress, onBook }: CourtMapListProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.mapPlaceholder}>
      {/* Map banner */}
      <LinearGradient colors={[colors.primary + '22', colors.background]} style={styles.mapBanner}>
        <Ionicons name="map-outline" size={28} color={colors.primary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ ...styles.mapText, fontSize: 15 }}>Xem theo khoảng cách</Text>
          <Text style={styles.mapSubtext}>{courts.length} sân gần bạn</Text>
        </View>
      </LinearGradient>

      {/* Court list sorted by distance */}
      <FlatList
        data={[...courts].sort((a, b) => (a.distance_km ?? 99) - (b.distance_km ?? 99))}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onPress(item.id)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary + '18',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="location" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}
                numberOfLines={1}
              >
                {item.address || item.location}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
                {item.distance_km != null ? `${item.distance_km} km` : '—'}
              </Text>
              <Pressable
                onPress={() => onBook(item.id)}
                style={({ pressed }) => ({
                  marginTop: 4,
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text style={{ fontSize: 12, color: colors.white, fontWeight: '700' }}>Đặt</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
});

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = React.memo(() => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.emptyState}>
      <Ionicons name="map-outline" size={48} color={colors.textTertiary} />
      <Text style={styles.emptyText}>Không tìm thấy sân</Text>
    </View>
  );
});
