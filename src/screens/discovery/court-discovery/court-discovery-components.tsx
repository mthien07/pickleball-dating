/**
 * CourtDiscovery - Reusable card and helper components
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../../theme/tokens';
import { styles } from './court-discovery-styles';

// ============================================
// STAR RATING
// ============================================

export const StarRating = React.memo(({ rating, count }: { rating: number; count: number }) => (
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
));

// ============================================
// COURT CARD
// ============================================

interface CourtCardProps {
  court: any;
  onPress: () => void;
  onBook: () => void;
}

export const CourtCard = React.memo(({ court, onPress, onBook }: CourtCardProps) => {
  const imageUrl =
    court.images && court.images.length > 0
      ? court.images[0]
      : 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&h=600&fit=crop';

  const priceDisplay = court.price_per_hour
    ? `${(court.price_per_hour / 1000).toFixed(0)}k/hr`
    : court.price || '$15/hr';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
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
          <TouchableOpacity style={styles.bookButton} onPress={onBook}>
            <Text style={styles.bookButtonText}>Đặt Ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// ============================================
// MAP PLACEHOLDER
// ============================================

export const MapPlaceholder = React.memo(() => (
  <View style={styles.mapPlaceholder}>
    <LinearGradient colors={[colors.surface, colors.background]} style={styles.mapGradient}>
      <Ionicons name="map" size={64} color={colors.primary} />
      <Text style={styles.mapText}>Bản Đồ Tương Tác</Text>
      <Text style={styles.mapSubtext}>Sắp ra mắt</Text>
    </LinearGradient>
  </View>
));

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = React.memo(() => (
  <View style={styles.emptyState}>
    <Ionicons name="map-outline" size={48} color={colors.textTertiary} />
    <Text style={styles.emptyText}>Không tìm thấy sân</Text>
  </View>
));
