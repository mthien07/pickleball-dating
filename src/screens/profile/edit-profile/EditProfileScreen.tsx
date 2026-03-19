import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
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

/** Strip HTML tags and SQL-like injection patterns from profile text fields */
const sanitizeInput = (text: string): string => {
  // Remove HTML/script tags
  let sanitized = text.replace(/<[^>]*>/g, '');
  // Remove semicolons used in SQL statement termination
  sanitized = sanitized.replace(/;/g, '');
  // Remove SQL DML/DDL keywords when combined with SQL syntax patterns
  sanitized = sanitized.replace(
    /\b(DROP|DELETE|INSERT|UPDATE|SELECT|TRUNCATE|ALTER|CREATE)\b\s+\b(TABLE|FROM|INTO|DATABASE|INDEX)\b/gi,
    ''
  );
  // Remove SQL comment sequences
  sanitized = sanitized.replace(/--/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  return sanitized;
};

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Mid' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'pro', label: 'Pro' },
];

const PLAY_STYLES = [
  { id: 'competitive', label: 'Competitive' },
  { id: 'casual', label: 'Casual' },
  { id: 'social', label: 'Social' },
];

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

  const bioLength = bio.length;
  const isNearLimit = bioLength >= 270;

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

        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={[styles.inputField, nameFocused && styles.inputFieldFocused]}
            value={name}
            onChangeText={(t) => setName(sanitizeInput(t))}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>

        {/* Bio Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={[styles.inputField, styles.bioInput, bioFocused && styles.inputFieldFocused]}
            value={bio}
            onChangeText={(t) => setBio(sanitizeInput(t))}
            placeholder="Tell others about yourself..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={300}
            textAlignVertical="top"
            onFocus={() => setBioFocused(true)}
            onBlur={() => setBioFocused(false)}
          />
          <Text style={[styles.charCounter, isNearLimit && styles.charCounterWarning]}>
            {bioLength}/300
          </Text>
        </View>

        {/* Skill Level */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.segmentedControl}>
            {SKILL_LEVELS.map((level) => (
              <Pressable
                key={level.id}
                style={[styles.segmentItem, skillLevel === level.id && styles.segmentItemActive]}
                onPress={() => setSkillLevel(level.id)}
              >
                <Text
                  style={[styles.segmentText, skillLevel === level.id && styles.segmentTextActive]}
                >
                  {level.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Play Style */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Play Style</Text>
          <View style={styles.pillRow}>
            {PLAY_STYLES.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.pill, playStyle === s.id && styles.pillActive]}
                onPress={() => setPlayStyle(s.id)}
              >
                <Text style={[styles.pillText, playStyle === s.id && styles.pillTextActive]}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

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
