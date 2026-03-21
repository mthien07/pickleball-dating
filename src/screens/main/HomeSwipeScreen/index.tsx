/**
 * HomeSwipeScreen
 *
 * Orchestrator: header, swipe card stack, action controls.
 * Gesture / keyboard logic → useSwipeGestureHandler
 * Card rendering → SwipeCardList
 */

import React, { useRef, useMemo } from 'react';
import { View, Text, Pressable, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

import { SwipeCardRef } from '../../../components/SwipeCard';
import { EmptyState } from '../../../components/EmptyState';
import { CARD_WIDTH, CARD_MAX_WIDTH } from '../../../theme/breakpoints';
import { showInfo } from '../../../services/toast';
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useResponsive } from '../../../hooks/useResponsive';
import { useWebUtils } from '../../../hooks/useWebUtils';
import { webStyles } from '../../../theme/webStyles';
import { useDiscoveryProfiles } from '../../../hooks/use-discovery-profiles';
import { createStyles } from './styles';
import { useSwipeGestureHandler } from './swipe-gesture-handler';
import { SwipeCardList } from './swipe-card-list';

const { width: screenWidth } = Dimensions.get('window');

export const HomeSwipeScreen = () => {
  const { isDark } = useTheme();
  const themeColors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const swipeCardRef = useRef<SwipeCardRef>(null);

  const { isDesktop, isWeb, maxContentWidth, containerPadding } = useResponsive();
  const { shouldEnableKeyboard } = useWebUtils();

  const { currentProfile, nextProfile, hasMore, handleSwipe, reload } = useDiscoveryProfiles();

  const cardWidth = useMemo(
    () =>
      isDesktop || isWeb
        ? CARD_WIDTH.desktop
        : Math.min(screenWidth * CARD_WIDTH.mobile, CARD_MAX_WIDTH),
    [isDesktop, isWeb]
  );

  const { handleSwipeLeft, handleSwipeRight, handleSuperLike } = useSwipeGestureHandler({
    handleSwipe,
    currentProfile,
    swipeCardRef,
    shouldEnableKeyboard,
    isWeb,
  });

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

          <SwipeCardList
            currentProfile={currentProfile}
            nextProfile={nextProfile}
            cardWidth={cardWidth}
            swipeCardRef={swipeCardRef}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSuperLike={handleSuperLike}
            isDesktop={isDesktop}
            isWeb={isWeb}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
