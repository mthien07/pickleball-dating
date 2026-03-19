/**
 * Sentry Configuration -- crash reporting and performance monitoring.
 * Only active in production (__DEV__ === false).
 */

import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
  if (__DEV__) {
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn('[Sentry] Missing EXPO_PUBLIC_SENTRY_DSN, skipping init');
    return;
  }

  Sentry.init({
    dsn,
    environment: 'production',
    tracesSampleRate: 0.2,
    enableAutoSessionTracking: true,
  });
};

export const setSentryUser = (user: { id: string; email?: string } | null) => {
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email });
  } else {
    Sentry.setUser(null);
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (__DEV__) {
    console.error('[Sentry] Would capture:', error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
};
