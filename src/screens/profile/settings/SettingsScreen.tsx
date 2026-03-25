/**
 * SettingsScreen
 *
 * Orchestrator for user settings.
 * Sections: appearance, account, discovery, notifications, privacy, support, danger zone.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { spacing } from '../../../theme/tokens';
import { useTheme, ThemeMode } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAuthStore } from '../../../stores/auth-store';
import { RootStackParamList, ProfileStackParamList } from '../../../navigation/types';
import { createStyles } from './settings-styles';
import { AppearanceSection } from './settings-appearance-section';
import { AccountSection } from './settings-account-section';
import { DangerZoneSection } from './settings-danger-zone-section';

const PRIVACY_STORAGE_KEY = '@privacy_settings';

type SettingsNav = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList, 'Settings'>,
  StackNavigationProp<RootStackParamList>
>;

type NotificationState = {
  newMatches: boolean;
  messages: boolean;
  likes: boolean;
  bookingReminders: boolean;
  promotions: boolean;
};

type PrivacyState = {
  showOnlineStatus: boolean;
  showDistance: boolean;
  showAge: boolean;
};

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsNav>();
  const { theme, themeMode, setThemeMode } = useTheme();
  const colors = theme.colors;
  const styles = useThemedStyles(createStyles);
  const logout = useAuthStore((s) => s.logout);

  const [notifications, setNotifications] = useState<NotificationState>({
    newMatches: true,
    messages: true,
    likes: true,
    bookingReminders: true,
    promotions: false,
  });

  const [privacy, setPrivacy] = useState<PrivacyState>({
    showOnlineStatus: true,
    showDistance: true,
    showAge: true,
  });

  useEffect(() => {
    AsyncStorage.getItem(PRIVACY_STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          setPrivacy(JSON.parse(stored));
        }
      })
      .catch(() => {});
  }, []);

  const updatePrivacy = (update: Partial<PrivacyState>) => {
    setPrivacy((prev) => {
      const next = { ...prev, ...update };
      AsyncStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const handleThemeChange = () => {
    const modes: ThemeMode[] = ['system', 'light', 'dark'];
    setThemeMode(modes[(modes.indexOf(themeMode) + 1) % modes.length]);
  };

  const handleNotificationToggle = (key: keyof NotificationState, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            // Auth state listener will handle navigation regardless
          }
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Cài đặt</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <AppearanceSection
            themeMode={themeMode}
            onThemeChange={handleThemeChange}
            colors={colors}
          />
          <AccountSection
            colors={colors}
            onEditProfile={() => navigation.navigate('EditProfile')}
            notifications={notifications}
            onNotificationToggle={handleNotificationToggle}
            privacy={privacy}
            onPrivacyToggle={updatePrivacy}
          />
          <DangerZoneSection
            colors={colors}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
          <View style={{ height: spacing['2xl'] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SettingsScreen;
