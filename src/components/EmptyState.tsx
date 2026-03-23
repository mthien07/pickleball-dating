/**
 * EmptyState Component
 *
 * Reusable component for displaying empty states (no data, errors, etc.)
 * Supports custom icons (Lucide SVG), images, and action buttons.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { Heart, MapPin, MessageCircle, AlertTriangle, FolderOpen } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../contexts/ThemeContext';
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
   * Icon (Lucide component or ReactNode) to display
   * @default FolderOpen icon
   */
  icon?: React.ReactNode;

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

const DefaultIcon = () => {
  const colors = useThemeColors();
  return <FolderOpen size={48} color={colors.textTertiary} />;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
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
        ) : (
          icon || <DefaultIcon />
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
  NoMatches: (props: Partial<EmptyStateProps>) => {
    const themeColors = useThemeColors();
    return (
      <EmptyState
        title="Chưa Có Kết Quả"
        message="Vuốt để tìm bạn chơi pickleball!"
        icon={<Heart size={48} color={themeColors.accent} />}
        actionLabel="Bắt Đầu"
        {...props}
      />
    );
  },
  NoCourts: (props: Partial<EmptyStateProps>) => {
    const themeColors = useThemeColors();
    return (
      <EmptyState
        title="Không Tìm Thấy Sân"
        message="Thử điều chỉnh bộ lọc hoặc tìm ở khu vực khác."
        icon={<MapPin size={48} color={themeColors.primary} />}
        {...props}
      />
    );
  },
  NoMessages: (props: Partial<EmptyStateProps>) => {
    const themeColors = useThemeColors();
    return (
      <EmptyState
        title="Chưa Có Tin Nhắn"
        message="Bạn chưa bắt đầu cuộc trò chuyện nào."
        icon={<MessageCircle size={48} color={themeColors.primary} />}
        {...props}
      />
    );
  },
  Error: (props: Partial<EmptyStateProps>) => {
    const themeColors = useThemeColors();
    return (
      <EmptyState
        title="Đã Xảy Ra Lỗi"
        message="Không thể tải dữ liệu. Vui lòng thử lại."
        icon={<AlertTriangle size={48} color={themeColors.warning} />}
        actionLabel="Thử Lại"
        {...props}
      />
    );
  },
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
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontFamily: 'PlayfairDisplay-Bold',
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
