import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/tokens';
import { useAuth } from '../contexts/AuthContext';

// Simple Splash Screen
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <Text style={styles.splashText}>PickleBall Dating 🎾</Text>
    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
  </View>
);

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (__DEV__) {
    console.log('[RootNavigator] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  }

  if (isLoading) {
    if (__DEV__) {
      console.log('[RootNavigator] Showing splash screen');
    }
    return <SplashScreen />;
  }

  if (__DEV__) {
    console.log('[RootNavigator] Rendering', isAuthenticated ? 'Main' : 'Auth', 'navigator');
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
