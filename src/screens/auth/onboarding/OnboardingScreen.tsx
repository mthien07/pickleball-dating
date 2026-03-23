import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { FadeIn } from '../../../components/Animations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './onboarding-styles';
import { AnimatedBlob, PulsingHeartLogo, FloatingCard } from './onboarding-animated-components';

const isWeb = Platform.OS === 'web';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { theme } = useTheme();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const isDark = theme.isDark;

  const backgroundGradient = [colors.background, colors.surface, colors.background] as const;

  const blobColors1 = [colors.primaryLight, colors.primary] as const;
  const blobColors2 = [colors.accentLight, colors.accent] as const;

  // Reduce animation delays on web for instant feel
  const d = (ms: number) => (isWeb ? Math.min(ms, 100) : ms);

  return (
    <View style={styles.container}>
      <LinearGradient colors={backgroundGradient} style={styles.background}>
        <AnimatedBlob top={80} left={40} colors={blobColors1} duration={20} initialRotate={0} />
        <AnimatedBlob
          bottom={80}
          right={40}
          colors={blobColors2}
          duration={15}
          initialRotate={90}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Web-only top bar with Login link */}
          {isWeb && (
            <View style={styles.webTopBar}>
              <View style={styles.webTopBarLogo}>
                <Heart size={20} color={colors.accent} fill={colors.accent} strokeWidth={0} />
                <Text style={styles.webTopBarBrand}>PICKLEMATCH</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('Login')} style={styles.webLoginButton}>
                <Text style={styles.webLoginText}>Log In</Text>
              </Pressable>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <FadeIn delay={d(0)} style={styles.logoSection}>
              <PulsingHeartLogo
                gradientColors={[colors.accent, colors.primary]}
                pulseColor={colors.success}
                pulseBorderColor={colors.background}
              />
            </FadeIn>

            <FadeIn delay={d(200)} style={styles.titleSection}>
              <Text style={styles.titleLine}>FIND YOUR</Text>
              <Text style={styles.titleLine}>
                <Text style={styles.titleAccent}>PERFECT</Text> MATCH
              </Text>
            </FadeIn>

            <FadeIn delay={d(400)}>
              <Text style={styles.subtitle}>
                Match by skill level. Book courts nearby.{'\n'}Play pickleball with the right
                people.
              </Text>
            </FadeIn>

            {/* CTA buttons — ABOVE cards so they're visible above the fold */}
            <FadeIn delay={d(500)} style={styles.buttonSection}>
              <Pressable
                onPress={() => navigation.navigate('SignupDesign')}
                style={({ pressed }) => [styles.buttonContainer, pressed && { opacity: 0.9 }]}
                android_ripple={{ color: 'rgba(59, 89, 152, 0.15)' }}
                accessibilityRole="button"
                accessibilityLabel="Get started - create your account"
              >
                <View style={styles.buttonGlow} />
                <LinearGradient
                  colors={[colors.accent, colors.accentDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.getStartedButton}
                >
                  <Heart size={20} color={colors.white} fill={colors.white} strokeWidth={0} />
                  <Text style={styles.buttonText}>GET STARTED</Text>
                  <ArrowRight size={20} color={colors.white} strokeWidth={2.5} />
                </LinearGradient>
              </Pressable>

              {/* Login link for returning users */}
              <Pressable
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLinkContainer}
                accessibilityRole="link"
                accessibilityLabel="Log in to existing account"
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginLinkAccent}>Log In</Text>
                </Text>
              </Pressable>
            </FadeIn>

            <FadeIn delay={d(600)} style={styles.cardsSection}>
              <View style={styles.cardsContainer}>
                <View style={[styles.cardWrapper, { left: 32, top: 0 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    altText="Sample profile photo of a pickleball player"
                    rotation={-8}
                    delay={0}
                  />
                </View>
                <View style={[styles.cardWrapper, { right: 32, top: 32 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                    altText="Profile photo of Julia Ledo, age 25"
                    name="Julia Ledo"
                    age={25}
                    rotation={8}
                    delay={500}
                    showLike
                    likeGradient={[colors.accent, colors.primary]}
                    iconColor={colors.white}
                  />
                </View>
              </View>
            </FadeIn>

            <FadeIn delay={d(800)}>
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

export default OnboardingScreen;
