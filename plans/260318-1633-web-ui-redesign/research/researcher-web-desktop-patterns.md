# Research: Web/Desktop UI Patterns for React Native Expo

**Date**: 2026-03-18 | **Focus**: Professional web/desktop patterns for RN Expo

## 1. Responsive Navigation: Sidebar + Bottom Tabs

Use `tabBarPosition` conditional in React Navigation v6:

```typescript
const dimensions = useWindowDimensions();
const isLargeScreen = dimensions.width >= 768;

<Tab.Navigator
  screenOptions={{
    tabBarPosition: isLargeScreen ? 'left' : 'bottom',
    tabBarVariant: isLargeScreen ? 'material' : 'default',
  }}
>
```

- Bottom tabs (mobile): width < 768px
- Sidebar (desktop): width >= 768px

## 2. Responsive Layouts: Master-Detail Pattern

```typescript
const isLargeScreen = Dimensions.get('window').width >= 768;

<View style={isLargeScreen ? styles.splitContainer : styles.stackContainer}>
  <View style={styles.master}>{/* List */}</View>
  {isLargeScreen && <View style={styles.detail}>{/* Content */}</View>}
</View>
```

## 3. Hover Effects in React Native Web

```typescript
<Pressable
  style={({ hovered }) => ({
    backgroundColor: hovered ? '#f0f0f0' : 'transparent',
    transform: [{ scale: hovered ? 1.02 : 1 }],
  })}
>
```

Use Pressable's built-in `hovered` state prop (RN Web supported).

## 4. Split-Screen Auth Layout

```typescript
const isLargeScreen = Dimensions.get('window').width >= 768;

<View style={styles.authContainer}>
  {isLargeScreen && (
    <ImageBackground style={styles.imageSide}>
      {/* Branding */}
    </ImageBackground>
  )}
  <ScrollView style={styles.formSide}>
    {/* Form */}
  </ScrollView>
</View>
```

## 5. Key Takeaways

- Use Pressable `hovered` state for web hover effects
- Conditional `tabBarPosition: 'left'` for sidebar on desktop
- Split layouts via flexDirection conditional
- Max-width constraints on form containers for ultra-wide screens
