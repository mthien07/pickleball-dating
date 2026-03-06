/**
 * WelcomeScreen - Vibrant Sport Theme
 *
 * Sign up/sign in screen with Barlow typography and sport-themed design.
 */

import React from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Mail, Phone } from 'lucide-react-native';
import { colors } from '../../../theme/tokens';
import { styles } from './welcome-styles';

// Unified button for both Ionicons (social) and Lucide (action) icons
const WelcomeButton = ({
  title,
  onPress,
  variant = 'filled',
  ionIcon,
  ionIconColor,
  LucideIcon,
}: {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  ionIcon?: string;
  ionIconColor?: string;
  LucideIcon?: any;
}) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      variant === 'filled' ? styles.buttonFilled : styles.buttonOutline,
      pressed && { opacity: 0.8 },
    ]}
    onPress={onPress}
    android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
  >
    <View style={styles.buttonContent}>
      {ionIcon && (
        <Ionicons
          name={ionIcon as any}
          size={20}
          color={ionIconColor || colors.textPrimary}
          style={styles.buttonIcon}
        />
      )}
      {LucideIcon && <LucideIcon size={20} color={colors.primary} style={styles.buttonIcon} />}
      <Text style={[styles.buttonText, variant === 'outline' && styles.buttonTextOutline]}>
        {title}
      </Text>
    </View>
  </Pressable>
);

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Branding */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="tennisball" size={24} color={colors.secondary} />
            <Text style={styles.appName}>PickleBall Dating</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>Tìm Đối Thủ{'\n'}Hoàn Hảo</Text>
            <Text style={styles.subheading}>Trên & Ngoài Sân</Text>
          </View>

          {/* Social Login */}
          <View style={styles.buttonGroup}>
            <WelcomeButton
              title="Tiếp tục với Google"
              ionIcon="logo-google"
              ionIconColor="#DB4437"
              onPress={() => {}}
            />
            <WelcomeButton
              title="Tiếp tục với Facebook"
              ionIcon="logo-facebook"
              ionIconColor="#4267B2"
              onPress={() => {}}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Phone Sign Up */}
          <View style={styles.buttonGroup}>
            <WelcomeButton
              title="Đăng ký bằng Email"
              LucideIcon={Mail}
              onPress={() => navigation.navigate('SignupDesign')}
              variant="outline"
            />
            <WelcomeButton
              title="Đăng ký bằng SĐT"
              LucideIcon={Phone}
              onPress={() => navigation.navigate('SignupDesign')}
              variant="outline"
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.navigate('LoginDesign')}
            style={({ pressed }) => [styles.signInContainer, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          >
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <Text style={styles.signInLink}>Đăng nhập</Text>
          </Pressable>

          <Text style={styles.legalText}>
            Khi tiếp tục, bạn đồng ý với <Text style={styles.legalLink}>Điều khoản</Text>
            {' & '}
            <Text style={styles.legalLink}>Chính sách bảo mật</Text>.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
