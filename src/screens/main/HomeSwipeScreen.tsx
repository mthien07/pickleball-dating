/**
 * Home Swipe Screen
 *
 * Tinder-style matching interface with modern sports aesthetic.
 * Mobile-first, clean, sporty, with neon accents.
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StatusBar, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { SwipeCard, SwipeCardRef } from '../../components/SwipeCard';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, borderRadius, typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { MOCK_USERS } from '@data/mockData';
import { showSuccess, showInfo } from '../../services/toast';

const { width } = Dimensions.get('window');

export const HomeSwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeCardRef = useRef<SwipeCardRef>(null);
  
  // Get current user
  const currentUser = MOCK_USERS[currentIndex];
  const nextUser = MOCK_USERS[currentIndex + 1];

  const handleSwipeLeft = useCallback(() => {
    // Pass logic
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleSwipeRight = useCallback(() => {
    // Like logic
    showSuccess(`Liked ${currentUser.display_name}!`);
    setCurrentIndex(prev => prev + 1);
  }, [currentUser]);

  const handleSuperLike = useCallback(() => {
    showSuccess(`Super Liked ${currentUser.display_name}! ⚡`);
    swipeCardRef.current?.swipe('right'); // Programmatic swipe right for now
  }, [currentUser]);

  const handleReload = () => {
    setCurrentIndex(0);
  };

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>pickle<Text style={styles.logoHighlight}>match</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => showInfo('Filters coming soon')}
          >
            <Ionicons name="options-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Card Stack */}
        <View style={styles.cardContainer}>
          {/* Background Pattern/Circle for visual interest */}
          <View style={styles.bgCircle} />

          {/* Render next card below for stack effect */}
          {nextUser && (
            <View style={[styles.cardWrapper, styles.nextCard]}>
              <SwipeCard user={nextUser} />
            </View>
          )}

          {/* Current Card */}
          <View style={styles.cardWrapper}>
            <SwipeCard
              ref={swipeCardRef}
              user={currentUser}
              onLike={handleSwipeRight}
              onPass={handleSwipeLeft}
              swipeThreshold={width * 0.3}
              showActionButtons={false} // We use custom buttons below
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Pass */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.passButton]}
            onPress={() => swipeCardRef.current?.swipe('left')}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={32} color={colors.error} />
          </TouchableOpacity>

          {/* Super Like */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.superLikeButton]}
            onPress={handleSuperLike}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.lime || '#CCFF00', '#B0E000']}
              style={styles.superLikeGradient}
            >
              <Ionicons name="flash" size={30} color={colors.black} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Like */}
          <TouchableOpacity 
            style={[styles.controlButton, styles.likeButton]}
            onPress={() => swipeCardRef.current?.swipe('right')}
            activeOpacity={0.7}
          >
            <Ionicons name="heart" size={32} color={colors.success} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Match UI Kit Demo
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  logoHighlight: {
    color: colors.primary,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background, // Light gray
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card Area
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: -spacing.xl, // Pull up slightly
  },
  bgCircle: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width,
    backgroundColor: '#F5F7FA', // Very subtle gray circle behind
    top: '10%',
    zIndex: -2,
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCard: {
    transform: [{ scale: 0.95 }, { translateY: 12 }],
    opacity: 0.6,
    zIndex: -1,
  },

  // Controls
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing['2xl'], // Space from bottom
    gap: spacing.xl,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    ...shadows.lg,
    elevation: 8,
  },
  passButton: {
    // shadowColor: colors.error,
  },
  likeButton: {
    // shadowColor: colors.success,
  },
  superLikeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 20, // Sit lower than others
    padding: 0,
    overflow: 'hidden',
    ...shadows.xl,
  },
  superLikeGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
