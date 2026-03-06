/**
 * RatingScreen
 *
 * Rate a player after a match with star ratings and optional comment
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import { spacing } from '../../../theme/tokens';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { showSuccess } from '../../../services/toast';
import { MOCK_USERS } from '@data/mockData';
import { createStyles } from './styles';
import { StarRating } from './StarRating';
import { RatingCategory } from './RatingCategory';

const RATING_LABELS: Record<number, string> = {
  1: 'Tệ 😞',
  2: 'Không tốt 😕',
  3: 'Bình thường 😐',
  4: 'Tốt 😊',
  5: 'Tuyệt vời! 🤩',
};

export const RatingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { userId, userName } = route.params || {};

  const user = MOCK_USERS.find((u: any) => u.id === userId) || MOCK_USERS[1];

  const [overallRating, setOverallRating] = useState(0);
  const [skillAccuracy, setSkillAccuracy] = useState(0);
  const [attitude, setAttitude] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = overallRating > 0 && skillAccuracy > 0 && attitude > 0 && punctuality > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showSuccess('Đã gửi đánh giá!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Đánh giá</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

            <Animated.View entering={FadeInUp.delay(200)} style={styles.overallSection}>
              <Text style={styles.overallLabel}>Đánh giá tổng thể</Text>
              <StarRating value={overallRating} onChange={setOverallRating} size={48} />
              {overallRating > 0 && (
                <Text style={styles.ratingText}>{RATING_LABELS[overallRating]}</Text>
              )}
            </Animated.View>

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

export default RatingScreen;
