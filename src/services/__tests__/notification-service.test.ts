/**
 * Notification Service Tests
 *
 * Tests push token registration, AsyncStorage persistence,
 * Android channel setup, and permission handling.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import {
  requestNotificationPermissions,
  registerForPushNotifications,
  getStoredPushToken,
  scheduleLocalNotification,
  cancelNotification,
  cancelAllNotifications,
} from '../notification.service';

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(),
  AndroidImportance: { MAX: 5 },
  AndroidNotificationPriority: { HIGH: 'high' },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}));

jest.mock('expo-constants', () => ({
  isDevice: true,
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;

const PUSH_TOKEN = 'ExponentPushToken[test-token-123]';

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Constants as any).isDevice = true;
    (Platform as any).OS = 'ios';
  });

  // ─── requestNotificationPermissions ───────────────────────────────────────

  describe('requestNotificationPermissions', () => {
    it('returns true when permission already granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);

      const result = await requestNotificationPermissions();

      expect(result).toBe(true);
      expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('requests permission when not yet granted', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'undetermined',
      } as any);
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);

      const result = await requestNotificationPermissions();

      expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('returns false when permission is denied', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'denied',
      } as any);
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'denied',
      } as any);

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
    });

    it('returns false on non-physical device', async () => {
      (Constants as any).isDevice = false;

      const result = await requestNotificationPermissions();

      expect(result).toBe(false);
      expect(mockNotifications.getPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  // ─── registerForPushNotifications ─────────────────────────────────────────

  describe('registerForPushNotifications', () => {
    beforeEach(() => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);
      mockNotifications.getExpoPushTokenAsync.mockResolvedValue({
        data: PUSH_TOKEN,
      } as any);
      mockAsyncStorage.setItem.mockResolvedValue();
    });

    it('returns push token on successful registration', async () => {
      const token = await registerForPushNotifications();

      expect(token).toBe(PUSH_TOKEN);
    });

    it('stores token in AsyncStorage', async () => {
      await registerForPushNotifications();

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@pickleball_push_token', PUSH_TOKEN);
    });

    it('sets up Android notification channel on Android', async () => {
      (Platform as any).OS = 'android';

      await registerForPushNotifications();

      expect(mockNotifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        'default',
        expect.objectContaining({ name: 'Default' })
      );
    });

    it('does not set Android channel on iOS', async () => {
      (Platform as any).OS = 'ios';

      await registerForPushNotifications();

      expect(mockNotifications.setNotificationChannelAsync).not.toHaveBeenCalled();
    });

    it('returns null when permission denied', async () => {
      mockNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'denied',
      } as any);
      mockNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'denied',
      } as any);

      const token = await registerForPushNotifications();

      expect(token).toBeNull();
    });

    it('returns null when getExpoPushTokenAsync throws', async () => {
      mockNotifications.getExpoPushTokenAsync.mockRejectedValue(new Error('Token fetch failed'));

      const token = await registerForPushNotifications();

      expect(token).toBeNull();
    });
  });

  // ─── getStoredPushToken ───────────────────────────────────────────────────

  describe('getStoredPushToken', () => {
    it('returns stored token from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(PUSH_TOKEN);

      const token = await getStoredPushToken();

      expect(token).toBe(PUSH_TOKEN);
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@pickleball_push_token');
    });

    it('returns null when no token stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const token = await getStoredPushToken();

      expect(token).toBeNull();
    });
  });

  // ─── scheduleLocalNotification ────────────────────────────────────────────

  describe('scheduleLocalNotification', () => {
    it('schedules immediate notification with null trigger', async () => {
      mockNotifications.scheduleNotificationAsync.mockResolvedValue('notif-id-1');

      const id = await scheduleLocalNotification({
        type: 'match',
        title: 'New Match!',
        body: 'You have a new match.',
      });

      expect(id).toBe('notif-id-1');
      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: null,
          content: expect.objectContaining({
            title: 'New Match!',
            body: 'You have a new match.',
          }),
        })
      );
    });

    it('schedules delayed notification with TIME_INTERVAL trigger', async () => {
      mockNotifications.scheduleNotificationAsync.mockResolvedValue('notif-id-2');

      await scheduleLocalNotification(
        { type: 'reminder', title: 'Reminder', body: 'Game in 5 min' },
        300
      );

      expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({ seconds: 300 }),
        })
      );
    });
  });

  // ─── cancelNotification / cancelAllNotifications ──────────────────────────

  describe('cancelNotification', () => {
    it('cancels specific notification', async () => {
      mockNotifications.cancelScheduledNotificationAsync.mockResolvedValue(undefined);

      await cancelNotification('notif-id-1');

      expect(mockNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('notif-id-1');
    });
  });

  describe('cancelAllNotifications', () => {
    it('cancels all scheduled notifications', async () => {
      mockNotifications.cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);

      await cancelAllNotifications();

      expect(mockNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });
});
