/**
 * ProfileSetupScreen
 *
 * Multi-step wizard for completing user profile after signup
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { useImagePicker } from '../../hooks/useImagePicker';
import { uploadProfileImage } from '../../services/storage.service';
import { showSuccess, showError } from '../../services/toast';
import { useAuth } from '../../contexts/AuthContext';
import { createProfile } from '../../services/api/profile.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_STEPS = 5;

// ============================================
// STEP COMPONENTS
// ============================================

// Step 1: Photos
interface PhotoStepProps {
  photos: string[];
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
  isUploading: boolean;
}

const PhotoStep: React.FC<PhotoStepProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  isUploading,
}) => (
  <Animated.View entering={FadeInUp} style={styles.stepContent}>
    <Text style={styles.stepTitle}>Thêm ảnh của bạn</Text>
    <Text style={styles.stepDescription}>
      Thêm ít nhất 2 ảnh để bắt đầu. Ảnh đầu tiên sẽ là ảnh đại diện.
    </Text>

    <View style={styles.photoGrid}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          style={[styles.photoSlot, index === 0 && styles.primaryPhotoSlot]}
          onPress={() => (photos[index] ? onRemovePhoto(index) : onAddPhoto())}
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
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Ionicons name="add" size={32} color={colors.textTertiary} />
              )}
              {index === 0 && <Text style={styles.primaryLabel}>Ảnh chính</Text>}
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </Animated.View>
);

// Step 2: Basic Info
interface BasicInfoStepProps {
  name: string;
  onNameChange: (name: string) => void;
  birthDate: string;
  onBirthDateChange: (date: string) => void;
  gender: string;
  onGenderChange: (gender: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  name,
  onNameChange,
  birthDate,
  onBirthDateChange,
  gender,
  onGenderChange,
}) => {
  // Auto-format birth date as DD/MM/YYYY
  const handleBirthDateChange = (text: string) => {
    // Remove all non-numeric characters
    const numbersOnly = text.replace(/[^0-9]/g, '');

    // Format as DD/MM/YYYY
    let formatted = '';
    if (numbersOnly.length > 0) {
      formatted = numbersOnly.slice(0, 2);
    }
    if (numbersOnly.length > 2) {
      formatted += '/' + numbersOnly.slice(2, 4);
    }
    if (numbersOnly.length > 4) {
      formatted += '/' + numbersOnly.slice(4, 8);
    }

    onBirthDateChange(formatted);
  };

  return (
    <Animated.View entering={FadeInUp} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Thông tin cơ bản</Text>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Tên hiển thị</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onNameChange}
          placeholder="Nguyễn Văn A"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Ngày sinh</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={handleBirthDateChange}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={{ color: colors.textTertiary, fontSize: 12, marginTop: 4 }}>
          Ví dụ: 15/03/1995
        </Text>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Giới tính</Text>
        <View style={styles.optionRow}>
          {['Nam', 'Nữ', 'Khác'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, gender === option && styles.optionButtonSelected]}
              onPress={() => onGenderChange(option)}
            >
              <Text style={[styles.optionText, gender === option && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Step 3: Skill Level
interface SkillLevelStepProps {
  skillLevel: string;
  onSkillLevelChange: (level: string) => void;
}

const SkillLevelStep: React.FC<SkillLevelStepProps> = ({ skillLevel, onSkillLevelChange }) => {
  const levels = [
    { id: 'beginner', label: 'Mới bắt đầu', emoji: '🌱', desc: 'Đang học cơ bản' },
    { id: 'intermediate', label: 'Trung bình', emoji: '🎯', desc: 'Chơi được 1-2 năm' },
    { id: 'advanced', label: 'Nâng cao', emoji: '⚡', desc: 'Chơi ổn định, biết chiến thuật' },
    { id: 'pro', label: 'Chuyên nghiệp', emoji: '🏆', desc: 'Thi đấu chuyên nghiệp' },
  ];

  return (
    <Animated.View entering={FadeInUp} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Trình độ của bạn</Text>
      <Text style={styles.stepDescription}>Chọn trình độ phù hợp để tìm đối thủ ngang tay</Text>

      <View style={styles.skillGrid}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[styles.skillCard, skillLevel === level.id && styles.skillCardSelected]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSkillLevelChange(level.id);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.skillEmoji}>{level.emoji}</Text>
            <Text style={[styles.skillLabel, skillLevel === level.id && styles.skillLabelSelected]}>
              {level.label}
            </Text>
            <Text style={styles.skillDesc}>{level.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

// Step 4: Play Style
interface PlayStyleStepProps {
  playStyle: string;
  onPlayStyleChange: (style: string) => void;
  lookingFor: string[];
  onLookingForChange: (items: string[]) => void;
}

const PlayStyleStep: React.FC<PlayStyleStepProps> = ({
  playStyle,
  onPlayStyleChange,
  lookingFor,
  onLookingForChange,
}) => {
  const styles_local = [
    { id: 'competitive', label: 'Cạnh tranh', emoji: '🔥' },
    { id: 'casual', label: 'Thư giãn', emoji: '😊' },
    { id: 'social', label: 'Giao lưu', emoji: '🤝' },
  ];

  const lookingForOptions = [
    { id: 'opponent', label: 'Đối thủ đơn' },
    { id: 'doubles_partner', label: 'Đối tác đôi' },
    { id: 'dating', label: 'Hẹn hò' },
  ];

  const toggleLookingFor = (id: string) => {
    if (lookingFor.includes(id)) {
      onLookingForChange(lookingFor.filter((i) => i !== id));
    } else {
      onLookingForChange([...lookingFor, id]);
    }
  };

  return (
    <Animated.View entering={FadeInUp} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Phong cách chơi</Text>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Bạn thích chơi kiểu nào?</Text>
        <View style={styles.optionRow}>
          {styles_local.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.styleCard, playStyle === option.id && styles.styleCardSelected]}
              onPress={() => onPlayStyleChange(option.id)}
            >
              <Text style={styles.styleEmoji}>{option.emoji}</Text>
              <Text
                style={[styles.styleLabel, playStyle === option.id && styles.styleLabelSelected]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Bạn đang tìm kiếm?</Text>
        <View style={styles.chipGrid}>
          {lookingForOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.chip, lookingFor.includes(option.id) && styles.chipSelected]}
              onPress={() => toggleLookingFor(option.id)}
            >
              <Text
                style={[styles.chipText, lookingFor.includes(option.id) && styles.chipTextSelected]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Step 5: Bio
interface BioStepProps {
  bio: string;
  onBioChange: (bio: string) => void;
}

const BioStep: React.FC<BioStepProps> = ({ bio, onBioChange }) => (
  <Animated.View entering={FadeInUp} style={styles.stepContent}>
    <Text style={styles.stepTitle}>Giới thiệu bản thân</Text>
    <Text style={styles.stepDescription}>Viết vài dòng về bản thân để người khác hiểu bạn hơn</Text>

    <TextInput
      style={[styles.input, styles.bioInput]}
      value={bio}
      onChangeText={onBioChange}
      placeholder="Tôi yêu pickleball vì..."
      placeholderTextColor={colors.textTertiary}
      multiline
      maxLength={300}
      textAlignVertical="top"
    />
    <Text style={styles.charCount}>{bio.length}/300</Text>
  </Animated.View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const ProfileSetupScreen = () => {
  const navigation = useNavigation<any>();
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
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

  const { user, refreshProfile } = useAuth();
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
        // Upload to Supabase Storage
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
          // Fallback to local URI if upload fails (for demo)
          setPhotos((prev) => [...prev, result[0].uri]);
          console.warn('Upload failed, using local URI');
        }
      } catch (error) {
        // Use local URI as fallback
        setPhotos((prev) => [...prev, result[0].uri]);
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete setup - save to database
      setIsSaving(true);
      try {
        // Convert birthDate from DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = birthDate.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        // Convert gender to database format
        const genderMap: Record<string, 'male' | 'female' | 'other'> = {
          Nam: 'male',
          Nữ: 'female',
          Khác: 'other',
        };

        await createProfile({
          displayName: name,
          dateOfBirth: formattedDate,
          gender: genderMap[gender] || 'other',
          bio: bio,
          avatarUrls: photos,
          skillLevel: skillLevel as any,
          playStyle: playStyle as any,
          lookingFor: lookingFor as any,
        });

        // Refresh profile in context
        await refreshProfile();

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccess('Tạo hồ sơ thành công!');
        navigation.navigate('ProfileMe');
      } catch (error: any) {
        console.error('Create profile error:', error);
        showError(error.message || 'Không thể tạo hồ sơ. Vui lòng thử lại.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const isNextEnabled = () => {
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PhotoStep
            photos={photos}
            onAddPhoto={handleAddPhoto}
            onRemovePhoto={handleRemovePhoto}
            isUploading={isUploading}
          />
        );
      case 1:
        return (
          <BasicInfoStep
            name={name}
            onNameChange={setName}
            birthDate={birthDate}
            onBirthDateChange={setBirthDate}
            gender={gender}
            onGenderChange={setGender}
          />
        );
      case 2:
        return <SkillLevelStep skillLevel={skillLevel} onSkillLevelChange={setSkillLevel} />;
      case 3:
        return (
          <PlayStyleStep
            playStyle={playStyle}
            onPlayStyleChange={setPlayStyle}
            lookingFor={lookingFor}
            onLookingForChange={setLookingFor}
          />
        );
      case 4:
        return <BioStep bio={bio} onBioChange={setBio} />;
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <ProgressBar progress={(currentStep + 1) / TOTAL_STEPS} />
          </View>
          <View style={{ width: 44 }} />
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
            disabled={!isNextEnabled()}
            fullWidth
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

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stepContent: {
    paddingTop: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  // Photo Grid
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoSlot: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
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
  formField: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
    height: 150,
    paddingTop: spacing.md,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Options
  optionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.white,
  },

  // Skill Cards
  skillGrid: {
    gap: spacing.sm,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  skillCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  skillEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  skillLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  skillLabelSelected: {
    color: colors.primary,
  },
  skillDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },

  // Style Cards
  styleCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  styleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  styleEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  styleLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  styleLabelSelected: {
    color: colors.primary,
  },

  // Chips
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.white,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
});

export default ProfileSetupScreen;
