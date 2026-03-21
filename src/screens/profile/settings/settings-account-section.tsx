/**
 * settings-account-section
 *
 * Account info, discovery filters, notifications, privacy, and support sections
 * for SettingsScreen.
 */

import React from 'react';
import { SettingsSection, SettingsRow } from './settings-components';

interface NotificationState {
  newMatches: boolean;
  messages: boolean;
  likes: boolean;
  bookingReminders: boolean;
  promotions: boolean;
}

interface PrivacyState {
  showOnlineStatus: boolean;
  showDistance: boolean;
  showAge: boolean;
}

interface Props {
  colors: any;
  onEditProfile: () => void;
  notifications: NotificationState;
  onNotificationToggle: (key: keyof NotificationState, value: boolean) => void;
  privacy: PrivacyState;
  onPrivacyToggle: (update: Partial<PrivacyState>) => void;
}

export const AccountSection = React.memo(
  ({
    colors,
    onEditProfile,
    notifications,
    onNotificationToggle,
    privacy,
    onPrivacyToggle,
  }: Props) => (
    <>
      <SettingsSection title="Tài khoản" delay={100} colors={colors}>
        <SettingsRow
          icon="person-outline"
          label="Chỉnh sửa hồ sơ"
          onPress={onEditProfile}
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
          onToggle={(v) => onNotificationToggle('newMatches', v)}
          colors={colors}
        />
        <SettingsRow
          icon="chatbubble-outline"
          label="Tin nhắn mới"
          type="toggle"
          isToggled={notifications.messages}
          onToggle={(v) => onNotificationToggle('messages', v)}
          colors={colors}
        />
        <SettingsRow
          icon="star-outline"
          label="Lượt thích mới"
          type="toggle"
          isToggled={notifications.likes}
          onToggle={(v) => onNotificationToggle('likes', v)}
          colors={colors}
        />
        <SettingsRow
          icon="calendar-outline"
          label="Nhắc đặt sân"
          type="toggle"
          isToggled={notifications.bookingReminders}
          onToggle={(v) => onNotificationToggle('bookingReminders', v)}
          colors={colors}
        />
        <SettingsRow
          icon="megaphone-outline"
          label="Khuyến mãi"
          type="toggle"
          isToggled={notifications.promotions}
          onToggle={(v) => onNotificationToggle('promotions', v)}
          colors={colors}
        />
      </SettingsSection>

      <SettingsSection title="Quyền riêng tư" delay={400} colors={colors}>
        <SettingsRow
          icon="ellipse-outline"
          label="Hiện trạng thái online"
          type="toggle"
          isToggled={privacy.showOnlineStatus}
          onToggle={(v) => onPrivacyToggle({ showOnlineStatus: v })}
          colors={colors}
        />
        <SettingsRow
          icon="navigate-outline"
          label="Hiện khoảng cách"
          type="toggle"
          isToggled={privacy.showDistance}
          onToggle={(v) => onPrivacyToggle({ showDistance: v })}
          colors={colors}
        />
        <SettingsRow
          icon="calendar-number-outline"
          label="Hiện tuổi"
          type="toggle"
          isToggled={privacy.showAge}
          onToggle={(v) => onPrivacyToggle({ showAge: v })}
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
    </>
  )
);

AccountSection.displayName = 'AccountSection';
