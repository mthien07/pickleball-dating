/**
 * settings-danger-zone-section
 *
 * Logout and delete-account actions section for SettingsScreen.
 */

import React from 'react';
import { SettingsSection, SettingsRow } from './settings-components';

interface Props {
  colors: any;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const DangerZoneSection = React.memo(({ colors, onLogout, onDeleteAccount }: Props) => (
  <SettingsSection title="Tài khoản" delay={600} colors={colors}>
    <SettingsRow
      icon="log-out-outline"
      label="Đăng xuất"
      danger
      onPress={onLogout}
      colors={colors}
    />
    <SettingsRow
      icon="trash-outline"
      label="Xóa tài khoản"
      danger
      onPress={onDeleteAccount}
      colors={colors}
    />
  </SettingsSection>
));

DangerZoneSection.displayName = 'DangerZoneSection';
