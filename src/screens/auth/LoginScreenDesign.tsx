import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { fontFamily, spacing } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { ThemeColors } from '../../contexts/theme-colors';
import { Input, PasswordInput } from '../../components/Input';
import { Button } from '../../components/Button';
import { supabase } from '../../services/supabase';
import { showSuccess, showError } from '../../services/toast';

export default function LoginScreenDesign({ navigation }: { navigation?: any }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) {
      return;
    }

    setLoading(true);
    try {
      console.log('[LoginDesign] Logging in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      console.log('[LoginDesign] Login successful:', data.user?.email);
      showSuccess('Đăng nhập thành công!');
      // AuthContext will detect session change and navigate to Main
    } catch (error: any) {
      console.error('[LoginDesign] Login error:', error.message);
      showError(error.message || 'Đăng nhập thất bại');
      if (Platform.OS === 'web') {
        window.alert('Lỗi: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => navigation?.goBack()}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.headerTitle}>ĐĂNG NHẬP</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            {/* Email Input */}
            <Input
              label="Email hoặc Số điện thoại"
              placeholder="example@email.com hoặc 0912345678"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Input */}
            <View>
              <PasswordInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
              />
              <Pressable
                style={({ pressed }) => [styles.forgotPassword, pressed && { opacity: 0.7 }]}
                onPress={() => console.log('Forgot Password')}
                android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
              >
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Button
              title="ĐĂNG NHẬP"
              onPress={handleLogin}
              disabled={!isFormValid}
              loading={loading}
              fullWidth
              size="large"
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Chưa có tài khoản?{' '}
                <Text style={styles.linkText} onPress={() => navigation?.navigate('SignupDesign')}>
                  Đăng ký
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    backButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    },
    headerTitle: {
      fontFamily: 'Barlow-Bold',
      fontSize: 22,
      color: colors.textPrimary,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'space-between',
    },
    form: {
      gap: spacing.lg,
      marginTop: spacing.lg,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: spacing.sm,
    },
    forgotPasswordText: {
      fontFamily: 'Barlow-Medium',
      color: colors.accent,
      fontSize: 14,
    },
    bottomSection: {
      gap: spacing.lg,
      marginBottom: Platform.OS === 'ios' ? 0 : spacing.lg,
    },
    footer: {
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.textSecondary,
    },
    linkText: {
      fontFamily: 'Barlow-SemiBold',
      color: colors.accent,
    },
  });
