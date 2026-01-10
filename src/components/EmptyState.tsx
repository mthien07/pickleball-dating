/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states (no data, errors, etc.)
 * Supports custom icons, images, and action buttons.
 *
 * Usage:
 * ```tsx
 * <EmptyState
 *   title="No Matches Yet"
 *   message="Swipe right on more profiles to get matched!"
 *   icon="💔"
 *   actionLabel="Start Swiping"
 *   onAction={handleStartSwiping}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { colors, spacing, typography } from '../theme/tokens';
import { Button } from './Button';

// ============================================
// TYPES
// ============================================

export interface EmptyStateProps {
  /**
   * Title text
   */
  title: string;

  /**
   * Description message
   */
  message?: string;

  /**
   * Icon (emoji or text) to display
   * @default '📂'
   */
  icon?: string | React.ReactNode;

  /**
   * Image source (overrides icon if provided)
   */
  image?: ImageSource;

  /**
   * Label for the action button
   */
  actionLabel?: string;

  /**
   * Handler for the action button
   */
  onAction?: () => void;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Vertical alignment
   * @default 'center'
   */
  alignment?: 'center' | 'start';
}

// ============================================
// COMPONENT
// ============================================

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '📂',
  image,
  actionLabel,
  onAction,
  style,
  alignment = 'center',
}) => {
  return (
    <View
      style={[styles.container, alignment === 'center' ? styles.centered : styles.start, style]}
    >
      {/* Visual (Image or Icon) */}
      <View style={styles.visualContainer}>
        {image ? (
          <Image source={image} style={styles.image} contentFit="contain" transition={200} />
        ) : typeof icon === 'string' ? (
          <Text style={styles.iconText}>{icon}</Text>
        ) : (
          icon
        )}
      </View>

      {/* Text Content */}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}

      {/* Action Button */}
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button title={actionLabel} onPress={onAction} variant="primary" size="medium" />
        </View>
      )}
    </View>
  );
};

// ============================================
// PRESETS
// ============================================

export const EmptyStatePresets = {
  NoMatches: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      title="No Matches Yet"
      message="Start swiping to find your pickleball partner!"
      icon="🎾"
      actionLabel="Start Swiping"
      {...props}
    />
  ),
  NoCourts: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      title="No Courts Found"
      message="Try adjusting your filters or search in a different area."
      icon="🗺️"
      {...props}
    />
  ),
  NoMessages: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      title="No Messages"
      message="You haven't started any conversations yet."
      icon="💬"
      {...props}
    />
  ),
  Error: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      title="Something Went Wrong"
      message="We couldn't load the data. Please try again."
      icon="⚠️"
      actionLabel="Retry"
      {...props}
    />
  ),
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: spacing['2xl'],
  },
  visualContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: 60, // Circle
    // Optional shadow/decoration
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  actionContainer: {
    minWidth: 200,
  },
});

export default EmptyState;
