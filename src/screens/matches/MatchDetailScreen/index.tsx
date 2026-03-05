/**
 * MatchDetailScreen
 *
 * View matched user's full profile with photos, info, and actions
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../../components/Button';
import { colors, spacing } from '../../../theme/tokens';
import { MOCK_MATCHES, MOCK_USERS } from '@data/mockData';
import { styles, SCREEN_WIDTH } from './styles';
import { getSkillLevelLabel, getPlayStyleLabel, calculateAge, LOOKING_FOR_LABELS } from './helpers';

export const MatchDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { matchId } = route.params || {};
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const match = MOCK_MATCHES.find((m) => m.id === matchId);
  const user = match?.matched_user || MOCK_USERS[1];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found</Text>
      </View>
    );
  }

  const skillInfo = getSkillLevelLabel(user.skill_level);
  const age = calculateAge(user.date_of_birth);

  const handleChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Chat', { matchId });
  };

  const handleRate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Rating', { userId: user.id, userName: user.display_name });
  };

  const handleUnmatch = () => {
    Alert.alert('Bỏ kết nối', `Bạn có chắc chắn muốn bỏ kết nối với ${user.display_name}?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Bỏ kết nối',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Photo Carousel */}
      <View style={styles.photoContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPhotoIndex(index);
          }}
        >
          {user.avatar_urls.map((url: string, index: number) => (
            <Image key={index} source={{ uri: url }} style={styles.photo} />
          ))}
        </ScrollView>

        <View style={styles.photoIndicators}>
          {user.avatar_urls.map((_: string, index: number) => (
            <View
              key={index}
              style={[styles.indicator, currentPhotoIndex === index && styles.indicatorActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.delay(100)} style={styles.nameSection}>
            <Text style={styles.displayName}>
              {user.display_name}, {age}
            </Text>
            {user.is_online && (
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150)} style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoEmoji}>{skillInfo.emoji}</Text>
              <Text style={styles.infoText}>{skillInfo.label}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.infoText}>{getPlayStyleLabel(user.play_style)}</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.matches_count}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.games_played}</Text>
              <Text style={styles.statLabel}>Trận</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.average_rating.toFixed(1)}⭐</Text>
              <Text style={styles.statLabel}>Đánh giá</Text>
            </View>
          </Animated.View>

          {user.bio && (
            <Animated.View entering={FadeInUp.delay(250)} style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Đang tìm kiếm</Text>
            <View style={styles.tagRow}>
              {user.looking_for.map((item: string) => (
                <View key={item} style={styles.tag}>
                  <Text style={styles.tagText}>{LOOKING_FOR_LABELS[item] || item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleUnmatch}>
            <Ionicons name="close-circle" size={28} color={colors.error} />
          </TouchableOpacity>
          <Button
            title="Nhắn tin"
            onPress={handleChat}
            variant="primary"
            style={styles.chatButton}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleRate}>
            <Ionicons name="star" size={28} color={colors.warning} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MatchDetailScreen;
