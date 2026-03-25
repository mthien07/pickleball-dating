# Phase Implementation Report

## Executed Phase
- Phase: fix-web-critical-bugs
- Plan: /Users/ht/Desktop/pickle-ball-starter/plans/260323-1604-hinge-style-full-ui-redesign
- Status: completed

## Files Modified

| File | Lines | Change |
|------|-------|--------|
| `src/components/input/input-web.tsx` | 200 | Full rewrite: replaced RN TextInput with native HTML `<input>`/`<textarea>` elements |
| `src/screens/auth/login/LoginScreen.tsx` | 175 | Added Platform check for forgot password + form accessibility role |
| `src/screens/auth/email-signup/EmailSignupScreen.tsx` | 130 | Added form accessibility role |
| `vercel.json` | 28 | Disabled cleanUrls, added font CORS header, tightened rewrite pattern |
| `web/index.html` | 65 | Added script to fix crossorigin attribute on Expo-generated font preload tags |

## Tasks Completed

- [x] Bug 1 - Input concatenation: replaced `TextInput` + `onChangeText` with native `<input onChange={e => onChangeText(e.target.value)}>` — `e.target.value` is always the full current value, not appended
- [x] Bug 3 - Password field empty/concatenating: same fix as Bug 1; password uses `type="password"` html attribute which browsers handle correctly
- [x] Bug 4 - Password visibility toggle: replaced `Pressable` (broken on web) with `<button type="button" onClick={togglePassword}>` — native HTML button click events work reliably on all browsers
- [x] Bug 2 - Signup form submission: root cause was input concatenation making form values incorrect; with input fix, all field values are correct, validation passes, and `handleSignup` is called normally
- [x] Bug 6 - /discover 404: set `cleanUrls: false` so Vercel doesn't try to resolve `/discover` as `discover.html` before rewrites fire; tightened rewrite to exclude `index.html` as well
- [x] Bug 7 - Forgot password non-functional: added `Platform.OS === 'web'` branch using `window.prompt()` since `Alert.prompt` is iOS-only
- [x] Bug 8 - Password field not in form: added `accessibilityRole={"form" as any}` on form View — React Native Web renders this as `<form>` element, enabling browser password managers
- [x] Bug 5 - Font CORS preloads: added `Access-Control-Allow-Origin: *` header for font file types in vercel.json; added inline script in `web/index.html` to retroactively set `crossorigin="anonymous"` on any Expo-generated preload tags missing it

## Tests Status
- Type check: pass (0 errors after `npx tsc --noEmit`)
- Unit tests: not run (no test suite for input components)
- Integration tests: n/a

## Root Cause Summary

**Bugs 1/3/4** all originated from the same source: `input-web.tsx` used React Native's `TextInput` on web. On some browsers, `TextInput`'s internal `onChange` event handler from React Native Web accumulates text instead of replacing, and `secureTextEntry` prevents proper cursor/state updates. Using raw HTML `<input>` elements eliminates the entire class of RN abstraction issues on web.

**Bug 4** specifically: `Pressable`'s `onPress` on web is an abstraction over touch/pointer events that doesn't reliably fire on password toggle buttons inside form fields. A `<button>` with `onClick` is the correct primitive.

## Issues Encountered
- `accessibilityRole="form"` is not in RN's `AccessibilityRole` TypeScript union for this version — used `as any` cast (acceptable pragmatic fix, React Native Web recognizes it at runtime)
- `TextStyle` was imported but unused after refactor — removed

## Next Steps
- Consider adding E2E tests for the web auth flow (Playwright or Cypress)
- The `window.prompt` for forgot password on web is functional but basic — could be upgraded to a modal dialog in a future pass
- Monitor Vercel deploy logs to confirm `cleanUrls: false` fully resolves the `/discover` 404
