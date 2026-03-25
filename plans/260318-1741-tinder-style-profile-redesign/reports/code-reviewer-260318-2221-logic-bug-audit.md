# Code Review Report — Logic Bug Audit

**Date**: 2026-03-18
**Reviewer**: code-reviewer
**Plan**: `/plans/260318-1741-tinder-style-profile-redesign`

---

## Code Review Summary

### Scope
- Files reviewed: 22 files
- Focus: Logic bugs in Auth, Swipe/Match, Chat, Navigation, Data Integrity, State Management
- Plan status: Phase 1 complete, Phase 2 pending

### Overall Assessment
Codebase is generally well-structured. Found **2 CRITICAL**, **4 HIGH**, **3 MEDIUM** bugs. The most dangerous issue is a confirmed **navigation dead route** that silently crashes chat access from MatchDetailScreen, and a **race condition** in match creation that can create duplicate match records.

---

## Critical Issues

### BUG [CRITICAL]: `MatchDetailScreen` navigates to non-existent route `'Chat'`

**File**: `src/screens/matches/MatchDetailScreen/index.tsx:49`

```
navigation.navigate('Chat', { matchId });
```

**Problem**: The `MatchesStackParamList` defines the screen as `'ChatScreen'`, not `'Chat'`. See `src/navigation/types.ts:26` and `src/navigation/components/stack-navigators.tsx:41`.

```
// types.ts
ChatScreen: { matchId: string; userId: string };

// stack-navigators.tsx
<MatchesStack.Screen name="ChatScreen" component={ChatScreen} />
```

**Impact**: Tapping "Chat" from MatchDetailScreen throws a navigation error at runtime. No userId is passed either (required param).

**FIX**:
```tsx
// MatchDetailScreen/index.tsx:49
navigation.navigate('ChatScreen', { matchId, userId: user.id });
```

Also line 54 — `'Rating'` is not in `MatchesStackParamList`; the registered name is `'RatingScreen'`:
```tsx
// line 54 — dead route
navigation.navigate('Rating', { ... });
// FIX:
navigation.navigate('RatingScreen', { userId: user.id, matchId });
```

---

### BUG [CRITICAL]: Race condition in `recordSwipe` creates duplicate match records

**File**: `src/services/api/swipe.service.ts:85–103`

```
// Step 1: insert swipe
// Step 2: query for mutual swipe
// Step 3: insert match if mutual found
```

**Problem**: If User A and User B swipe each other simultaneously, both will:
1. Insert their own swipe row (success)
2. Query for the other's swipe (both find it, since both inserts completed)
3. Both attempt to insert a match record → **two match rows** for the same pair

**Impact**: Duplicate matches in the `matches` table. Downstream: two conversations, two notification triggers, broken match list.

**FIX**: Move all three steps into a single Supabase DB function (`record_swipe_and_match`) that uses a transaction + unique constraint on `(LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2))`. The client-side JS cannot safely prevent this race.

Short-term mitigation (not a full fix): add `.select()` to the match insert and handle the unique-constraint error gracefully:
```ts
const { error: matchError } = await supabase.from('matches').insert({
  user_id_1: user.id < targetUserId ? user.id : targetUserId,
  user_id_2: user.id < targetUserId ? targetUserId : user.id,
  matched_at: new Date().toISOString(),
});
// error code '23505' = unique violation → already matched, not a real error
return { isMatch: matchError?.code !== '23505' ? !matchError : true };
```

---

## High Priority Findings

### BUG [HIGH]: `onAuthStateChange` fires on initial session, causing double profile load

**File**: `src/contexts/AuthContext.tsx:88–141`

**Problem**: On mount, `checkSession()` calls `setAuthState(currentSession)` and then `loadProfile()`. Immediately after, `onAuthStateChange` fires with `INITIAL_SESSION` (Supabase fires this synchronously after `onAuthStateChange` registration), which also calls `loadProfile()`. This results in two concurrent profile fetches, the second overwriting the first — potentially with stale data or causing a visible flicker.

**Impact**: `profileLoading` toggles twice; potential double API call on every app launch.

**FIX**: Guard against duplicate loads. The simplest approach is to check for `event === 'INITIAL_SESSION'` and skip it (the manual `checkSession` already handles it):
```ts
supabase.auth.onAuthStateChange(async (event, newSession) => {
  if (event === 'INITIAL_SESSION') return; // handled by checkSession above
  setAuthState(newSession);
  if (newSession) {
    loadProfile().catch(console.error);
  }
});
```

---

### BUG [HIGH]: `HomeSwipeScreen` buttons trigger swipe animation but bypass `handleSwipe` logic

**File**: `src/screens/main/HomeSwipeScreen/index.tsx:199, 245`

```tsx
// Pass button
onPress={() => swipeCardRef.current?.swipe('left')}

// Like button
onPress={() => swipeCardRef.current?.swipe('right')}
```

**Problem**: The "Nope" and "Like" buttons call `swipeCardRef.current?.swipe(...)` which animates the card and triggers `onPass`/`onLike` callbacks set on `<SwipeCard>`. Those callbacks are `handleSwipeLeft` and `handleSwipeRight` respectively — so the logic IS wired. But swipe direction `'pass'` vs `'like'` is only recorded when the `useDiscoveryProfiles.handleSwipe` is called via the card's `onLike`/`onPass` props.

Check: `SwipeCard` accepts `onLike={handleSwipeRight}` and `onPass={handleSwipeLeft}`. The `useSwipeGesture` hook calls `onSwipeRight` for rightward swipes — which maps to `onLike`. So the wiring is:
- Button "Like" → `ref.swipe('right')` → `onSwipeRight` in gesture hook → `onLike` prop → `handleSwipeRight` ✓
- Button "Nope" → `ref.swipe('left')` → `onSwipeLeft` → `onPass` prop → `handleSwipeLeft` ✓

**Actual bug**: `handleSwipeRight` shows toast BEFORE `handleSwipe` resolves (the result check is correct), but `currentProfileRef.current` may already point to the **next** profile by the time the toast fires, because `setCurrentIndex` runs synchronously inside `handleSwipe` before the `recordSwipe` async call resolves. The ref update in the hook:

```ts
// use-discovery-profiles.ts:56
setCurrentIndex((prev) => prev + 1);  // index advances immediately

// Then async:
return await recordSwipe(profile.id, direction);
```

The `currentProfileRef.current` in `HomeSwipeScreen` is updated each render. Since `setCurrentIndex` triggers a re-render, by the time `await handleSwipe` returns, the ref points to the NEW profile. Result: "Liked [next user's name]!" instead of the swiped user's name.

**FIX**: Capture the profile name before the await:
```ts
const handleSwipeRight = useCallback(async () => {
  const swipedName = currentProfileRef.current?.display_name;
  const result = await handleSwipe('like');
  if (result.isMatch) {
    showSuccess("It's a Match! 🎉");
  } else {
    showSuccess(`Liked ${swipedName}!`);
  }
}, [handleSwipe]);
```

---

### BUG [HIGH]: `useChatMessages` real-time subscription only filters by `sender_id !== currentUserId`, no deduplication with optimistic messages

**File**: `src/hooks/use-chat-messages.ts:90–96`

```ts
const channel = subscribeToMessages(conversationId, (rawMsg) => {
  const msg = rawMsg as unknown as ServiceMessage;
  if (msg.sender_id !== currentUserId) {
    setMessages((prev) => [toUIMessage(msg), ...prev]);
  }
});
```

**Problem**: When the current user sends a message, the optimistic temp message is added. The subscription correctly filters `sender_id !== currentUserId` so the confirmed message from Supabase Realtime is NOT added again. However, there is no mechanism to replace or confirm the temp message via realtime — only via the `sendTextMessage` response in `sendMessage`. If the insert succeeds but the response races with a network hiccup, the temp message (`status: 'sending'`) may persist permanently alongside no duplicate — this is OK. But if the realtime broadcast arrives before the `sendTextMessage` promise resolves (edge case), nothing currently catches that.

More importantly: **error state is misleading**. On send failure:
```ts
// line 154 — status stays 'sending' on error, no 'failed' status
setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'sending' } : m)));
```

User sees a "sending..." message forever with no indication of failure.

**FIX**: Use a `'failed'` status:
```ts
setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m)));
```
(Same fix applies to `sendImage` at line 179.)

---

### BUG [HIGH]: `getCourtTimeSlots` day-of-week bug when date string lacks timezone

**File**: `src/services/api/court.service.ts:65`

```ts
const dayOfWeek = new Date(date).getDay();
```

**Problem**: When `date` is `'YYYY-MM-DD'` (no time component), `new Date('2026-03-18')` is parsed as **UTC midnight**. In timezones west of UTC (e.g. UTC-5, which covers Vietnam's users in US), this resolves to the **previous day**. E.g., `new Date('2026-03-18').getDay()` in UTC-5 = `Tuesday` instead of `Wednesday`.

**Impact**: Wrong time slots returned for a given date — user books for the wrong day.

**FIX**:
```ts
const [year, month, day] = date.split('-').map(Number);
const dayOfWeek = new Date(year, month - 1, day).getDay(); // local time
```

---

## Medium Priority Improvements

### BUG [MEDIUM]: `match.service.ts` join query assumes `conversations` is a one-to-many array — may silently return empty `conversation_id`

**File**: `src/services/api/match.service.ts:43, 59`

```ts
// Query returns conversations as array via foreign key
conversations(id),
// ...
conversation_id: m.conversations?.[0]?.id || '',
```

**Problem**: If the relationship between `matches` and `conversations` is one-to-one (FK on `conversations.match_id`) and the supabase client returns a single object instead of array, `m.conversations?.[0]` would be `undefined` even when a conversation exists. The `|| ''` fallback means `isRealMode` in ChatScreen becomes false and falls back to mock mode silently.

**FIX**: Validate the DB relationship. If one-to-one, use:
```ts
conversation:conversations(id),
// ...
conversation_id: (m.conversation as any)?.id || '',
```

---

### BUG [MEDIUM]: `useMockChat` auto-reply interval captures `userId` via closure but `userId` could be `undefined`

**File**: `src/screens/matches/chat/ChatScreen.tsx:156`

```ts
sender_id: userId ?? 'other',
```

This is safe, but the `useEffect` has `[userId]` in deps. If `userId` changes (navigating between chat screens without unmounting), the old interval is cleared and a new one starts — but `autoMsgCount` is reset to `0` inside the new closure. This is actually correct behavior. No bug here but worth noting `autoMsgCount` is a closure variable, not a ref, so it resets on re-run.

The real issue: the typing indicator `setTimeout` inside `setInterval` callback at line 150:
```ts
setMessages((prev) => {
  // ...
  setIsTyping(true);           // ← called inside setState callback
  setTimeout(() => { ... });   // ← setTimeout inside setState callback
  return prev;
});
```

**Problem**: Calling `setIsTyping(true)` inside a `setMessages` state updater function is a side effect inside a pure updater — React may call updaters multiple times in concurrent/strict mode. The setTimeout scheduling compound the risk: two typing indicators may be shown, or typing auto-clears twice.

**FIX**: Move side effects out of the state updater:
```ts
setInterval(() => {
  if (autoMsgCount >= MAX_AUTO_MESSAGES) return;
  setMessages((prev) => {
    if (prev.length === 0 || prev[0].sender_id !== CURRENT_USER_ID) return prev;
    return prev; // no state change
  });
  // side effects outside updater:
  setIsTyping(true);
  setTimeout(() => { /* send reply */ }, TYPING_DURATION);
}, interval);
```

---

### BUG [MEDIUM]: `ProfileMeScreen` age calculation ignores month/day — off by 1 for most of the year

**File**: `src/screens/profile/profile-me/ProfileMeScreen.tsx:48–50`

```ts
const age = profile.date_of_birth
  ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
  : undefined;
```

**Problem**: Subtracting years alone gives age+1 for anyone who hasn't had their birthday yet this year. E.g., DOB=2000-12-25, today=2026-03-18 → shows 26, should be 25.

**FIX**:
```ts
const calculateAge = (dob: string) => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};
```

---

## Low Priority Suggestions

- `AuthContext` `logout()` calls both `signOut()` and `setAuthState(null)` manually. `signOut()` will trigger `onAuthStateChange(SIGNED_OUT)` which also calls `setAuthState(null)` — resulting in a double clear. Harmless but redundant.
- `cancelBooking` in `booking.service.ts:90` has no auth check — any authenticated user can cancel any booking by guessing `bookingId`. Should add `.eq('user_id', user.id)` to the update filter.
- `MainNavigator` computes `unreadCount` from `MOCK_MATCHES` with `useMemo([], [])` — the empty deps array means this never updates. Fine for mock data but will break when real match data is wired in.

---

## Positive Observations
- `loadProfile` / `setAuthState` separation in AuthContext is clean — easy to reason about auth vs profile state
- `use-discovery-profiles` dual-mode (real/mock) fallback is well-structured
- `useChatMessages` optimistic update pattern is correct for the happy path
- `getDiscoveryProfiles` correctly delegates exclusion logic to the DB RPC (good boundary)
- `SwipeCard` exposes imperative ref correctly via `useImperativeHandle`

---

## Recommended Actions

1. **[CRITICAL]** Fix `MatchDetailScreen` dead routes: `'Chat'` → `'ChatScreen'`, `'Rating'` → `'RatingScreen'`, add missing `userId` param
2. **[CRITICAL]** Add unique constraint on `matches(user_id_1, user_id_2)` in DB + handle 23505 error in `recordSwipe`; ideally move to a DB transaction function
3. **[HIGH]** Skip `INITIAL_SESSION` event in `onAuthStateChange` to prevent double profile load
4. **[HIGH]** Capture profile name before `await handleSwipe` in `HomeSwipeScreen`
5. **[HIGH]** Replace `status: 'sending'` with `status: 'failed'` in `useChatMessages` error paths
6. **[HIGH]** Fix `getCourtTimeSlots` date parsing to use local time components
7. **[MEDIUM]** Validate `conversations` join query returns format (array vs object)
8. **[MEDIUM]** Move side effects out of `setMessages` updater in mock chat interval
9. **[MEDIUM]** Fix age calculation in `ProfileMeScreen`
10. **[LOW]** Add `user_id` check to `cancelBooking`

---

## Plan File Status Update

**Phase 1** (`phase-01-profile-me-redesign.md`): Todo shows `[x]` for implementation and type check, `[ ]` for web responsive test — no bug found in Phase 1 implementation itself (hero layout, stats grid, bio section are structurally correct). Age calculation bug (item 9 above) is in Phase 1 scope.

**Phase 2** (`phase-02-edit-profile-redesign.md`): All todos still `[ ]` — not yet implemented.

---

## Unresolved Questions

1. Does the `matches` table have a unique constraint on `(user_id_1, user_id_2)`? If not, the race condition cannot be mitigated without a DB migration.
2. Is the `conversations` → `matches` relationship one-to-one or one-to-many in the actual schema? The query assumes array (`[0]`).
3. Is `'INITIAL_SESSION'` guaranteed to fire for all Supabase JS SDK versions in use? Check SDK version to confirm event name.
4. Phase 1 plan says "Verify type check passes" is done — was a TypeScript compile actually run? The `getSkillLevelLabel` function signature changed (now takes `colors` as second arg) but the helper export `getPlayStyleLabel` is used without colors. Need to confirm no TS errors remain.
