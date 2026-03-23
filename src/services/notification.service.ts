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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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

// Re-export badge management and messages
export {
  setBadgeCount,
  getBadgeCount,
  clearBadge,
  NotificationMessages,
} from './notification-messages';

// ============================================
// PERMISSION & REGISTRATION
// ============================================

export async function requestNotificationPermissions(): Promise<boolean> {
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

export async function registerForPushNotifications(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });
    const token = tokenData.data;

    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B5998',
      });
    }

    console.log('Push token registered:', token);
    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// ============================================
// LOCAL NOTIFICATIONS
// ============================================

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

  return Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: { type: notification.type, ...notification.data },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ============================================
// NOTIFICATION HANDLERS
// ============================================

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  return Notifications.getLastNotificationResponseAsync();
}

// ============================================
// TEST NOTIFICATION
// ============================================

export async function sendTestNotification(): Promise<void> {
  await scheduleLocalNotification(
    {
      type: 'match',
      title: 'Test Notification 🎾',
      body: 'This is a test notification from PickleBall Dating!',
    },
    1
  );
}
