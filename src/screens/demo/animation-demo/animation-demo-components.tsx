/**
 * AnimationDemo - Reusable sub-components: FeatureCard, ShowcaseItem
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { GradientCard, createGradientColors } from '../../../components/GradientBackground';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { usePressAnimation } from '../../../hooks/useAnimations';
import { styles } from './animation-demo-styles';

// ============================================
// FEATURE CARD
// ============================================

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard = React.memo(({ icon, title, description, delay }: FeatureCardProps) => {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)} style={styles.featureCard}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
      >
        <Animated.View style={animatedStyle}>
          <GradientCard variant="subtle" style={styles.featureCardInner}>
            <View style={styles.featureIconContainer}>
              <Ionicons name={icon as any} size={32} color="#EF4444" />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
          </GradientCard>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

// ============================================
// SHOWCASE ITEM
// ============================================

interface ShowcaseItemProps {
  icon: string;
  title: string;
}

export const ShowcaseItem = React.memo(({ icon, title }: ShowcaseItemProps) => {
  const colors = useThemeColors();
  const gc = createGradientColors(colors);
  return (
    <View style={styles.showcaseItem}>
      <LinearGradient
        colors={gc.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.showcaseIcon}
      >
        <Ionicons name={icon as any} size={24} color="#FFFFFF" />
      </LinearGradient>
      <Text style={styles.showcaseItemTitle}>{title}</Text>
    </View>
  );
});
