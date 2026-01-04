import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { colors, spacing } from '../theme/tokens';

const PlaceholderScreen = ({ navigation, route }: any) => (
  <View style={styles.container}>
    <Text style={styles.text}>{route.name}</Text>
    <Button title="Go Back" onPress={() => navigation.goBack()} variant="text" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});

export const ProfileSetupScreen = PlaceholderScreen;

export const HomeSwipeScreen = PlaceholderScreen;

export const MatchesListScreen = PlaceholderScreen;
export const ChatScreen = PlaceholderScreen;
export const MatchDetailScreen = PlaceholderScreen;
export const RatingScreen = PlaceholderScreen;

export const CourtDiscoveryScreen = PlaceholderScreen;
export const CourtDetailScreen = PlaceholderScreen;
export const CourtBookingScreen = PlaceholderScreen;
export const PaymentMethodScreen = PlaceholderScreen;
export const BookingConfirmationScreen = PlaceholderScreen;

export const ProfileMeScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={styles.text}>Profile Me</Text>
    <Button 
      title="View Animation Demo" 
      onPress={() => navigation.navigate('AnimationDemo')}
      style={{ marginTop: 20 }}
    />
  </View>
);

export const EditProfileScreen = PlaceholderScreen;
export const SettingsScreen = PlaceholderScreen;
export const BookingHistoryScreen = PlaceholderScreen;
export const BookingDetailScreen = PlaceholderScreen;
export const CoachDetailScreen = PlaceholderScreen;
