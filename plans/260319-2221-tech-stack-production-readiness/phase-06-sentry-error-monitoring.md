# Phase 6: Sentry Error Monitoring

## Context Links
- [Production Tooling Research](./research/researcher-02-production-tooling.md) -- Section 1
- [Existing ErrorBoundary](../src/components/ErrorBoundary.tsx)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 3h
- **Depends on:** None (independent)
- **Description:** Install and configure Sentry for crash reporting with Expo SDK 54, source map upload, and error boundary integration

## Key Insights
- Two-plugin architecture: `@sentry/react-native/expo` config plugin + Sentry Metro Plugin
- Source maps auto-upload during EAS Build via config plugin
- EAS Updates need separate source map upload command
- SENTRY_AUTH_TOKEN required as env var
- Existing ErrorBoundary component can integrate with Sentry.captureException

## Requirements
**Functional:**
- Crash reports sent to Sentry dashboard
- Source maps uploaded for readable stack traces
- ErrorBoundary catches and reports unhandled React errors
- User context attached to error reports (user ID, email)
- Performance monitoring (optional, enable later)

**Non-functional:**
- < 50ms SDK init overhead
- No PII in error reports beyond user ID
- Works in production builds only (skip in __DEV__)

## Architecture
```
App startup:
  Sentry.init({ dsn, environment, release })
  --> captures unhandled JS exceptions
  --> captures native crashes
  --> uploads source maps (via EAS Build plugin)

ErrorBoundary:
  componentDidCatch --> Sentry.captureException(error)

Auth store:
  on login --> Sentry.setUser({ id, email })
  on logout --> Sentry.setUser(null)
```

## Related Code Files
**Create:**
- `src/config/sentry.ts` -- Sentry init and helpers

**Modify:**
- `app.json` / `app.config.js` -- Add Sentry expo plugin
- `metro.config.js` -- Add Sentry Metro plugin wrapper
- `App.tsx` -- Call Sentry.init() before render
- `src/components/ErrorBoundary.tsx` -- Add Sentry.captureException
- `src/stores/auth-store.ts` -- Set/clear Sentry user context

## Implementation Steps

1. Install dependencies:
   ```bash
   npx expo install @sentry/react-native
   ```

2. Create `src/config/sentry.ts`:
   ```typescript
   import * as Sentry from '@sentry/react-native';

   export const initSentry = () => {
     if (__DEV__) return;
     Sentry.init({
       dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
       environment: __DEV__ ? 'development' : 'production',
       tracesSampleRate: 0.2,
       enableAutoSessionTracking: true,
     });
   };

   export const setSentryUser = (user: { id: string; email?: string } | null) => {
     Sentry.setUser(user);
   };
   ```

3. Configure app.json Sentry plugin:
   ```json
   {
     "plugins": [
       ["@sentry/react-native/expo", {
         "url": "https://sentry.io/",
         "project": "pickleball-dating",
         "organization": "<org-slug>"
       }]
     ]
   }
   ```

4. Update metro.config.js:
   ```javascript
   const { getSentryExpoConfig } = require("@sentry/react-native/metro");
   const config = getSentryExpoConfig(__dirname);
   module.exports = config;
   ```

5. Call initSentry in App.tsx:
   - Import and call `initSentry()` at module level (before component)

6. Update ErrorBoundary:
   - Add `Sentry.captureException(error)` in error handler

7. Update auth store:
   - Call `setSentryUser({ id, email })` on login
   - Call `setSentryUser(null)` on logout

8. Set SENTRY_AUTH_TOKEN:
   - Add to `.env` for local builds
   - Add to EAS secrets for CI builds: `eas secret:create SENTRY_AUTH_TOKEN`

## Todo List
- [ ] Install @sentry/react-native
- [ ] Create src/config/sentry.ts
- [ ] Add Sentry expo plugin to app config
- [ ] Update metro.config.js with Sentry wrapper
- [ ] Call initSentry in App.tsx
- [ ] Integrate ErrorBoundary with Sentry
- [ ] Set Sentry user context in auth store
- [ ] Configure SENTRY_AUTH_TOKEN
- [ ] Test error capture in preview build
- [ ] Verify source maps resolve stack traces

## Success Criteria
- Unhandled exceptions appear in Sentry dashboard
- Stack traces show original TypeScript source (not bundled JS)
- User context attached to error reports
- No Sentry overhead in __DEV__ mode
- ErrorBoundary fallback UI shown + error reported

## Risk Assessment
- **Risk:** Source map upload fails silently in EAS Build
  - **Mitigation:** Verify SENTRY_AUTH_TOKEN is set in EAS secrets. Test with preview build first.
- **Risk:** Sentry SDK increases bundle size
  - **Mitigation:** ~200KB addition is acceptable for production crash reporting

## Security Considerations
- SENTRY_AUTH_TOKEN is a build-time secret -- never commit to git
- Only user ID and email sent to Sentry (no passwords, tokens, PII)
- DSN is public-facing (safe to commit), but use env var for flexibility
- Sentry data retention configured in Sentry dashboard

## Next Steps
- Phase 7 (EAS Build) configures SENTRY_AUTH_TOKEN in build pipeline
- Source map upload automated as part of EAS Build
