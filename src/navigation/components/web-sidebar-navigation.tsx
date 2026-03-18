/**
 * WebSidebarNavigation
 *
 * Desktop-only left sidebar navigation replacing the bottom tab bar.
 * Shows app logo, 4 nav items with icons, active state highlight, and unread badge.
 * Uses useNavigation to navigate between tabs imperatively.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useThemeColors } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../contexts/ThemeContext';
import { spacing, iconSizes } from '../../theme/tokens';
import type { MainTabParamList } from '../types';

type TabNavProp = BottomTabNavigationProp<MainTabParamList>;

interface NavItem {
  key: keyof MainTabParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'HomeTab', label: 'Home', icon: 'heart', iconOutline: 'heart-outline' },
  { key: 'MatchesTab', label: 'Matches', icon: 'chatbubbles', iconOutline: 'chatbubbles-outline' },
  { key: 'CourtsTab', label: 'Courts', icon: 'location', iconOutline: 'location-outline' },
  { key: 'ProfileTab', label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
];

interface WebSidebarNavigationProps {
  activeTab: string;
  unreadCount: number;
}

export const WebSidebarNavigation = ({ activeTab, unreadCount }: WebSidebarNavigationProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const navigation = useNavigation<TabNavProp>();

  return (
    <View style={styles.sidebar}>
      {/* Logo section */}
      <View style={styles.logoSection}>
        <Ionicons name="tennisball" size={28} color={colors.accent} />
        <Text style={styles.logoText}>PICKLEMATCH</Text>
      </View>

      {/* Nav items */}
      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.key;
          const showBadge = item.key === 'MatchesTab' && unreadCount > 0;

          return (
            <Pressable
              key={item.key}
              onPress={() => navigation.navigate(item.key)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              style={(state: any) => [
                styles.navItem,
                isActive && styles.navItemActive,
                state.hovered && !isActive && styles.navItemHovered,
              ]}
            >
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isActive ? item.icon : item.iconOutline}
                  size={iconSizes.md}
                  color={isActive ? colors.accent : colors.textTertiary}
                />
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadCount > 99 ? '99+' : String(unreadCount)}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sidebar: {
      width: 240,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingTop: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    logoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.xl,
    },
    logoText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.accent,
      letterSpacing: 1.5,
    },
    navItems: {
      gap: spacing.xs,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 10,
    },
    navItemActive: {
      backgroundColor: colors.backgroundCircle,
    },
    navItemHovered: {
      backgroundColor: colors.searchBackground,
      opacity: 0.7,
    },
    iconWrapper: {
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -6,
      backgroundColor: colors.accent,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    badgeText: {
      color: colors.white,
      fontSize: 9,
      fontWeight: '700',
    },
    navLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textTertiary,
    },
    navLabelActive: {
      color: colors.accent,
      fontWeight: '600',
    },
  });
