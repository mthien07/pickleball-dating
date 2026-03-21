import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useImagePicker } from '../../../hooks/useImagePicker';
import { uploadProfileImage } from '../../../services/storage.service';
import { updateProfile } from '../../../services/api/profile.service';
import { showSuccess, showError } from '../../../services/toast';
import { useAuthStore } from '../../../stores/auth-store';
import { createStyles } from './edit-profile-styles';
import { PhotoGrid } from './edit-profile-photo-grid';
import { FormSection, sanitizeInput } from './edit-profile-form-section';

export const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [bioFocused, setBioFocused] = useState(false);

  useEffect(() => {
    if (profile) {
      setPhotos(profile.avatar_urls || []);
      setName(profile.display_name || '');
      setBio(profile.bio || '');
      setSkillLevel(profile.skill_level || '');
      setPlayStyle(profile.play_style || '');
    }
  }, [profile]);

  const { pickImage } = useImagePicker({ allowsEditing: true, aspect: [1, 1] });

  const handleAddPhoto = async (_index: number) => {
    if (photos.length >= 9) {
      Alert.alert('Gioi han', 'Ban chi co the tai len toi da 9 anh');
      return;
    }
    const result = await pickImage();
    if (result && result.length > 0) {
      setIsUploading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        if (!user?.id) {
          showError('Vui long dang nhap de tai anh');
          setIsUploading(false);
          return;
        }
        const uploadResult = await uploadProfileImage(result[0].uri, user.id);
        if (uploadResult.success && uploadResult.publicUrl) {
          setPhotos((prev) => [...prev, uploadResult.publicUrl!]);
          showSuccess('Tai anh thanh cong!');
        } else {
          showError('Khong the tai anh. Vui long thu lai.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        showError('Loi tai anh');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Loi', 'Ten hien thi phai co it nhat 2 ky tu');
      return;
    }
    if (photos.length === 0) {
      Alert.alert('Thieu anh', 'Vui long them it nhat 1 anh truoc khi luu');
      return;
    }
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await updateProfile({
        displayName: name.trim(),
        bio: bio.trim(),
        avatarUrls: photos,
        skillLevel: skillLevel as any,
        playStyle: playStyle as any,
      });
      await refreshProfile();
      showSuccess('Da luu thay doi!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Save error:', error);
      const msg =
        error?.code === 'PGRST116'
          ? 'Khong tim thay ho so. Vui long them anh va thu lai.'
          : error.message || 'Khong the luu. Vui long thu lai.';
      showError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          disabled={isSaving || isUploading}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.saveButtonText, (isSaving || isUploading) && { opacity: 0.4 }]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Grid */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <PhotoGrid
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
          />
        </View>

        <FormSection
          name={name}
          onNameChange={(t) => setName(sanitizeInput(t))}
          nameFocused={nameFocused}
          onNameFocus={() => setNameFocused(true)}
          onNameBlur={() => setNameFocused(false)}
          bio={bio}
          onBioChange={(t) => setBio(sanitizeInput(t))}
          bioFocused={bioFocused}
          onBioFocus={() => setBioFocused(true)}
          onBioBlur={() => setBioFocused(false)}
          skillLevel={skillLevel}
          onSkillLevelChange={setSkillLevel}
          playStyle={playStyle}
          onPlayStyleChange={setPlayStyle}
        />

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <Pressable
            onPress={handleSave}
            disabled={isSaving || isUploading}
            style={({ pressed }) => [pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonGradientText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
