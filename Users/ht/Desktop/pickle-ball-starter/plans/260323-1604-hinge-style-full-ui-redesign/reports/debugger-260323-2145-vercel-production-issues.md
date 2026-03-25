# Debug Report: Vercel Production Issues
**Date:** 2026-03-23 21:45
**URL:** https://pickleball-dating.vercel.app/

---

## Executive Summary

3 issues confirmed from Scout QA report. Root causes identified across Vercel config, Supabase initialization, and ErrorBoundary. No 404 on assets — fonts ARE present in dist. The primary crash risk is the `throw new Error` in `supabase.ts` at module-load time if env vars are missing on Vercel.

---

## Issue 1: Asset 404s — PARTIALLY RESOLVED, RISK REMAINS

**Status:** Fonts present in dist, but Vercel cache headers misconfigured for the actual asset path.

**Finding:**
- Fonts are at `dist/assets/assets/fonts/*.ttf` (double-nested `assets/assets/`)
- Bundle references them as `/assets/assets/fonts/...` — correct for serving from `dist/` root
- Assets physically exist: confirmed via glob

**Actual root cause of any 404s:**
`vercel.json` cache header rule targets `/static/(.*)` but Expo web assets are served from `/_expo/static/(.*)` and `/assets/(.*)`. The long-cache header **never applies** to the actual asset paths.

**File:** `/Users/ht/Desktop/pickle-ball-starter/vercel.json` line 14

```json
// CURRENT (wrong path pattern)
"source": "/static/(.*)"

// SHOULD BE
"source": "/(assets|_expo/static)/(.*)"
```

**Impact:** Assets load (no 404) but with no cache headers → slower repeat loads, Lighthouse penalty. If Vercel ever changes default behavior, assets could 404.

---

## Issue 2: Console Errors on Page Load — CRITICAL (App-Crashing)

**Status:** Confirmed critical. Will crash app on Vercel if env vars not set.

**Root cause:** `src/services/supabase.ts` lines 20–25 throws unconditionally at module load time if env vars are missing:

```ts
// supabase.ts lines 20-25 — THROWS at import time
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables...'
  );
}
```

**Good news:** Build-time check confirms env vars ARE inlined into the bundle (`dist/_expo/static/js/web/AppEntry-*.js` line 14428 contains the actual URL `https://ytwcalyalpnmnqsmoilt.supabase.co` and the anon key). So this only crashes if Vercel deployment was done WITHOUT the env vars set in Vercel dashboard.

**Verification needed:** Check Vercel project settings → Environment Variables for `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

**Additional console errors at load:**
- `initSentry()` — called at module level in `App.tsx` line 27, before any React tree. On web, `@sentry/react-native` may not initialize cleanly.
- `initAnalytics()` — PostHog React Native on web may emit console warnings.
- `NetInfo.addEventListener` — `@react-native-community/netinfo` may log errors on web before polyfills load.

**Fix for Supabase:** Change throw to warn-and-continue so app doesn't crash:

```ts
// src/services/supabase.ts — safer pattern
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing env vars. App will not connect to backend.');
}

export const supabase = createClient<Database>(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  { ... }
);
```

---

## Issue 3: 5 Medium-Severity Issues

### 3a. ErrorBoundary Does NOT Wrap Supabase Init

`supabase.ts` is imported at module level, before React renders. The `ErrorBoundary` in `App.tsx` (line 99) only catches errors inside the React tree — it cannot catch the `throw` from `supabase.ts` which happens at JS module evaluation time. If the throw fires, the entire page goes blank with no fallback UI.

**File:** `src/services/supabase.ts` lines 20–25
**Fix:** Remove the throw, replace with graceful degradation (see Issue 2 fix above).

### 3b. Vercel SPA Rewrite — Works but Overly Broad

`vercel.json` has `"source": "/(.*)"` which rewrites ALL paths (including `/_expo/static/...` and `/assets/...`) to `index.html`. Vercel processes rewrites after static file serving so assets are served correctly, but this is fragile.

**File:** `/Users/ht/Desktop/pickle-ball-starter/vercel.json` line 9
**Fix:** Scope the rewrite to avoid asset paths:

```json
"rewrites": [
  {
    "source": "/((?!_expo|assets|favicon).*)",
    "destination": "/index.html"
  }
]
```

### 3c. `web/index.html` Meta Tags Not Preserved in `dist/index.html`

`web/index.html` (source template) has full SEO meta tags (OG, Twitter, keywords, canonical, aria attributes). `dist/index.html` (generated) is missing:
- `og:type`, `og:site_name`, `og:url`, `og:description`
- Twitter card meta tags
- `keywords`, `author` meta tags
- `aria-label` on `#root` div
- Dark mode flash-prevention `<style>` block

**Root cause:** Expo web bundler does not merge `web/index.html` custom content into `dist/index.html` — it generates a minimal HTML shell.

**Files:** `web/index.html` vs `dist/index.html`
**Fix:** The `web/index.html` IS the template Expo should use. Ensure `app.json` `web.output` is configured, or use a post-build script to copy template content. This requires investigation of the Expo web build config.

### 3d. `ErrorBoundary` Uses `expo-haptics` on Web

`src/components/ErrorBoundary.tsx` line 12 imports `expo-haptics`. On web, haptics silently fail but emit warnings. More critically, `componentDidCatch` calls `Haptics.notificationAsync(...)` synchronously — if the haptics module fails hard on web it could prevent the error UI from rendering.

**File:** `src/components/ErrorBoundary.tsx` lines 12, 90–91
**Fix:** Guard haptics calls with platform check:

```ts
import { Platform } from 'react-native';

componentDidCatch(error, errorInfo) {
  captureException(error, { componentStack: errorInfo.componentStack });
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}
```

### 3e. `__DEV__` Flag in Production Web Bundle

`RootNavigator.tsx` line 46 and `auth-store.ts` lines 73–75 use `__DEV__` guards for console.log. Confirmed in bundle — `__DEV__` is properly replaced at build time (minifier handles it). Not a bug but worth noting logs are stripped in prod build.

---

## Priority Action Plan

| Priority | Issue | File | Action |
|----------|-------|------|--------|
| P0 | Supabase throw crashes app | `src/services/supabase.ts:20-25` | Replace throw with console.error + empty string fallback |
| P1 | Vercel cache headers wrong path | `vercel.json:14` | Fix source pattern to `/(assets\|_expo/static)/(.*)` |
| P1 | SPA rewrite too broad | `vercel.json:9` | Scope rewrite to exclude asset paths |
| P2 | ErrorBoundary haptics on web | `src/components/ErrorBoundary.tsx:90-91` | Add Platform.OS !== 'web' guard |
| P2 | dist/index.html missing SEO | Build config | Investigate Expo template HTML merging |

---

## Unresolved Questions

1. Are `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` set in the Vercel dashboard environment variables? (The current dist bundle has them baked in, so the last deploy was fine — but future deploys from CI need them set.)
2. The current `dist/` in the repo appears to be a stale build (the git status shows `dist/_expo/static/js/web/AppEntry-5f82a2d87ca13cc7cc09b3b2fbc688b0.js` deleted, replaced by `AppEntry-d10e7f8e783640e31b0bf7ad53cd7d0b.js`). Is Vercel building from source or deploying the committed `dist/` folder?
3. What specific console errors are being reported by Scout QA? The above analysis covers likely candidates but exact error messages would confirm root cause order.
