/**
 * useNotifications Hook
 *
 * React hook for managing push notifications lifecycle.
 * Handles registration, listeners, and navigation from notifications.
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
} from '../services/notification.service';

interface UseNotificationsOptions {
  /** Whether to auto-register on mount */
  autoRegister?: boolean;
  /** Callback when notification received in foreground */
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  /** Callback when notification tapped */
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}

interface UseNotificationsReturn {
  /** Expo push token */
  pushToken: string | null;
  /** Whether notification permission is granted */
  hasPermission: boolean;
  /** Whether currently registering */
  isRegistering: boolean;
  /** Last notification response */
  lastResponse: Notifications.NotificationResponse | null;
  /** Manually register for notifications */
  register: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { autoRegister = true, onNotificationReceived, onNotificationResponse } = options;

  const [pushToken, setPushToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [lastResponse, setLastResponse] = useState<Notifications.NotificationResponse | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const handleNotificationNavigation = (data: Record<string, unknown>) => {
    if (!navigation) {
      return;
    }

    const type = data.type as string;

    switch (type) {
      case 'match':
        navigation.navigate('MatchesTab');
        break;
      case 'message':
        if (data.matchId) {
          navigation.navigate('MatchesTab', {
            screen: 'ChatScreen',
            params: { matchId: data.matchId },
          });
        }
        break;
      case 'booking':
        navigation.navigate('ProfileTab', {
          screen: 'BookingHistory',
        });
        break;
      default:
        break;
    }
  };

  // Register for push notifications
  const register = async () => {
    setIsRegistering(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setPushToken(token);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Failed to register for notifications:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    // Auto-register if enabled
    if (autoRegister) {
      register();
    }

    // Check for notification that opened the app
    getLastNotificationResponse().then((response) => {
      if (response) {
        setLastResponse(response);
        const data = response.notification.request.content.data;
        handleNotificationNavigation(data);
      }
    });

    // Listen for notifications when app is in foreground
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    });

    // Listen for notification taps
    responseListener.current = addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      setLastResponse(response);

      const data = response.notification.request.content.data;
      handleNotificationNavigation(data);

      onNotificationResponse?.(response);
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    pushToken,
    hasPermission,
    isRegistering,
    lastResponse,
    register,
  };
}

export default useNotifications;
