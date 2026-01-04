import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Building,
  User,
  Award,
  Check,
} from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { Input, PasswordInput } from '../../components/Input';
import { Button } from '../../components/Button';

const COLORS = {
  background: colors.background,
  cardBg: colors.surface,
  border: colors.border,
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  primary: colors.primary,
  white: '#FFFFFF',
};

const RoleCard = ({
  icon: Icon,
  label,
  selected,
  onPress,
}: {
  icon: any;
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.roleCard,
      selected && styles.roleCardSelected,
    ]}
    activeOpacity={0.7}
  >
    <Icon
      size={24}
      color={selected ? COLORS.primary : COLORS.textSecondary}
    />
    <Text
      style={[
        styles.roleCardText,
        selected && styles.roleCardTextSelected,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Checkbox = ({
  checked,
  onPress,
}: {
  checked: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.checkbox,
      checked && styles.checkboxChecked,
    ]}
    activeOpacity={0.7}
  >
    {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
  </TouchableOpacity>
);

export default function SignupScreenDesign({ navigation }: { navigation?: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'owner' | 'player' | 'coach' | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isFormValid =
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    selectedRole !== null &&
    agreedToTerms;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <ChevronLeft size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Inputs */}
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

          {/* Role Selection */}
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

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Checkbox
              checked={agreedToTerms}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            />
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                Tôi đồng ý với{' '}
                <Text style={styles.linkText}>Điều khoản sử dụng</Text>
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <Button
            title="ĐĂNG KÝ"
            onPress={() => console.log('Register')}
            disabled={!isFormValid}
            fullWidth
            size="large"
            style={styles.button}
          />

          {/* Footer */}
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
  content: {
    padding: 24,
  },
  formGroup: {
    gap: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.1)', // Orange with low opacity
  },
  roleCardText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  roleCardTextSelected: {
    color: COLORS.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.text,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  button: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});