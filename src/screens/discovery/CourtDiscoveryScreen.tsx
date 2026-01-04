/**
 * Court Discovery Screen
 *
 * Find and book pickleball courts.
 * Modern sports vibe with map/list toggle and card-based layout.
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
import { MOCK_COURTS } from '@data/mockData';
import { showInfo } from '../../services/toast';

// ============================================
// HELPER COMPONENTS
// ============================================

const StarRating = ({ rating, count }: { rating: number; count: number }) => {
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
};

interface CourtCardProps {
  court: any;
  onPress: () => void;
  onBook: () => void;
}

const CourtCard = ({ court, onPress, onBook }: CourtCardProps) => {
  const imageUrl = court.images && court.images.length > 0 
    ? court.images[0] 
    : 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&h=600&fit=crop';
    
  const priceDisplay = court.price_per_hour 
    ? `${(court.price_per_hour / 1000).toFixed(0)}k/hr`
    : court.price || '$15/hr';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
        />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{priceDisplay}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{court.name}</Text>
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate" size={12} color={colors.primary} />
            <Text style={styles.distanceText}>{court.distance || '1.2 km'}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>{court.address || court.location}</Text>
        </View>

        <View style={styles.cardFooter}>
          <StarRating rating={court.rating} count={court.reviews || court.review_count || 0} />
          
          <TouchableOpacity style={styles.bookButton} onPress={onBook}>
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

export const CourtDiscoveryScreen = () => {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');
  const [courts, setCourts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setCourts(MOCK_COURTS);
      setIsLoading(false);
    }, 1000);
  };

  const filteredCourts = courts.filter(court =>
    court.name.toLowerCase().includes(query.toLowerCase()) ||
    (court.address && court.address.toLowerCase().includes(query.toLowerCase()))
  );

  const handleBook = (courtId: string) => {
    // showInfo('Booking flow starting...');
    navigation.navigate('CourtBooking', { courtId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Find Courts 🏟️</Text>
      
      {/* View Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courts..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {renderHeader()}
        
        <View style={styles.contentContainer}>
          {viewMode === 'list' ? (
            <FlatList
              data={filteredCourts}
              renderItem={({ item }) => (
                <CourtCard
                  court={item}
                  onPress={() => navigation.navigate('CourtDetail', { courtId: item.id })}
                  onBook={() => handleBook(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !isLoading ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="map-outline" size={48} color={colors.textTertiary} />
                    <Text style={styles.emptyText}>No courts found</Text>
                  </View>
                ) : null
              }
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <LinearGradient
                colors={[colors.surface, colors.background]}
                style={styles.mapGradient}
              >
                <Ionicons name="map" size={64} color={colors.primary} />
                <Text style={styles.mapText}>Interactive Map View</Text>
                <Text style={styles.mapSubtext}>Coming soon</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Light blue-ish background
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    zIndex: 10,
  },
  screenTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  toggleText: {
    ...typography.button,
    color: colors.textSecondary,
    fontSize: 14,
  },
  toggleTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    ...shadows.sm,
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
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  // Content
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for bottom tab bar
    gap: spacing.md,
  },
  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: spacing.sm,
  },
  cardImageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  priceText: {
    ...typography.label,
    color: colors.white,
    fontWeight: '700',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  distanceText: {
    ...typography.label,
    color: colors.primaryDark,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 4,
  },
  locationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCount: {
    ...typography.label,
    color: colors.textTertiary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20, // Pill shape
    ...shadows.sm,
  },
  bookButtonText: {
    ...typography.button,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  // Map Placeholder
  mapPlaceholder: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  mapGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  mapSubtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
