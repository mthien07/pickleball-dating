# React Navigation v6+ Reference

**Last Updated**: January 2026
**Source**: [React Navigation Official](https://reactnavigation.org/)

## Overview

React Navigation is the standard navigation library for React Native apps. Latest version is 7.x, but v6 patterns remain compatible.

## Installation

```bash
# Core navigation
npm install @react-navigation/native

# Dependencies
npm install react-native-screens react-native-safe-area-context

# Navigator types
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-navigation/drawer

# For iOS (if using bare React Native)
cd ios && pod install && cd ..
```

## For Expo Projects

With Expo, installation is simpler:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

## Key Features

- **Component-based API**: Declarative navigation configuration
- **Type Safety**: Excellent TypeScript support
- **Performance**: Optimized transitions and rendering
- **Deep Linking**: Built-in support for URL-based navigation

## Common Navigator Types

1. **Native Stack Navigator**: Recommended for most use cases (uses native navigation)
2. **Bottom Tabs Navigator**: Tab-based navigation
3. **Drawer Navigator**: Side drawer menu
4. **Stack Navigator**: JS-based stack (for custom transitions)

## Basic Setup Pattern

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Sources

- [Getting Started Guide](https://reactnavigation.org/docs/getting-started/)
- [React Navigation GitHub](https://github.com/react-navigation/react-navigation)
