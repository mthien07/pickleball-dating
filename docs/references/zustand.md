# Zustand for React Native

**Last Updated**: January 2026
**Source**: [Zustand GitHub](https://github.com/pmndrs/zustand)

## Overview

Zustand is a lightweight (2KB), hook-based state management library perfect for React Native apps.

## Installation

```bash
npm install zustand

# For persistence (optional)
npm install zustand @react-native-async-storage/async-storage
```

## Why Zustand for React Native?

- **Lightweight**: 2KB minified vs Redux's ~20KB
- **Simple API**: Hook-based, no boilerplate
- **Performance**: Selective re-renders (only components using specific state slices update)
- **Hermes Compatible**: Works seamlessly with Hermes (RN's default JS engine)
- **Fabric Ready**: Compatible with concurrent rendering

## Basic Store Setup

```typescript
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

## Using Store in Components

```typescript
function MyComponent() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Component logic
}
```

## Persistence with AsyncStorage

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      // Your state
    }),
    {
      name: 'my-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Best Practices

1. **Slice Stores**: Create separate stores for different domains
2. **Selector Pattern**: Use selectors to prevent unnecessary re-renders
3. **Immer for Complex State**: Use immer middleware for nested state updates
4. **DevTools**: Enable Redux DevTools for debugging

## Performance Tips

- Use shallow comparison for object/array selectors
- Split large stores into smaller slices
- Avoid storing derived state (compute on-the-fly)

## Sources

- [Zustand GitHub Repository](https://github.com/pmndrs/zustand)
- [React Native Zustand Guide](https://javascript.plainenglish.io/mastering-state-management-in-react-native-with-zustand-a-modern-guide-d6fb2764cdcb)
