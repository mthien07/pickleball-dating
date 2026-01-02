# React Native Paper v5

**Last Updated**: January 2026
**Source**: [React Native Paper Docs](https://reactnativepaper.com/)

## Overview

React Native Paper is a cross-platform UI component library implementing Material Design (MD2 and MD3/Material You).

## Installation

```bash
# Install Paper
npm install react-native-paper

# Required dependency
npm install react-native-safe-area-context

# For bare React Native (not needed for Expo)
npm install @react-native-vector-icons/material-design-icons
```

### Expo Projects

If using Expo, vector icons are already included - no need to install separately.

## Setup

### Wrap App in PaperProvider

```typescript
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      {/* Your app */}
    </PaperProvider>
  );
}
```

**Note**: Versions prior to 5.8.0 use `Provider` instead of `PaperProvider`.

## Material Design Support

React Native Paper v5 supports **both**:
- **Material Design 2 (MD2)**: Classic Material Design
- **Material Design 3 (MD3)**: "Material You" with dynamic theming

## Key Features

- **Production-Ready Components**: Buttons, Cards, Dialogs, TextInputs, etc.
- **Customizable Theming**: Full theme customization support
- **Accessibility**: Built-in accessibility features
- **Cross-Platform**: Works on iOS, Android, and Web
- **TypeScript**: Full TypeScript support

## Common Components

- AppBar, Button, Card, Checkbox, Chip
- Dialog, Divider, FAB (Floating Action Button)
- List, Menu, Modal, ProgressBar
- RadioButton, Searchbar, Snackbar
- Switch, TextInput, ToggleButton

## Theming

```typescript
import { MD3LightTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function App() {
  return (
    <PaperProvider theme={theme}>
      {/* Your app */}
    </PaperProvider>
  );
}
```

## Setup Time

Most developers complete integration within **30 minutes**.

## Architecture Support

Works seamlessly with:
- New React Native Architecture
- Old Architecture
- Expo and bare React Native

## Sources

- [Getting Started Guide](http://oss.callstack.com/react-native-paper/docs/guides/getting-started/)
- [Material You (MD3) Migration](http://oss.callstack.com/react-native-paper/docs/guides/migration-guide-to-5.0/)
- [GitHub Repository](https://github.com/callstack/react-native-paper)
