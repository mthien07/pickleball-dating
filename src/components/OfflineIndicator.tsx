/**
 * OfflineIndicator Component
 *
 * Shows a banner when the app is offline
 * Provides visual feedback about network status
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { WifiOff, Wifi } from 'lucide-react-native';
import { useOfflineIndicator } from '../hooks/useOfflineQuery';
import { colors, spacing, typography } from '../theme/tokens';

// ============================================
// TYPES
// ============================================

export interface OfflineIndicatorProps {
  /**
   * Show at top or bottom of screen
   * @default 'top'
   */
  position?: 'top' | 'bottom';
}

// ============================================
// COMPONENT
// ============================================

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
}) => {
  const { shouldShowOfflineBanner, networkType, isWifi } = useOfflineIndicator();

  // Animation values
  const translateY = useSharedValue(position === 'top' ? -100 : 100);
  const opacity = useSharedValue(0);

  // Animate banner in/out
  useEffect(() => {
    if (shouldShowOfflineBanner) {
      // Show banner
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Hide banner
      translateY.value = withSpring(position === 'top' ? -100 : 100, { damping: 15 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [shouldShowOfflineBanner, position]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!shouldShowOfflineBanner) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.top : styles.bottom,
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <WifiOff size={16} color={colors.background} />
        <Text style={styles.text}>You're offline</Text>
        <Text style={styles.subtext}>Some features may be limited</Text>
      </View>
    </Animated.View>
  );
};

// ============================================
// ONLINE INDICATOR (Optional)
// ============================================

/**
 * Shows when connection is restored
 */
export const OnlineIndicator: React.FC = () => {
  const { shouldShowOfflineBanner } = useOfflineIndicator();
  const [wasOffline, setWasOffline] = React.useState(false);
  const [showReconnected, setShowReconnected] = React.useState(false);

  useEffect(() => {
    if (shouldShowOfflineBanner) {
      setWasOffline(true);
    } else if (wasOffline) {
      // Just reconnected
      setShowReconnected(true);
      setWasOffline(false);

      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [shouldShowOfflineBanner, wasOffline]);

  if (!showReconnected) {
    return null;
  }

  return (
    <View style={[styles.container, styles.top, styles.online]}>
      <View style={styles.content}>
        <Wifi size={16} color={colors.background} />
        <Text style={styles.text}>Back online!</Text>
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  top: {
    top: 0,
    paddingTop: spacing.xl,
  },

  bottom: {
    bottom: 0,
    paddingBottom: spacing.xl,
  },

  online: {
    backgroundColor: colors.success,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  text: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },

  subtext: {
    ...typography.bodySmall,
    color: colors.background,
    opacity: 0.9,
  },
});

export default OfflineIndicator;
