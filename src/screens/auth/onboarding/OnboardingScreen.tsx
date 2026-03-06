import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <FadeIn delay={0} style={styles.logoSection}>
              <PulsingHeartLogo
                gradientColors={[colors.accent, colors.primary]}
                pulseColor={colors.success}
                pulseBorderColor={colors.background}
              />
            </FadeIn>

            <FadeIn delay={200} style={styles.titleSection}>
              <Text style={styles.titleLine}>FIND YOUR</Text>
              <Text style={styles.titleLine}>
                <Text style={styles.titleAccent}>PERFECT</Text> MATCH
              </Text>
            </FadeIn>

            <FadeIn delay={400}>
              <Text style={styles.subtitle}>
                Meet New Players, Spark Real Connections,{'\n'}And Play Together.
              </Text>
            </FadeIn>

            <FadeIn delay={600} style={styles.cardsSection}>
              <View style={styles.cardsContainer}>
                <View style={[styles.cardWrapper, { left: 32, top: 0 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                    rotation={-8}
                    delay={0}
                  />
                </View>
                <View style={[styles.cardWrapper, { right: 32, top: 32 }]}>
                  <FloatingCard
                    imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
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

            <FadeIn delay={800} style={styles.buttonSection}>
              <Pressable
                onPress={() => navigation.navigate('SignupDesign')}
                style={({ pressed }) => [styles.buttonContainer, pressed && { opacity: 0.9 }]}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
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
            </FadeIn>

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

export default OnboardingScreen;
