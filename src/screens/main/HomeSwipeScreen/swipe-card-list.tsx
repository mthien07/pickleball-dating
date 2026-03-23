/**
 * swipe-card-list
 *
 * Card stack rendering for HomeSwipeScreen: background gradient, next card,
 * current swipeable card, and action control buttons (pass / super-like / like).
 */

import React, { MutableRefObject } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Heart } from 'lucide-react-native';

import { SwipeCard, SwipeCardRef } from '../../../components/SwipeCard';
import { DiscoveryProfile } from '../../../services/api/swipe.service';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { spacing, borderRadius, fontFamily } from '../../../theme/tokens';
import { shadows } from '../../../theme/shadows';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  currentProfile: DiscoveryProfile | null | undefined;
  nextProfile: DiscoveryProfile | null | undefined;
  cardWidth: number;
  swipeCardRef: MutableRefObject<SwipeCardRef | null>;
  onSwipeLeft: () => Promise<void>;
  onSwipeRight: () => Promise<void>;
  onSuperLike: () => Promise<void>;
  isDesktop: boolean;
  isWeb: boolean;
}

export const SwipeCardList = React.memo(
  ({
    currentProfile,
    nextProfile,
    cardWidth,
    swipeCardRef,
    onSwipeLeft,
    onSwipeRight,
    onSuperLike,
    isDesktop,
    isWeb,
  }: Props) => {
    const themeColors = useThemeColors();
    const styles = localStyles(themeColors);

    return (
      <>
        {/* Card Stack */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={[themeColors.secondary, themeColors.primary, themeColors.accent]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bgCircle}
          />

          {nextProfile && (
            <View style={[styles.cardWrapper, styles.nextCard]}>
              {/* DiscoveryProfile is structurally compatible at runtime with User */}
              <SwipeCard user={nextProfile as any} cardWidth={cardWidth} />
            </View>
          )}

          <View style={styles.cardWrapper}>
            <SwipeCard
              ref={swipeCardRef}
              user={currentProfile as any}
              onLike={onSwipeRight}
              onPass={onSwipeLeft}
              cardWidth={cardWidth}
              showActionButtons={false}
            />
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsContainer}>
          {/* Nope */}
          <View style={styles.buttonGroup}>
            <Pressable
              testID="btn-pass"
              style={({ pressed }) => [
                styles.controlButton,
                styles.passButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => swipeCardRef.current?.swipe('left')}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              <X size={32} color={themeColors.textSecondary} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.buttonLabel}>Nope</Text>
          </View>

          {/* Super Like */}
          <View style={styles.buttonGroup}>
            <Pressable
              testID="btn-super-like"
              style={({ pressed }) => [
                styles.controlButton,
                styles.superLikeButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={onSuperLike}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              <LinearGradient
                colors={[themeColors.primary, themeColors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.superLikeGradient}
              >
                <Star
                  size={26}
                  color={themeColors.white}
                  fill={themeColors.white}
                  strokeWidth={0}
                />
              </LinearGradient>
            </Pressable>
            <Text style={styles.buttonLabel}>Super</Text>
          </View>

          {/* Like */}
          <View style={styles.buttonGroup}>
            <Pressable
              testID="btn-like"
              style={({ pressed }) => [
                styles.controlButton,
                styles.likeButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => swipeCardRef.current?.swipe('right')}
              android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            >
              <LinearGradient
                colors={[themeColors.accent, themeColors.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.likeGradient}
              >
                <Heart
                  size={30}
                  color={themeColors.white}
                  fill={themeColors.white}
                  strokeWidth={0}
                />
              </LinearGradient>
            </Pressable>
            <Text style={styles.buttonLabel}>Like</Text>
          </View>
        </View>

        {isDesktop && isWeb && (
          <Text style={styles.keyboardHint}>← → to swipe · ↑ space for super like</Text>
        )}
      </>
    );
  }
);

SwipeCardList.displayName = 'SwipeCardList';

// Local styles — independent from shared createStyles after editorial feed refactor
const localStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    cardContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginTop: -spacing.xl,
      paddingTop: spacing.sm,
    },
    bgCircle: {
      position: 'absolute',
      width: screenWidth * 1.2,
      height: screenWidth * 1.2,
      borderRadius: screenWidth,
      top: '-5%' as any,
      zIndex: -2,
      opacity: 0.08,
    },
    cardWrapper: {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextCard: {
      transform: [{ scale: 0.95 }, { translateY: 12 }],
      opacity: 0.5,
      zIndex: -1,
    },
    controlsContainer: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'flex-end' as const,
      paddingBottom: spacing['2xl'],
      gap: spacing.lg,
    },
    buttonGroup: {
      alignItems: 'center' as const,
      gap: 6,
    },
    buttonLabel: {
      fontFamily: fontFamily.bodyMedium,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
      color: colors.textTertiary,
    },
    controlButton: {
      borderRadius: borderRadius.full,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
    },
    passButton: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: colors.border,
      ...shadows.md,
    },
    likeButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      padding: 0,
      overflow: 'hidden' as const,
      ...shadows.button,
    },
    likeGradient: {
      width: '100%' as const,
      height: '100%' as const,
      borderRadius: 36,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    superLikeButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: 6,
      padding: 0,
      overflow: 'hidden' as const,
      ...shadows.button,
    },
    superLikeGradient: {
      width: '100%' as const,
      height: '100%' as const,
      borderRadius: 28,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    keyboardHint: {
      textAlign: 'center' as const,
      fontFamily: fontFamily.body,
      fontSize: 10,
      color: colors.textTertiary,
      marginTop: spacing.sm,
      paddingBottom: spacing.md,
      letterSpacing: 0.8,
      opacity: 0.6,
    },
  });
