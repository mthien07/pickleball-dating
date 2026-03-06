/**
 * SignupScreenDesign
 *
 * Alternate signup screen with design-system styling.
 * Handles email/password form, role selection, terms checkbox, Supabase signup.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Building, User, Award } from 'lucide-react-native';
import { Input, PasswordInput } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { supabase } from '../../../services/supabase';
import { showSuccess, showError } from '../../../services/toast';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { RoleCard, Checkbox } from './signup-design-components';
import { createStyles } from './signup-design-styles';

type SignupRole = 'owner' | 'player' | 'coach';

export default function SignupScreenDesign({ navigation }: { navigation?: any }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<SignupRole | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    selectedRole !== null &&
    agreedToTerms;

  const handleSignup = async () => {
    if (!isFormValid || !selectedRole) {
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showError('Email không hợp lệ');
      if (Platform.OS === 'web') {
        window.alert('Email không hợp lệ');
      }
      return;
    }

    setLoading(true);
    try {
      console.log('[SignupDesign] Starting signup for:', email);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: selectedRole } },
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = data?.user;
      if (!user) {
        showError('Đăng ký thất bại');
        return;
      }

      console.log('[SignupDesign] Creating profile for:', user.id);
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: user.id,
          email,
          role: selectedRole,
          full_name: '',
          display_name: email.split('@')[0],
          date_of_birth: '2000-01-01',
          gender: 'other',
          skill_level: 'beginner',
          play_style: 'casual',
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.log('[SignupDesign] Profile error (may be duplicate):', profileError.message);
      }

      if (!data?.session) {
        console.log('[SignupDesign] No session, attempting auto-login...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('[SignupDesign] Auto-login failed:', signInError.message);
          showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
          if (Platform.OS === 'web') {
            window.alert('Đăng ký thành công!\n\nVui lòng đăng nhập hoặc kiểm tra email xác thực.');
          }
          navigation?.navigate('LoginDesign');
          return;
        }

        if (signInData?.session) {
          console.log('[SignupDesign] Auto-login successful!');
          showSuccess('Đăng ký và đăng nhập thành công!');
        }
      } else {
        console.log('[SignupDesign] Session exists, AuthContext will navigate');
        showSuccess('Đăng ký thành công!');
      }
    } catch (error: any) {
      console.error('[SignupDesign] Error:', error.message);
      showError(error.message || 'Đăng ký thất bại');
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

      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => navigation?.goBack()}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.headerTitle}>ĐĂNG KÝ</Text>
        <View style={{ width: 48 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Input
              label="Email hoặc Số điện thoại"
              placeholder="Email hoặc Số điện thoại"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PasswordInput
              label="Mật khẩu"
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
            />
            <PasswordInput
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bạn là:</Text>
            <View style={styles.roleContainer}>
              <RoleCard
                icon={Building}
                label="Chủ sân"
                selected={selectedRole === 'owner'}
                onPress={() => setSelectedRole('owner')}
              />
              <RoleCard
                icon={User}
                label="Người chơi"
                selected={selectedRole === 'player'}
                onPress={() => setSelectedRole('player')}
              />
              <RoleCard
                icon={Award}
                label="HLV"
                selected={selectedRole === 'coach'}
                onPress={() => setSelectedRole('coach')}
              />
            </View>
          </View>

          <View style={styles.termsContainer}>
            <Checkbox checked={agreedToTerms} onPress={() => setAgreedToTerms(!agreedToTerms)} />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                Tôi đồng ý với <Text style={styles.linkText}>Điều khoản sử dụng</Text>
              </Text>
            </View>
          </View>

          <Button
            title="ĐĂNG KÝ"
            onPress={handleSignup}
            disabled={!isFormValid}
            loading={loading}
            fullWidth
            size="large"
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Đã có tài khoản?{' '}
              <Text style={styles.linkText} onPress={() => navigation?.navigate('LoginDesign')}>
                Đăng nhập
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
