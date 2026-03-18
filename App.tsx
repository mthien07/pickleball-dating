import React, { useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { createToastConfig } from './src/config/toastConfig';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme, useThemeColors } from './src/contexts/ThemeContext';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import Animated from 'react-native-reanimated';
import { useAnimation } from './src/hooks/useAnimation';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import {
  queryClient,
  asyncStoragePersister,
  invalidateAllOnReconnect,
} from './src/config/queryClient';
import { OfflineIndicator, OnlineIndicator } from './src/components/OfflineIndicator';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { lightColors, darkColors } from './src/contexts/ThemeContext';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

// Setup auto-invalidation on reconnect
invalidateAllOnReconnect();

// Inner component that uses theme context
const AppContent = () => {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const toastConfig = createToastConfig(colors);
  const { animatedStyle, fadeIn, scaleIn } = useAnimation({
    initialOpacity: 0,
    initialScale: 0.98,
  });

  useEffect(() => {
    // Animate app entry
    fadeIn(800);
    scaleIn();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <RootNavigator />
      </Animated.View>
      <Toast config={toastConfig} />
      <OfflineIndicator position="top" />
      <OnlineIndicator />
    </>
  );
};

export default function App() {
  // Detect system color scheme for loading screen (before ThemeProvider)
  const systemScheme = useColorScheme();
  const loadingColors = systemScheme === 'dark' ? darkColors : lightColors;

  // Load Barlow fonts for Vibrant Sport style
  const [fontsLoaded] = useFonts({
    'Barlow-Regular': require('./assets/fonts/Barlow-Regular.ttf'),
    'Barlow-Medium': require('./assets/fonts/Barlow-Medium.ttf'),
    'Barlow-SemiBold': require('./assets/fonts/Barlow-SemiBold.ttf'),
    'Barlow-Bold': require('./assets/fonts/Barlow-Bold.ttf'),
    'BarlowCondensed-SemiBold': require('./assets/fonts/BarlowCondensed-SemiBold.ttf'),
    'BarlowCondensed-Bold': require('./assets/fonts/BarlowCondensed-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show loading while fonts are loading
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: loadingColors.background,
        }}
      >
        <ActivityIndicator size="large" color={loadingColors.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
          >
            <ThemeProvider>
              <AuthProvider>
                <AppContent />
              </AuthProvider>
            </ThemeProvider>
          </PersistQueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
