/**
 * Email Signup Screen
 *
 * Registration form using Email/Password.
 * Includes Role selection.
 *
 * Updated to match Figma design:
 * - Dark background (#0a0a0a)
 * - Circular back button with icon
 * - Role cards with icons and gradient selected state
 * - Gray input labels
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { EmailInput, PasswordInput } from '../../components/Input';
import { KeyboardView } from '../../components/KeyboardView';
import { colors, spacing, typography } from '../../theme/tokens';
import { shadows } from '../../theme/shadows';
import { showSuccess, showError } from '../../services/toast';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabase';

type EmailSignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailSignup'>;

type Role = 'player' | 'owner' | 'coach';

export const EmailSignupScreen = () => {
  const navigation = useNavigation<EmailSignupScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !role || !agreed) {
      showError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Save role in user metadata
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (user) {
        // 2. Create user profile record in 'users' table
        // We need to provide all REQUIRED fields to avoid DB errors
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: user.id,
            email: email,
            role: role,
            full_name: '', // Will be updated in profile setup

            // Required fields by Schema (filling with placeholders)
            display_name: email.split('@')[0], // Default display name from email
            date_of_birth: '2000-01-01', // Placeholder DOB
            gender: 'other', // Placeholder gender
            skill_level: 'beginner', // Default skill
            play_style: 'casual', // Default play style

            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          // If trigger already created it, we might get a duplicate error, which is fine to ignore or handle
          console.log('Profile creation note:', profileError.message);
        }

        showSuccess('Account created successfully!');

        // 3. Navigate to Login (or Auto-login if session is active)
        navigation.navigate('Login');
      }
    } catch (error: any) {
      showError(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({
    value,
    label,
    iconName,
  }: {
    value: Role;
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
  }) => {
    const isSelected = role === value;

    const CardContent = (
      <View style={[styles.roleCard, isSelected && styles.roleCardSelected]}>
        <Ionicons name={iconName} size={32} color={isSelected ? '#EF4444' : colors.textPrimary} />
        <Text style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}>{label}</Text>
      </View>
    );

    return (
      <TouchableOpacity
        onPress={() => setRole(value)}
        activeOpacity={0.8}
        style={styles.roleCardTouchable}
      >
        {isSelected ? (
          <LinearGradient
            colors={['rgba(239, 68, 68, 0.2)', 'rgba(249, 115, 22, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.roleCardGradient}
          >
            {CardContent}
          </LinearGradient>
        ) : (
          CardContent
        )}
      </TouchableOpacity>
    );
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
          <Text style={styles.headerTitle}>Đăng ký</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Inputs with gray labels */}
        <View style={styles.inputContainer}>
          <Text style={styles.labelGray}>Email hoặc Số điện thoại</Text>
          <EmailInput value={email} onChangeText={setEmail} containerStyle={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelGray}>Mật khẩu</Text>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelGray}>Xác nhận mật khẩu</Text>
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            containerStyle={styles.input}
          />
        </View>

        {/* Role Selection with icons */}
        <Text style={styles.sectionLabel}>Bạn là:</Text>
        <View style={styles.rolesContainer}>
          <RoleCard value="owner" label="Chủ sân" iconName="business" />
          <RoleCard value="player" label="Người chơi" iconName="people" />
          <RoleCard value="coach" label="HLV" iconName="school" />
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            Tôi đồng ý với <Text style={styles.link}>Điều khoản sử dụng</Text>
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <Button
          title="ĐĂNG KÝ"
          onPress={handleSignup}
          loading={loading}
          disabled={!agreed || !role}
          style={styles.submitButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Light Theme
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },

  // Header
  header: {
    marginBottom: spacing.lg,
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
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  // Form
  form: {
    gap: spacing.lg,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  labelGray: {
    ...typography.label,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {},

  // Role Selection
  sectionLabel: {
    ...typography.label,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleCardTouchable: {
    flex: 1,
  },
  roleCardGradient: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444', // Red border when selected
    overflow: 'hidden',
  },
  roleCard: {
    aspectRatio: 1,
    backgroundColor: colors.surface, // Light bg for card
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  roleCardSelected: {
    borderColor: '#EF4444', // Red border
    backgroundColor: 'transparent',
  },
  roleLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  roleLabelSelected: {
    color: '#EF4444', // Red text when selected
  },

  // Terms Checkbox
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  termsText: {
    ...typography.bodySmall,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  link: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
