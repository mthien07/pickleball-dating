/**
 * CoachDetailScreen
 *
 * Coach profile with bio, experience, certifications, rating, and booking
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_COACHES } from '@data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ/giờ';
};

// ============================================
// STAT ITEM
// ============================================

interface StatItemProps {
  icon: string;
  value: string | number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon as any} size={20} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const CoachDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
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
    // Navigate to booking with coach
    navigation.navigate('CourtsTab');
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImage}>
        <Image source={{ uri: coach.avatar_url }} style={styles.coverImage} />
        <View style={styles.headerOverlay} />

        <SafeAreaView style={styles.headerActions}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Animated.View entering={FadeIn.delay(100)} style={styles.profileCard}>
            <Avatar
              size="xl"
              imageUrl={coach.avatar_url}
              name={coach.display_name}
              showBorder
              borderColor={colors.primary}
            />
            <Text style={styles.coachName}>{coach.display_name}</Text>
            <Text style={styles.price}>{formatPrice(coach.hourly_rate)}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatItem icon="star" value={coach.rating} label="Đánh giá" />
              <View style={styles.statDivider} />
              <StatItem icon="time-outline" value={`${coach.experience_years}+`} label="Năm KN" />
              <View style={styles.statDivider} />
              <StatItem icon="chatbubble-outline" value={coach.review_count} label="Reviews" />
            </View>
          </Animated.View>

          {/* Bio */}
          <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu</Text>
            <Text style={styles.bio}>{coach.bio}</Text>
          </Animated.View>

          {/* Certifications */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
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

          {/* Location */}
          <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
            <Text style={styles.sectionTitle}>Địa điểm</Text>
            <View style={styles.locationCard}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.locationText}>{coach.location.address}</Text>
            </View>
          </Animated.View>

          {/* Gallery */}
          {coach.gallery_urls.length > 0 && (
            <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
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

          {/* Contact */}
          <Animated.View entering={FadeInUp.delay(350)} style={styles.section}>
            <Text style={styles.sectionTitle}>Liên hệ</Text>
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                <Ionicons name="call" size={24} color={colors.white} />
              </TouchableOpacity>
              {coach.contact.email && (
                <TouchableOpacity style={[styles.contactButton, styles.emailButton]} onPress={handleEmail}>
                  <Ionicons name="mail" size={24} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Học phí</Text>
          <Text style={styles.footerPriceValue}>{formatPrice(coach.hourly_rate)}</Text>
        </View>
        <Button title="Đặt lịch học" onPress={handleBook} variant="primary" style={styles.bookButton} />
      </View>
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

  // Header
  headerImage: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },

  // Content
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -20,
    paddingHorizontal: spacing.lg,
  },

  // Profile Card
  profileCard: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    marginTop: -50,
  },
  coachName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  price: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },

  // Section
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  bio: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Certifications
  certList: {
    gap: spacing.sm,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  certText: {
    ...typography.body,
    color: colors.textPrimary,
  },

  // Location
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },

  // Gallery
  galleryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: borderRadius.md,
  },

  // Contact
  contactRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  contactButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerPrice: {
    marginRight: spacing.lg,
  },
  footerPriceLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footerPriceValue: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  bookButton: {
    flex: 1,
  },
});

export default CoachDetailScreen;
