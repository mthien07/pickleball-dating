/**
 * CourtDetail - Reusable section components
 */

import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useThemeColors } from '../../../contexts/ThemeContext';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles, SCREEN_WIDTH } from './court-detail-styles';
import { Court } from '@data/mockData';

// ============================================
// IMAGE CAROUSEL
// ============================================

interface ImageCarouselProps {
  court: Court;
  currentImageIndex: number;
  scrollRef: React.RefObject<ScrollView | null>;
  onScrollEnd: (event: any) => void;
  onBack: () => void;
}

export const ImageCarousel = React.memo(
  ({ court, currentImageIndex, scrollRef, onScrollEnd, onBack }: ImageCarouselProps) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    return (
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        >
          {court.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} contentFit="cover" />
          ))}
        </ScrollView>

        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent']}
          style={styles.topGradient}
        />

        <SafeAreaView style={styles.headerOverlay}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="share-outline" size={24} color={colors.white} />
          </Pressable>
        </SafeAreaView>

        <View style={styles.imageIndicators}>
          {court.images.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, currentImageIndex === index && styles.indicatorActive]}
            />
          ))}
        </View>
      </View>
    );
  }
);

// ============================================
// HEADER INFO SECTION
// ============================================

interface HeaderInfoProps {
  court: Court;
  starColor: string;
}

export const HeaderInfo = React.memo(({ court, starColor }: HeaderInfoProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  return (
    <Animated.View entering={getEntering(FadeInUp.delay(100))} style={styles.headerSection}>
      {court.is_partner && (
        <View style={styles.partnerBadge}>
          <Ionicons name="shield-checkmark" size={14} color={colors.white} />
          <Text style={styles.partnerText}>Partner</Text>
        </View>
      )}
      <Text style={styles.courtName}>{court.name}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={18} color={starColor} />
        <Text style={styles.rating}>{court.rating}</Text>
        <Text style={styles.reviewCount}>({court.review_count} đánh giá)</Text>
        <View style={styles.dot} />
        <Text style={styles.courtType}>
          {court.court_type === 'indoor' ? '🏠 Trong nhà' : '🌳 Ngoài trời'}
        </Text>
      </View>
    </Animated.View>
  );
});

// ============================================
// LOCATION SECTION
// ============================================

export const LocationSection = React.memo(({ address }: { address: string }) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  return (
    <Animated.View entering={getEntering(FadeInUp.delay(150))} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Địa chỉ</Text>
      </View>
      <Text style={styles.address}>{address}</Text>
      <Pressable
        style={({ pressed }) => [styles.mapButton, pressed && { opacity: 0.7 }]}
        android_ripple={{ color: 'rgba(59, 89, 152, 0.15)' }}
      >
        <Ionicons name="navigate-outline" size={16} color={colors.primary} />
        <Text style={styles.mapButtonText}>Xem bản đồ</Text>
      </Pressable>
    </Animated.View>
  );
});

// ============================================
// AMENITIES SECTION
// ============================================

export const AmenitiesSection = React.memo(({ amenities }: { amenities: string[] }) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  return (
    <Animated.View entering={getEntering(FadeInUp.delay(200))} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="fitness-outline" size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Tiện ích</Text>
      </View>
      <View style={styles.amenitiesGrid}>
        {amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
});

// ============================================
// REVIEWS SECTION
// ============================================

interface ReviewsSectionProps {
  reviews: any[];
  starColor: string;
}

export const ReviewsSection = React.memo(({ reviews, starColor }: ReviewsSectionProps) => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  return (
    <Animated.View entering={getEntering(FadeInUp.delay(350))} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Đánh giá</Text>
      </View>
      {reviews.slice(0, 2).map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewerName}>{review.reviewer.display_name}</Text>
            <View style={styles.reviewRating}>
              <Ionicons name="star" size={14} color={starColor} />
              <Text style={styles.reviewRatingText}>{review.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </Animated.View>
  );
});
