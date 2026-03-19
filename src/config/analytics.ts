/**
 * Analytics Service -- abstraction layer for PostHog tracking.
 * Add EXPO_PUBLIC_POSTHOG_API_KEY to .env to activate.
 */

import PostHog from 'posthog-react-native';

let posthog: PostHog | null = null;

export const initAnalytics = () => {
  if (__DEV__) {
    return;
  }

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  if (!apiKey) {
    console.warn('[Analytics] Missing EXPO_PUBLIC_POSTHOG_API_KEY, skipping init');
    return;
  }

  posthog = new PostHog(apiKey, {
    host: 'https://app.posthog.com',
  });
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (__DEV__) {
    return;
  }
  posthog?.identify(userId, properties);
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (__DEV__) {
    console.log('[Analytics]', event, properties);
    return;
  }
  posthog?.capture(event, properties);
};

export const resetAnalytics = () => {
  posthog?.reset();
};

export const AnalyticsEvents = {
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_COMPLETED: 'profile_completed',
  SWIPE_LIKE: 'swipe_like',
  SWIPE_PASS: 'swipe_pass',
  MATCH_CREATED: 'match_created',
  COURT_VIEWED: 'court_viewed',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  MESSAGE_SENT: 'message_sent',
  CHAT_OPENED: 'chat_opened',
} as const;
