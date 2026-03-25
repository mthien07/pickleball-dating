/**
 * useEmailSignup hook
 * Handles Supabase signup logic: validation, profile creation, auto-login.
 */

import { useState } from 'react';
import { Platform } from 'react-native';
import { showSuccess, showError } from '../../../services/toast';
import { supabase } from '../../../services/supabase';
import type { Role } from './email-signup-components';

interface UseEmailSignupOptions {
  onNavigateLogin: () => void;
}

export const useEmailSignup = ({ onNavigateLogin }: UseEmailSignupOptions) => {
  const [loading, setLoading] = useState(false);

  const handleSignup = async (params: {
    email: string;
    password: string;
    confirmPassword: string;
    role: Role | null;
    agreed: boolean;
  }) => {
    const { email, password, confirmPassword, role, agreed } = params;

    if (!email || !password || !confirmPassword || !role || !agreed) {
      showError('Please fill in all fields');
      return;
    }

    // Strict email regex validation (Bug 7)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const msg = 'Email không hợp lệ. Vui lòng nhập email đúng định dạng.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      }
      showError(msg);
      return;
    }

    if (password !== confirmPassword) {
      if (Platform.OS === 'web') {
        window.alert('Mật khẩu không khớp');
      }
      showError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (__DEV__) {
        console.log('[EmailSignup] Starting signup for:', email, 'role:', role);
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });

      if (signUpError) {
        throw signUpError;
      }

      const user = data?.user;
      if (!user) {
        showError('Đăng ký thất bại. Vui lòng thử lại.');
        return;
      }

      // Create minimal profile record — full profile completed in profile-setup flow.
      // Only include columns that exist in the 'users' table (Bug 1: removed full_name, role).
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: user.id,
          email,
          display_name: email.split('@')[0],
          date_of_birth: '2000-01-01',
          gender: 'other',
          skill_level: 'beginner',
          play_style: 'casual',
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.log('[EmailSignup] Profile creation note:', profileError.message);
      }

      if (data?.session) {
        showSuccess('Đăng ký thành công!');
        return;
      }

      // No session — attempt auto-login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (Platform.OS === 'web') {
          window.alert(
            'Đăng ký thành công!\n\nEmail confirmation có thể đang bật. Vui lòng kiểm tra email hoặc thử đăng nhập.'
          );
        }
        showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        onNavigateLogin();
      } else if (signInData?.session) {
        showSuccess('Đăng ký và đăng nhập thành công!');
        setTimeout(async () => {
          const { data: checkData } = await supabase.auth.getSession();
          if (!checkData.session) {
            onNavigateLogin();
          }
        }, 500);
      } else {
        showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        onNavigateLogin();
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Signup failed';
      if (Platform.OS === 'web') {
        window.alert('Lỗi: ' + errorMsg);
      }
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSignup };
};
