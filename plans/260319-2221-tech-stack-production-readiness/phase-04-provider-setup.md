# Phase 4: Provider Setup Restructure

## Context Links
- [Current App.tsx](../App.tsx)
- Phase 1 (auth store), Phase 3 (query hooks)

## Overview
- **Priority:** P2
- **Status:** pending
- **Effort:** 1.5h
- **Depends on:** Phase 1, Phase 3
- **Description:** Clean up App.tsx provider tree after auth and query migrations complete. Remove AuthContext wrapper, add query cache clear on logout.

## Key Insights
- App.tsx already has PersistQueryClientProvider wrapping the app
- After Phase 1+3, AuthContext.Provider becomes unnecessary
- Zustand stores need no providers
- Need to ensure query cache clears on logout

## Requirements
**Functional:**
- Remove AuthProvider from App.tsx
- Move auth listener init to app startup (outside component tree)
- Clear query cache on logout
- Keep ThemeProvider (correct Context usage for tree-wide theming)

**Non-functional:**
- Simpler provider tree = easier debugging
- Faster app startup (one fewer context layer)

## Architecture
```
Before:
ErrorBoundary > GestureHandler > SafeArea > PersistQueryClient > Theme > Auth > AppContent

After:
ErrorBoundary > GestureHandler > SafeArea > PersistQueryClient > Theme > AppContent
(Auth managed by Zustand store, initialized at module level)
```

## Related Code Files
**Modify:**
- `App.tsx` -- Remove AuthProvider, init auth listener
- `src/stores/auth-store.ts` -- Add `queryClient.clear()` to logout action
- `src/contexts/AuthContext.tsx` -- Mark as deprecated or remove

**Delete (if all consumers migrated):**
- `src/contexts/AuthContext.tsx` -- Only after Phase 3 completes all consumer migrations

## Implementation Steps

1. Update auth store logout action:
   - Import `queryClient` from config
   - Call `queryClient.clear()` in logout action after `supabase.auth.signOut()`

2. Move auth listener initialization:
   - Call `initAuthListener()` at module level in App.tsx (outside component)
   - Or call in top-level useEffect in App component

3. Remove AuthProvider from App.tsx:
   - Remove `<AuthProvider>` wrapper
   - Remove import

4. Update any remaining `useAuth()` consumers to `useAuthStore()`:
   - `src/screens/profile/edit-profile/EditProfileScreen.tsx`
   - `src/screens/profile/profile-me/ProfileMeScreen.tsx`
   - `src/navigation/RootNavigator.tsx`
   - `src/screens/auth/profile-setup/use-profile-setup-form.ts`

5. Delete or deprecate AuthContext files:
   - `src/contexts/AuthContext.tsx`
   - `src/contexts/auth-context.types.ts`

## Todo List
- [ ] Add queryClient.clear() to auth store logout
- [ ] Move auth listener init to App.tsx module level
- [ ] Remove AuthProvider from App.tsx
- [ ] Migrate remaining useAuth() consumers to useAuthStore()
- [ ] Delete/deprecate AuthContext files
- [ ] Test full auth flow end-to-end
- [ ] Verify provider tree is minimal

## Success Criteria
- No React Context providers for auth state
- Provider tree: ErrorBoundary > GestureHandler > SafeArea > PersistQueryClient > Theme > App
- Query cache cleared on logout
- All screens functional after provider removal

## Risk Assessment
- **Risk:** Removing AuthProvider before all consumers migrated = crash
  - **Mitigation:** Phase 3 migrates hook consumers, this phase migrates remaining 4 screen consumers. Verify zero AuthContext imports remain before deletion.
- **Risk:** Auth listener race condition with app render
  - **Mitigation:** Init listener at module level (runs before render). Zustand persisted state shows last known auth state immediately.

## Security Considerations
- Query cache MUST clear on logout to prevent data leakage between users
- Verify no stale profile data persists after logout

## Next Steps
- Auth architecture complete after this phase
- Production tooling phases (5-8) can proceed independently
