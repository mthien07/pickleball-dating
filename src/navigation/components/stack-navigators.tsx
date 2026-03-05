/**
 * Stack navigators for each tab section
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { MatchesStackParamList, CourtsStackParamList, ProfileStackParamList } from '../types';

// Matches Screens
import { MatchesListScreen } from '../../screens/matches/MatchesListScreen';
import { ChatScreen } from '../../screens/matches/ChatScreen';
import { MatchDetailScreen } from '../../screens/matches/MatchDetailScreen';
import { RatingScreen } from '../../screens/matches/RatingScreen';

// Court Screens
import { CourtDiscoveryScreen } from '../../screens/discovery/CourtDiscoveryScreen';
import { CourtDetailScreen } from '../../screens/court/CourtDetailScreen';
import { BookingScreen } from '../../screens/court/BookingScreen';
import { PaymentScreen } from '../../screens/court/PaymentScreen';
import { BookingConfirmationScreen } from '../../screens/court/BookingConfirmationScreen';

// Booking Screens
import { BookingHistoryScreen } from '../../screens/booking/BookingHistoryScreen';
import { BookingDetailScreen } from '../../screens/booking/BookingDetailScreen';

// Coach Screens
import { CoachDirectoryScreen } from '../../screens/coach/CoachDirectoryScreen';
import { CoachDetailScreen } from '../../screens/coach/CoachDetailScreen';

// Profile Screens
import { ProfileMeScreen } from '../../screens/profile/ProfileMeScreen';
import { EditProfileScreen } from '../../screens/profile/EditProfileScreen';
import { SettingsScreen } from '../../screens/profile/SettingsScreen';
import { ProfileSetupScreen } from '../../screens/auth/ProfileSetupScreen';
import { AnimationDemoScreen } from '../../screens/demo/AnimationDemoScreen';

const MatchesStack = createStackNavigator<MatchesStackParamList>();
export const MatchesNavigator = () => (
  <MatchesStack.Navigator screenOptions={{ headerShown: false }}>
    <MatchesStack.Screen name="MatchesList" component={MatchesListScreen} />
    <MatchesStack.Screen name="ChatScreen" component={ChatScreen} />
    <MatchesStack.Screen name="MatchDetail" component={MatchDetailScreen} />
    <MatchesStack.Screen name="RatingScreen" component={RatingScreen} />
  </MatchesStack.Navigator>
);

const CourtsStack = createStackNavigator<CourtsStackParamList>();
export const CourtsNavigator = () => (
  <CourtsStack.Navigator screenOptions={{ headerShown: false }}>
    <CourtsStack.Screen name="CourtDiscovery" component={CourtDiscoveryScreen} />
    <CourtsStack.Screen name="CourtDetail" component={CourtDetailScreen} />
    <CourtsStack.Screen name="CourtBooking" component={BookingScreen} />
    <CourtsStack.Screen name="PaymentMethod" component={PaymentScreen} />
    <CourtsStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
  </CourtsStack.Navigator>
);

const ProfileStack = createStackNavigator<ProfileStackParamList>();
export const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMe" component={ProfileMeScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <ProfileStack.Screen name="BookingDetail" component={BookingDetailScreen} />
    <ProfileStack.Screen name="CoachDirectory" component={CoachDirectoryScreen} />
    <ProfileStack.Screen name="CoachDetail" component={CoachDetailScreen} />
    <ProfileStack.Screen name="AnimationDemo" component={AnimationDemoScreen} />
  </ProfileStack.Navigator>
);
