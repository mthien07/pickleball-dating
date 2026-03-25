---
title: "Dark Mode & Runtime Bug Audit"
date: 2026-03-18
reviewer: code-reviewer
---

## Code Review Summary

### Scope
- Files reviewed: 12 source files + grep scan of full `src/`
- Focus: Dark mode color consistency, StatusBar, Ionicons on web, navigation theming
- Updated plans: N/A (audit only, no plan tasks)

---

### Overall Assessment
Navigation and most screens use `useThemeColors()` correctly. Key issues are hardcoded `StatusBar barStyle="dark-content"` across all screens (text becomes invisible in dark mode), a few hardcoded hex colors in production components, and one semi-transparent overlay using `rgba(255,255,255,0.95)` that breaks in dark mode.

---

### Critical Issues

**1. StatusBar hardcoded to `"dark-content"` everywhere**
Affects: ALL screens. In dark mode the status bar icons become invisible (dark icons on dark background).

Files (line):
- `HomeSwipeScreen/index.tsx:98,118`
- `ChatScreen.tsx:382`
- `WelcomeScreen.tsx:160`
- `MatchesListScreen.tsx:83,101`
- `CourtDiscoveryScreen.tsx:174`
- `LoginScreenDesign.tsx:62`
- `PaymentScreen.tsx:70`
- `BookingScreen.tsx:112`
- `ProfileSetupScreen.tsx:101`
- `SignupScreenDesign.tsx:146`
- `CoachDirectoryScreen.tsx:90`

Fix — replace static `barStyle` with theme-aware value in each screen:
```tsx
// Add useTheme hook import
const { isDark } = useTheme();
// Then:
<StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
```
Note: `BookingConfirmationScreen.tsx:76` and `CourtDetailScreen.tsx:50` correctly use `"light-content"` (they have full-bleed dark hero images) — leave those.

---

**2. `SwipeCard` LIKE/NOPE overlay badge: hardcoded white background**
`src/components/SwipeCard.tsx:193`
```ts
backgroundColor: 'rgba(255, 255, 255, 0.95)',  // invisible text on dark bg card
```
In dark mode the card is dark so a white badge is fine visually, but on light cards it also works — this is acceptable for an overlay on an image. **Low actual risk**, but not theme-consistent.

Fix: use `colors.surface` with opacity or keep as-is (it's overlaying a photo).

---

### High Priority Findings

**3. `LoadingScreen.tsx` — fully hardcoded colors, no theme hook**
`src/components/LoadingScreen.tsx:68,81,93,98`
```ts
backgroundColor: '#F8FAFC',  // light bg only
backgroundColor: '#FFFFFF',  // card — white in dark mode
color: '#64748B',
color: '#1E293B',
```
LoadingScreen is shown app-wide. In dark mode the card will be white on a light slate background — broken.

Fix: import `useThemeColors` and replace all hardcoded values with `colors.*`.

---

**4. `profile-me-styles.ts:183` — tagPill hardcoded light blue**
```ts
backgroundColor: '#EFF6FF',  // Blue-50 — only correct in light mode
```
In dark mode this renders a light blue pill on a dark card.

Fix: use `colors.backgroundCircle` (which maps to `#EFF6FF` in light / dark equivalent in dark).

---

**5. `profile-me-components.tsx:46-60` — `SKILL_COLORS` static map**
```ts
const SKILL_COLORS: Record<string, string> = {
  beginner: '#10B981',
  ...
};
```
These are fixed hex values, not theme tokens. In dark mode they still render (colors are saturated enough), but they bypass the theme system. Medium risk.

Fix: use `colors.skillBeginner`, `colors.skillIntermediate`, etc. (already defined on `ThemeColors`). The `getSkillLevelLabel` helper already does this correctly — the `SkillBadge` component should too.

---

**6. `KeyboardView.tsx:174` — JSDoc example has hardcoded `'#fff'`**
This is in a JSDoc comment block, not real runtime code. No fix needed.

---

### Medium Priority Improvements

**7. `HomeSwipeScreen/styles.ts:146` — like button shadow hardcoded**
```ts
shadowColor: '#F43F5E',
```
This is the accent/CTA color — acceptable as a fixed design intent (like Tinder's red glow). Not broken in dark mode, just not token-driven.

**8. `web-sidebar-navigation.tsx:150` — badge text hardcoded white**
```ts
color: '#FFFFFF',
```
Badge text on an accent-colored badge — `colors.white` would be more consistent. Low risk.

Fix: `color: colors.white`

**9. `PaymentScreen.tsx:138` — inverted gradient logic**
```ts
gradientColors={
  theme.isDark
    ? [themeColors.surface, themeColors.background]  // dark mode: correct
    : ['#1A1A2E', '#16213E']                          // light mode: dark navy (intentional card design)
}
```
This is intentional (dark credit card in light mode). No fix needed.

**10. `useRefresh.ts:138-139` — hardcoded refresh control tint**
```ts
tintColor: '#5B9FE3',
colors: ['#5B9FE3', '#A8C8E8'],
```
Not theme-aware. Low risk (refresh spinner only).

---

### Low Priority Suggestions

**11. Ionicons on web** — All Ionicons usages checked:
- `web-sidebar-navigation.tsx` — `@expo/vector-icons` with Ionicons ✓
- `HomeSwipeScreen/index.tsx` — uses Ionicons for filter/notification icons ✓
- `WelcomeScreen.tsx` — uses Ionicons for logo/social icons ✓
- `profile-me-components.tsx` — uses Ionicons ✓
- `MessageBubble` — uses Ionicons for status icons ✓

No raw SVG-incompatible usage found. `@expo/vector-icons` renders on web via SVG internally. **No web-specific Ionicons bug found.**

**12. Navigation dark mode** — Both confirmed correct:
- `web-sidebar-navigation.tsx` uses `colors.surface` for sidebar bg ✓
- `MainNavigator.tsx` tab bar uses `colors.surface`, `colors.border` ✓

---

### Positive Observations
- `chat-screen-styles.ts` — fully theme-aware, no hardcoded colors
- `message-bubble-styles.ts` — fully theme-aware ✓
- `SwipeCard` overlays use `colors.secondary`, `colors.error`, `colors.white` ✓
- Sidebar and tab bar navigation are properly themed ✓
- `SKILL_COLORS` duplicate of existing theme tokens is the only DRY violation

---

### Recommended Actions (priority order)

1. **CRITICAL** Fix `StatusBar barStyle` in all 11 files — add `useTheme()` and use `isDark ? "light-content" : "dark-content"`
2. **HIGH** Fix `LoadingScreen.tsx` — migrate to `useThemeColors()`
3. **HIGH** Fix `profile-me-styles.ts:183` tagPill background to `colors.backgroundCircle`
4. **MEDIUM** Fix `SkillBadge` in `profile-me-components.tsx` to use `colors.skillBeginner` etc. instead of `SKILL_COLORS` map
5. **LOW** Fix `web-sidebar-navigation.tsx:150` badge text to `colors.white`
6. **LOW** Fix `useRefresh.ts` tint colors to use theme tokens

---

### Metrics
- StatusBar violations: 11 files (all critical)
- Hardcoded non-theme color in production components: 4 files
- Ionicons web issues: 0
- Navigation dark mode issues: 0

### Unresolved Questions
- Does the app have a dark mode toggle exposed in UI? (ThemeContext supports it but need to confirm it's reachable by users to prioritize this work)
- `BookingConfirmationScreen` and `CourtDetailScreen` use `"light-content"` — confirm these always have dark hero image backgrounds (assumption seems correct but worth verifying)
