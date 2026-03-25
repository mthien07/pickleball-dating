# Phase 8: Analytics (PostHog)

## Context Links
- [Production Tooling Research](./research/researcher-02-production-tooling.md) -- Section 3

## Overview
- **Priority:** P2
- **Status:** pending
- **Effort:** 3h
- **Depends on:** None (independent)
- **Description:** Install PostHog React Native SDK, create analytics service module, add event tracking for key user actions

## Key Insights
- PostHog cheapest option: $180-900/mo at scale vs $2K+ for Mixpanel/Amplitude
- No per-seat fees -- good for small team
- Self-hostable option (skip for MVP, adds DevOps overhead)
- React Native SDK available with autocapture
- Feature flags included (useful for gradual rollouts)

## Requirements
**Functional:**
- Track key user events: sign_up, login, swipe, match, booking, message_sent
- Identify users after login (link anonymous -> authenticated)
- Screen view tracking (automatic via navigation)
- Feature flag support (for future use)

**Non-functional:**
- Skip tracking in __DEV__ mode
- Batch events to reduce network calls
- < 100KB SDK size addition

## Architecture
```
App startup:
  PostHog.init(apiKey, { host })

User events:
  Screen --> analytics.track('swipe', { direction, profileId })
                |
                +--> PostHog SDK --> PostHog Cloud
                      (batched, async)

Auth flow:
  login --> PostHog.identify(userId, { email, name })
  logout --> PostHog.reset()
```

## Related Code Files
**Create:**
- `src/config/analytics.ts` -- PostHog init + typed event tracking helpers

**Modify:**
- `App.tsx` -- Init PostHog on startup
- `src/stores/auth-store.ts` -- identify/reset on login/logout

**Add tracking calls (future, not in initial scope):**
- Screens with key actions (swipe, booking, message) -- add incrementally

## Implementation Steps

1. Install PostHog:
   ```bash
   npx expo install posthog-react-native
   ```

2. Create `src/config/analytics.ts`:
   ```typescript
   import PostHog from 'posthog-react-native';

   let posthog: PostHog | null = null;

   export const initAnalytics = async () => {
     if (__DEV__) return;
     posthog = await PostHog.initAsync(
       process.env.EXPO_PUBLIC_POSTHOG_KEY!,
       { host: 'https://app.posthog.com' }
     );
   };

   export const track = (event: string, properties?: Record<string, any>) => {
     posthog?.capture(event, properties);
   };

   export const identify = (userId: string, traits?: Record<string, any>) => {
     posthog?.identify(userId, traits);
   };

   export const resetAnalytics = () => {
     posthog?.reset();
   };
   ```

3. Init in App.tsx:
   - Call `initAnalytics()` at module level or in useEffect

4. Integrate with auth store:
   - On login: `identify(user.id, { email: user.email })`
   - On logout: `resetAnalytics()`

5. Add initial event tracking for core actions:
   - `sign_up` -- after successful registration
   - `login` -- after successful auth
   - `swipe` -- in discovery hook mutation
   - `match_created` -- when swipe results in match
   - `booking_created` -- after successful booking

6. Add EXPO_PUBLIC_POSTHOG_KEY to environment:
   - `.env` for local
   - EAS secrets for builds

## Todo List
- [ ] Install posthog-react-native
- [ ] Create src/config/analytics.ts
- [ ] Init PostHog in App.tsx
- [ ] Integrate identify/reset in auth store
- [ ] Add tracking for 5 core events
- [ ] Set PostHog API key in env vars / EAS secrets
- [ ] Verify events appear in PostHog dashboard

## Success Criteria
- Events visible in PostHog dashboard
- Users identified with correct user ID
- No tracking in __DEV__ mode
- Analytics module < 40 lines
- Core user journey trackable: signup -> swipe -> match -> book

## Risk Assessment
- **Risk:** PostHog SDK init blocks app startup
  - **Mitigation:** `initAsync` is non-blocking. App renders before analytics ready.
- **Risk:** Event spam from rapid swipes
  - **Mitigation:** PostHog batches events automatically. Rate limiting not needed.

## Security Considerations
- PostHog API key is write-only (cannot read data) -- safe in client
- Do not track PII beyond user ID and email
- GDPR: PostHog supports EU hosting and data deletion API
- Add opt-out mechanism before app store submission (future)

## Next Steps
- Add screen view tracking via navigation state listener
- Enable PostHog feature flags for A/B testing
- Add funnel analysis dashboards in PostHog
