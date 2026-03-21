/**
 * swipe-card-list
 *
 * Card stack rendering for HomeSwipeScreen: background gradient, next card,
 * current swipeable card, and action control buttons (pass / super-like / like).
 */

import React, { MutableRefObject } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Heart } from 'lucide-react-native';

import { SwipeCard, SwipeCardRef } from '../../../components/SwipeCard';
import { DiscoveryProfile } from '../../../services/api/swipe.service';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './styles';

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
    const styles = useThemedStyles(createStyles);

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
