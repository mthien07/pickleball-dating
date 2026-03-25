# Dark Mode + Web Responsive + Reanimated v4 Research

## 1. Dark Mode in Expo

### Setup
- Use `useColorScheme()` hook from react-native + Context + AsyncStorage for persistence
- Enable `"userInterfaceStyle": "automatic"` in app.json for system-level integration
- Memoize themed components to prevent re-renders on theme switch

### Architecture Pattern
```
ThemeProvider (Context)
  ├── useColorScheme() — system preference
  ├── AsyncStorage — user override persistence
  ├── ThemeColors — light/dark token maps
  └── useMemo() — computed theme values
```

### Performance Tips
- Centralize color tokens with design tokens approach
- Use `useMemo()` for computed theme values
- Avoid theme context re-renders on every state change
- Use `React.memo` on themed components

## 2. Web Responsive Design

### Approaches
1. **@expo/match-media** — native, Expo-integrated
2. **react-native-media-query** — CSS-based media queries
3. **Dimensions API** — manual breakpoint detection

### Best Practices
- Flexbox + percentage dimensions with maxWidth constraints
- Standard breakpoints: 360px (mobile), 768px (tablet), 1024px+ (desktop)
- Platform-specific code for web-only responsive logic
- Use `Platform.select()` for platform-specific styles

## 3. Reanimated v4 Animations

### Shared Element Transitions
- Available since v4.2.0 (New Architecture/Fabric required)
- Auto-animates: width, height, transforms, backgroundColor, opacity

### Elegant Animation Patterns
- Spring-based: `withSpring({ damping: 15, stiffness: 100 })`
- Layout animations: `FadeIn.duration(300)`, `SlideInRight`
- Scroll-driven: `useAnimatedScrollHandler` + interpolate

### For Hinge-style
- Fade-in on scroll (entering animations per card section)
- Subtle scale on press (0.98)
- Smooth page transitions with shared elements
- Parallax effect on profile photos

## 4. Key Takeaways
- Project ALREADY has ThemeContext + light/dark colors — just update values
- Project ALREADY has useResponsive hook + webStyles — extend for Hinge layout
- Reanimated v4.1 is installed — leverage layout animations + spring configs
- Focus on subtle, elegant animations (Hinge) vs bold sport animations (current)

## Sources
- Expo Color Themes Documentation
- React Native Appearance API
- React Native Reanimated Shared Element Transitions
- Expo Match Media Blog
- react-native-media-query npm
