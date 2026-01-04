/**
 * Skeleton Loaders
 *
 * Loading placeholders for different card types
 * Uses moti library for shimmer animation
 *
 * Usage:
 * ```tsx
 * {isLoading ? <SkeletonCourtCard /> : <CourtCard court={court} />}
 * ```
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { colors, spacing, borderRadius } from '../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// SKELETON PROFILE CARD (Swipe Card)
// ============================================

export const SkeletonProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <Skeleton
        colorMode="light"
        width="100%"
        height="100%"
        radius={borderRadius.profileCard}
      />
    </View>
  );
};

// ============================================
// SKELETON COURT CARD (List Item)
// ============================================

export const SkeletonCourtCard = () => {
  return (
    <View style={styles.courtCard}>
      {/* Image skeleton */}
      <Skeleton
        colorMode="light"
        width={120}
        height={90}
        radius={borderRadius.md}
      />

      {/* Content skeleton */}
      <View style={styles.courtInfo}>
        <Skeleton
          colorMode="light"
          width="70%"
          height={20}
          radius={4}
        />
        <View style={{ height: 6 }} />
        <Skeleton
          colorMode="light"
          width="90%"
          height={14}
          radius={4}
        />
        <View style={{ height: 6 }} />
        <Skeleton
          colorMode="light"
          width="50%"
          height={14}
          radius={4}
        />
        <View style={{ height: 8 }} />
        <View style={styles.courtFooter}>
          <Skeleton
            colorMode="light"
            width={80}
            height={18}
            radius={4}
          />
          <Skeleton
            colorMode="light"
            width={70}
            height={32}
            radius={borderRadius.sm}
          />
        </View>
      </View>
    </View>
  );
};

// ============================================
// SKELETON MATCH CARD (Chat List Item)
// ============================================

export const SkeletonMatchCard = () => {
  return (
    <View style={styles.matchCard}>
      {/* Avatar skeleton */}
      <Skeleton
        colorMode="light"
        width={56}
        height={56}
        radius={28}
      />

      {/* Content skeleton */}
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Skeleton
            colorMode="light"
            width="60%"
            height={18}
            radius={4}
          />
          <Skeleton
            colorMode="light"
            width={40}
            height={14}
            radius={4}
          />
        </View>
        <View style={{ height: 6 }} />
        <Skeleton
          colorMode="light"
          width="80%"
          height={14}
          radius={4}
        />
      </View>
    </View>
  );
};

// ============================================
// SKELETON LIST (Multiple skeletons)
// ============================================

interface SkeletonListProps {
  type: 'court' | 'match' | 'profile';
  count?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  type,
  count = 3
}) => {
  const SkeletonComponent =
    type === 'court' ? SkeletonCourtCard :
    type === 'match' ? SkeletonMatchCard :
    SkeletonProfileCard;

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Profile Card Skeleton
  profileCard: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.profileCard,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },

  // Court Card Skeleton
  courtCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  courtInfo: {
    flex: 1,
    marginLeft: spacing.sm + 4,
    justifyContent: 'space-between',
  },
  courtFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Match Card Skeleton
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matchInfo: {
    flex: 1,
    marginLeft: spacing.sm + 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

// Default export
export default {
  SkeletonProfileCard,
  SkeletonCourtCard,
  SkeletonMatchCard,
  SkeletonList,
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Single skeleton
{isLoading ? <SkeletonCourtCard /> : <CourtCard court={court} />}

// Multiple skeletons
{isLoading ? (
  <SkeletonList type="court" count={5} />
) : (
  courts.map(court => <CourtCard key={court.id} court={court} />)
)}

// Different types
<SkeletonList type="profile" count={3} />
<SkeletonList type="match" count={10} />
<SkeletonList type="court" count={5} />
*/
