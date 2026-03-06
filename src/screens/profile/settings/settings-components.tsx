/**
 * Settings reusable sub-components
 * - SettingsRow: single settings item (link/toggle/value)
 * - SettingsSection: animated grouped settings rows
 */

import React from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { type ThemeColors } from '../../../contexts/ThemeContext';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { createStyles } from './settings-styles';

export interface SettingsRowProps {
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

export const SettingsRow = React.memo<SettingsRowProps>(
  ({
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
    const styles = createStyles(colors);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.row,
          { borderBottomColor: colors.border },
          type !== 'toggle' && pressed && { opacity: 0.7 },
        ]}
        onPress={type !== 'toggle' ? onPress : undefined}
        android_ripple={type !== 'toggle' ? { color: 'rgba(37, 99, 235, 0.15)' } : undefined}
      >
        <View
          style={[
            styles.rowIcon,
            { backgroundColor: colors.background },
            danger && { backgroundColor: `${colors.error}15` },
          ]}
        >
          <Ionicons
            name={icon as React.ComponentProps<typeof Ionicons>['name']}
            size={20}
            color={danger ? colors.error : colors.primary}
          />
        </View>
        <Text
          style={[
            styles.rowLabel,
            { color: colors.textPrimary },
            danger && { color: colors.error },
          ]}
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
        {type === 'link' && (
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        )}
      </Pressable>
    );
  }
);

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  colors: ThemeColors;
}

export const SettingsSection = React.memo<SettingsSectionProps>(
  ({ title, children, delay = 0, colors }) => {
    const styles = createStyles(colors);
    const { getEntering } = useReducedMotion();
    return (
      <Animated.View entering={getEntering(FadeInUp.delay(delay))} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
        <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>{children}</View>
      </Animated.View>
    );
  }
);
