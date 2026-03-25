# Phase Implementation Report

## Executed Phase
- Phase: fix-scout-qa-round3-bugs
- Plan: /Users/ht/Desktop/pickle-ball-starter/plans/260323-1604-hinge-style-full-ui-redesign
- Status: completed

## Files Modified

| File | Change |
|------|--------|
| `src/screens/auth/signup-design/SignupScreenDesign.tsx` | Bug 1: removed `full_name` and `role` from users insert |
| `src/hooks/use-discovery-profiles.ts` | Bug 2: added profile completeness guard before recordSwipe |
| `src/screens/auth/email-signup/EmailSignupScreen.tsx` | Bug 9: live password mismatch error on confirm field |
| `src/screens/main/HomeSwipeScreen/index.tsx` | Bug 10: removed non-functional filter + notifications buttons |
| `src/screens/coach/coach-directory/CoachDirectoryScreen.tsx` | Bug 10: removed non-functional filter button |

## Tasks Completed

- [x] Bug 1: Removed `full_name` (and `role`) column from `SignupScreenDesign.tsx` users insert — these columns don't exist in the `users` table. `use-email-signup.ts` was already clean.
- [x] Bug 2: Added guard in `handleSwipe` — if authenticated user has incomplete profile (missing bio or avatar), shows toast "Hoàn thiện hồ sơ trước khi thích người khác nhé!" and returns early instead of calling recordSwipe which would hit the DB check constraint.
- [x] Bug 3: Already fixed — `LoginScreen.tsx` and `auth-password.service.ts` both use `Platform.OS === 'web'` to conditionally set `redirectTo`, omitting it on native.
- [x] Bug 4: Already fixed — `MainNavigator.tsx` computes `unreadCount` from `matches.reduce((sum, m) => sum + (m.unread_count ?? 0), 0)`, badge only shows when > 0.
- [x] Bug 5: Already exists — `settings-danger-zone-section.tsx` renders "Đăng xuất" `SettingsRow` calling `onLogout` which calls `useAuthStore.logout()`.
- [x] Bug 6: No duplication — `MOCK_COURTS` has 4 unique IDs (court_001–004), FlatList `keyExtractor={(item) => item.id}` is correct.
- [x] Bug 7: Already fixed — both `use-email-signup.ts` and `LoginScreen.tsx` validate email with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` before submitting.
- [x] Bug 8: Already fixed — `PasswordInput` in `input-variants.tsx` has `maxLength={128}` applied.
- [x] Bug 9: Added inline `error` prop on confirm password `PasswordInput` — shows "Mật khẩu không khớp" as user types when value diverges from password field.
- [x] Bug 10: Removed filter button from `HomeSwipeScreen` header (was showing "Filters coming soon" toast). Removed non-functional filter button from `CoachDirectoryScreen` header (coach filter modal not implemented). `CourtDiscoveryScreen` already has a real `CourtFilterModal`.

## Tests Status
- Type check: pass (no output from `npx tsc --noEmit`)
- Unit tests: not run (no test changes needed; existing tests don't cover these exact code paths)

## Issues Encountered
None. All changes are minimal, targeted edits.

## Next Steps
- Bug 2 guard uses bio + avatar_urls as "complete" signal. If DB has a `profile_complete` boolean column, that would be a cleaner check — worth aligning when schema is confirmed.
- Coach filter modal could be implemented in a future phase to restore the filter button.

## Unresolved Questions
- Does the `users` table have a `profile_complete` boolean? If so, Bug 2 guard should use that instead of checking bio/avatar_urls manually.
- Is `SignupScreenDesign.tsx` the active signup screen or a legacy design variant? Both it and `EmailSignupScreen.tsx` appear to be active routes.
