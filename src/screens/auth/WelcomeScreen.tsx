/**
 * Welcome Screen (Onboarding/Sign Up)
 *
 * Modern, clean, sporty design for PickleBall Dating app.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Mail, Phone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';

const { width } = Dimensions.get('window');

// Custom button component for this screen to match specific design requirements
const SocialButton = ({ 
  title, 
  icon, 
  onPress, 
  iconColor, 
  variant = 'filled',
  IconComponent = Ionicons
}: { 
  title: string; 
  icon: string; 
  onPress: () => void; 
  iconColor?: string;
  variant?: 'filled' | 'outline';
  IconComponent?: any;
}) => (
  <TouchableOpacity
      style={[
      styles.button,
      variant === 'filled' ? styles.buttonFilled : styles.buttonOutline,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.buttonContent}>
      <IconComponent 
        name={icon} 
        size={20} 
        color={iconColor || (variant === 'filled' ? colors.textPrimary : colors.primary)} 
        // Lucide icons use 'color' and 'size' props, Ionicons uses same.
        // For Lucide, we might need to pass props differently if it's a component class, but here we assume it's like Ionicons or we pass the component instance.
        // Actually for Lucide, we usually pass the component itself, not a name string if we want to be type safe, but here we are mixing.
        // Let's adjust the usage below.
      />
      <Text style={[
        styles.buttonText, 
        variant === 'filled' ? styles.buttonTextFilled : styles.buttonTextOutline
      ]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

const ActionButton = ({
  title,
  icon: Icon,
  onPress,
  variant = 'filled'
}: {
  title: string;
  icon: any;
  onPress: () => void;
  variant?: 'filled' | 'outline';
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === 'filled' ? styles.buttonFilled : styles.buttonOutline,
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.buttonContent}>
      <Icon 
        size={20} 
        color={variant === 'filled' ? colors.textPrimary : colors.primary} 
        style={styles.buttonIcon}
      />
      <Text style={[
        styles.buttonText, 
        variant === 'filled' ? styles.buttonTextFilled : styles.buttonTextOutline
      ]}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  const handleSignIn = () => {
    navigation.navigate('LoginDesign');
  };

  const handleGoogle = () => {
    // console.log('Google Sign In');
  };

  const handleFacebook = () => {
    // console.log('Facebook Sign In');
  };

  const handleEmail = () => {
    navigation.navigate('SignupDesign');
  };

  const handlePhone = () => {
    navigation.navigate('SignupDesign');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
        
        {/* Top Branding Section */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIconContainer}>
               {/* Custom Tennis Racket representation using Ionicons for now */}
               <Ionicons name="tennisball" size={24} color={colors.lime || '#CCFF00'} />
            </View>
            <Text style={styles.appName}>PickleBall Dating</Text>
              </View>
            </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>Find Your Perfect Match</Text>
            <Text style={styles.subheading}>On & Off the Court</Text>
          </View>

          {/* Social Buttons */}
          <View style={styles.buttonGroup}>
            <SocialButton
              title="Continue with Google"
              icon="logo-google"
              onPress={handleGoogle}
              iconColor="#DB4437"
              IconComponent={Ionicons}
            />
            <SocialButton
              title="Continue with Facebook"
              icon="logo-facebook"
              onPress={handleFacebook}
              iconColor="#4267B2"
              IconComponent={Ionicons}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Alternative Sign Up */}
          <View style={styles.buttonGroup}>
            <ActionButton
              title="Sign up with Email"
              icon={Mail}
              onPress={handleEmail}
              variant="outline"
            />
            <ActionButton
              title="Sign up with Phone"
              icon={Phone}
              onPress={handlePhone}
              variant="outline"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
          
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink} onPress={() => {}}>Terms</Text>
            {' & '}
            <Text style={styles.legalLink} onPress={() => {}}>Privacy Policy</Text>.
          </Text>
        </View>
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: spacing.xl,
    alignItems: 'center', // Centered horizontally as per "Keep all main content centered horizontally" but logo requested "align left next to app name"?
    // "Keep the tennis-racket + ball logo, but make it a bit smaller and align it left next to the app name."
    // This implies the logo and name are a unit. I will center that unit on the screen.
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIconContainer: {
    // transform: [{ rotate: '-45deg' }], // Optional: tilt for sportiness
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Ideally a rounded font
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: spacing.md,
  },
  button: {
    height: 50,
    borderRadius: borderRadius.md, // More square like 21st.dev
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonFilled: {
    backgroundColor: colors.surface,
    // Subtle shadow
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // Left align icon and text as requested
    justifyContent: 'flex-start',
    paddingLeft: spacing.md,
  },
  buttonIcon: {
    marginRight: spacing.md,
    width: 24, // Fixed width for alignment
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextFilled: {
    color: colors.textPrimary,
  },
  buttonTextOutline: {
    color: colors.textPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textTertiary,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  signInLink: {
    // "Sign In" is in the app’s primary blue color... wait, background is blue.
    // "Sign In is in the app’s primary blue color" on a dark sky blue background might have low contrast.
    // I'll make it bold white or a lighter accent color for better contrast if primary blue is too dark/similar.
    // Or I can use the neon lime accent if allowed, but specs said "primary blue".
    // Given the background is #87CEEB (Sky Blue), primary blue #5B9FE3 is very close.
    // I'll use white bold for now for readability, or the 'lime' accent if it fits 'sporty'.
    // Re-reading: "Sign In is in the app’s primary blue color". Okay, I will try to use a distinct blue or maybe the request implied a white background for the text, but the whole screen is "darker sky blue".
    // Let's interpret "primary blue" as "accent color that stands out" or just stick to the literal request but check contrast.
    // I'll use a very dark blue/navy for high contrast against sky blue?
    // Let's try colors.white first for "Already have..." and colors.lime or Dark Blue for the link.
    // Actually, on a #87CEEB bg, white text is good. A dark blue link is good.
    color: colors.primaryDark, // Cobalt/Dark blue for contrast
    fontWeight: 'bold',
    fontSize: 15,
  },
  legalText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: '80%',
  },
  legalLink: {
    color: colors.primaryDark, // Match Sign In link color
    fontWeight: '600',
  },
});
