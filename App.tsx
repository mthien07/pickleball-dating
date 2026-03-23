import React, { useEffect, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { createToastConfig } from './src/config/toastConfig';
import { StatusBar } from 'expo-status-bar';
import { initAuthListener } from './src/stores/auth-store';
import { initSentry } from './src/config/sentry';
import { initAnalytics } from './src/config/analytics';
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
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { lightColors, darkColors } from './src/contexts/ThemeContext';

initSentry();
initAnalytics();
SplashScreen.preventAutoHideAsync();
invalidateAllOnReconnect();
initAuthListener();

const AppContent = () => {
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const toastConfig = createToastConfig(colors);
  const { animatedStyle, fadeIn, scaleIn } = useAnimation({
    initialOpacity: 0,
    initialScale: 0.98,
  });

  useEffect(() => {
    fadeIn(800);
    scaleIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
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
  const systemScheme = useColorScheme();
  const loadingColors = systemScheme === 'dark' ? darkColors : lightColors;

  const [fontsLoaded] = useFonts({
    'Barlow-Regular': require('./assets/fonts/Barlow-Regular.ttf'),
    'Barlow-Medium': require('./assets/fonts/Barlow-Medium.ttf'),
    'Barlow-SemiBold': require('./assets/fonts/Barlow-SemiBold.ttf'),
    'Barlow-Bold': require('./assets/fonts/Barlow-Bold.ttf'),
    'BarlowCondensed-SemiBold': require('./assets/fonts/BarlowCondensed-SemiBold.ttf'),
    'BarlowCondensed-Bold': require('./assets/fonts/BarlowCondensed-Bold.ttf'),
    'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
    'PlayfairDisplay-Italic': require('./assets/fonts/PlayfairDisplay-Italic.ttf'),
    Ionicons: require('./assets/fonts/Ionicons.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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
              <AppContent />
            </ThemeProvider>
          </PersistQueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
