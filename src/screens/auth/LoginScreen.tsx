/**
 * Login Screen
 *
 * Traditional Email/Password Login
 *
 * Updated to match Figma design:
 * - Dark background (#0a0a0a)
 * - Red email label
 * - Circular back button with icon
 * - Pill-shaped submit button with subtle background
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../../components/Button';
import { EmailInput, PasswordInput } from '../../components/Input';
import { KeyboardView } from '../../components/KeyboardView';
import { colors, spacing, typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { showSuccess, showError } from '../../services/toast';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        showError(error.message);
        setLoading(false);
        return;
      }

      // Successful login
      showSuccess('Welcome back!');
      login(); // Update AuthContext state
    } catch (err) {
      showError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled
    >
      {/* Header with circular back button */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng nhập</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Email with RED label */}
        <View style={styles.inputContainer}>
          <Text style={styles.labelRed}>Email hoặc Số điện thoại</Text>
          <EmailInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com hoặc 0912345678"
            containerStyle={styles.emailInput}
          />
        </View>

        {/* Password with GRAY label */}
        <View style={styles.inputContainer}>
          <Text style={styles.labelGray}>Mật khẩu</Text>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.passwordInput}
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <Button
          title="ĐĂNG NHẬP"
          onPress={handleLogin}
          loading={loading}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('EmailSignup')}>
          <Text style={styles.link}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Light Theme (Sky Blue)
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    flex: 1,
  },

  // Header
  header: {
    marginBottom: spacing['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface, // White circle
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textPrimary, // Dark text
    fontWeight: '600',
  },

  // Form
  form: {
    flex: 1,
    paddingTop: spacing['2xl'],
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  labelRed: {
    ...typography.label,
    fontSize: 14,
    color: '#EF4444', // Red label for email
    marginBottom: spacing.sm,
  },
  labelGray: {
    ...typography.label,
    fontSize: 14,
    color: colors.textSecondary, // Gray text on light bg
    marginBottom: spacing.sm,
  },
  emailInput: {
    // Will be styled by EmailInput component
  },
  passwordInput: {
    // Will be styled by PasswordInput component
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.bodySmall,
    fontSize: 14,
    color: '#EF4444', // Red color
    fontWeight: '500',
  },

  // Submit Button - Pill shape with subtle background
  submitButton: {
    height: 56,
    borderRadius: 28, // Pill shape
    backgroundColor: colors.primary, // Primary Blue
    marginTop: spacing.sm,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: spacing.xl,
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  link: {
    color: '#EF4444', // Red color
    fontWeight: '600',
  },
});
