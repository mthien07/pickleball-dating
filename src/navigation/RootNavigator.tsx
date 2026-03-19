import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColors } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../contexts/theme-colors';
import { useAuthStore } from '../stores/auth-store';

// Simple Splash Screen
const SplashScreen = () => {
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>PickleBall Dating 🎾</Text>
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  // Always log for debugging navigation issues
  console.log('[RootNavigator] State:', { isLoading, isAuthenticated });

  if (isLoading) {
    console.log('[RootNavigator] Showing splash screen...');
    return <SplashScreen />;
  }

  console.log('[RootNavigator] Rendering:', isAuthenticated ? 'MainNavigator' : 'AuthNavigator');

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
