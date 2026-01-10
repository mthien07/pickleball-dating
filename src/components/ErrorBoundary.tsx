/**
 * ErrorBoundary Component
 *
 * Catches errors in component tree and shows fallback UI
 * Prevents app from crashing with white screen
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to crash reporting service (Sentry, etc.)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
            {/* Error Icon with Animation */}
            <Animated.View entering={SlideInDown.springify().delay(200)}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={80} color={colors.error} />
              </View>
            </Animated.View>

            {/* Error Message */}
            <Animated.View entering={FadeIn.delay(400)}>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                Don't worry, it's not your fault. Try restarting the app.
              </Text>
            </Animated.View>

            {/* Error Details (Development only) */}
            {__DEV__ && this.state.error && (
              <Animated.View entering={FadeIn.delay(600)} style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details:</Text>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              </Animated.View>
            )}

            {/* Reset Button */}
            <Animated.View entering={SlideInDown.delay(800).springify()}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleReset}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    width: '100%',
  },
  errorTitle: {
    ...typography.label,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    fontFamily: 'monospace',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
});

export default ErrorBoundary;
