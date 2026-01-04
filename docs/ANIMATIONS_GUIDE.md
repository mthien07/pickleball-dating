# Animation Guide

Hướng dẫn sử dụng animations mới được convert từ web design (với màu đỏ-cam theme).

## 📦 Files đã tạo

### 1. **Animation Hooks** (`src/hooks/useAnimations.ts`)

Các hooks tái sử dụng cho animations:

```tsx
import {
  usePressAnimation,
  useElevationAnimation,
  useFadeAnimation,
  useRippleAnimation,
  useBounceAnimation,
  useShimmerAnimation,
  useSlideAnimation,
} from '@/hooks/useAnimations';

// Press animation (scale down on press)
const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

// Elevation animation (shadow + scale)
const { animatedStyle, handlePressIn, handlePressOut } = useElevationAnimation();

// Bounce animation
const { animatedStyle, bounce } = useBounceAnimation();
```

### 2. **Gradient Components** (`src/components/GradientBackground.tsx`)

Các wrapper components với gradient đỏ-cam:

```tsx
import {
  GradientView,
  GradientButton,
  GradientCard,
  GradientOverlay,
  GradientBadge,
  GRADIENT_COLORS,
} from '@/components/GradientBackground';

// Gradient view
<GradientView direction="horizontal">
  <Text>Content</Text>
</GradientView>

// Gradient button wrapper
<GradientButton variant="primary">
  <Text style={{ color: '#FFF' }}>Click me</Text>
</GradientButton>

// Gradient card
<GradientCard variant="subtle">
  <Text>Card content</Text>
</GradientCard>
```

### 3. **Enhanced Button Component** (`src/components/Button.tsx`)

Button với 2 variants mới:

```tsx
import { Button, GradientButton, ElevatedButton } from '@/components/Button';

// Gradient button (red-orange gradient)
<GradientButton
  title="Get Started"
  size="large"
  fullWidth
  onPress={handlePress}
/>

// Elevated button (dynamic shadow on press)
<ElevatedButton
  title="Learn More"
  size="medium"
  onPress={handlePress}
/>
```

### 4. **Demo Screen** (`src/screens/demo/AnimationDemoScreen.tsx`)

Screen showcase tất cả animations mới.

---

## 🎨 Gradient Colors (Red-Orange Theme)

```tsx
import { GRADIENT_COLORS } from '@/components/GradientBackground';

// Available gradients:
GRADIENT_COLORS.primary          // ['#EF4444', '#F97316'] - Red to Orange
GRADIENT_COLORS.primaryReverse   // ['#F97316', '#EF4444'] - Orange to Red
GRADIENT_COLORS.primarySubtle    // Transparent version
GRADIENT_COLORS.primaryDark      // Darker version
GRADIENT_COLORS.primaryLight     // Lighter version
GRADIENT_COLORS.bgSubtle         // Background gradient
GRADIENT_COLORS.bgMedium         // Medium background
```

---

## 🔥 Usage Examples

### 1. Press Animation

```tsx
import { usePressAnimation } from '@/hooks/useAnimations';

const MyComponent = () => {
  const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();

  return (
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
```

### 2. Gradient Button

```tsx
import { GradientButton } from '@/components/Button';

<GradientButton
  title="Match Now"
  size="large"
  fullWidth
  icon={<Ionicons name="heart" size={20} color="#FFF" />}
  onPress={handleMatch}
/>
```

### 3. Elevation Animation

```tsx
import { useElevationAnimation } from '@/hooks/useAnimations';

const ElevatedCard = () => {
  const { animatedStyle, handlePressIn, handlePressOut } = useElevationAnimation({
    elevationFrom: 4,
    elevationTo: 16,
  });

  return (
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text>Hover me</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
```

### 4. Gradient Card with Overlay

```tsx
import { GradientCard, GradientOverlay } from '@/components/GradientBackground';

<GradientCard variant="medium">
  <GradientOverlay position="bottom" intensity="heavy">
    <Image source={profileImage} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.name}>Julia, 25</Text>
    </View>
  </GradientOverlay>
</GradientCard>
```

### 5. Bounce Animation

```tsx
import { useBounceAnimation } from '@/hooks/useAnimations';

const BouncyButton = () => {
  const { animatedStyle, bounce } = useBounceAnimation();

  return (
    <TouchableOpacity onPress={bounce}>
      <Animated.View style={animatedStyle}>
        <Text>Bounce!</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
```

---

## 🎯 Animation Configs

Tất cả animations đều có configs có thể customize:

```tsx
// Press Animation
usePressAnimation({
  scaleValue: 0.98,      // Scale khi press (default: 0.98)
  useSpring: true,       // Dùng spring hoặc timing (default: true)
});

// Elevation Animation
useElevationAnimation({
  elevationFrom: 4,      // Shadow ban đầu
  elevationTo: 12,       // Shadow khi press
  scaleFrom: 1,          // Scale ban đầu
  scaleTo: 1.02,         // Scale khi press
});

// Fade Animation
useFadeAnimation({
  initialOpacity: 0,     // Opacity ban đầu
});
```

---

## 🚀 Best Practices

### 1. Sử dụng Gradient cho CTAs quan trọng

```tsx
// ✅ Good - Gradient cho primary CTA
<GradientButton title="Match Now" onPress={handleMatch} />

// ❌ Bad - Quá nhiều gradient buttons
<GradientButton title="Skip" onPress={handleSkip} />  // Nên dùng secondary
```

### 2. Kết hợp Animations hợp lý

```tsx
// ✅ Good - Elevation cho cards
<ElevatedButton title="Book Court" />

// ✅ Good - Press animation cho icons
const { animatedStyle, handlePressIn, handlePressOut } = usePressAnimation();
```

### 3. Performance

```tsx
// ✅ Good - Reuse animation hooks
const pressAnim = usePressAnimation();

// ❌ Bad - Tạo mới mỗi lần render
const MyComponent = () => {
  const { animatedStyle } = usePressAnimation(); // Don't do this in render
};
```

---

## 📱 Demo Screen

Để xem tất cả animations hoạt động:

1. Import screen:
```tsx
import AnimationDemoScreen from '@/screens/demo/AnimationDemoScreen';
```

2. Thêm vào navigator:
```tsx
<Stack.Screen
  name="AnimationDemo"
  component={AnimationDemoScreen}
  options={{ title: 'Animations' }}
/>
```

3. Navigate đến screen:
```tsx
navigation.navigate('AnimationDemo');
```

---

## 🎨 Design Tokens

Màu sắc chính của project (giữ nguyên):

```tsx
Primary: #EF4444 (Red 500)
Secondary: #F97316 (Orange 500)

Gradient: Red → Orange
Dark BG: #0a0a0a
Surface: #1a1a1a
```

---

## 📝 Notes

- Tất cả animations đều chạy trên **UI thread** (60fps) nhờ Reanimated
- Gradient colors **giữ nguyên** theme đỏ-cam của project
- Components **backwards compatible** - không ảnh hưởng code cũ
- Performance được optimize với `React.memo` và `useAnimatedStyle`

---

## 🔗 References

- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/
- Expo Linear Gradient: https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- Design inspiration: Converted from web component patterns

---

**Last updated:** 2026-01-03
**Màu theme:** Red (#EF4444) to Orange (#F97316)
