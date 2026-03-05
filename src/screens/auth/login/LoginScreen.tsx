/**
 * LoginScreen
 *
 * Email/password login with forgot password flow.
 * Handles Supabase auth.signInWithPassword and resetPasswordForEmail.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '../../../components/Button';
import { EmailInput, PasswordInput } from '../../../components/Input';
import { KeyboardView } from '../../../components/KeyboardView';
import { showSuccess, showError } from '../../../services/toast';
import { AuthStackParamList } from '../../../navigation/types';
import { supabase } from '../../../services/supabase';
import { colors } from '../../../theme/tokens';
import { styles } from './login-styles';

type LoginNav = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const navigation = useNavigation<LoginNav>();
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showError(error.message);
        return;
      }
      showSuccess('Welcome back!');
    } catch {
      showError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendResetEmail = async (resetEmail: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'myapp://auth/reset-password',
      });
      if (error) {
        showError(error.message);
      } else {
        showSuccess('Đã gửi email đặt lại mật khẩu!');
      }
    } catch {
      showError('Không thể gửi email. Vui lòng thử lại.');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.prompt(
        'Quên mật khẩu',
        'Nhập email của bạn để nhận link đặt lại mật khẩu:',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Gửi',
            onPress: (inputEmail: string | undefined) => {
              if (!inputEmail) {
                showError('Vui lòng nhập email');
                return;
              }
              sendResetEmail(inputEmail);
            },
          },
        ],
        'plain-text',
        ''
      );
    } else {
      Alert.alert('Quên mật khẩu', `Gửi link đặt lại mật khẩu đến ${email}?`, [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Gửi', onPress: () => sendResetEmail(email) },
      ]);
    }
  };

  return (
    <KeyboardView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ĐĂNG NHẬP</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelAccent}>EMAIL HOẶC SỐ ĐIỆN THOẠI</Text>
          <EmailInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com hoặc 0912345678"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.labelSecondary}>MẬT KHẨU</Text>
          <PasswordInput value={password} onChangeText={setPassword} />
        </View>

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
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

export default LoginScreen;
