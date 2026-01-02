# React Native Reanimated v4 Reference

**Last Updated**: January 2026
**Source**: [Software Mansion Docs](https://docs.swmansion.com/react-native-reanimated/)

## Overview

Reanimated v4 is the future of React Native animations, running on the UI thread for 60+ FPS performance.

## Breaking Changes in v4

### Worklets Separation

Worklets have been **extracted into a separate package** (`react-native-worklets-core`). This allows other libraries to leverage worklet functionality.

**Important**: You must install `react-native-worklets` separately.

### Installation

```bash
# Install Reanimated v4
npm install react-native-reanimated

# Install Worklets (required)
npm install react-native-worklets-core
```

### Babel Configuration Update

**OLD (v3)**:
```javascript
plugins: ['react-native-reanimated/plugin']
```

**NEW (v4)**:
```javascript
plugins: ['react-native-worklets/plugin']
```

## Key Concepts

### Worklets

Worklets are functions that run on the **UI thread** (not JS thread), enabling smooth 60 FPS animations.

```typescript
'worklet';
function animationWorklet() {
  // This runs on UI thread
}
```

### Shared Values

Special variables accessible from both JS and native code without communication overhead.

```typescript
const offset = useSharedValue(0);
```

## When to Use Worklets

Worklets are recommended for:
- Gesture-driven animations (drag, swipe)
- Scroll-driven animations
- Screen transitions
- Complex orchestrated animations
- Real-time interactive animations

## Architecture Requirements

- **New Architecture Only**: Reanimated 4.x requires New React Native Architecture
- **RN Versions**: Supports 3 latest React Native versions only

## Performance

- Runs entirely on UI thread
- No bridge communication for animations
- Smooth 60-120 FPS animations
- Ideal for gesture handlers

## Sources

- [Reanimated 4 Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [Worklets Guide](https://docs.swmansion.com/react-native-worklets/)
- [Migration Guide](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/)
