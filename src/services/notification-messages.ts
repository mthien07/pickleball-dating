/**
 * Notification message templates and badge management.
 */

import * as Notifications from 'expo-notifications';
import type { NotificationData } from './notification.service';

// ============================================
// BADGE MANAGEMENT
// ============================================

export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

export async function getBadgeCount(): Promise<number> {
  return Notifications.getBadgeCountAsync();
}

export async function clearBadge(): Promise<void> {
  await Notifications.setBadgeCountAsync(0);
}

// ============================================
// COMMON NOTIFICATION MESSAGES
// ============================================

export const NotificationMessages = {
  newMatch: (name: string): NotificationData => ({
    type: 'match',
    title: 'Match mới! 🎾',
    body: `${name} đã thích bạn! Bắt đầu trò chuyện ngay.`,
  }),

  newMessage: (name: string, preview: string): NotificationData => ({
    type: 'message',
    title: name,
    body: preview.length > 50 ? preview.substring(0, 50) + '...' : preview,
  }),

  bookingConfirmed: (courtName: string, time: string): NotificationData => ({
    type: 'booking',
    title: 'Đặt sân thành công! ✅',
    body: `${courtName} - ${time}`,
  }),

  bookingReminder: (courtName: string, time: string): NotificationData => ({
    type: 'reminder',
    title: 'Nhắc nhở đặt sân 🏸',
    body: `Bạn có lịch chơi tại ${courtName} lúc ${time}`,
  }),

  promo: (title: string, body: string): NotificationData => ({
    type: 'promo',
    title,
    body,
  }),
};
