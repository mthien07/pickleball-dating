import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { Input, PasswordInput } from '../../components/Input';
import { Button } from '../../components/Button';

// Map design colors to tokens or use specific hex if needed for dark mode
const COLORS = {
  background: colors.background,
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  primary: colors.primary,
  disabled: colors.textTertiary,
  white: '#FFFFFF',
};

export default function LoginScreenDesign({ navigation }: { navigation?: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = () => {
    // Add login logic here
    console.log('Login', { email, password });
    // After successful login, navigation should be handled by AuthContext state change usually
    // But if testing navigation:
    // navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <ChevronLeft size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng nhập</Text>
        <View style={{ width: 28 }} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => console.log('Forgot Password')}
                >
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <Button
                title="ĐĂNG NHẬP"
                onPress={handleLogin}
                disabled={!isFormValid}
                fullWidth
                size="large"
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Chưa có tài khoản?{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => navigation?.navigate('SignupDesign')}
                  >
                    Đăng ký
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  form: {
    gap: 24,
    marginTop: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSection: {
    gap: 24,
    marginBottom: Platform.OS === 'ios' ? 0 : 24,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});
