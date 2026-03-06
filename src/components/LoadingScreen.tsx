/**
 * LoadingScreen Component
 *
 * Full screen loading state with blur background support.
 *
 * Usage:
 * ```tsx
 * <LoadingScreen message="Loading matches..." />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../contexts/ThemeContext';

interface LoadingScreenProps {
  visible?: boolean;
  message?: string;
  overlay?: boolean; // If true, shows as a modal overlay
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  visible = true,
  message,
  overlay = false,
}) => {
  const colors = useThemeColors();
  if (!visible) {
    return null;
  }

  const Content = (
    <View style={[styles.container, overlay && styles.overlayContainer]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent animationType="fade" visible={visible}>
        {/* BlurView only works on iOS/Android if native module linked, 
            but expo-blur is standard in Expo.
            On Android it might fallback or need config.
        */}
        <BlurView intensity={20} style={StyleSheet.absoluteFill}>
          <View style={styles.modalBackground}>
            <View style={styles.card}>
              <ActivityIndicator size="large" color={colors.primary} />
              {message && <Text style={styles.cardMessage}>{message}</Text>}
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  overlayContainer: {
    backgroundColor: 'transparent',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  card: {
    padding: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 150,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  message: {
    ...typography.body,
    color: '#64748B',
    marginTop: spacing.md,
  },
  cardMessage: {
    ...typography.body,
    color: '#1E293B',
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

export default LoadingScreen;
