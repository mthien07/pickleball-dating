/**
 * Coach Directory Screen
 *
 * Find and book pickleball coaches.
 * Modern sports aesthetic with clean white background and neon accents.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_COACHES, Coach } from '@data/mockData';
import { showInfo } from '../../services/toast';

// ============================================
// HELPER COMPONENTS
// ============================================

const RatingBadge = ({ rating, count }: { rating: number; count: number }) => (
  <View style={styles.ratingContainer}>
    <Ionicons name="star" size={14} color={colors.accent} />
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    <Text style={styles.reviewCount}>({count})</Text>
  </View>
);

interface CoachCardProps {
  coach: Coach;
  onPress: () => void;
  onBook: () => void;
}

const CoachCard = ({ coach, onPress, onBook }: CoachCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.card}>
      <View style={styles.cardContent}>
        {/* Header: Avatar & Main Info */}
        <View style={styles.cardHeader}>
          <Image source={{ uri: coach.avatar_url }} style={styles.avatar} />
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

        {/* Details Row */}
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

        {/* Footer: Price & Action */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Hourly Rate</Text>
            <Text style={styles.priceValue}>
              {(coach.hourly_rate / 1000).toFixed(0)}k <Text style={styles.currency}>VND</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card press
              onBook();
            }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ============================================
// MAIN SCREEN
// ============================================

export const CoachDirectoryScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setCoaches(MOCK_COACHES);
        setIsLoading(false);
      }, 500);
    };
    loadData();
  }, []);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.display_name.toLowerCase().includes(query.toLowerCase()) ||
      coach.location.address.toLowerCase().includes(query.toLowerCase())
  );

  const handleBook = (coachId: string) => {
    showInfo('Booking flow starting...');
    // navigation.navigate('CoachBooking', { coachId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Find a Coach 🧢</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => showInfo('Filters coming soon')}
        >
          <Ionicons name="options-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {renderHeader()}

        <FlatList
          data={filteredCoaches}
          renderItem={({ item }) => (
            <CoachCard
              coach={item}
              onPress={() => {}} // navigation.navigate('CoachDetail', { coachId: item.id })
              onBook={() => handleBook(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyText}>No coaches found</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface, // White button on blue bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface, // Clean white search bar
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for tab bar
    gap: spacing.lg,
  },
  // Card Styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.card,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: '#E0E0E0',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  ratingText: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  reviewCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  skillBadge: {
    backgroundColor: colors.lime || '#CCFF00', // Neon Lime
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  skillText: {
    ...typography.label,
    color: colors.black,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: '#F9FAFB',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textTertiary,
    fontSize: 10,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: spacing.md,
  },
  priceLabel: {
    ...typography.label,
    color: colors.textTertiary,
    fontSize: 10,
  },
  priceValue: {
    ...typography.h3,
    color: colors.primary,
    fontSize: 18,
  },
  currency: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    ...shadows.sm,
  },
  bookButtonText: {
    ...typography.button,
    color: colors.white,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    ...typography.h4,
    color: colors.textTertiary,
    marginTop: spacing.md,
  },
});
