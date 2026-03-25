# Phase 1: Web Landing Page CTA & Navigation

## Priority: Critical
## Status: TODO

## Problem
1. "GET STARTED" button exists but is below the fold — hidden by animated cards
2. No "Login" link visible for returning users
3. No navigation bar on the onboarding screen
4. Animations delay content by 800ms+ — crawler/users see blank content

## Related Code Files
- `src/screens/auth/onboarding/OnboardingScreen.tsx` — main landing screen
- `src/screens/auth/onboarding/onboarding-styles.ts` — styles
- `src/screens/auth/onboarding/onboarding-animated-components.tsx` — animated cards
- `src/navigation/AuthNavigator.tsx` — auth navigation

## Implementation Steps

### 1. Add web-specific top navigation bar to OnboardingScreen
- Show on `Platform.OS === 'web'` only
- Contains: Logo (left), "Login" button (right)
- Transparent over the gradient background
- No need for full nav — just brand + login link

### 2. Move CTA buttons above the cards section
- Reorder layout: Logo → Title → Subtitle → **CTA Buttons** → Cards
- Currently: Logo → Title → Subtitle → Cards → CTA (below fold)
- This ensures "GET STARTED" and "Login" are immediately visible

### 3. Add a "Login" text link next to or below GET STARTED
- "Already have an account? Log in" below GET STARTED button
- Links to LoginScreen

### 4. Reduce animation delays for web
- Web: reduce delays to 0-200ms (instant feel)
- Mobile: keep existing staggered delays
- Platform.OS check in delay values

### 5. Ensure cards section is still visible but doesn't push CTA below fold
- Reduce card section height on web
- Or make it a background decoration behind the CTA area

## Todo List
- [ ] Add "Login" link to onboarding screen
- [ ] Move CTA buttons above cards section
- [ ] Reduce animation delays on web
- [ ] Add "Already have an account?" text
- [ ] Test on desktop (1440px) and mobile web (390px)

## Success Criteria
- GET STARTED button visible above the fold on 1440x900
- Login link visible without scrolling
- Page loads with visible content within 500ms
