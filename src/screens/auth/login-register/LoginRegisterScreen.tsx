/**
 * LoginRegisterScreen
 *
 * Social + traditional auth entry screen.
 * Provides Google, Facebook (Apple on iOS), Email, Phone signup options.
 */

import React from 'react';
import { View, Text, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../../components/Button';
import { colors } from '../../../theme/tokens';
import { FadeIn, SlideIn, StaggerContainer } from '../../../components/Animations';
import { showInfo } from '../../../services/toast';
import { AuthStackParamList } from '../../../navigation/types';
import { styles } from './login-register-styles';

type LoginRegisterNav = StackNavigationProp<AuthStackParamList, 'LoginRegister'>;

export const LoginRegisterScreen = () => {
  const navigation = useNavigation<LoginRegisterNav>();

  const handleSocialLogin = (provider: string) => {
    showInfo(`Continue with ${provider} coming soon!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Branding */}
        <FadeIn duration={800} style={styles.brandingSection}>
          <Text style={styles.logo}>🎾 PickleBall Dating</Text>
          <Text style={styles.headline}>Find Your Perfect Match</Text>
          <Text style={styles.subheadline}>On & Off Court</Text>
        </FadeIn>

        {/* Social Login */}
        <StaggerContainer style={styles.socialSection} staggerTime={100}>
          <SlideIn direction="bottom" distance={30}>
            <Button
              title="Continue with Google"
              variant="secondary"
              onPress={() => handleSocialLogin('Google')}
              icon={<Text style={styles.buttonIcon}>G</Text>}
              style={styles.socialButton}
            />
          </SlideIn>
          <SlideIn direction="bottom" distance={30}>
            <Button
              title="Continue with Facebook"
              variant="secondary"
              onPress={() => handleSocialLogin('Facebook')}
              icon={<Text style={styles.buttonIcon}>f</Text>}
              style={styles.socialButton}
            />
          </SlideIn>
          {Platform.OS === 'ios' && (
            <SlideIn direction="bottom" distance={30}>
              <Button
                title="Continue with Apple"
                variant="secondary"
                onPress={() => handleSocialLogin('Apple')}
                icon={<Text style={styles.buttonIcon}></Text>}
                style={styles.socialButton}
              />
            </SlideIn>
          )}
        </StaggerContainer>

        {/* Divider */}
        <FadeIn delay={600} style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </FadeIn>

        {/* Traditional Login */}
        <StaggerContainer style={styles.traditionalSection} staggerTime={100}>
          <SlideIn direction="bottom" distance={30} delay={700}>
            <Button
              title="Sign up with Email"
              variant="secondary"
              onPress={() => navigation.navigate('EmailSignup')}
              icon={<Text style={styles.buttonIcon}>✉️</Text>}
              style={styles.traditionalButton}
            />
          </SlideIn>
          <SlideIn direction="bottom" distance={30} delay={800}>
            <Button
              title="Sign up with Phone"
              variant="secondary"
              onPress={() => navigation.navigate('PhoneSignup')}
              icon={<Text style={styles.buttonIcon}>📞</Text>}
              style={styles.traditionalButton}
            />
          </SlideIn>
        </StaggerContainer>

        {/* Existing User */}
        <FadeIn delay={1000} style={styles.footerSection}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
              Sign In
            </Text>
          </Text>
        </FadeIn>

        {/* Legal */}
        <FadeIn delay={1200} style={styles.legalSection}>
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link} onPress={() => {}}>
              Terms
            </Text>
            {' & '}
            <Text style={styles.link} onPress={() => {}}>
              Privacy Policy
            </Text>
          </Text>
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginRegisterScreen;
