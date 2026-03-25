# PickleBall Dating - Design System

## Tổng quan

Hệ thống thiết kế cho ứng dụng hẹn hò dành cho người chơi Pickleball. Phong cách năng động, thể thao, vui tươi.

---

## 1. Nhận diện thương hiệu

| Yếu tố | Đề xuất |
|--------|---------|
| **Phong cách chính** | Vibrant & Block-based + Motion-Driven |
| **Phong cách phụ** | Aurora UI, Glassmorphism |
| **Cảm xúc** | Năng động, vui tươi, thể thao, trẻ trung |
| **Đối tượng** | Người chơi Pickleball muốn tìm bạn chơi/hẹn hò |

---

## 2. Bảng màu (Color Palette)

### Màu chính

| Vai trò | Tên | Hex | RGB | Sử dụng |
|---------|-----|-----|-----|---------|
| **Primary** | Electric Blue | `#2563EB` | rgb(37, 99, 235) | Brand chính, headers, nút CTA chính |
| **Primary Light** | Sky Blue | `#60A5FA` | rgb(96, 165, 250) | Điểm nhấn, hover states |
| **Primary Dark** | Deep Blue | `#1D4ED8` | rgb(29, 78, 216) | Active states, shadows |

### Màu phụ (Dating/Match)

| Vai trò | Tên | Hex | RGB | Sử dụng |
|---------|-----|-----|-----|---------|
| **Accent/CTA** | Rose | `#F43F5E` | rgb(244, 63, 94) | Nút like/match, trái tim, thông báo match |
| **Accent Light** | Pink | `#FB7185` | rgb(251, 113, 133) | Hover states cho accent |
| **Success** | Emerald | `#10B981` | rgb(16, 185, 129) | Thành công, online status |
| **Warning** | Amber | `#F59E0B` | rgb(245, 158, 11) | Cảnh báo, skill level |

### Màu nền & Text

| Vai trò | Tên | Hex | Sử dụng |
|---------|-----|-----|---------|
| **Background** | Slate 50 | `#F8FAFC` | Nền app chính |
| **Surface** | White | `#FFFFFF` | Cards, modals |
| **Border** | Slate 200 | `#E2E8F0` | Viền, dividers |
| **Text Primary** | Slate 900 | `#0F172A` | Tiêu đề, text chính |
| **Text Secondary** | Slate 600 | `#475569` | Text phụ, descriptions |
| **Text Muted** | Slate 400 | `#94A3B8` | Placeholders, hints |

### Dark Mode

| Vai trò | Hex |
|---------|-----|
| **Background** | `#0F172A` (Slate 900) |
| **Surface** | `#1E293B` (Slate 800) |
| **Border** | `#334155` (Slate 700) |
| **Text Primary** | `#F8FAFC` (Slate 50) |
| **Text Secondary** | `#CBD5E1` (Slate 300) |

### Gradients

```css
/* Primary Gradient - cho headers, hero sections */
background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);

/* Match/Like Gradient - cho match animations */
background: linear-gradient(135deg, #F43F5E 0%, #FB7185 100%);

/* Sports Energy Gradient */
background: linear-gradient(135deg, #2563EB 0%, #10B981 100%);
```

---

## 3. Typography

### Font Family

**Cặp font chính:** Barlow Condensed / Barlow

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500;600;700&display=swap');
```

| Loại | Font | Weight | Sử dụng |
|------|------|--------|---------|
| **Display** | Barlow Condensed | 700 | Logo, hero text |
| **Heading** | Barlow Condensed | 600 | H1, H2, section titles |
| **Subheading** | Barlow | 600 | H3, H4, card titles |
| **Body** | Barlow | 400-500 | Paragraphs, descriptions |
| **Caption** | Barlow | 400 | Labels, hints, metadata |

### Font Sizes (React Native)

| Name | Size | Line Height | Sử dụng |
|------|------|-------------|---------|
| `xs` | 12px | 16px | Captions, badges |
| `sm` | 14px | 20px | Secondary text |
| `base` | 16px | 24px | Body text |
| `lg` | 18px | 28px | Large body |
| `xl` | 20px | 28px | Card titles |
| `2xl` | 24px | 32px | Section headers |
| `3xl` | 30px | 36px | Page titles |
| `4xl` | 36px | 40px | Hero text |

---

## 4. Spacing & Layout

### Spacing Scale

| Token | Value | Sử dụng |
|-------|-------|---------|
| `xs` | 4px | Inline spacing nhỏ |
| `sm` | 8px | Padding nhỏ, gaps |
| `md` | 16px | Padding chuẩn |
| `lg` | 24px | Section padding |
| `xl` | 32px | Large gaps |
| `2xl` | 48px | Section margins |
| `3xl` | 64px | Hero sections |

### Border Radius

| Token | Value | Sử dụng |
|-------|-------|---------|
| `sm` | 8px | Buttons, inputs |
| `md` | 12px | Cards nhỏ |
| `lg` | 16px | Cards lớn |
| `xl` | 24px | Modals, bottom sheets |
| `full` | 9999px | Avatars, pills |

---

## 5. Components

### Buttons

```
Primary Button:
- Background: #2563EB
- Text: #FFFFFF
- Border Radius: 12px
- Padding: 16px 24px
- Font: Barlow 600, 16px

Secondary Button:
- Background: transparent
- Border: 2px solid #2563EB
- Text: #2563EB

Accent/CTA Button (Like/Match):
- Background: linear-gradient(135deg, #F43F5E, #FB7185)
- Text: #FFFFFF
- Shadow: 0 4px 14px rgba(244, 63, 94, 0.4)
```

### Cards

```
Profile Card:
- Background: #FFFFFF
- Border Radius: 24px
- Shadow: 0 10px 40px rgba(0, 0, 0, 0.1)
- Padding: 0 (image full-bleed)

Info Card:
- Background: #FFFFFF
- Border: 1px solid #E2E8F0
- Border Radius: 16px
- Padding: 16px
```

### Inputs

```
Text Input:
- Background: #F8FAFC
- Border: 1px solid #E2E8F0
- Border Radius: 12px
- Padding: 16px
- Focus Border: #2563EB
```

---

## 6. Animations & Effects

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| **Micro-interactions** | 150ms | ease-out |
| **Transitions** | 200-300ms | ease-out |
| **Page transitions** | 300-400ms | ease-in-out |
| **Match animation** | 500-800ms | spring |

### Key Effects

- **Swipe cards:** Spring physics với damping
- **Like animation:** Scale up + heart particles
- **Match popup:** Scale từ 0 + confetti
- **Button press:** Scale 0.95 + opacity
- **Card hover:** translateY -4px + shadow increase

### React Native Reanimated

```typescript
// Swipe animation
const cardStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: translateX.value },
    { rotate: `${translateX.value / 20}deg` },
  ],
}));

// Like button press
const buttonStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(pressed.value ? 0.9 : 1) }],
}));
```

---

## 7. Icons

### Icon Library

Sử dụng **Lucide Icons** hoặc **Heroicons** (SVG)

### Common Icons

| Action | Icon |
|--------|------|
| Like | `heart` |
| Pass | `x` |
| Chat | `message-circle` |
| Profile | `user` |
| Settings | `settings` |
| Location | `map-pin` |
| Calendar | `calendar` |
| Court | `map` |
| Match | `users` |
| Notification | `bell` |

**LƯU Ý:** KHÔNG sử dụng emoji làm icon trong UI.

---

## 8. Accessibility

### Contrast Ratios

- Text trên nền: tối thiểu 4.5:1
- Large text (18px+): tối thiểu 3:1
- Interactive elements: tối thiểu 3:1

### Touch Targets

- Minimum: 44x44px
- Recommended: 48x48px

### Focus States

```css
/* Focus ring */
outline: 2px solid #2563EB;
outline-offset: 2px;
```

### Motion

```typescript
// Respect user preferences
import { useReducedMotion } from 'react-native-reanimated';

const reducedMotion = useReducedMotion();
const duration = reducedMotion ? 0 : 300;
```

---

## 9. Pre-Delivery Checklist

- [ ] SVG icons only (Lucide/Heroicons) - không emoji
- [ ] Touch targets tối thiểu 44x44px
- [ ] Smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum
- [ ] Visible focus states
- [ ] `useReducedMotion` respected
- [ ] Responsive trên các màn hình

---

## 10. File References

### Theme Implementation

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  accent: '#F43F5E',
  accentLight: '#FB7185',
  success: '#10B981',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
};

// Dark mode
export const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
};
```
