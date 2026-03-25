# Tinder UI/UX Design Patterns Research

**Date**: 2026-03-18 | **Focus**: Pickleball Dating App Redesign Reference

---

## Color Palette & Visual Style

**Primary Brand Colors:**
- Electric Pink: `#FD297B`
- Fiery Rose: `#FF5864`
- Pastel Red: `#FF655B`

**Gradient System**: Tinder uses "Background Brand Gradient" (pink → red → coral) for hero sections and CTAs.

**Neutral Palette:**
- Dark BG: `#141414`
- Light BG: `#f0f0f0`
- Borders: `#c8c8c8`, `#b4b4b4`
- Text: `#000000`, `#ffffff`

**Design System**: "Obsidian" — tokenized design system with gradient, color, typography, and spacing tokens for consistency.

---

## Navigation Structure

**Tab Bar Pattern** (Bottom navigation):
1. **Discover** - Card swiping interface (primary engagement)
2. **Matches/Messages** - Chat conversations & match history
3. **Profile** - User profile, settings, preferences

**Hierarchy**: Tab bar persistent, back navigation contextual (not shown in main tabs).

---

## Core Swipe Mechanics

**Card Interaction**:
- Horizontal swipe triggers `translateX` + `rotate` transformation
- Rotation: 0 to ±45° based on drag distance (ratio: `deltaX/20` degrees)
- Threshold: Completes swipe when exceeds ~50% of screen width
- Animation: 0.5s ease-out on release for snappy feedback

**Gesture States**:
- `onStart`: Disable transition, capture touch
- `onMove`: Apply real-time transform following finger
- `onEnd`: Snap to conclusion or reset with ease-out

**Visual Feedback**:
- Like (right): Flame icon, green overlay tint
- Nope (left): X icon, red/gray overlay tint
- Super Like (up): Blue star animation

---

## Button & Component States

**Action Buttons** (below card):
- Nope (X), Like (heart), Super Like (star), Rewind, Boost
- State variants: Default, Hover, Active, Disabled
- Touch targets: Min 48px for thumb accessibility
- Placement: Bottom center, within thumb zone

**Profile Cards**:
- Photo stack (scrollable)
- Name/Age + Distance badge overlay
- Bio section (2-3 lines, expandable)
- Tags/traits below bio
- Actions below (Like/Nope/SuperLike)

---

## Loading & Empty States

**Loading Pattern**:
- Progress indicators on profile setup screens
- Skeleton loaders while fetching matches
- Subtle opacity animations during transitions

**Empty States**:
- No more cards message ("Come back later")
- Profile incomplete nudge with progress bar
- Explore filters reminder when no matches

**Match Celebration**:
- "It's a Match!" screen with confetti animation
- Modal with option to message immediately
- Auto-dismiss after 3-5 seconds or tap to continue

---

## Chat & Messaging UI

**Message Bubbles**:
- Sent (right-aligned, brand color)
- Received (left-aligned, light gray)
- Rounded rect with tail indicator
- GIF/media support below text

**Typing Indicator**: Three bouncing dots animation

---

## Key Takeaways for Pickleball App

1. **Swipe-first UX**: Make swiping smooth (0.5s animations, rotation feedback)
2. **Color consistency**: Use brand gradient strategically (CTAs, highlights)
3. **Touch-friendly**: 48px+ buttons, bottom placement for one-handed use
4. **Match celebration**: Motivate users with visual feedback (confetti, modal)
5. **Profile clarity**: Stack photos, show key info (name, skill level, location)
6. **Progress nudges**: Guide incomplete profiles with progress bars
7. **Tab hierarchy**: Discover → Matches → Profile (proven pattern)

---

## Sources

- [Tinder Brand Color Palette](https://mobbin.com/colors/brand/tinder)
- [Best Dating App UI UX Design Practices 2025](https://medium.com/@prajapatisuketu/best-dating-app-ui-ux-design-practices-in-2025-d38fac4fa9c6)
- [Tinder Card Swipe Figma Prototyping](https://medium.com/@FullStackDesigner/tinder-card-swipe-figma-prototyping-9c9e78fff869)
- [Tinder UX Flow – iOS App Design](https://pageflows.com/ios/products/tinder/)
- [10 UI/UX Design Tips for Dating Apps](https://keyua.org/blog/ui-and-ux-tips-for-dating-app-design/)
- [Tinder's Design System - Obsidian](https://www.lifeattinder.com/blog/building-obsidian-tinders-design-system)
