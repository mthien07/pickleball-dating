/**
 * SettingsScreen
 *
 * User settings with sections for account, discovery, notifications, and privacy
 * Supports dark mode theme switching
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { spacing, typography, borderRadius } from '../../theme/tokens';
import { useTheme, ThemeMode, type ThemeColors } from '../../contexts/ThemeContext';

// ============================================
// TYPES
// ============================================

interface SettingsRowProps {
  icon: string;
  label: string;
  value?: string;
  type?: 'link' | 'toggle' | 'value';
  isToggled?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
  colors: ThemeColors;
}

// ============================================
// SETTINGS ROW
// ============================================

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  type = 'link',
  isToggled = false,
  onPress,
  onToggle,
  danger = false,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={type !== 'toggle' ? onPress : undefined}
      activeOpacity={type === 'toggle' ? 1 : 0.7}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: colors.background },
          danger && { backgroundColor: `${colors.error}15` },
        ]}
      >
        <Ionicons name={icon as any} size={20} color={danger ? colors.error : colors.primary} />
      </View>
      <Text
        style={[styles.rowLabel, { color: colors.textPrimary }, danger && { color: colors.error }]}
      >
        {label}
      </Text>
      {type === 'value' && (
        <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>
      )}
      {type === 'toggle' && (
        <Switch
          value={isToggled}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      )}
      {type === 'link' && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />}
    </TouchableOpacity>
  );
};

// ============================================
// SECTION
// ============================================

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  colors: ThemeColors;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  delay = 0,
  colors,
}) => (
  <Animated.View entering={FadeInUp.delay(delay)} style={styles.section}>
    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>{children}</View>
  </Animated.View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { theme, themeMode, setThemeMode } = useTheme();
  const colors = theme.colors;

  // Toggle states
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    likes: true,
    bookingReminders: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    showDistance: true,
    showAge: true,
  });

  // Theme mode labels
  const themeModeLabels: Record<ThemeMode, string> = {
    system: 'Hệ thống',
    light: 'Sáng',
    dark: 'Tối',
  };

  const handleThemeChange = () => {
    const modes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setThemeMode(nextMode);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => navigation.navigate('Auth'),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa tài khoản', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cài đặt</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Appearance */}
          <SettingsSection title="Hiển thị" delay={0} colors={colors}>
            <SettingsRow
              icon="moon-outline"
              label="Giao diện"
              type="value"
              value={themeModeLabels[themeMode]}
              onPress={handleThemeChange}
              colors={colors}
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="Tài khoản" delay={100} colors={colors}>
            <SettingsRow
              icon="person-outline"
              label="Chỉnh sửa hồ sơ"
              onPress={() => navigation.navigate('EditProfile')}
              colors={colors}
            />
            <SettingsRow
              icon="mail-outline"
              label="Email"
              type="value"
              value="user@example.com"
              colors={colors}
            />
            <SettingsRow
              icon="call-outline"
              label="Số điện thoại"
              type="value"
              value="+84 *** *** 789"
              colors={colors}
            />
            <SettingsRow
              icon="lock-closed-outline"
              label="Đổi mật khẩu"
              onPress={() => {}}
              colors={colors}
            />
          </SettingsSection>

          {/* Discovery */}
          <SettingsSection title="Khám phá" delay={200} colors={colors}>
            <SettingsRow
              icon="location-outline"
              label="Khoảng cách tối đa"
              type="value"
              value="50 km"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="people-outline"
              label="Độ tuổi"
              type="value"
              value="18 - 45"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="fitness-outline"
              label="Trình độ"
              type="value"
              value="Tất cả"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="search-outline"
              label="Tìm kiếm"
              type="value"
              value="Tất cả"
              onPress={() => {}}
              colors={colors}
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="Thông báo" delay={300} colors={colors}>
            <SettingsRow
              icon="heart-outline"
              label="Match mới"
              type="toggle"
              isToggled={notifications.newMatches}
              onToggle={(v) => setNotifications((prev) => ({ ...prev, newMatches: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="chatbubble-outline"
              label="Tin nhắn mới"
              type="toggle"
              isToggled={notifications.messages}
              onToggle={(v) => setNotifications((prev) => ({ ...prev, messages: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="star-outline"
              label="Lượt thích mới"
              type="toggle"
              isToggled={notifications.likes}
              onToggle={(v) => setNotifications((prev) => ({ ...prev, likes: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="calendar-outline"
              label="Nhắc đặt sân"
              type="toggle"
              isToggled={notifications.bookingReminders}
              onToggle={(v) => setNotifications((prev) => ({ ...prev, bookingReminders: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="megaphone-outline"
              label="Khuyến mãi"
              type="toggle"
              isToggled={notifications.promotions}
              onToggle={(v) => setNotifications((prev) => ({ ...prev, promotions: v }))}
              colors={colors}
            />
          </SettingsSection>

          {/* Privacy */}
          <SettingsSection title="Quyền riêng tư" delay={400} colors={colors}>
            <SettingsRow
              icon="ellipse-outline"
              label="Hiện trạng thái online"
              type="toggle"
              isToggled={privacy.showOnlineStatus}
              onToggle={(v) => setPrivacy((prev) => ({ ...prev, showOnlineStatus: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="navigate-outline"
              label="Hiện khoảng cách"
              type="toggle"
              isToggled={privacy.showDistance}
              onToggle={(v) => setPrivacy((prev) => ({ ...prev, showDistance: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="calendar-number-outline"
              label="Hiện tuổi"
              type="toggle"
              isToggled={privacy.showAge}
              onToggle={(v) => setPrivacy((prev) => ({ ...prev, showAge: v }))}
              colors={colors}
            />
          </SettingsSection>

          {/* Support */}
          <SettingsSection title="Hỗ trợ" delay={500} colors={colors}>
            <SettingsRow
              icon="help-circle-outline"
              label="Trung tâm hỗ trợ"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="document-text-outline"
              label="Điều khoản sử dụng"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="shield-outline"
              label="Chính sách bảo mật"
              onPress={() => {}}
              colors={colors}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="Về ứng dụng"
              type="value"
              value="v1.0.0"
              colors={colors}
            />
          </SettingsSection>

          {/* Danger Zone */}
          <SettingsSection title="Tài khoản" delay={600} colors={colors}>
            <SettingsRow
              icon="log-out-outline"
              label="Đăng xuất"
              danger
              onPress={handleLogout}
              colors={colors}
            />
            <SettingsRow
              icon="trash-outline"
              label="Xóa tài khoản"
              danger
              onPress={handleDeleteAccount}
              colors={colors}
            />
          </SettingsSection>

          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
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
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h4,
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
    ...typography.label,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  sectionContent: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    flex: 1,
  },
  rowValue: {
    ...typography.body,
    marginRight: spacing.xs,
  },
});

export default SettingsScreen;
