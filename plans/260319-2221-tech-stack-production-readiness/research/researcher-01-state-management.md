# State Management Architecture for React Native Production Apps

## Research Date
March 19, 2026

---

## 1. Zustand v5 Store Architecture Best Practices

### Key Findings

**Store Design:**
- Minimal store structure: Zustand uses single store with hooks, no providers needed
- Use `useShallow` selector for multi-field object selectors in v5 (native useSyncExternalStore)
- Avoid object selectors without `useShallow` to prevent "Maximum update depth exceeded"

**Middleware Stack (Production Pattern):**
```typescript
import { create } from 'zustand';
import { devtools, persist, immer } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        setUser: (user) => set({ user }),
      })),
      { name: 'auth-store', storage: AsyncStorage }
    ),
    { name: 'AuthStore' }
  )
);
```

**Persistence Optimization:**
- Use `partialize` to avoid persisting large state trees
- Configure custom storage backend (AsyncStorage for React Native)
- Use JSON serialization for getItem/setItem methods
- Add versioning to migrations

**State Separation:**
- Keep Zustand for app logic/async state
- Use React Context for UI-only state (themes, modals)
- Prevents unnecessary re-renders across app

### Sources
- [GitHub - Zustand](https://github.com/pmndrs/zustand)
- [Mastering Zustand v4 & v5 Guide](https://dev.to/vishwark/mastering-zustand-the-modern-react-state-manager-v4-v5-guide-8mm)

---

## 2. TanStack Query v5 + React Native + Supabase Patterns

### Key Findings

**Query Key Factories (Recommended):**
```typescript
export const queryKeys = {
  courts: {
    all: ['courts'],
    list: () => [...queryKeys.courts.all, 'list'],
    detail: (id) => [...queryKeys.courts.all, 'detail', id],
  },
  matches: {
    all: ['matches'],
    userMatches: (userId) => [...queryKeys.matches.all, userId],
  },
};
```

**Offline Persistence Setup:**
```typescript
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{ persister: asyncStoragePersister }}
>
  <App />
</PersistQueryClientProvider>
```

**Optimistic Updates for Mutations:**
- Create mutation with optimistic updates using `onMutate`
- Rollback on error using `onError` with previous data
- Revalidate query on success with `onSuccess`

**Network State Handling:**
- React Native requires manual network listener (TanStack Query auto-handles in browser)
- Use `@react-native-community/netinfo` to listen for connectivity
- Call `queryClient.refetchQueries()` on reconnect
- Persist mutations using `createQueryPersister` experimental API

### Sources
- [React Native Offline First with TanStack Query](https://dev.to/fedorish/react-native-offline-first-with-tanstack-query-1pe5)
- [How to Use Supabase with TanStack Query v5](https://makerkit.dev/blog/saas/supabase-react-query)
- [TanStack Query Persistence Docs](https://tanstack.com/query/v5/docs/framework/react/plugins/createPersister)

---

## 3. Migration: React Context → Zustand (Without Breaking Changes)

### Step-by-Step Approach

**Phase 1 - Wrapper Pattern:**
```typescript
// Keep existing AuthContext export
export const AuthContext = React.createContext(null);

// Create wrapper using Zustand store as provider
const useAuthStore = create((set) => ({ /* auth state */ }));

export function AuthProvider({ children }) {
  const store = useAuthStore();
  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Phase 2 - Gradual Consumer Migration:**
- Old consumers: Keep using `useContext(AuthContext)` (unchanged)
- New components: Use `useAuthStore()` directly
- No breaking changes during transition period

**Phase 3 - Remove Context:**
- Deprecate AuthContext export after all consumers migrated
- Components using Zustand only at end state

**Key Safety Measure:**
- Maintain identical API surface during migration
- Both Context and Zustand return same data shape
- Test old context users work unchanged

### Sources
- [Zustand and React Context Comparison](https://tkdodo.eu/blog/zustand-and-react-context)
- [Migrating from Context to Zustand](https://github.com/pmndrs/zustand/issues/235)
- [Combining Zustand with React Context](https://tillitsdone.com/blogs/zustand-with-react-context-guide/)

---

## 4. Performance: Context vs Zustand in Large Apps

### Re-Render Analysis

**Context API Problem:**
- Entire consumer tree re-renders on value change
- No granular subscription: all descendants affected
- Example: 100-item list re-renders all items on single field change
- Severe impact on mobile (laggy UX, battery drain)

**Zustand Advantage:**
- **Selective subscription model**: Only components using specific state re-render
- Centralized store with fine-grained updates
- Components don't re-render unnecessarily
- Performance scales with app size

**Measurement:**
- Context: O(n) re-renders where n = total descendants
- Zustand: O(m) re-renders where m = components using specific slice

### Production Recommendation

| Scenario | Use |
|----------|-----|
| Auth state (frequently read, infrequently changed) | **Zustand** |
| Theme/UI state (rarely changes) | Context API |
| Large datasets with frequent updates | **Zustand** |
| Dependency injection only | Context API |
| Production/scalable apps | **Zustand** |

**For PickleBall Auth:** Zustand is strongly recommended given auth state touched frequently and app will grow.

### Sources
- [React State Management 2025: Context vs Zustand](https://dev.to/cristiansifuentes/react-state-management-in-2025-context-api-vs-zustand-385m)
- [Context API Performance Issues Analysis](https://medium.com/@bloodturtle/react-state-management-why-context-api-might-be-causing-performance-issues-and-how-zustand-can-help-ec7718103a71)

---

## Recommended Architecture for PickleBall

**State Management Stack:**
1. **Zustand** → Auth, User Profile, Match Data, Court Data
2. **TanStack Query v5** → Server state, caching, offline sync
3. **React Context** → UI state only (modals, themes)

**Setup Pattern:**
- Persist auth store with versioning
- Use query key factories for all Supabase queries
- Implement optimistic mutations for user actions
- Network listener for offline resilience
- Migrate existing AuthContext gradually using wrapper pattern

---

## Unresolved Questions
- Specific MMKV vs AsyncStorage performance for this app scale?
- Optimal cache invalidation strategy with Supabase real-time updates?
- Details on TanStack Query mutation persistence in v5?

