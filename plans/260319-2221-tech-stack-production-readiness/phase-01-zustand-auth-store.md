# Phase 1: Zustand Auth Store

## Context Links
- [State Management Research](./research/researcher-01-state-management.md) -- Sections 1, 3, 4
- [Current AuthContext](../src/contexts/AuthContext.tsx)
- [Auth Types](../src/contexts/auth-context.types.ts)

## Overview
- **Priority:** P1 (Critical)
- **Status:** pending
- **Effort:** 3h
- **Description:** Migrate AuthContext to Zustand store using wrapper pattern for zero-breakage gradual migration

## Key Insights
- AuthContext has 8 consumers: 5 hooks (useContext direct), 5 screens (useAuth), RootNavigator
- Current pattern: 9 useState calls, useCallback, useEffect with Supabase onAuthStateChange
- Zustand eliminates provider requirement and enables selective subscriptions
- Wrapper pattern allows both `useAuth()` and `useAuthStore()` during transition

## Requirements
**Functional:**
- Same API surface: isAuthenticated, isLoading, user, session, profile, profileLoading, profileError, logout, refreshProfile
- Persist session/profile to AsyncStorage via Zustand persist middleware
- Listen to Supabase onAuthStateChange and sync store
- `useAuth()` hook continues working unchanged (backward compat)

**Non-functional:**
- No re-render regressions -- fewer re-renders than Context
- Session rehydration on app cold start

## Architecture
```
AuthProvider (wrapper) --> Zustand auth-store --> AsyncStorage (persist)
                      |
                      +--> supabase.auth.onAuthStateChange
                      +--> supabase.auth.getSession (init)
```
- Store holds auth state + actions
- AuthProvider becomes thin wrapper: syncs Supabase events into store
- Existing `useAuth()` re-exported from store (same shape)

## Related Code Files
**Create:**
- `src/stores/auth-store.ts` -- Zustand store with persist middleware

**Modify:**
- `src/contexts/AuthContext.tsx` -- Thin wrapper using store internally
- `src/contexts/auth-context.types.ts` -- Export AuthState type for store

**No changes needed (backward compat):**
- `src/hooks/use-discovery-profiles.ts` (uses useContext(AuthContext))
- `src/hooks/use-matches.ts`
- `src/hooks/use-courts.ts`
- `src/hooks/use-bookings.ts`
- `src/hooks/use-coaches.ts`
- `src/screens/profile/edit-profile/EditProfileScreen.tsx`
- `src/screens/profile/profile-me/ProfileMeScreen.tsx`
- `src/navigation/RootNavigator.tsx`
- `src/screens/auth/profile-setup/use-profile-setup-form.ts`

## Implementation Steps

1. Create `src/stores/auth-store.ts`:
   - Define `AuthState` interface matching `AuthContextType`
   - Use `create` with `devtools` + `persist` middleware
   - Persist only: `isAuthenticated`, `user`, `session`, `profile` (not loading/error states)
   - Use `createJSONStorage(() => AsyncStorage)` for React Native
   - Add `version: 1` for future migrations
   - Actions: `setAuthState`, `setProfile`, `setProfileLoading`, `setProfileError`, `logout`, `refreshProfile`, `_loadProfile` (internal)

2. Add Supabase sync logic:
   - Create `initAuthListener()` function in store file
   - Calls `supabase.auth.getSession()` on init
   - Subscribes to `supabase.auth.onAuthStateChange`
   - Updates store on auth events (same logic as current AuthContext useEffect)
   - Returns unsubscribe function

3. Refactor `AuthContext.tsx` to wrapper pattern:
   - AuthProvider calls `initAuthListener()` in useEffect
   - Reads all state from `useAuthStore()`
   - Passes store values to Context.Provider (backward compat)
   - `useAuth()` still works unchanged

4. Verify no breaking changes:
   - All 5 hooks using `useContext(AuthContext)` work unchanged
   - All 5 screens using `useAuth()` work unchanged
   - Profile loading, logout, session persistence all functional

## Todo List
- [ ] Create `src/stores/auth-store.ts` with persist middleware
- [ ] Implement `initAuthListener()` Supabase sync
- [ ] Refactor AuthContext.tsx to wrapper pattern
- [ ] Test auth flow: login, session restore, logout
- [ ] Test profile load/refresh
- [ ] Verify no re-render regressions

## Success Criteria
- `useAuthStore()` directly accessible without provider
- `useAuth()` backward compatible -- no consumer changes needed
- Session persists across app restarts via AsyncStorage
- Auth state changes propagate to all consumers
- Profile loads on auth, refreshable on demand

## Risk Assessment
- **Risk:** Persist middleware could expose sensitive session tokens in AsyncStorage
  - **Mitigation:** Session already stored by Supabase SDK in SecureStore; Zustand persist stores only user metadata, not raw tokens
- **Risk:** Dual-source-of-truth during migration (Context + Store)
  - **Mitigation:** Wrapper pattern ensures single source (store), Context just proxies

## Security Considerations
- Do NOT persist raw `session.access_token` in Zustand store -- Supabase SDK handles token storage in SecureStore
- Persist only user profile data and auth boolean flags
- Clear all persisted state on logout

## Next Steps
- Phase 3 depends on this: TanStack Query hooks use `useAuthStore().isAuthenticated` for `enabled` flag
- Phase 4 depends on this: Final provider restructure removes AuthContext wrapper
