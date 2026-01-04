import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/config/toastConfig';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Animated from 'react-native-reanimated';
import { useAnimation } from './src/hooks/useAnimation';

const queryClient = new QueryClient();

export default function App() {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="auto" />
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
              <RootNavigator />
            </Animated.View>
            <Toast config={toastConfig} />
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
