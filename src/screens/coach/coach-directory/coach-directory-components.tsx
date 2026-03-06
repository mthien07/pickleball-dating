/**
 * CoachDirectory - Reusable card and badge components
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../theme/tokens';
import { Coach } from '@data/mockData';
import { styles } from './coach-directory-styles';

// ============================================
// RATING BADGE
// ============================================

export const RatingBadge = React.memo(({ rating, count }: { rating: number; count: number }) => (
  <View style={styles.ratingContainer}>
    <Ionicons name="star" size={14} color={colors.accent} />
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    <Text style={styles.reviewCount}>({count})</Text>
  </View>
));

// ============================================
// COACH CARD
// ============================================

interface CoachCardProps {
  coach: Coach;
  onPress: () => void;
  onBook: () => void;
}

export const CoachCard = React.memo(({ coach, onPress, onBook }: CoachCardProps) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
    onPress={onPress}
    android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: coach.avatar_url }}
          style={styles.avatar}
          cachePolicy="memory-disk"
          contentFit="cover"
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {coach.display_name}
            </Text>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
          </View>
          <RatingBadge rating={coach.rating} count={coach.review_count} />
          <View style={styles.skillBadge}>
            <Text style={styles.skillText}>{coach.skill_level}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Experience</Text>
          <Text style={styles.detailValue}>{coach.experience_years} Years</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue} numberOfLines={1}>
            {coach.location.address}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.priceLabel}>Hourly Rate</Text>
          <Text style={styles.priceValue}>
            {(coach.hourly_rate / 1000).toFixed(0)}k <Text style={styles.currency}>VND</Text>
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.bookButton, pressed && { opacity: 0.7 }]}
          onPress={onBook}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  </Pressable>
));

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = React.memo(() => (
  <View style={styles.emptyState}>
    <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
    <Text style={styles.emptyText}>No coaches found</Text>
  </View>
));
