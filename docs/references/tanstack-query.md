# TanStack Query (React Query) for React Native

**Last Updated**: January 2026
**Source**: [TanStack Query Docs](https://tanstack.com/query/latest)

## Overview

TanStack Query (formerly React Query) is a powerful data-fetching and state management library designed for React/React Native apps.

## Installation

```bash
npm install @tanstack/react-query

# Optional: HTTP client (choose one)
npm install axios
# OR
npm install ky
```

## Basic Setup

### 1. Create QueryClient and Wrap App

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
    </QueryClientProvider>
  );
}
```

### 2. Use Queries in Components

```typescript
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
}
```

## React Native-Specific Features

### Online/Offline Detection

React Native provides focus info through `AppState` module. Use the `AppState` "change" event to trigger updates when app state changes to "active".

```typescript
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { focusManager } from '@tanstack/react-query';

function onAppStateChange(status) {
  focusManager.setFocused(status === 'active');
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange);
  return () => subscription.remove();
}, []);
```

### Refetch on Screen Focus

Custom hooks can refetch all active stale queries when screen is focused again.

### DevTools Options

- Native macOS App
- Flipper Plugin
- Reactotron Plugin

## Compatibility

- React v18+
- Works with ReactDOM and React Native
- Compatible with Expo and bare React Native

## Key Features

- **Automatic Caching**: Smart caching with invalidation
- **Background Updates**: Auto-refetch on window focus, reconnect
- **Request Deduplication**: Automatic query deduplication
- **Pagination & Infinite Scroll**: Built-in support
- **Optimistic Updates**: UI updates before server confirms

## Sources

- [TanStack Query React Native Docs](https://tanstack.com/query/latest/docs/framework/react/react-native)
- [Installation Guide](https://tanstack.com/query/v5/docs/react/installation)
- [React Native Examples](https://tanstack.com/query/v4/docs/framework/react/examples/react-native)
