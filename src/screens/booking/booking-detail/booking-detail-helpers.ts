/**
 * BookingDetail - Helper functions and types
 */

import { BookingStatus } from '@data/mockData';
import type { ThemeColors } from '../../../contexts/theme-colors';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('vi-VN', options);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

export const getStatusInfo = (
  status: BookingStatus,
  colors: ThemeColors
): { label: string; color: string; bg: string; icon: string } => {
  const info: Record<BookingStatus, { label: string; color: string; bg: string; icon: string }> = {
    confirmed: {
      label: 'Đã xác nhận',
      color: colors.success,
      bg: `${colors.success}20`,
      icon: 'checkmark-circle',
    },
    completed: {
      label: 'Hoàn thành',
      color: colors.textSecondary,
      bg: colors.surface,
      icon: 'checkmark-done',
    },
    cancelled: {
      label: 'Đã hủy',
      color: colors.error,
      bg: `${colors.error}20`,
      icon: 'close-circle',
    },
  };
  return info[status];
};
