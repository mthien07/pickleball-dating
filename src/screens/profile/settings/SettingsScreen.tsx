/**
 * SettingsScreen
 *
 * Orchestrator for user settings.
 * Sections: appearance, account, discovery, notifications, privacy, support, danger zone.
 */

import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { spacing } from '../../../theme/tokens';
import { useTheme, ThemeMode } from '../../../contexts/ThemeContext';
import { RootStackParamList, ProfileStackParamList } from '../../../navigation/types';
import { SettingsRow, SettingsSection } from './settings-components';
import { styles } from './settings-styles';

type SettingsNav = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList, 'Settings'>,
  StackNavigationProp<RootStackParamList>
>;

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsNav>();
  const { theme, themeMode, setThemeMode } = useTheme();
  const colors = theme.colors;

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

  const themeModeLabels: Record<ThemeMode, string> = {
    system: 'Hệ thống',
    light: 'Sáng',
    dark: 'Tối',
  };

  const handleThemeChange = () => {
    const modes: ThemeMode[] = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    setThemeMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          // @ts-expect-error: Navigation routing complex union types
          navigation.navigate('Auth');
        },
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
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cài đặt</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

          <SettingsSection title="Thông báo" delay={300} colors={colors}>
            <SettingsRow
              icon="heart-outline"
              label="Match mới"
              type="toggle"
              isToggled={notifications.newMatches}
              onToggle={(v) => setNotifications((p) => ({ ...p, newMatches: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="chatbubble-outline"
              label="Tin nhắn mới"
              type="toggle"
              isToggled={notifications.messages}
              onToggle={(v) => setNotifications((p) => ({ ...p, messages: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="star-outline"
              label="Lượt thích mới"
              type="toggle"
              isToggled={notifications.likes}
              onToggle={(v) => setNotifications((p) => ({ ...p, likes: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="calendar-outline"
              label="Nhắc đặt sân"
              type="toggle"
              isToggled={notifications.bookingReminders}
              onToggle={(v) => setNotifications((p) => ({ ...p, bookingReminders: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="megaphone-outline"
              label="Khuyến mãi"
              type="toggle"
              isToggled={notifications.promotions}
              onToggle={(v) => setNotifications((p) => ({ ...p, promotions: v }))}
              colors={colors}
            />
          </SettingsSection>

          <SettingsSection title="Quyền riêng tư" delay={400} colors={colors}>
            <SettingsRow
              icon="ellipse-outline"
              label="Hiện trạng thái online"
              type="toggle"
              isToggled={privacy.showOnlineStatus}
              onToggle={(v) => setPrivacy((p) => ({ ...p, showOnlineStatus: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="navigate-outline"
              label="Hiện khoảng cách"
              type="toggle"
              isToggled={privacy.showDistance}
              onToggle={(v) => setPrivacy((p) => ({ ...p, showDistance: v }))}
              colors={colors}
            />
            <SettingsRow
              icon="calendar-number-outline"
              label="Hiện tuổi"
              type="toggle"
              isToggled={privacy.showAge}
              onToggle={(v) => setPrivacy((p) => ({ ...p, showAge: v }))}
              colors={colors}
            />
          </SettingsSection>

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

export default SettingsScreen;
