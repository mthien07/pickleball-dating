# PickleBall Dating App - UI/UX Design Guidelines

**Version**: 2.0
**Last Updated**: 2026-03-18
**Design Philosophy**: Tinder-Inspired Swipe-First Dating for Pickleball Players
**Reference**: Tinder UI/UX Patterns (swipe mechanics, match flow, tab hierarchy)

---

## 1. Visual Style

### Design Language
**Tinder-Style Swipe UI + Vibrant Sport Energy**
- Card-based swipe interface as primary discovery mechanic
- Clean layouts with strategic brand gradient highlights (CTAs, match celebrations)
- Soft shadows and depth via elevation system
- Rounded corners (20-28px cards) for approachability
- Bottom-anchored actions for one-handed thumb-zone use

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#2563EB` | Electric Blue - Brand, headers, main CTAs |
| **Primary Light** | `#60A5FA` | Gradient end, hover accents |
| **Primary Dark** | `#1D4ED8` | Active/pressed states |
| **Secondary** | `#10B981` | Emerald - Courts, success, nature |
| **Accent/CTA** | `#F43F5E` | Rose - Like/match button, hearts, notifications (Tinder-style) |
| **Accent Light** | `#FB7185` | Hover states for accent |
| **Warning** | `#F59E0B` | Amber - Skill level indicators |
| **Background** | `#F8FAFC` | Slate-50, clean app background |
| **Background Dark** | `#0F172A` | Slate-900, dark mode |
| **Surface** | `#FFFFFF` | Cards, modals, input fields |
| **Surface Dark** | `#1E293B` | Slate-800, dark mode cards |
| **Text Primary** | `#0F172A` | Slate-900, headings |
| **Text Secondary** | `#475569` | Slate-600, descriptions |
| **Text Tertiary** | `#94A3B8` | Slate-400, placeholders |
| **Text Inverse** | `#F8FAFC` | On dark/gradient backgrounds |
| **Border** | `#E2E8F0` | Slate-200, dividers |
| **Success** | `#10B981` | Emerald, confirmations |
| **Error** | `#EF4444` | Red, destructive actions |
| **Info** | `#38BDF8` | Sky-400, informational |

**Brand Gradients** (Tinder-inspired):
- Primary: `linear-gradient(135deg, #2563EB, #60A5FA)` — headers, hero
- Match/Like: `linear-gradient(135deg, #F43F5E, #FB7185)` — like button, match celebrations
- Sport Energy: `linear-gradient(135deg, #2563EB, #10B981)` — court/sport features

### Typography

**Font Family** (Athletic, energetic):
- Display/Headlines: **Barlow Condensed** Bold (impact for large titles, sport feel)
- Headings: **Barlow** Bold/SemiBold
- Body: **Barlow** Regular/Medium
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Type Scale**:

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| H1 | 32px | 700 Bold | 40px | Screen titles |
| H2 | 24px | 700 Bold | 32px | Section headers |
| H3 | 20px | 600 Semibold | 28px | Card titles |
| H4 | 18px | 600 Semibold | 24px | Subsection headers |
| Body Large | 16px | 400 Regular | 24px | Primary content |
| Body | 14px | 400 Regular | 20px | Standard text |
| Body Small | 12px | 400 Regular | 18px | Captions, metadata |
| Button | 16px | 600 Semibold | 24px | Button labels |
| Label | 12px | 500 Medium | 16px | Input labels, tags |

**Letter Spacing**:
- Headings: `-0.5px`
- Body: `0px`
- Labels/Caps: `0.5px`

---

## 2. Mobile-First Rules

### Touch Targets
- **Minimum**: 44x44px (iOS HIG) / 48x48dp (Material)
- **Recommended**: 48x48px for primary actions
- **Spacing between targets**: minimum 8px

### Thumb Zone Architecture
- **Primary actions**: Bottom 1/3 of screen (easy reach with thumb)
- **Navigation**: Bottom tab bar or floating bottom sheet
- **Secondary actions**: Top of cards/content areas
- **Destructive actions**: Require swipe or explicit confirmation

### Layout Foundation
- **Single column** layout for all mobile screens
- **Safe Area Insets**:
  - Top: Status bar + 8px
  - Bottom: Home indicator + 16px (iOS) / Navigation bar + 8px (Android)
  - Horizontal: 16px minimum
- **Content width**: 100% - 32px (16px padding each side)
- **Maximum content width**: 428px (iPhone Pro Max reference)

### Spacing System
**Base unit**: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing, icon padding |
| `sm` | 8px | Compact lists, small gaps |
| `md` | 16px | Standard component padding |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Major section breaks |
| `2xl` | 48px | Screen-level spacing |

### Content Priority
1. **Hero content**: Profile photo/swipe cards (占 60% viewport height)
2. **Primary actions**: Swipe controls, match buttons
3. **Metadata**: Name, age, skill level, distance
4. **Secondary info**: Bio, preferences (expandable)

---

## 3. Tinder-Style UX Flows

### Discovery (Swipe-First)
- **Primary screen**: Card stack with swipeable profiles
- Cards show: photo stack, name/age, distance, skill level badge, bio preview
- Three actions below card: Nope (X), Super Like (star), Like (heart)
- Keyboard shortcuts on desktop: ← Nope, → Like, ↑ Super Like
- Empty state: "All caught up! Check again later" with reload option

### Match Flow
1. User swipes right (Like) on a profile
2. If mutual like → **"It's a Match!"** celebration screen
3. Celebration: confetti animation, both avatars, "Send a message" CTA
4. Match auto-saved to Matches tab with unread indicator
5. Dismiss: tap anywhere or swipe down

### Tab Hierarchy (Tinder-proven)
1. **Home** (heart icon) — Swipe discovery, primary engagement
2. **Matches** (chat icon) — Chat list, match history, unread badges
3. **Courts** (location icon) — Court discovery, booking
4. **Profile** (person icon) — Settings, edit profile, preferences

### Profile Card Content Priority
1. **Photo** (60% of card height, full bleed with bottom gradient overlay)
2. **Name + Age** (bold, white on gradient)
3. **Distance + Skill Level** (badges)
4. **Bio** (2-3 lines, expandable on tap)
5. **Play Style Tags** (pills below bio)

### Chat Patterns
- Sent bubbles: right-aligned, accent/primary color
- Received bubbles: left-aligned, surface/gray
- Typing indicator: three bouncing dots
- GIF/media support
- Match context header showing shared interests

### Profile Completeness
- Progress bar nudge for incomplete profiles
- "Add more photos" prompt
- Skill level verification flow

---

## 4. Responsive Strategy

### Breakpoints

| Device | Width | Layout Strategy |
|--------|-------|-----------------|
| Mobile | < 768px | Single column, stack vertically |
| Tablet | 768px - 1024px | 2-column grid for lists, full width for detail |
| Desktop | > 1024px | Max 1200px container, 3-column grids |

### Layout Adaptation

**Mobile (Primary)**:
- Flexbox column layout
- Full-width cards
- Bottom navigation
- Swipeable carousels

**Tablet**:
- Grid layout (2 columns) for match list
- Sidebar navigation (optional)
- Modal dialogs expand to 80% width

**Desktop** (Tinder Desktop-Style):
- Left sidebar navigation (240px), bottom tabs hidden
- Content area: max 900px centered (swipe card stays 500px max)
- Auth screens: split layout (brand panel left 45% + form right 55%)
- Hover effects on interactive elements (scale 1.02, opacity, cursor pointer)
- Keyboard shortcuts for swipe actions

### Media Scaling
- **Profile images**: 1:1 aspect ratio, progressive loading
- **Court photos**: 16:9 aspect ratio
- **Max width**: 100% of container
- **Lazy loading**: Images outside viewport

### Typography Scaling
**Mobile**: Base scale (14px body)
**Tablet**: +10% (15.4px body)
**Desktop**: +20% (16.8px body)

---

## 5. Component Library

### Button

#### Variants

**Primary Button**:
```
Default:
  - Background: #2563EB (Electric Blue)
  - Text: #FFFFFF, 16px Barlow SemiBold
  - Border Radius: 16px
  - Padding: 16px 24px
  - Shadow: 0px 4px 12px rgba(37, 99, 235, 0.25)

Hover (web):
  - Background: #1D4ED8
  - Shadow: 0px 6px 16px rgba(37, 99, 235, 0.35)
  - Scale: 1.02

Pressed:
  - Background: #1D4ED8
  - Scale: 0.98
  - Shadow: 0px 2px 8px rgba(37, 99, 235, 0.2)

Disabled:
  - Background: #E2E8F0
  - Text: #94A3B8
  - Shadow: None

Loading:
  - Background: #2563EB (50% opacity)
  - Spinner: White, centered
```

**Like/CTA Button** (Tinder-style accent):
```
Default:
  - Background: gradient(135deg, #F43F5E, #FB7185)
  - Text/Icon: #FFFFFF
  - Border Radius: full (circular)
  - Shadow: 0px 4px 14px rgba(244, 63, 94, 0.4)

Hover (web):
  - Scale: 1.1
  - Shadow: 0px 6px 20px rgba(244, 63, 94, 0.5)

Pressed:
  - Scale: 0.9
```

**Secondary Button**:
```
Default:
  - Background: Transparent
  - Border: 2px solid #2563EB
  - Text: #2563EB, 16px Barlow SemiBold
  - Border Radius: 16px
  - Padding: 14px 24px

Hover (web):
  - Background: rgba(37, 99, 235, 0.08)
  - Scale: 1.02

Pressed:
  - Background: rgba(37, 99, 235, 0.16)
  - Scale: 0.98

Disabled:
  - Border: 2px solid #E2E8F0
  - Text: #94A3B8
```

**Text Button** (Tertiary):
```
Default:
  - Background: Transparent
  - Text: #2563EB, 16px Barlow SemiBold
  - Padding: 8px 16px

Hover (web):
  - Background: rgba(37, 99, 235, 0.08)

Pressed:
  - Background: rgba(37, 99, 235, 0.16)
```

**Icon Button**:
```
Default:
  - Size: 48x48px
  - Icon: 24x24px, #2D2D2D
  - Background: Transparent
  - Border Radius: 24px (circular)

Hover:
  - Background: rgba(0, 0, 0, 0.04)

Pressed:
  - Background: rgba(0, 0, 0, 0.08)
  - Scale: 0.95
```

### Input Field

**Text Input**:
```
Default:
  - Background: #FFFFFF
  - Border: 1px solid #E0E0E0
  - Border Radius: 12px
  - Padding: 16px
  - Text: 16px Regular, #2D2D2D
  - Placeholder: 16px Regular, #9E9E9E

Focused:
  - Border: 2px solid #2563EB
  - Shadow: 0px 0px 0px 4px rgba(37, 99, 235, 0.08)

Filled (valid):
  - Border: 1px solid #4CAF50

Error:
  - Border: 2px solid #F44336
  - Helper text: 12px Regular, #F44336
  - Icon: Error icon, #F44336

Disabled:
  - Background: #FAFAFA
  - Border: 1px solid #E0E0E0
  - Text: #9E9E9E
```

**Search Input**:
```
Default:
  - Background: #F5F5F5
  - Border: None
  - Border Radius: 24px (pill shape)
  - Padding: 12px 16px 12px 48px (space for icon)
  - Leading icon: Search icon, 20x20px, #6B6B6B
  - Placeholder: "Search courts, players..."

Focused:
  - Background: #FFFFFF
  - Shadow: 0px 2px 8px rgba(0, 0, 0, 0.08)
```

### Card

**Profile Card (Swipe)**:
```
Default:
  - Background: #FFFFFF
  - Border Radius: 24px
  - Shadow: 0px 8px 24px rgba(0, 0, 0, 0.12)
  - Aspect Ratio: 3:4
  - Image: Full bleed with gradient overlay (bottom)
  - Content overlay: Bottom 40%, gradient from transparent to rgba(0,0,0,0.6)

Hover (web only):
  - Shadow: 0px 12px 32px rgba(0, 0, 0, 0.16)
  - Scale: 1.02

Pressed:
  - Scale: 0.98

Swiping Right:
  - Overlay: Green tint rgba(76, 175, 80, 0.2)
  - Icon: Heart, top-right, 48x48px

Swiping Left:
  - Overlay: Red tint rgba(244, 67, 54, 0.2)
  - Icon: X, top-left, 48x48px
```

**Court Card (List)**:
```
Default:
  - Background: #FFFFFF
  - Border Radius: 16px
  - Shadow: 0px 4px 12px rgba(0, 0, 0, 0.08)
  - Layout: Horizontal (120x90px image + content)
  - Padding: 12px
  - Spacing: 12px between image and text

Pressed:
  - Background: #FAFAFA
  - Scale: 0.98
```

**Match Card (Chat List)**:
```
Default:
  - Background: #FFFFFF
  - Border: None
  - Border Radius: 0px
  - Padding: 16px
  - Layout: Avatar (56x56px) + Text + Timestamp
  - Divider: 1px solid #E0E0E0 (bottom)

Unread:
  - Badge: Orange dot (8x8px), top-right of avatar
  - Name: 600 Semibold (instead of Regular)

Pressed:
  - Background: #FAFAFA
```

### Avatar

**Sizes**:
- **XS**: 32x32px (group members)
- **SM**: 48x48px (chat list)
- **MD**: 56x56px (match list)
- **LG**: 80x80px (profile preview)
- **XL**: 120x120px (full profile)

**Default**:
```
  - Border Radius: 50% (circular)
  - Border: 2px solid #FFFFFF (when on colored background)
  - Shadow: 0px 2px 8px rgba(0, 0, 0, 0.12)

Active (online):
  - Status indicator: 12x12px green dot (#4CAF50)
  - Position: Bottom-right, overlapping avatar
  - Border: 2px solid #FFFFFF
```

### Badge

```
Default:
  - Background: #FFD700
  - Text: #2D2D2D, 12px Semibold
  - Padding: 4px 12px
  - Border Radius: 12px (pill)

Verified:
  - Background: #A8C8E8
  - Icon: Checkmark, 12x12px white
  - Text: White

Skill Level:
  - Beginner: #4CAF50
  - Intermediate: #FF9800
  - Advanced: #F44336
  - Pro: #9C27B0
```

### Bottom Navigation

```
Container:
  - Background: #FFFFFF
  - Border Top: 1px solid #E0E0E0
  - Padding: 8px 0px 8px + safe-area-bottom
  - Height: 56px + safe-area-bottom
  - Shadow: 0px -2px 8px rgba(0, 0, 0, 0.04)

Tab Item:
  - Size: 48x48px touch target
  - Icon: 24x24px
  - Label: 10px Semibold (optional)
  - Spacing: Equal distribution

Tab Active:
  - Icon: #F43F5E (accent, Tinder-style)
  - Label: #F43F5E
  - Scale: 1.1 (animated spring)

Tab Inactive:
  - Icon: #94A3B8
  - Label: #94A3B8
  - Scale: 0.9, opacity: 0.6
```

---

## 6. Interaction & Motion

### Animation Principles
- **Duration**: 200-300ms for micro-interactions, 400-500ms for transitions
- **Easing**:
  - Entrance: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
  - Exit: `cubic-bezier(0.4, 0, 1, 1)` (ease-in)
  - Emphasis: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-in-out)

### Micro-interactions

**Button Press**:
```
  - Scale down to 0.98
  - Duration: 100ms
  - Easing: ease-in
  - Release: scale back to 1.0, 150ms, ease-out
```

**Toggle Switch**:
```
  - Slide knob: 250ms ease-in-out
  - Color transition: 200ms linear
  - Background: ON #4CAF50, OFF #E0E0E0
```

**Checkbox**:
```
  - Border: 2px solid #E0E0E0 (unchecked)
  - Checked: Background #5B9FE3, white checkmark
  - Checkmark scale: 0 → 1, 200ms, ease-out with bounce
```

**Heart/Like Icon**:
```
  - Tap: Scale 0.8 → 1.2 → 1.0, 300ms
  - Color: Gray → Red with glow effect
  - Particles: Small hearts burst outward (optional)
```

### Page Transitions

**Push (Navigate Forward)**:
```
  - New screen slides in from right
  - Current screen slides left (iOS style)
  - Duration: 350ms
  - Easing: ease-in-out
```

**Pop (Navigate Back)**:
```
  - Current screen slides out to right
  - Previous screen slides in from left
  - Duration: 350ms
  - Easing: ease-in-out
```

**Modal Present**:
```
  - Backdrop fade in: 0 → 0.5 opacity, 250ms
  - Modal slide up from bottom: 300ms ease-out
  - Spring damping: 0.8
```

**Modal Dismiss**:
```
  - Modal slide down: 250ms ease-in
  - Backdrop fade out: 200ms
```

### Swipe Interactions

**Card Swipe** (Tinder-style):
```
  - Drag resistance: 1.0 (no friction, follows finger exactly)
  - Rotation: ±45° max based on horizontal drag (deltaX/20 degrees)
  - Threshold: 50% of screen width to auto-complete
  - Auto-complete: 500ms ease-out to final position
  - Dismiss: Fade out + fly off screen direction
  - Next card: Scale 0.95 → 1.0, opacity 0.5 → 1.0, 200ms
  - Visual feedback:
    - Swipe right: Green tint overlay + heart icon (top-right)
    - Swipe left: Red tint overlay + X icon (top-left)
    - Swipe up: Blue tint + star icon (super like)
```

**Pull to Refresh**:
```
  - Pull distance: 80px
  - Indicator: Circular spinner
  - Spinner appears at 40px, spins faster as pull increases
  - Release: Snap to 60px, trigger refresh
  - Complete: Spinner shrinks and fades, 300ms
```

**Swipe to Delete (Lists)**:
```
  - Reveal: Red background with trash icon
  - Threshold: 60% of row width
  - Confirm: Slide out completely, 250ms
  - Undo toast: 3 seconds bottom notification
```

### Special Patterns

**Optimistic UI**:
- Show immediate feedback (message sent, like registered)
- Display pending state (lighter opacity, spinner)
- Rollback on error with toast notification

**Debounced Search**:
- Wait 300ms after last keystroke before triggering search
- Show loading indicator in search field
- Clear button appears when text exists

**Skeleton Loading**:
```
  - Background: #F5F5F5
  - Shimmer: Linear gradient animation
  - Colors: #F5F5F5 → #E0E0E0 → #F5F5F5
  - Duration: 1500ms infinite
  - Direction: Left to right
```

**Match Celebration** (Tinder "It's a Match!"):
```
  - Full-screen modal with backdrop blur(8px)
  - "It's a Match!" title: scale 0 → 1.1 → 1.0 (bounce), 400ms
  - Both user avatars slide in from sides, meet in center
  - Confetti: 2 seconds, particles fall from top
  - CTA: "Send a Message" primary button + "Keep Swiping" text button
  - Auto-dismiss: 5 seconds or tap anywhere
  - Background: gradient overlay (primary → accent)
```

**Empty States**:
```
  - Icon: 80x80px, light gray
  - Title: H3, #6B6B6B
  - Description: Body, #9E9E9E
  - CTA Button: Primary or Secondary
  - Fade in: 300ms after page load
```

**Toast Notifications**:
```
  - Position: Bottom, 16px from safe area
  - Background: #2D2D2D (90% opacity)
  - Text: White, 14px Regular
  - Padding: 12px 16px
  - Border Radius: 8px
  - Shadow: 0px 4px 12px rgba(0, 0, 0, 0.3)
  - Animation: Slide up 200ms, auto-dismiss 3s, slide down 200ms
```

---

## 7. Accessibility

### Color Contrast
- **Text on Background**: Minimum 4.5:1 (WCAG AA)
- **Large Text (18px+)**: Minimum 3:1
- **Interactive Elements**: Minimum 3:1 against background

### Screen Reader Support
- Label all interactive elements
- Announce state changes (loading, errors, success)
- Reading order matches visual hierarchy

### Keyboard Navigation
- Tab order: Top to bottom, left to right
- Focus indicators: 2px solid #FFD700 outline with 4px offset
- Escape key: Close modals/overlays

### Motion Reduction
- Respect `prefers-reduced-motion` OS setting
- Disable animations, use instant transitions instead
- Keep critical feedback (color changes, state updates)

---

## 8. Dark Mode

**Color Mappings**:

| Light | Dark | Usage |
|-------|------|-------|
| #FAFAFA | #121212 | Background |
| #FFFFFF | #1E1E1E | Surface |
| #2D2D2D | #FFFFFF | Text Primary |
| #6B6B6B | #B0B0B0 | Text Secondary |
| #E0E0E0 | #2D2D2D | Borders |

**Adjustments**:
- Reduce shadows: Use lighter opacity or borders instead
- Desaturate accent colors slightly for comfort
- Increase contrast for readability

---

## Implementation Notes

### For React Native Developers

**Recommended Libraries**:
- **Styling**: StyleSheet with design tokens exported from constants
- **Animations**: React Native Reanimated v4 (worklets API)
- **Navigation**: React Navigation v6 (stack, bottom tabs)
- **Icons**: React Native Vector Icons or expo/vector-icons
- **Images**: expo-image (optimized caching, progressive loading)

**Design Tokens File** (`src/theme/tokens.ts`):
```typescript
export const colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  accent: '#F43F5E',
  // ... (see src/theme/tokens.ts for full palette)
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  // ... (map all type scales)
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
```

**Component Example**:
```tsx
import { colors, spacing, borderRadius } from '@/theme/tokens';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4, // Android shadow
  },
});
```

**Animation Example** (Reanimated v4):
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.98, { damping: 10, stiffness: 400 });
};

const handlePressOut = () => {
  scale.value = withSpring(1, { damping: 10, stiffness: 400 });
};
```

---

**End of Guidelines**

*These guidelines ensure consistency, accessibility, and delightful user experience across the PickleBall Dating App.*
