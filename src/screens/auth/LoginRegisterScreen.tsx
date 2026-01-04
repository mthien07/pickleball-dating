import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme/tokens';
import { FadeIn, SlideIn, StaggerContainer } from '../../components/Animations';
import { showInfo } from '../../services/toast';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

type LoginRegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'LoginRegister'>;

export const LoginRegisterScreen = () => {
  const navigation = useNavigation<LoginRegisterScreenNavigationProp>();

  const handleSocialLogin = (provider: string) => {
    showInfo(`Continue with ${provider} coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Branding Section */}
        <FadeIn duration={800} style={styles.brandingSection}>
          <Text style={styles.logo}>🎾 PickleBall Dating</Text>
          <Text style={styles.headline}>Find Your Perfect Match</Text>
          <Text style={styles.subheadline}>On & Off Court</Text>
        </FadeIn>

        {/* 2. Social Login Section */}
        <StaggerContainer style={styles.socialSection} staggerTime={100}>
          <SlideIn direction="bottom" distance={30}>
            <Button
              title="Continue with Google"
              variant="secondary"
              onPress={() => handleSocialLogin('Google')}
              icon={<Text style={styles.buttonIcon}>G</Text>} // Placeholder icon
              style={styles.socialButton}
            />
          </SlideIn>
          
          <SlideIn direction="bottom" distance={30}>
            <Button
              title="Continue with Facebook"
              variant="secondary"
              onPress={() => handleSocialLogin('Facebook')}
              icon={<Text style={styles.buttonIcon}>f</Text>} // Placeholder icon
              style={styles.socialButton}
            />
          </SlideIn>

          {Platform.OS === 'ios' && (
            <SlideIn direction="bottom" distance={30}>
              <Button
                title="Continue with Apple"
                variant="secondary"
                onPress={() => handleSocialLogin('Apple')}
                icon={<Text style={styles.buttonIcon}></Text>} // Placeholder icon
                style={styles.socialButton}
              />
            </SlideIn>
          )}
        </StaggerContainer>

        {/* 3. Divider */}
        <FadeIn delay={600} style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </FadeIn>

        {/* 4. Traditional Login Options */}
        <StaggerContainer style={styles.traditionalSection} staggerTime={100}>
          <SlideIn direction="bottom" distance={30} delay={700}>
            <Button
              title="Sign up with Email"
              variant="secondary" // Outlined style
              onPress={() => navigation.navigate('EmailSignup')}
              icon={<Text style={styles.buttonIcon}>✉️</Text>}
              style={styles.traditionalButton}
            />
          </SlideIn>

          <SlideIn direction="bottom" distance={30} delay={800}>
            <Button
              title="Sign up with Phone"
              variant="secondary" // Outlined style
              onPress={() => navigation.navigate('PhoneSignup')}
              icon={<Text style={styles.buttonIcon}>📞</Text>}
              style={styles.traditionalButton}
            />
          </SlideIn>
        </StaggerContainer>

        {/* 5. Existing User Section */}
        <FadeIn delay={1000} style={styles.footerSection}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.signInLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
        </FadeIn>

        {/* 6. Legal Footer */}
        <FadeIn delay={1200} style={styles.legalSection}>
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link} onPress={() => {}}>Terms</Text>
            {' & '}
            <Text style={styles.link} onPress={() => {}}>Privacy Policy</Text>
          </Text>
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    ...typography.h1,
    fontSize: 32,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  headline: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subheadline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  socialSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  socialButton: {
    width: '100%',
    backgroundColor: colors.white, // Override for social buttons usually
    borderColor: colors.border,
    borderWidth: 1,
  },
  buttonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginHorizontal: spacing.md,
  },
  traditionalSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  traditionalButton: {
    width: '100%',
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  signInLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  legalSection: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  legalText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
