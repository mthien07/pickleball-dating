/**
 * Notification Service
 *
 * Handles push notifications using expo-notifications.
 * Includes permission request, token registration, and notification handlers.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// ============================================
// CONFIGURATION
// ============================================

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Storage key for push token
const PUSH_TOKEN_KEY = '@pickleball_push_token';

// ============================================
// TYPES
// ============================================

export interface NotificationData {
  type: 'match' | 'message' | 'booking' | 'reminder' | 'promo';
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// ============================================
// PERMISSION & REGISTRATION
// ============================================

/**
 * Request notification permissions
 * @returns Permission status
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Check if running on a physical device
  if (!Constants.isDevice) {
    console.warn('Push notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  return true;
}

/**
 * Register for push notifications and get Expo push token
 * @returns Expo push token or null
 */
export async function registerForPushNotifications(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    return null;
  }

  try {
    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    const token = tokenData.data;

    // Save token locally
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#F97316',
      });
    }

    console.log('Push token registered:', token);
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Get stored push token
 */
export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// ============================================
// LOCAL NOTIFICATIONS
// ============================================

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  notification: NotificationData,
  triggerSeconds: number = 0
): Promise<string> {
  const trigger: Notifications.NotificationTriggerInput =
    triggerSeconds > 0
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
          repeats: false,
        }
      : null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: {
        type: notification.type,
        ...notification.data,
      },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });

  return id;
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ============================================
// NOTIFICATION HANDLERS
// ============================================

/**
 * Add listener for received notifications (app in foreground)
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add listener for notification responses (user tapped notification)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get last notification response (for cold start from notification)
 */
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return Notifications.getLastNotificationResponseAsync();
}

// ============================================
// BADGE MANAGEMENT
// ============================================

/**
 * Set app badge count
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Get current badge count
 */
export async function getBadgeCount(): Promise<number> {
  return Notifications.getBadgeCountAsync();
}

/**
 * Clear badge
 */
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

// ============================================
// TEST NOTIFICATION
// ============================================

/**
 * Send a test notification (for development)
 */
export async function sendTestNotification(): Promise<void> {
  await scheduleLocalNotification(
    {
      type: 'match',
      title: 'Test Notification 🎾',
      body: 'This is a test notification from PickleBall Dating!',
    },
    1 // Trigger after 1 second
  );
}
