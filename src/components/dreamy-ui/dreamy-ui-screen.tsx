/**
 * DreamyUIScreen - Main showcase screen combining all dreamy components
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Heart, Sparkles, Star, Cloud, Moon, Sun } from 'lucide-react-native';
import { spacing } from '../../theme/tokens';
import { dreamyColors, SCREEN_WIDTH } from './dreamy-ui-styles';
import { FloatingElement } from './dreamy-floating-element';
import { DreamyFeatureCard } from './dreamy-feature-card';
import { DreamyBadge } from './dreamy-badge';
import { DreamyTabBar } from './dreamy-tab-bar';
import { DreamyHeroCard } from './dreamy-hero-card';

const FEATURES = [
  {
    icon: <Heart size={28} color={dreamyColors.purple600} />,
    title: 'Delightful Design',
    description: 'Experience a dreamy interface with soft pastels and smooth animations.',
  },
  {
    icon: <Sparkles size={28} color={dreamyColors.purple600} />,
    title: 'Smooth Interactions',
    description: 'Every tap and swipe is crafted with Apple-inspired fluidity.',
  },
  {
    icon: <Star size={28} color={dreamyColors.purple600} />,
    title: 'Beautiful Details',
    description: 'Thoughtful micro-interactions make every moment special.',
  },
  {
    icon: <Cloud size={28} color={dreamyColors.purple600} />,
    title: 'Cloud Sync',
    description: 'Your data floats seamlessly across all your devices.',
  },
];

const TABS = ['Discover', 'Favorites', 'Collections'];

export const DreamyUIScreen: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          dreamyColors.bgGradientStart,
          dreamyColors.bgGradientMid,
          dreamyColors.bgGradientEnd,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating Background Orbs */}
      <View style={styles.floatingBgContainer}>
        <FloatingElement delay={0} duration={4000} style={styles.floatingBg1}>
          <View style={styles.floatingOrb1} />
        </FloatingElement>
        <FloatingElement delay={1000} duration={5000} style={styles.floatingBg2}>
          <View style={styles.floatingOrb2} />
        </FloatingElement>
        <FloatingElement delay={2000} duration={6000} style={styles.floatingBg3}>
          <View style={styles.floatingOrb3} />
        </FloatingElement>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(800).springify()} style={styles.header}>
          <View style={styles.headerIcons}>
            <FloatingElement delay={500} duration={2500}>
              <Moon size={32} color={dreamyColors.purple400} />
            </FloatingElement>
            <FloatingElement delay={1000} duration={3000}>
              <Sparkles size={40} color={dreamyColors.pink400} />
            </FloatingElement>
            <FloatingElement delay={700} duration={2800}>
              <Sun size={32} color={dreamyColors.pink300} />
            </FloatingElement>
          </View>

          <Text style={styles.mainTitle}>Dreamy UI</Text>
          <Text style={styles.mainSubtitle}>
            A magical experience crafted with soft pastels and smooth animations
          </Text>

          <View style={styles.badgeRow}>
            <DreamyBadge label="✨ Beautiful" variant="pink" />
            <DreamyBadge label="🎨 Playful" variant="purple" />
            <DreamyBadge label="💫 Smooth" variant="pink" />
          </View>
        </Animated.View>

        {/* Tab Bar */}
        <DreamyTabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Feature Cards */}
        <View style={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <DreamyFeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={300 + index * 100}
            />
          ))}
        </View>

        {/* Hero Card */}
        <DreamyHeroCard
          title="Made with Love"
          subtitle="Every pixel is carefully crafted to bring joy and delight to your experience"
          primaryButtonText="Get Started"
          secondaryButtonText="Learn More"
        />

        {/* Footer */}
        <Animated.View entering={FadeIn.delay(800).duration(600)} style={styles.footer}>
          <Text style={styles.footerText}>Designed with ✨ and 💜 for a dreamy experience</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Floating Background
  floatingBgContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  floatingBg1: { position: 'absolute', top: 80, left: -40 },
  floatingBg2: { position: 'absolute', top: 160, right: -20 },
  floatingBg3: { position: 'absolute', bottom: 80, left: SCREEN_WIDTH / 3 },
  floatingOrb1: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(249, 168, 212, 0.3)',
  },
  floatingOrb2: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(216, 180, 254, 0.3)',
  },
  floatingOrb3: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: 'rgba(252, 231, 243, 0.3)',
  },

  // Header
  header: { alignItems: 'center', marginBottom: spacing.xl },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: '#EC4899',
  },
  mainSubtitle: {
    fontSize: 16,
    color: 'rgba(126, 34, 206, 0.7)',
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.lg,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  // Feature Grid
  featuresGrid: { marginBottom: spacing.xl },

  // Footer
  footer: { alignItems: 'center', paddingVertical: spacing.lg },
  footerText: { color: 'rgba(126, 34, 206, 0.6)', fontSize: 14 },
});

export default DreamyUIScreen;
