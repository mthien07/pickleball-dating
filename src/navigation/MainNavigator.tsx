import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors } from '../theme/tokens';
import {
  MainTabParamList,
  MatchesStackParamList,
  CourtsStackParamList,
  ProfileStackParamList,
} from './types';

// Real Screens
import { HomeSwipeScreen } from '../screens/main/HomeSwipeScreen';
import { CourtDiscoveryScreen } from '../screens/discovery/CourtDiscoveryScreen';
import { CoachDirectoryScreen } from '../screens/coach/CoachDirectoryScreen';
import { AnimationDemoScreen } from '../screens/demo/AnimationDemoScreen';

// Placeholders for now
import {
  MatchesListScreen,
  ChatScreen,
  MatchDetailScreen,
  RatingScreen,
  CourtDetailScreen,
  CourtBookingScreen,
  PaymentMethodScreen,
  BookingConfirmationScreen,
  ProfileMeScreen,
  EditProfileScreen,
  SettingsScreen,
  BookingHistoryScreen,
  BookingDetailScreen,
  CoachDetailScreen,
} from '../screens/placeholders';

// --- Tab Icons (Simple Text for now, replace with Icons later) ---
const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => (
  <Text style={{ color, fontSize: 24 }}>{name}</Text>
);

// --- Stacks for each Tab ---

const MatchesStack = createStackNavigator<MatchesStackParamList>();
const MatchesNavigator = () => (
  <MatchesStack.Navigator screenOptions={{ headerShown: false }}>
    <MatchesStack.Screen name="MatchesList" component={MatchesListScreen} />
    <MatchesStack.Screen name="ChatScreen" component={ChatScreen} />
    <MatchesStack.Screen name="MatchDetail" component={MatchDetailScreen} />
    <MatchesStack.Screen name="RatingScreen" component={RatingScreen} />
  </MatchesStack.Navigator>
);

const CourtsStack = createStackNavigator<CourtsStackParamList>();
const CourtsNavigator = () => (
  <CourtsStack.Navigator screenOptions={{ headerShown: false }}>
    <CourtsStack.Screen name="CourtDiscovery" component={CourtDiscoveryScreen} />
    <CourtsStack.Screen name="CourtDetail" component={CourtDetailScreen} />
    <CourtsStack.Screen name="CourtBooking" component={CourtBookingScreen} />
    <CourtsStack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
    <CourtsStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
  </CourtsStack.Navigator>
);

const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMe" component={ProfileMeScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <ProfileStack.Screen name="BookingDetail" component={BookingDetailScreen} />
    <ProfileStack.Screen name="CoachDirectory" component={CoachDirectoryScreen} />
    <ProfileStack.Screen name="CoachDetail" component={CoachDetailScreen} />
    <ProfileStack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
  </ProfileStack.Navigator>
);

// --- Main Tab Navigator ---

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeSwipeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="❤️" color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MatchesTab"
        component={MatchesNavigator}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color, focused }) => <TabIcon name="💬" color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="CourtsTab"
        component={CourtsNavigator}
        options={{
          tabBarLabel: 'Courts',
          tabBarIcon: ({ color, focused }) => <TabIcon name="🎾" color={color} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon name="👤" color={color} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
