/**
 * CoachDetailScreen - Coach profile with bio, certifications, rating, and booking
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { MOCK_COACHES } from '@data/mockData';
import { createStyles } from './coach-detail-styles';

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN').format(price) + 'đ/giờ';

const StatItem: React.FC<{ icon: string; value: string | number; label: string }> = React.memo(
  ({ icon, value, label }) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    return (
      <View style={styles.statItem}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    );
  }
);

export const CoachDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { getEntering } = useReducedMotion();
  const { coachId } = route.params || {};

  const coach = MOCK_COACHES.find((c) => c.id === coachId) || MOCK_COACHES[0];

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${coach.contact.phone}`);
  };

  const handleEmail = () => {
    if (coach.contact.email) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(`mailto:${coach.contact.email}`);
    }
  };

  const handleBook = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CourtsTab');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerImage}>
        <Image source={{ uri: coach.avatar_url }} style={styles.coverImage} />
        <View style={styles.headerOverlay} />
        <SafeAreaView style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.goBack()}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </Pressable>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View entering={getEntering(FadeIn.delay(100))} style={styles.profileCard}>
            <Avatar
              size="xl"
              imageUrl={coach.avatar_url}
              name={coach.display_name}
              showBorder
              borderColor={colors.primary}
            />
            <Text style={styles.coachName}>{coach.display_name}</Text>
            <Text style={styles.price}>{formatPrice(coach.hourly_rate)}</Text>

            <View style={styles.statsRow}>
              <StatItem icon="star" value={coach.rating} label="Đánh giá" />
              <View style={styles.statDivider} />
              <StatItem icon="time-outline" value={`${coach.experience_years}+`} label="Năm KN" />
              <View style={styles.statDivider} />
              <StatItem icon="chatbubble-outline" value={coach.review_count} label="Reviews" />
            </View>
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(150))} style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.bio}>{coach.bio}</Text>
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(200))} style={styles.section}>
            <Text style={styles.sectionTitle}>Chứng chỉ</Text>
            <View style={styles.certList}>
              {coach.certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                  <Ionicons name="ribbon-outline" size={20} color={colors.primary} />
                  <Text style={styles.certText}>{cert}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={getEntering(FadeInUp.delay(250))} style={styles.section}>
            <Text style={styles.sectionTitle}>Địa điểm</Text>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.locationText}>{coach.location.address}</Text>
            </View>
          </Animated.View>

          {coach.gallery_urls.length > 0 && (
            <Animated.View entering={getEntering(FadeInUp.delay(300))} style={styles.section}>
              <Text style={styles.sectionTitle}>Thư viện ảnh</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.galleryRow}>
                  {coach.gallery_urls.map((url, index) => (
                    <Image key={index} source={{ uri: url }} style={styles.galleryImage} />
                  ))}
                </View>
              </ScrollView>
            </Animated.View>
          )}

          <Animated.View entering={getEntering(FadeInUp.delay(350))} style={styles.section}>
            <Text style={styles.sectionTitle}>Liên hệ</Text>
            <View style={styles.contactRow}>
              <Pressable
                style={({ pressed }) => [styles.contactButton, pressed && { opacity: 0.8 }]}
                onPress={handleCall}
                android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="call" size={24} color={colors.white} />
              </Pressable>
              {coach.contact.email && (
                <Pressable
                  style={({ pressed }) => [
                    styles.contactButton,
                    styles.emailButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={handleEmail}
                  android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="mail" size={24} color={colors.primary} />
                </Pressable>
              )}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Học phí</Text>
          <Text style={styles.footerPriceValue}>{formatPrice(coach.hourly_rate)}</Text>
        </View>
        <Button
          title="Đặt lịch học"
          onPress={handleBook}
          variant="primary"
          style={styles.bookButton}
        />
      </View>
    </View>
  );
};

export default CoachDetailScreen;
