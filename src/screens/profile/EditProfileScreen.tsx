/**
 * EditProfileScreen
 *
 * Edit user profile with image upload - saves to Supabase database
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { useImagePicker } from '../../hooks/useImagePicker';
import { uploadProfileImage } from '../../services/storage.service';
import { updateProfile } from '../../services/api/profile.service';
import { showSuccess, showError } from '../../services/toast';
import { useAuth } from '../../contexts/AuthContext';

// ============================================
// PHOTO GRID
// ============================================

interface PhotoGridProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onAdd, onRemove, isUploading }) => (
  <View style={styles.photoGrid}>
    {[0, 1, 2, 3, 4, 5].map((index) => (
      <TouchableOpacity
        key={index}
        style={[styles.photoSlot, index === 0 && styles.primaryPhotoSlot]}
        onPress={() => (photos[index] ? onRemove(index) : onAdd())}
        activeOpacity={0.8}
        disabled={isUploading}
      >
        {photos[index] ? (
          <>
            <Animated.Image
              entering={FadeIn}
              source={{ uri: photos[index] }}
              style={styles.photoImage}
            />
            <View style={styles.photoRemove}>
              <Ionicons name="close" size={16} color={colors.white} />
            </View>
          </>
        ) : (
          <>
            {isUploading && index === photos.length ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name="add" size={32} color={colors.textTertiary} />
            )}
            {index === 0 && <Text style={styles.primaryLabel}>Ảnh chính</Text>}
          </>
        )}
      </TouchableOpacity>
    ))}
  </View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { profile, user, refreshProfile } = useAuth();

  // Form state - initialize from profile
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [playStyle, setPlayStyle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form from profile
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
      Alert.alert('Giới hạn', 'Bạn chỉ có thể tải lên tối đa 6 ảnh');
      return;
    }

    const result = await pickImage();
    if (result && result.length > 0) {
      setIsUploading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        if (!user?.id) {
          showError('Vui lòng đăng nhập để tải ảnh');
          setIsUploading(false);
          return;
        }
        const uploadResult = await uploadProfileImage(result[0].uri, user.id);

        if (uploadResult.success && uploadResult.publicUrl) {
          setPhotos((prev) => [...prev, uploadResult.publicUrl!]);
          showSuccess('Tải ảnh thành công!');
        } else {
          showError('Không thể tải ảnh. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Upload error:', error);
        showError('Lỗi tải ảnh');
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
      Alert.alert('Lỗi', 'Tên hiển thị phải có ít nhất 2 ký tự');
      return;
    }

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Update profile in database
      await updateProfile({
        displayName: name.trim(),
        bio: bio.trim(),
        avatarUrls: photos,
        skillLevel: skillLevel as any,
        playStyle: playStyle as any,
      });

      // Refresh profile in context
      await refreshProfile();

      showSuccess('Đã lưu thay đổi!');
      navigation.goBack();
    } catch (error: any) {
      console.error('Save error:', error);
      showError(error.message || 'Không thể lưu. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const skillLevels = [
    { id: 'beginner', label: 'Mới bắt đầu' },
    { id: 'intermediate', label: 'Trung bình' },
    { id: 'advanced', label: 'Nâng cao' },
    { id: 'pro', label: 'Chuyên nghiệp' },
  ];

  const playStyles = [
    { id: 'competitive', label: 'Cạnh tranh' },
    { id: 'casual', label: 'Thư giãn' },
    { id: 'social', label: 'Giao lưu' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chỉnh sửa</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Photos Section */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Ảnh của bạn</Text>
            <Text style={styles.sectionHint}>Ảnh đầu tiên sẽ là ảnh đại diện</Text>
            <PhotoGrid
              photos={photos}
              onAdd={handleAddPhoto}
              onRemove={handleRemovePhoto}
              isUploading={isUploading}
            />
          </Animated.View>

          {/* Name */}
          <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
            <Text style={styles.fieldLabel}>Tên hiển thị</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên của bạn"
              placeholderTextColor={colors.textTertiary}
            />
          </Animated.View>

          {/* Bio */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
            <Text style={styles.fieldLabel}>Giới thiệu</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Viết vài dòng về bạn..."
              placeholderTextColor={colors.textTertiary}
              multiline
              maxLength={300}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/300</Text>
          </Animated.View>

          {/* Skill Level */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
            <Text style={styles.fieldLabel}>Trình độ</Text>
            <View style={styles.optionGrid}>
              {skillLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.optionButton,
                    skillLevel === level.id && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSkillLevel(level.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      skillLevel === level.id && styles.optionTextSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Play Style */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
            <Text style={styles.fieldLabel}>Phong cách chơi</Text>
            <View style={styles.optionRow}>
              {playStyles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[styles.styleButton, playStyle === style.id && styles.styleButtonSelected]}
                  onPress={() => setPlayStyle(style.id)}
                >
                  <Text
                    style={[styles.styleText, playStyle === style.id && styles.styleTextSelected]}
                  >
                    {style.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
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

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Section
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryPhotoSlot: {
    borderColor: colors.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoRemove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: 4,
  },

  // Form Fields
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  bioInput: {
    height: 120,
    paddingTop: spacing.md,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Options
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.white,
  },
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  styleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  styleButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  styleText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  styleTextSelected: {
    color: colors.white,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default EditProfileScreen;
