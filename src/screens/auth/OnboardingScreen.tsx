/**
 * Onboarding Screen
 *
 * First-time user experience screen showing app value proposition.
 * Features:
 * - Animated background blobs
 * - Heart logo with pulse effect
 * - Floating profile cards preview
 * - Get Started CTA button
 *
 * Adapted from Figma design for PickleBall Dating app
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { FadeIn } from '../../components/Animations';
import { colors, spacing, typography } from '../../theme/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

// Animated Background Blob (reuse from WelcomeScreen)
const AnimatedBlob = ({
  top,
  bottom,
  left,
  right,
  colors: gradientColors,
  duration,
  initialRotate = 0,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  colors: readonly [string, string, ...string[]];
  duration: number;
  initialRotate?: number;
}) => {
  const rotation = useSharedValue(initialRotate);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(initialRotate + 90, { duration: duration * 1000, easing: Easing.linear }),
        withTiming(initialRotate, { duration: duration * 1000, easing: Easing.linear })
      ),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: duration * 1000, easing: Easing.linear }),
        withTiming(1, { duration: duration * 1000, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.blob, animatedStyle, { top, bottom, left, right }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blobGradient}
      />
    </Animated.View>
  );
};

// Pulsing Heart Logo
const PulsingHeartLogo = () => {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withSpring(1.2, { damping: 2, stiffness: 100 }),
        withSpring(1, { damping: 2, stiffness: 100 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={['#EF4444', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoBackground}
      >
        <Ionicons name="heart" size={40} color="#FFFFFF" />
      </LinearGradient>
      {/* Pulse dot */}
      <Animated.View style={[styles.pulseDot, pulseStyle]} />
    </View>
  );
};

// Floating Profile Card
const FloatingCard = ({
  imageUrl,
  name,
  age,
  rotation,
  delay,
  showLike = false,
}: {
  imageUrl: string;
  name?: string;
  age?: number;
  rotation: number;
  delay: number;
  showLike?: boolean;
}) => {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation}deg` }, { translateY: floatY.value }],
  }));

  return (
    <Animated.View style={[styles.floatingCard, animatedStyle]}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.cardGradient} />
      {name && (
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>
            {name}, {age}
          </Text>
        </View>
      )}
      {showLike && (
        <View style={styles.cardLikeIcon}>
          <LinearGradient colors={['#EF4444', '#F97316']} style={styles.likeIconGradient}>
            <Ionicons name="heart" size={16} color="#FFFFFF" />
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
};

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2a1a1a', '#1a1a1a']} style={styles.background}>
        {/* Animated Blobs */}
        <AnimatedBlob
          top={80}
          left={40}
          colors={['rgba(239, 68, 68, 0.2)', 'rgba(249, 115, 22, 0.2)']}
          duration={20}
          initialRotate={0}
        />
        <AnimatedBlob
          bottom={80}
          right={40}
          colors={['rgba(249, 115, 22, 0.2)', 'rgba(239, 68, 68, 0.2)']}
          duration={15}
          initialRotate={90}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <FadeIn delay={0} style={styles.logoSection}>
              <PulsingHeartLogo />
            </FadeIn>

            {/* Title */}
            <FadeIn delay={200} style={styles.titleSection}>
              <Text style={styles.title}>Find Your</Text>
              <Text style={styles.title}>
                <Text style={styles.titleGradient}>Perfect</Text> Match
              </Text>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={400}>
              <Text style={styles.subtitle}>
                Meet New Players, Spark Real Connections,{'\n'}
                And Play Together.
              </Text>
            </FadeIn>

            {/* Floating Cards Preview */}
            <FadeIn delay={600} style={styles.cardsSection}>
              <View style={styles.cardsContainer}>
                {/* Card 1 - Background */}
                <View style={[styles.cardWrapper, { left: 32, top: 0 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    rotation={-8}
                    delay={0}
                    showLike={false}
                  />
                </View>

                {/* Card 2 - Foreground */}
                <View style={[styles.cardWrapper, { right: 32, top: 32 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                    name="Julia Ledo"
                    age={25}
                    rotation={8}
                    delay={500}
                    showLike={true}
                  />
                </View>
              </View>
            </FadeIn>

            {/* Get Started Button */}
            <FadeIn delay={800} style={styles.buttonSection}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('SignupDesign')}
              >
                {/* Glow effect */}
                <View style={styles.buttonGlow} />
                {/* Button */}
                <LinearGradient
                  colors={['#EF4444', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.getStartedButton}
                >
                  <Ionicons name="heart" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </FadeIn>

            {/* Terms */}
            <FadeIn delay={1000}>
              <Text style={styles.termsText}>
                By tapping Get Started, you agree to our Terms.{'\n'}
                Learn how we process your data in our Privacy Policy.
              </Text>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  // Blobs
  blob: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  blobGradient: {
    flex: 1,
    borderRadius: 128,
  },

  // Logo
  logoSection: {
    marginTop: spacing['2xl'],
    marginBottom: spacing['2xl'],
  },
  logoContainer: {
    position: 'relative',
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  pulseDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },

  // Title
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 48,
    lineHeight: 56,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '800',
  },
  titleGradient: {
    color: '#F97316',
  },
  subtitle: {
    ...typography.h3,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.md,
  },

  // Floating Cards
  cardsSection: {
    width: '100%',
    marginBottom: spacing['2xl'],
  },
  cardsContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
  },
  floatingCard: {
    width: 224,
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  cardName: {
    ...typography.h3,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cardLikeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  likeIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Button
  buttonSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EF4444',
    borderRadius: 28,
    opacity: 0.3,
    transform: [{ scale: 1.1 }],
  },
  getStartedButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Terms
  termsText: {
    ...typography.label,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.lg,
  },
});
