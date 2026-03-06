import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { useThemeColors } from '../contexts/ThemeContext';
import type { MainTabParamList } from './types';

import { HomeSwipeScreen } from '../screens/main/HomeSwipeScreen';
import { TabIcon } from './components/TabIcon';
import { MatchesNavigator, CourtsNavigator, ProfileNavigator } from './components/stack-navigators';
import { MOCK_MATCHES } from '@data/mockData';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const unreadCount = useMemo(
    () => MOCK_MATCHES.reduce((sum, m) => sum + (m.unread_count ?? 0), 0),
    []
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          paddingTop: spacing.xs,
          ...shadows.md,
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: spacing.xs,
        },
        tabBarItemStyle: {
          paddingVertical: spacing.xs,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeSwipeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'heart' : 'heart-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MatchesTab"
        component={MatchesNavigator}
        options={{
          tabBarLabel: 'Matches',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CourtsTab"
        component={CourtsNavigator}
        options={{
          tabBarLabel: 'Courts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'location' : 'location-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
