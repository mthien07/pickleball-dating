/**
 * ProfileSetupScreen (orchestrator)
 *
 * Multi-step wizard for completing user profile after signup.
 * Delegates rendering to step components; form state managed by useProfileSetupForm.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../../components/Button';
import { ProgressBar } from '../../../components/ProgressBar';
import { colors, spacing } from '../../../theme/tokens';

import { useProfileSetupForm, TOTAL_STEPS } from './use-profile-setup-form';
import { ProfileSetupPhotoStep } from './profile-setup-photo-step';
import { ProfileSetupBasicInfoStep } from './profile-setup-basic-info-step';
import { ProfileSetupSkillLevelStep } from './profile-setup-skill-level-step';
import { ProfileSetupPlayStyleStep } from './profile-setup-play-style-step';
import { ProfileSetupBioStep } from './profile-setup-bio-step';

export const ProfileSetupScreen = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useProfileSetupForm();

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleNext = async () => {
    await form.handleNext(currentStep, () => {
      if (currentStep < TOTAL_STEPS - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        navigation.navigate('ProfileMe');
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileSetupPhotoStep
            photos={form.photos}
            onAddPhoto={form.handleAddPhoto}
            onRemovePhoto={form.handleRemovePhoto}
            isUploading={form.isUploading}
          />
        );
      case 1:
        return (
          <ProfileSetupBasicInfoStep
            name={form.name}
            onNameChange={form.setName}
            birthDate={form.birthDate}
            onBirthDateChange={form.setBirthDate}
            gender={form.gender}
            onGenderChange={form.setGender}
          />
        );
      case 2:
        return (
          <ProfileSetupSkillLevelStep
            skillLevel={form.skillLevel}
            onSkillLevelChange={form.setSkillLevel}
          />
        );
      case 3:
        return (
          <ProfileSetupPlayStyleStep
            playStyle={form.playStyle}
            onPlayStyleChange={form.setPlayStyle}
            lookingFor={form.lookingFor}
            onLookingForChange={form.setLookingFor}
          />
        );
      case 4:
        return <ProfileSetupBioStep bio={form.bio} onBioChange={form.setBio} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.progressContainer}>
            <ProgressBar progress={(currentStep + 1) / TOTAL_STEPS} />
          </View>
          <View style={styles.spacer} />
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={currentStep === TOTAL_STEPS - 1 ? 'Hoàn tất' : 'Tiếp tục'}
            onPress={handleNext}
            variant="primary"
            disabled={!form.isNextEnabled(currentStep)}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  spacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
});

export default ProfileSetupScreen;
