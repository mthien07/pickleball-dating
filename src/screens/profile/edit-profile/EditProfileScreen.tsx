import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

import { Button } from '../../../components/Button';
import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useImagePicker } from '../../../hooks/useImagePicker';
import { uploadProfileImage } from '../../../services/storage.service';
import { updateProfile } from '../../../services/api/profile.service';
import { showSuccess, showError } from '../../../services/toast';
import { useAuth } from '../../../contexts/AuthContext';
import { createStyles } from './edit-profile-styles';
import { PhotoGrid } from './edit-profile-photo-grid';

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Moi bat dau' },
  { id: 'intermediate', label: 'Trung binh' },
  { id: 'advanced', label: 'Nang cao' },
  { id: 'pro', label: 'Chuyen nghiep' },
];

const PLAY_STYLES = [
  { id: 'competitive', label: 'Canh tranh' },
  { id: 'casual', label: 'Thu gian' },
  { id: 'social', label: 'Giao luu' },
];

export const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  const { profile, user, refreshProfile } = useAuth();

  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddPhoto = async () => {
    if (photos.length >= 6) {
      Alert.alert('Gioi han', 'Ban chi co the tai len toi da 6 anh');
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
      showError(error.message || 'Khong the luu. Vui long thu lai.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Chinh sua</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={getEntering(FadeInUp.delay(100))} style={styles.section}>
            <Text style={styles.sectionTitle}>Anh cua ban</Text>
            <Text style={styles.sectionHint}>Anh dau tien se la anh dai dien</Text>
            <PhotoGrid
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
              isUploading={isUploading}
            />
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(150))} style={styles.section}>
            <Text style={styles.fieldLabel}>Ten hien thi</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhap ten cua ban"
              placeholderTextColor={colors.textTertiary}
            />
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(200))} style={styles.section}>
            <Text style={styles.fieldLabel}>Gioi thieu</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Viet vai dong ve ban..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={300}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/300</Text>
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(250))} style={styles.section}>
            <Text style={styles.fieldLabel}>Trinh do</Text>
            <View style={styles.optionGrid}>
              {SKILL_LEVELS.map((level) => (
                <Pressable
                  key={level.id}
                  style={({ pressed }) => [
                    styles.optionButton,
                    skillLevel === level.id && styles.optionButtonSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setSkillLevel(level.id)}
                  android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      skillLevel === level.id && styles.optionTextSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(300))} style={styles.section}>
            <Text style={styles.fieldLabel}>Phong cach choi</Text>
            <View style={styles.optionRow}>
              {PLAY_STYLES.map((s) => (
                <Pressable
                  key={s.id}
                  style={({ pressed }) => [
                    styles.styleButton,
                    playStyle === s.id && styles.styleButtonSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setPlayStyle(s.id)}
                  android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
                >
                  <Text style={[styles.styleText, playStyle === s.id && styles.styleTextSelected]}>
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isSaving ? 'Dang luu...' : 'Luu thay doi'}
            onPress={handleSave}
            variant="primary"
            fullWidth
            disabled={isSaving || isUploading}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EditProfileScreen;
