/**
 * useProfileSetupForm
 *
 * Form state and handlers for the multi-step profile setup wizard.
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useImagePicker } from '../../../hooks/useImagePicker';
import { uploadProfileImage } from '../../../services/storage.service';
import { showSuccess, showError } from '../../../services/toast';
import { useAuthStore } from '../../../stores/auth-store';
import { createProfile } from '../../../services/api/profile.service';

export const TOTAL_STEPS = 5;

export interface ProfileSetupFormState {
  photos: string[];
  name: string;
  birthDate: string;
  gender: string;
  skillLevel: string;
  playStyle: string;
  lookingFor: string[];
  bio: string;
  isUploading: boolean;
  isSaving: boolean;
}

export interface ProfileSetupFormHandlers {
  handleAddPhoto: () => Promise<void>;
  handleRemovePhoto: (index: number) => void;
  handleNext: (currentStep: number, onComplete: () => void) => Promise<void>;
  isNextEnabled: (currentStep: number) => boolean;
  setName: (v: string) => void;
  setBirthDate: (v: string) => void;
  setGender: (v: string) => void;
  setSkillLevel: (v: string) => void;
  setPlayStyle: (v: string) => void;
  setLookingFor: (v: string[]) => void;
  setBio: (v: string) => void;
}

export function useProfileSetupForm(): ProfileSetupFormState & ProfileSetupFormHandlers {
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const { pickImage } = useImagePicker({ allowsEditing: true, aspect: [1, 1] });

  const handleAddPhoto = async () => {
    if (photos.length >= 6) {
      Alert.alert('Giới hạn', 'Bạn chỉ có thể tải lên tối đa 6 ảnh');
      return;
    }

    const result = await pickImage();
    if (!result || result.length === 0) {
      return;
    }

    setIsUploading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (!user?.id) {
        showError('Vui lòng đăng nhập để tải ảnh');
        return;
      }
      const uploadResult = await uploadProfileImage(result[0].uri, user.id);
      if (uploadResult.success && uploadResult.publicUrl) {
        setPhotos((prev) => [...prev, uploadResult.publicUrl!]);
        showSuccess('Tải ảnh thành công!');
      } else {
        // Fallback to local URI if upload fails
        setPhotos((prev) => [...prev, result[0].uri]);
        console.warn('Upload failed, using local URI');
      }
    } catch (error) {
      setPhotos((prev) => [...prev, result[0].uri]);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isNextEnabled = (currentStep: number): boolean => {
    switch (currentStep) {
      case 0:
        return photos.length >= 2;
      case 1:
        return name.length >= 2 && birthDate.length === 10 && gender !== '';
      case 2:
        return skillLevel !== '';
      case 3:
        return playStyle !== '' && lookingFor.length > 0;
      case 4:
        return bio.length >= 10;
      default:
        return false;
    }
  };

  const handleNext = async (currentStep: number, onComplete: () => void) => {
    if (currentStep < TOTAL_STEPS - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onComplete();
      return;
    }

    // Final step: save profile
    setIsSaving(true);
    try {
      const [day, month, year] = birthDate.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      const genderMap: Record<string, 'male' | 'female' | 'other'> = {
        Nam: 'male',
        Nữ: 'female',
        Khác: 'other',
      };

      await createProfile({
        displayName: name,
        dateOfBirth: formattedDate,
        gender: genderMap[gender] || 'other',
        bio,
        avatarUrls: photos,
        skillLevel: skillLevel as any,
        playStyle: playStyle as any,
        lookingFor: lookingFor as any,
      });

      await refreshProfile();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccess('Tạo hồ sơ thành công!');
      onComplete();
    } catch (error: any) {
      console.error('Create profile error:', error);
      showError(error.message || 'Không thể tạo hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    photos,
    name,
    birthDate,
    gender,
    skillLevel,
    playStyle,
    lookingFor,
    bio,
    isUploading,
    isSaving,
    handleAddPhoto,
    handleRemovePhoto,
    handleNext,
    isNextEnabled,
    setName,
    setBirthDate,
    setGender,
    setSkillLevel,
    setPlayStyle,
    setLookingFor,
    setBio,
  };
}
