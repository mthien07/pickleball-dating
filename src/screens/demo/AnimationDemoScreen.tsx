/**
 * Animation Demo Screen
 *
 * Showcase các animations mới được convert từ web design
 * - Gradient buttons (Red-Orange theme)
 * - Press animations
 * - Elevation effects
 * - Card animations
 * - Smooth transitions
 *
 * Converted from web component patterns to React Native
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Components
import { Button, GradientButton, ElevatedButton } from '../../components/Button';
import {
  GradientCard,
  GradientBadge,
  GradientOverlay,
  GRADIENT_COLORS,
} from '../../components/GradientBackground';
import { spacing, typography, colors } from '../../theme/tokens';
import { usePressAnimation, useBounceAnimation } from '../../hooks/useAnimations';

export const AnimationDemoScreen = () => {
  const [counter, setCounter] = useState(0);
  const { animatedStyle: bounceStyle, bounce } = useBounceAnimation();

  const features = [
    { icon: 'flash', title: 'Nhanh chóng', description: 'Tối ưu hiệu suất' },
    { icon: 'heart', title: 'Mượt mà', description: 'Animations 60fps' },
    { icon: 'star', title: 'Đẹp mắt', description: 'Gradient đỏ-cam' },
    { icon: 'trophy', title: 'Chuyên nghiệp', description: 'Chi tiết hoàn hảo' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Gradient Background */}
      <LinearGradient colors={['#1a0a0a', '#0a0a0a', '#1a0000']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.1)', 'rgba(249, 115, 22, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logo} />
              <Text style={styles.headerTitle}>Animations</Text>
            </View>
            <GradientBadge>
              <Text style={styles.badgeText}>✨ New</Text>
            </GradientBadge>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.heroSection}>
          <GradientBadge style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🎨 Showcase</Text>
          </GradientBadge>

          <Text style={styles.heroTitle}>
            Trải nghiệm{'\n'}
            <LinearGradient
              colors={GRADIENT_COLORS.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextWrapper}
            >
              <Text style={styles.heroTitleGradient}>Animations Mới</Text>
            </LinearGradient>
          </Text>

          <Text style={styles.heroSubtitle}>
            Các hiệu ứng mượt mà với gradient đỏ-cam đặc trưng của PickleBall Dating
          </Text>

          <View style={styles.heroButtons}>
            <GradientButton
              title="Bắt đầu"
              size="large"
              fullWidth
              onPress={() => {
                setCounter(counter + 1);
                bounce();
              }}
            />
            <ElevatedButton
              title="Tìm hiểu thêm"
              size="large"
              fullWidth
              onPress={() => console.log('Learn more')}
            />
          </View>

          {/* Counter with Bounce */}
          <Animated.View style={[styles.counterBadge, bounceStyle]}>
            <Text style={styles.counterText}>Clicks: {counter}</Text>
          </Animated.View>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tính năng nổi bật</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </View>
        </Animated.View>

        {/* Showcase Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.showcaseSection}>
          <GradientCard variant="medium" style={styles.showcaseCard}>
            <GradientOverlay position="full" intensity="light">
              <View style={styles.showcaseContent}>
                <Text style={styles.showcaseTitle}>Thiết kế hoàn hảo</Text>
                <Text style={styles.showcaseDescription}>
                  Mỗi chi tiết đều quan trọng trong việc tạo nên trải nghiệm tuyệt vời
                </Text>

                <View style={styles.showcaseGrid}>
                  <ShowcaseItem icon="rocket" title="Siêu nhanh" />
                  <ShowcaseItem icon="target" title="Chính xác" />
                  <ShowcaseItem icon="diamond" title="Cao cấp" />
                </View>

                <View style={styles.showcaseFooter}>
                  <View style={styles.avatarGroup}>
                    {[1, 2, 3, 4].map((i) => (
                      <View key={i} style={styles.avatar} />
                    ))}
                  </View>
                  <Text style={styles.userCount}>
                    <Text style={styles.userCountBold}>10,000+</Text> người dùng
                  </Text>
                </View>
              </View>
            </GradientOverlay>
          </GradientCard>
        </Animated.View>

        {/* Button Variants */}
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.buttonsSection}>
          <Text style={styles.sectionTitle}>Button Variants</Text>
          <View style={styles.buttonsGrid}>
            <Button
              title="Primary"
              variant="primary"
              onPress={() => console.log('Primary')}
              fullWidth
            />
            <GradientButton title="Gradient" onPress={() => console.log('Gradient')} fullWidth />
            <ElevatedButton title="Elevated" onPress={() => console.log('Elevated')} fullWidth />
            <Button
              title="Secondary"
              variant="secondary"
              onPress={() => console.log('Secondary')}
              fullWidth
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💜 and ✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// FEATURE CARD COMPONENT
// ============================================

const FeatureCard = ({ icon, title, description, delay }: any) => {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)} style={styles.featureCard}>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.9}>
        <Animated.View style={animatedStyle}>
          <GradientCard variant="subtle" style={styles.featureCardInner}>
            <View style={styles.featureIconContainer}>
              <Ionicons name={icon as any} size={32} color="#EF4444" />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
          </GradientCard>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ============================================
// SHOWCASE ITEM COMPONENT
// ============================================

const ShowcaseItem = ({ icon, title }: any) => (
  <View style={styles.showcaseItem}>
    <LinearGradient
      colors={GRADIENT_COLORS.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.showcaseIcon}
    >
      <Ionicons name={icon as any} size={24} color="#FFFFFF" />
    </LinearGradient>
    <Text style={styles.showcaseItemTitle}>{title}</Text>
  </View>
);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  heroBadge: {
    marginBottom: spacing.md,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 56,
  },
  gradientTextWrapper: {
    borderRadius: 8,
  },
  heroTitleGradient: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '800',
    color: 'transparent',
  },
  heroSubtitle: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  heroButtons: {
    width: '100%',
    gap: spacing.md,
  },
  counterBadge: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    width: '48%',
  },
  featureCardInner: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  featureIconContainer: {
    marginBottom: spacing.md,
  },
  featureTitle: {
    ...typography.h4,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.bodySmall,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },

  // Showcase Section
  showcaseSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  showcaseCard: {
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  showcaseContent: {
    gap: spacing.lg,
  },
  showcaseTitle: {
    ...typography.h2,
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  showcaseDescription: {
    ...typography.body,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  showcaseGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  showcaseItem: {
    flex: 1,
    gap: spacing.sm,
  },
  showcaseIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseItemTitle: {
    ...typography.bodySmall,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  showcaseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginLeft: -8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0a0a0a',
    marginLeft: -8,
  },
  userCount: {
    ...typography.bodySmall,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userCountBold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Buttons Section
  buttonsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  buttonsGrid: {
    gap: spacing.md,
  },

  // Footer
  footer: {
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

export default AnimationDemoScreen;
