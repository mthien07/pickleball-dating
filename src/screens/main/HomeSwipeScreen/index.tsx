import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Heart, User } from 'lucide-react-native';

import { SwipeCard, SwipeCardRef } from '../../../components/SwipeCard';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/tokens';
import { CARD_WIDTH, CARD_MAX_WIDTH } from '../../../theme/breakpoints';
import { MOCK_USERS } from '@data/mockData';
import { showSuccess, showInfo } from '../../../services/toast';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { useWebUtils } from '../../../hooks/useWebUtils';
import { webStyles } from '../../../theme/webStyles';
import { styles } from './styles';

const { width: screenWidth } = Dimensions.get('window');

export const HomeSwipeScreen = () => {
  const themeColors = useThemeColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeCardRef = useRef<SwipeCardRef>(null);

  const { isDesktop, isWeb, maxContentWidth, containerPadding } = useResponsive();
  const { shouldEnableKeyboard } = useWebUtils();

  const currentUser = MOCK_USERS[currentIndex];
  const nextUser = MOCK_USERS[currentIndex + 1];

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const cardWidth = useMemo(
    () =>
      isDesktop || isWeb
        ? CARD_WIDTH.desktop
        : Math.min(screenWidth * CARD_WIDTH.mobile, CARD_MAX_WIDTH),
    [isDesktop, isWeb]
  );

  const handleSwipeLeft = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    showSuccess(`Liked ${currentUserRef.current.display_name}!`);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleSuperLike = useCallback(() => {
    showSuccess(`Super Liked ${currentUserRef.current.display_name}! ⚡`);
    swipeCardRef.current?.swipe('right');
  }, []);

  const handleReload = () => {
    setCurrentIndex(0);
  };

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

  if (currentIndex >= MOCK_USERS.length) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <EmptyState
            title="All Caught Up!"
            message="You've seen everyone in your area."
            icon="🎾"
            actionLabel="Check Again Later"
            onAction={handleReload}
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
      <StatusBar barStyle="dark-content" />
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
            <TouchableOpacity style={styles.profileButton} onPress={() => showInfo('View profile')}>
              <User size={24} color={colors.textPrimary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Card Stack */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={[colors.secondary, colors.primary, colors.accent]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bgCircle}
            />

            {nextUser && (
              <View style={[styles.cardWrapper, styles.nextCard]}>
                <SwipeCard user={nextUser} cardWidth={cardWidth} />
              </View>
            )}

            <View style={styles.cardWrapper}>
              <SwipeCard
                ref={swipeCardRef}
                user={currentUser}
                onLike={handleSwipeRight}
                onPass={handleSwipeLeft}
                cardWidth={cardWidth}
                showActionButtons={false}
              />
            </View>
          </View>

          {/* Action Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.controlButton, styles.passButton]}
              onPress={() => swipeCardRef.current?.swipe('left')}
              activeOpacity={0.85}
            >
              <X size={32} color={colors.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.superLikeButton]}
              onPress={handleSuperLike}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.superLikeGradient}
              >
                <Star size={26} color={colors.white} fill={colors.white} strokeWidth={0} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.likeButton]}
              onPress={() => swipeCardRef.current?.swipe('right')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.accent, colors.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.likeGradient}
              >
                <Heart size={30} color={colors.white} fill={colors.white} strokeWidth={0} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {isDesktop && isWeb && (
            <Text style={styles.keyboardHint}>
              Use ← → arrows to swipe, ↑ or space for super like
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
