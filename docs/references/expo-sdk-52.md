# Expo SDK 52 Reference

**Last Updated**: January 2026
**Source**: [Expo Official Documentation](https://docs.expo.dev/)

## Overview

Expo SDK 52 enables the **New Architecture by default** - all new projects created with `npx create-expo-app` will have `newArchEnabled: true` in app.json.

## Key Changes

- **React Native 0.77**: SDK 52 is based on RN 0.77
- **New Architecture Default**: Enabled for all new projects
- **Expo Go**: Now uses New Architecture; JSC no longer supported, **Hermes only**
- **Minimum Platform Versions**:
  - iOS: 15.1+
  - Android: minSdkVersion 24, compileSdkVersion 35

## Installation

```bash
# Create new project
npx create-expo-app@latest

# Install additional packages
npx expo install [package-name]
```

## Important Notes

- All apps in Expo Go must use Hermes
- New Architecture brings performance improvements but requires compatible packages
- Some older packages may not work with New Architecture

## Key Features in SDK 52

- **expo-video**: Stable release with lock screen controls and Picture-in-Picture support
- Enhanced reliability and performance across SDK modules

## Sources

- [Expo SDK 52 Changelog](https://expo.dev/changelog/2024-11-12-sdk-52)
- [Expo Documentation](https://docs.expo.dev/)
- [New Architecture Guide](https://docs.expo.dev/guides/new-architecture/)
