/**
 * settings-appearance-section
 *
 * Theme / display settings section for SettingsScreen.
 */

import React from 'react';
import { ThemeMode } from '../../../contexts/ThemeContext';
import { SettingsSection, SettingsRow } from './settings-components';

interface Props {
  themeMode: ThemeMode;
  onThemeChange: () => void;
  colors: any;
}

const themeModeLabels: Record<ThemeMode, string> = {
  system: 'Hệ thống',
  light: 'Sáng',
  dark: 'Tối',
};

export const AppearanceSection = React.memo(({ themeMode, onThemeChange, colors }: Props) => (
  <SettingsSection title="Hiển thị" delay={0} colors={colors}>
    <SettingsRow
      icon="moon-outline"
      label="Giao diện"
      type="value"
      value={themeModeLabels[themeMode]}
      onPress={onThemeChange}
      colors={colors}
    />
  </SettingsSection>
));

AppearanceSection.displayName = 'AppearanceSection';
