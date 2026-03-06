/**
 * Phone Signup Screen
 *
 * Registration form using Phone Number.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { KeyboardView } from '../../components/KeyboardView';
import { colors, spacing, typography } from '../../theme/tokens';
import { showSuccess, showError } from '../../services/toast';

type PhoneSignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneSignup'>;

export const PhoneSignupScreen = () => {
  const navigation = useNavigation<PhoneSignupScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const handleSendCode = () => {
    if (!phone || phone.length < 9) {
      showError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('code');
      showSuccess('Verification code sent!');
    }, 1000);
  };

  const handleVerify = () => {
    if (!code || code.length < 4) {
      showError('Please enter the verification code');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSuccess('Phone verified!');
      // navigation.navigate('ProfileSetup');
    }, 1500);
  };

  return (
    <KeyboardView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (step === 'phone' ? navigation.goBack() : setStep('phone'))}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.1)' }}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{step === 'phone' ? 'Enter Phone Number' : 'Verify Phone'}</Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'We will send you a verification code'
            : `Enter code sent to ${phone}`}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'phone' ? (
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+84 90 123 4567"
            keyboardType="phone-pad"
            containerStyle={styles.input}
          />
        ) : (
          <Input
            label="Verification Code"
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            containerStyle={styles.input}
            maxLength={6}
          />
        )}

        <Button
          title={step === 'phone' ? 'Send Code' : 'Verify'}
          onPress={step === 'phone' ? handleSendCode : handleVerify}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </KeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.sm,
  },
  input: {
    marginBottom: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
