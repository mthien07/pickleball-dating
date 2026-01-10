import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
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

// Setup auto-invalidation on reconnect
invalidateAllOnReconnect();

// Inner component that uses theme context
const AppContent = () => {
  const { isDark } = useTheme();
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
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
