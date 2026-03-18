import React, { useMemo } from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme/tokens';
import { shadows } from '../theme/shadows';
import { useThemeColors } from '../contexts/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import type { MainTabParamList } from './types';

import { HomeSwipeScreen } from '../screens/main/HomeSwipeScreen';
import { TabIcon } from './components/TabIcon';
import { MatchesNavigator, CourtsNavigator, ProfileNavigator } from './components/stack-navigators';
import { WebSidebarNavigation } from './components/web-sidebar-navigation';
import { MOCK_MATCHES } from '@data/mockData';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_NAMES: (keyof MainTabParamList)[] = ['HomeTab', 'MatchesTab', 'CourtsTab', 'ProfileTab'];

const TabNavigator = ({
  showSidebar,
  insets,
  colors,
}: {
  showSidebar: boolean;
  insets: ReturnType<typeof useSafeAreaInsets>;
  colors: ReturnType<typeof useThemeColors>;
}) => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: showSidebar
        ? { display: 'none' }
        : {
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

export const MainNavigator = () => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { isDesktop } = useResponsive();
  const showSidebar = Platform.OS === 'web' && isDesktop;

  const unreadCount = useMemo(
    () => MOCK_MATCHES.reduce((sum, m) => sum + (m.unread_count ?? 0), 0),
    []
  );

  // Track active tab index reactively for sidebar highlighting
  const activeIndex = useNavigationState((state) => state?.index ?? 0);
  const activeTab = TAB_NAMES[activeIndex] ?? 'HomeTab';

  if (!showSidebar) {
    return <TabNavigator showSidebar={false} insets={insets} colors={colors} />;
  }

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <WebSidebarNavigation activeTab={activeTab} unreadCount={unreadCount} />
      <View style={{ flex: 1 }}>
        <TabNavigator showSidebar={true} insets={insets} colors={colors} />
      </View>
    </View>
  );
};
