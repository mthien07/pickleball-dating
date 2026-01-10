/**
 * RatingScreen
 *
 * Rate a player after a match with star ratings and optional comment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { showSuccess } from '../../services/toast';
import { MOCK_USERS } from '@data/mockData';

// ============================================
// STAR RATING COMPONENT
// ============================================

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, size = 36 }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((star) => (
      <TouchableOpacity
        key={star}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChange(star);
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={star <= value ? 'star' : 'star-outline'}
          size={size}
          color={star <= value ? colors.warning : colors.border}
        />
      </TouchableOpacity>
    ))}
  </View>
);

// ============================================
// RATING CATEGORY
// ============================================

interface RatingCategoryProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  delay?: number;
}

const RatingCategory: React.FC<RatingCategoryProps> = ({ icon, label, value, onChange, delay = 0 }) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.categoryCard}>
    <View style={styles.categoryHeader}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
    <StarRating value={value} onChange={onChange} size={28} />
  </Animated.View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const RatingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userId, userName } = route.params || {};

  const user = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[1];

  // Rating state
  const [overallRating, setOverallRating] = useState(0);
  const [skillAccuracy, setSkillAccuracy] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = overallRating > 0 && skillAccuracy > 0 && attitude > 0 && punctuality > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showSuccess('Đã gửi đánh giá!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đánh giá</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Info */}
            <Animated.View entering={FadeIn.delay(100)} style={styles.userSection}>
              <Avatar
                size="lg"
                imageUrl={user.avatar_urls[0]}
                name={user.display_name}
                showBorder
                borderColor={colors.primary}
              />
              <Text style={styles.userName}>{userName || user.display_name}</Text>
              <Text style={styles.ratingPrompt}>Bạn đánh giá trận đấu thế nào?</Text>
            </Animated.View>

            {/* Overall Rating */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.overallSection}>
              <Text style={styles.overallLabel}>Đánh giá tổng thể</Text>
              <StarRating value={overallRating} onChange={setOverallRating} size={48} />
              {overallRating > 0 && (
                <Text style={styles.ratingText}>
                  {overallRating === 1 && 'Tệ 😞'}
                  {overallRating === 2 && 'Không tốt 😕'}
                  {overallRating === 3 && 'Bình thường 😐'}
                  {overallRating === 4 && 'Tốt 😊'}
                  {overallRating === 5 && 'Tuyệt vời! 🤩'}
                </Text>
              )}
            </Animated.View>

            {/* Categories */}
            <View style={styles.categories}>
              <RatingCategory
                icon="fitness-outline"
                label="Trình độ thực tế"
                value={skillAccuracy}
                onChange={setSkillAccuracy}
                delay={300}
              />
              <RatingCategory
                icon="heart-outline"
                label="Thái độ"
                value={attitude}
                onChange={setAttitude}
                delay={350}
              />
              <RatingCategory
                icon="time-outline"
                label="Đúng giờ"
                value={punctuality}
                onChange={setPunctuality}
                delay={400}
              />
            </View>

            {/* Comment */}
            <Animated.View entering={FadeInUp.delay(450)} style={styles.commentSection}>
              <Text style={styles.commentLabel}>Nhận xét (tùy chọn)</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                placeholderTextColor={colors.textTertiary}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>
            </Animated.View>

            <View style={{ height: spacing.xl }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title={isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              onPress={handleSubmit}
              variant="primary"
              fullWidth
              disabled={!canSubmit || isSubmitting}
            />
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
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
  closeButton: {
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

  // User Section
  userSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  userName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  ratingPrompt: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Overall Rating
  overallSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  overallLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
  },
  starRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  // Categories
  categories: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Comment
  commentSection: {
    marginBottom: spacing.lg,
  },
  commentLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  commentInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    height: 100,
  },
  charCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
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

export default RatingScreen;
