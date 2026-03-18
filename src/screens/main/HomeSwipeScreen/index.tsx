import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Heart, User } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

import { SwipeCard, SwipeCardRef } from '../../../components/SwipeCard';
import { EmptyState } from '../../../components/EmptyState';
import { CARD_WIDTH, CARD_MAX_WIDTH } from '../../../theme/breakpoints';
import { showSuccess, showInfo } from '../../../services/toast';
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useResponsive } from '../../../hooks/useResponsive';
import { useWebUtils } from '../../../hooks/useWebUtils';
import { webStyles } from '../../../theme/webStyles';
import { useDiscoveryProfiles } from '../../../hooks/use-discovery-profiles';
import { createStyles } from './styles';

const { width: screenWidth } = Dimensions.get('window');

export const HomeSwipeScreen = () => {
  const { isDark } = useTheme();
  const themeColors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const swipeCardRef = useRef<SwipeCardRef>(null);

  const { isDesktop, isWeb, maxContentWidth, containerPadding } = useResponsive();
  const { shouldEnableKeyboard } = useWebUtils();

  const { currentProfile, nextProfile, hasMore, handleSwipe, reload } = useDiscoveryProfiles();

  // Keep a ref so keyboard handlers always see the latest profile name
  const currentProfileRef = useRef(currentProfile);
  currentProfileRef.current = currentProfile;

  const cardWidth = useMemo(
    () =>
      isDesktop || isWeb
        ? CARD_WIDTH.desktop
        : Math.min(screenWidth * CARD_WIDTH.mobile, CARD_MAX_WIDTH),
    [isDesktop, isWeb]
  );

  const handleSwipeLeft = useCallback(async () => {
    await handleSwipe('pass');
  }, [handleSwipe]);

  const handleSwipeRight = useCallback(async () => {
    const result = await handleSwipe('like');
    if (result.isMatch) {
      showSuccess("It's a Match! 🎉");
    } else {
      showSuccess(`Liked ${currentProfileRef.current?.display_name}!`);
    }
  }, [handleSwipe]);

  const handleSuperLike = useCallback(async () => {
    const result = await handleSwipe('super_like');
    if (result.isMatch) {
      showSuccess("It's a Match! 🎉");
    } else {
      showSuccess(`Super Liked ${currentProfileRef.current?.display_name}! ⚡`);
    }
    swipeCardRef.current?.swipe('up');
  }, [handleSwipe]);

  useEffect(() => {
    if (!shouldEnableKeyboard || !isWeb) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          swipeCardRef.current?.swipe('left');
          break;
        case 'ArrowRight':
          swipeCardRef.current?.swipe('right');
          break;
        case 'ArrowUp':
        case ' ':
          handleSuperLike();
          break;
        default:
          break;
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [shouldEnableKeyboard, isWeb, handleSuperLike]);

  if (!hasMore) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.safeArea}>
          <EmptyState
            title="Hết rồi!"
            message="Hết rồi! Quay lại sau nhé"
            icon={<Ionicons name="tennisball" size={48} color={themeColors.accent} />}
            actionLabel="Tải lại"
            onAction={reload}
          />
        </SafeAreaView>
      </View>
    );
  }

  const containerStyle = isDesktop
    ? [styles.container, webStyles.centeredContainer, { paddingHorizontal: containerPadding }]
    : styles.container;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea}>
        <View style={containerStyle}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                <Text style={styles.logoPrimary}>PICKLE</Text>
                <Text style={styles.logoAccent}>MATCH</Text>
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [styles.headerIconButton, pressed && { opacity: 0.7 }]}
                onPress={() => showInfo('Filters coming soon')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="options-outline" size={20} color={themeColors.textSecondary} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.headerIconButton, pressed && { opacity: 0.7 }]}
                onPress={() => showInfo('Notifications coming soon')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={themeColors.textSecondary}
                />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.profileButton, pressed && { opacity: 0.7 }]}
                onPress={() => showInfo('View profile')}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <User size={24} color={themeColors.textPrimary} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

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
                <SwipeCard user={nextProfile} cardWidth={cardWidth} />
              </View>
            )}

            <View style={styles.cardWrapper}>
              <SwipeCard
                ref={swipeCardRef}
                user={currentProfile}
                onLike={handleSwipeRight}
                onPass={handleSwipeLeft}
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
                onPress={handleSuperLike}
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
        </View>
      </SafeAreaView>
    </View>
  );
};
