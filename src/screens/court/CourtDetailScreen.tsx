/**
 * CourtDetailScreen
 *
 * Displays court details with image carousel, amenities, reviews
 * and booking CTA
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_COURTS, Court, MOCK_REVIEWS } from '@data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// TYPES
// ============================================

type CourtDetailRouteParams = {
  CourtDetail: {
    courtId: string;
  };
};

// ============================================
// SCREEN COMPONENT
// ============================================

export const CourtDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<CourtDetailRouteParams, 'CourtDetail'>>();
  const { courtId } = route.params || {};

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Get court data
  const court = MOCK_COURTS.find((c) => c.id === courtId) || MOCK_COURTS[0];
  const reviews = MOCK_REVIEWS.filter((r) => r.court_id === court.id);

  const handleScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleBooking = () => {
    navigation.navigate('CourtBooking', { courtId: court.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {court.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} contentFit="cover" />
          ))}
        </ScrollView>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent']}
          style={styles.topGradient}
        />

        {/* Back Button */}
        <SafeAreaView style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Image Indicators */}
        <View style={styles.imageIndicators}>
          {court.images.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, currentImageIndex === index && styles.indicatorActive]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.headerSection}>
          {court.is_partner && (
            <View style={styles.partnerBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.white} />
              <Text style={styles.partnerText}>Partner</Text>
            </View>
          )}
          <Text style={styles.courtName}>{court.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#FFB800" />
            <Text style={styles.rating}>{court.rating}</Text>
            <Text style={styles.reviewCount}>({court.review_count} đánh giá)</Text>
            <View style={styles.dot} />
            <Text style={styles.courtType}>
              {court.court_type === 'indoor' ? '🏠 Trong nhà' : '🌳 Ngoài trời'}
            </Text>
          </View>
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Địa chỉ</Text>
          </View>
          <Text style={styles.address}>{court.address}</Text>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="navigate-outline" size={16} color={colors.primary} />
            <Text style={styles.mapButtonText}>Xem bản đồ</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Amenities */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Tiện ích</Text>
          </View>
          <View style={styles.amenitiesGrid}>
            {court.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Mô tả</Text>
          </View>
          <Text style={styles.description}>{court.description}</Text>
        </Animated.View>

        {/* Operating Hours */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Giờ hoạt động</Text>
          </View>
          <Text style={styles.hours}>
            {court.operating_hours?.monday
              ? `${court.operating_hours.monday.open} - ${court.operating_hours.monday.close}`
              : '06:00 - 22:00'}
          </Text>
        </Animated.View>

        {/* Reviews Preview */}
        {reviews.length > 0 && (
          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Đánh giá</Text>
            </View>
            {reviews.slice(0, 2).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.reviewer.display_name}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Booking Footer */}
      <Animated.View entering={FadeIn.delay(400)} style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá từ</Text>
          <Text style={styles.price}>
            {(court.price_per_hour / 1000).toFixed(0)}k<Text style={styles.priceUnit}>/giờ</Text>
          </Text>
        </View>
        <Button
          title="Đặt sân"
          onPress={handleBooking}
          variant="primary"
          style={styles.bookButton}
        />
      </Animated.View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Image Carousel
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: colors.white,
    width: 24,
  },

  // Content
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Header Section
  headerSection: {
    marginBottom: spacing.lg,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  partnerText: {
    ...typography.label,
    color: colors.white,
  },
  courtName: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 4,
  },
  reviewCount: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  courtType: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  address: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  mapButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '500',
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  amenityText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },

  // Description
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Hours
  hours: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Reviews
  reviewCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  reviewerName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewComment: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  priceUnit: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  bookButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
});

export default CourtDetailScreen;
