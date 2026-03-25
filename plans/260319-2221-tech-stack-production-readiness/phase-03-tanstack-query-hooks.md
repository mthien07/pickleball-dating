# Phase 3: TanStack Query Hooks Refactor

## Context Links
- [State Management Research](./research/researcher-01-state-management.md) -- Section 2 (TanStack Query patterns)
- [Query Client Config](../src/config/queryClient.ts) -- Already configured with offline persistence
- [Query Key Factory](../src/config/query-keys.ts) -- Already has keys for all entities
- Current hooks: [use-discovery-profiles](../src/hooks/use-discovery-profiles.ts), [use-matches](../src/hooks/use-matches.ts), [use-courts](../src/hooks/use-courts.ts), [use-bookings](../src/hooks/use-bookings.ts), [use-coaches](../src/hooks/use-coaches.ts)

## Overview
- **Priority:** P1 (Critical)
- **Status:** pending
- **Effort:** 8h
- **Depends on:** Phase 1 (auth store for `enabled` flag)
- **Description:** Refactor 5 existing hooks from manual useState/useEffect to TanStack Query. Eliminates manual loading state, adds caching, background refetch, offline support.

## Key Insights
- queryClient.ts already configured: 24h gcTime, 5min staleTime, offlineFirst, retry logic, AsyncStorage persister
- query-keys.ts already has factory pattern for all entities
- PersistQueryClientProvider already wrapping app in App.tsx
- All hooks follow identical pattern: useState + useCallback + useEffect + mock fallback
- API service functions already exist and return data -- just need to be used as queryFn
- 5 hooks + 2 screens use `useContext(AuthContext)` directly for mock-mode toggle

## Requirements
**Functional:**
- Each hook uses `useQuery` with existing service function as `queryFn`
- `enabled` flag tied to auth state (only fetch when authenticated)
- Mock fallback moved to `placeholderData` or dev-mode env toggle
- Mutations for write operations (swipe, create booking)
- Optimistic updates for swipe actions

**Non-functional:**
- Zero waterfall fetches -- parallel where possible
- Offline cached data served immediately
- Background refetch on reconnect (already configured in queryClient)
- Type-safe: remove `any[]` typings

## Architecture
```
Screen --> useDiscoveryProfiles() --> useQuery({ queryKey, queryFn, enabled })
                                         |
                                         +--> queryFn: getDiscoveryProfiles()
                                         +--> enabled: useAuthStore().isAuthenticated
                                         +--> placeholderData: MOCK_USERS (dev only)
```

## Related Code Files
**Modify:**
- `src/hooks/use-discovery-profiles.ts` -- useQuery + useMutation(recordSwipe)
- `src/hooks/use-matches.ts` -- useQuery with derived newMatches/conversations
- `src/hooks/use-courts.ts` -- useQuery with courtType filter in queryKey
- `src/hooks/use-bookings.ts` -- useQuery with normalizer in select
- `src/hooks/use-coaches.ts` -- useQuery
- `src/config/query-keys.ts` -- Add `discovery` and `swipes` key groups

**Modify (consumer updates if return shape changes):**
- `src/screens/matches/chat/ChatScreen.tsx` -- uses useContext(AuthContext), update to useAuthStore
- `src/screens/court/booking/BookingScreen.tsx` -- uses useContext(AuthContext), update to useAuthStore

**No changes needed:**
- `src/config/queryClient.ts` -- Already properly configured
- `src/services/api/*.service.ts` -- Used as queryFn, no changes

## Implementation Steps

### 3.1 Add missing query keys (15min)
1. Add to `src/config/query-keys.ts`:
   ```typescript
   discovery: {
     all: ['discovery'] as const,
     profiles: () => ['discovery', 'profiles'] as const,
   },
   swipes: {
     all: ['swipes'] as const,
   },
   ```

### 3.2 Refactor use-discovery-profiles.ts (1.5h)
1. Replace useState/useEffect with `useQuery`:
   - `queryKey`: `queryKeys.discovery.profiles()`
   - `queryFn`: `getDiscoveryProfiles`
   - `enabled`: `isAuthenticated` from auth store
   - `placeholderData`: `__DEV__ ? MOCK_USERS : undefined`
2. Add `useMutation` for `recordSwipe`:
   - Optimistic update: advance currentIndex immediately
   - `onError`: rollback index
   - `onSuccess`: invalidate matches query (new match possible)
3. Keep `currentIndex` as local useState (UI-only state)
4. Return same shape: `{ currentProfile, nextProfile, hasMore, isLoading, handleSwipe, reload }`
   - `reload` = `refetch` from useQuery
   - `isLoading` = query.isLoading

### 3.3 Refactor use-matches.ts (1h)
1. Replace with `useQuery`:
   - `queryKey`: `queryKeys.matches.list()`
   - `queryFn`: `getMatches`
   - `enabled`: `isAuthenticated`
   - `select`: derive `newMatches` and `conversations` in select function
2. Return: `{ matches, newMatches, conversations, isLoading, refresh }`
   - `refresh` = `refetch`

### 3.4 Refactor use-courts.ts (1h)
1. Replace with `useQuery`:
   - `queryKey`: `queryKeys.courts.list({ courtType })`
   - `queryFn`: `() => getCourts(courtType)`
   - `enabled`: `isAuthenticated`
2. Return: `{ courts, isLoading, refresh }`

### 3.5 Refactor use-bookings.ts (1h)
1. Replace with `useQuery`:
   - `queryKey`: `queryKeys.bookings.list()`
   - `queryFn`: `getMyBookings`
   - `select`: `(data) => data.map(normalizeSupabaseBooking)` -- keep normalizer
   - `enabled`: `isAuthenticated`
2. Return: `{ bookings, isLoading, refresh }`

### 3.6 Refactor use-coaches.ts (45min)
1. Replace with `useQuery`:
   - `queryKey`: `queryKeys.coaches.list()`
   - `queryFn`: `getCoaches`
   - `enabled`: `isAuthenticated`
2. Return: `{ coaches, isLoading, refresh }`

### 3.7 Update direct AuthContext consumers (1h)
1. `ChatScreen.tsx`: Replace `useContext(AuthContext)` with `useAuthStore()`
2. `BookingScreen.tsx`: Replace `useContext(AuthContext)` with `useAuthStore()`

### 3.8 Remove mock fallback pattern (45min)
1. All hooks: remove try/catch mock fallback
2. Add `placeholderData` with mock data gated behind `__DEV__` flag
3. On query error, TanStack Query shows stale cached data automatically (offlineFirst mode)

## Todo List
- [ ] Add discovery/swipes query keys
- [ ] Refactor use-discovery-profiles.ts to useQuery + useMutation
- [ ] Refactor use-matches.ts to useQuery with select
- [ ] Refactor use-courts.ts to useQuery
- [ ] Refactor use-bookings.ts to useQuery with select normalizer
- [ ] Refactor use-coaches.ts to useQuery
- [ ] Update ChatScreen.tsx to use auth store
- [ ] Update BookingScreen.tsx to use auth store
- [ ] Remove mock fallback pattern from all hooks
- [ ] Test offline behavior (cached data served)
- [ ] Test background refetch on reconnect
- [ ] Verify no screen regressions

## Success Criteria
- Zero manual useState/useEffect for server data in hooks
- All hooks use TanStack Query with proper query keys
- Offline: cached data displayed, no crash
- Online: background refetch after stale time
- Mock data only used in __DEV__ as placeholderData
- Type-safe: no `any[]` in hook return types

## Risk Assessment
- **Risk:** Return shape changes break screen consumers
  - **Mitigation:** Keep exact same return object shape. `isLoading` maps to query.isLoading. `refresh` maps to refetch.
- **Risk:** Mock fallback removal breaks unauthenticated preview
  - **Mitigation:** Use `placeholderData` in __DEV__ mode only. Production requires auth.
- **Risk:** Multiple simultaneous refactors cause hard-to-debug issues
  - **Mitigation:** Refactor one hook at a time. Test each before moving to next.

## Security Considerations
- Query cache persisted to AsyncStorage -- no sensitive tokens in cache
- Profile data in cache is same data user already sees on screen
- Cache cleared on logout via `queryClient.clear()` in auth store logout action

## Next Steps
- Phase 4: Final provider cleanup (remove AuthContext wrapper)
- Consider adding mutations for booking creation, profile update
