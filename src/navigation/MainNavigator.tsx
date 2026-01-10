import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing, iconSizes } from '../theme/tokens';
import { shadows } from '../theme/shadows';
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

// Matches Screens
import { MatchesListScreen } from '../screens/matches/MatchesListScreen';
import { ChatScreen } from '../screens/matches/ChatScreen';
import { MatchDetailScreen } from '../screens/matches/MatchDetailScreen';
import { RatingScreen } from '../screens/matches/RatingScreen';

// Court Screens
import { CourtDetailScreen } from '../screens/court/CourtDetailScreen';
import { BookingScreen } from '../screens/court/BookingScreen';
import { PaymentScreen } from '../screens/court/PaymentScreen';
import { BookingConfirmationScreen } from '../screens/court/BookingConfirmationScreen';

// Booking Screens
import { BookingHistoryScreen } from '../screens/booking/BookingHistoryScreen';
import { BookingDetailScreen } from '../screens/booking/BookingDetailScreen';

// Coach Screens
import { CoachDetailScreen } from '../screens/coach/CoachDetailScreen';

// Profile Screens
import { ProfileMeScreen } from '../screens/profile/ProfileMeScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';

// --- Animated Tab Icon Component ---
interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}

const TabIcon = ({ name, color, focused, size = iconSizes.md }: TabIconProps) => {
  const scale = useSharedValue(focused ? 1.1 : 0.9);
  const opacity = useSharedValue(focused ? 1 : 0.6);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(0.6, { duration: 200 });
    }
  }, [focused, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

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
    <CourtsStack.Screen name="CourtBooking" component={BookingScreen} />
    <CourtsStack.Screen name="PaymentMethod" component={PaymentScreen} />
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
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          paddingTop: spacing.sm,
          ...shadows.elevated,
          elevation: 8,
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
};
