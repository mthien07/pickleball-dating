// src/navigation/types.ts

import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Onboarding: undefined;
  LoginRegister: undefined;
  Login: undefined;
  EmailSignup: undefined;
  PhoneSignup: undefined;
  ProfileSetup: { step?: number };
  SignupDesign: undefined;
  LoginDesign: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  MatchesTab: undefined;
  CourtsTab: undefined;
  ProfileTab: undefined;
};

export type MatchesStackParamList = {
  MatchesList: undefined;
  ChatScreen: { matchId: string; userId: string };
  MatchDetail: { userId: string };
  RatingScreen: { userId: string; matchId: string };
};

export type CourtsStackParamList = {
  CourtDiscovery: { searchQuery?: string };
  CourtDetail: { courtId: string };
  CourtBooking: { courtId: string };
  PaymentMethod: { bookingData: any }; // Replace 'any' with specific BookingData type later
  BookingConfirmation: { bookingId: string };
};

export type ProfileStackParamList = {
  ProfileMe: undefined;
  EditProfile: undefined;
  Settings: undefined;
  BookingHistory: undefined;
  BookingDetail: { bookingId: string };
  CoachDirectory: undefined;
  CoachDetail: { coachId: string };
  AnimationDemo: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
