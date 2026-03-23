/**
 * EmailSignupScreen
 *
 * Orchestrator for email registration flow.
 * Delegates signup logic to useEmailSignup hook.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Building2, Users, GraduationCap, ArrowLeft } from 'lucide-react-native';
import { AuthStackParamList } from '../../../navigation/types';
import { Button } from '../../../components/Button';
import { EmailInput, PasswordInput } from '../../../components/Input';
import { KeyboardView } from '../../../components/KeyboardView';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { RoleCard, TermsCheckbox, type Role } from './email-signup-components';
import { createStyles } from './email-signup-styles';
import { useEmailSignup } from './use-email-signup';

type EmailSignupNav = StackNavigationProp<AuthStackParamList, 'EmailSignup'>;

export const EmailSignupScreen = () => {
  const navigation = useNavigation<EmailSignupNav>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [agreed, setAgreed] = useState(false);

  const { loading, handleSignup } = useEmailSignup({
    onNavigateLogin: () => navigation.navigate('Login'),
  });

  const onSubmit = () => handleSignup({ email, password, confirmPassword, role, agreed });
  const onToggleAgreed = useCallback(() => setAgreed((prev) => !prev), []);

  return (
    <KeyboardView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.headerTitle}>ĐĂNG KÝ</Text>
        </View>
      </View>

      {/* accessibilityRole="form" renders as <form> on web, enabling password managers */}
      <View style={styles.form} accessibilityRole={'form' as any}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelSecondary}>EMAIL</Text>
          <EmailInput value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelSecondary}>MẬT KHẨU</Text>
          <PasswordInput value={password} onChangeText={setPassword} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelSecondary}>XÁC NHẬN MẬT KHẨU</Text>
          {/* Bug 9: show mismatch error as user types in confirm password field */}
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={
              confirmPassword.length > 0 && password !== confirmPassword
                ? 'Mật khẩu không khớp'
                : undefined
            }
          />
        </View>

        <Text style={styles.sectionLabel}>BẠN LÀ:</Text>
        <View style={styles.rolesContainer}>
          <RoleCard
            value="owner"
            label="Chủ sân"
            Icon={Building2}
            selected={role === 'owner'}
            onSelect={setRole}
          />
          <RoleCard
            value="player"
            label="Người chơi"
            Icon={Users}
            selected={role === 'player'}
            onSelect={setRole}
          />
          <RoleCard
            value="coach"
            label="HLV"
            Icon={GraduationCap}
            selected={role === 'coach'}
            onSelect={setRole}
          />
        </View>

        <TermsCheckbox agreed={agreed} onToggle={onToggleAgreed} />

        <Button
          title="ĐĂNG KÝ"
          onPress={onSubmit}
          loading={loading}
          disabled={!agreed || !role}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Đã có tài khoản? </Text>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => pressed && { opacity: 0.7 }}
        >
          <Text style={styles.link}>Đăng nhập</Text>
        </Pressable>
      </View>
    </KeyboardView>
  );
};

export default EmailSignupScreen;
