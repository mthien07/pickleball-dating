/**
 * AnimationDemoScreen - Showcase animations with gradient red-orange theme
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button, GradientButton, ElevatedButton } from '../../../components/Button';
import {
  GradientCard,
  GradientBadge,
  GradientOverlay,
  createGradientColors,
} from '../../../components/GradientBackground';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useBounceAnimation } from '../../../hooks/useAnimations';
import { styles } from './animation-demo-styles';
import { FeatureCard, ShowcaseItem } from './animation-demo-components';

const FEATURES = [
  { icon: 'flash', title: 'Nhanh chóng', description: 'Tối ưu hiệu suất' },
  { icon: 'heart', title: 'Mượt mà', description: 'Animations 60fps' },
  { icon: 'star', title: 'Đẹp mắt', description: 'Gradient đỏ-cam' },
  { icon: 'trophy', title: 'Chuyên nghiệp', description: 'Chi tiết hoàn hảo' },
];

export const AnimationDemoScreen = () => {
  const [counter, setCounter] = useState(0);
  const { animatedStyle: bounceStyle, bounce } = useBounceAnimation();
  const themeColors = useThemeColors();
  const GRADIENT_COLORS = createGradientColors(themeColors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <LinearGradient colors={['#1a0a0a', '#0a0a0a', '#1a0000']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.1)', 'rgba(236, 72, 153, 0.1)']}
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

          <Animated.View style={[styles.counterBadge, bounceStyle]}>
            <Text style={styles.counterText}>Clicks: {counter}</Text>
          </Animated.View>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Tính năng nổi bật</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
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
            <Button title="Primary" variant="primary" onPress={() => {}} fullWidth />
            <GradientButton title="Gradient" onPress={() => {}} fullWidth />
            <ElevatedButton title="Elevated" onPress={() => {}} fullWidth />
            <Button title="Secondary" variant="secondary" onPress={() => {}} fullWidth />
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with 💜 </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnimationDemoScreen;
