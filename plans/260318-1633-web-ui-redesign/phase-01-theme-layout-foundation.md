# Phase 1: Theme & Layout Foundation

## Parallelization
- **Can run in parallel** with Phase 2 and Phase 3
- **No shared files** with other phases

## Context Links
- Breakpoints: `src/theme/breakpoints.ts` (43 lines)
- Web styles: `src/theme/webStyles.ts` (86 lines)
- Responsive hook: `src/hooks/useResponsive.ts` (87 lines)
- Web utils: `src/hooks/useWebUtils.ts` (50 lines)

## Overview
- **Priority:** High (foundation for all desktop improvements)
- **Status:** Pending
- **Description:** Widen desktop content area, add hover/transition utilities, create desktop layout wrapper

## Key Insights
- `MAX_CONTENT_WIDTH.desktop` is 500px; list screens need 900px, swipe stays 380px
- `webStyles.ts` already has basic `hoverable` and `sidebarLayout` styles but unused
- `useResponsive` already provides `isDesktop`, `isWeb`, `deviceType`
- No `src/layouts/` directory exists yet

## Requirements

### Functional
- Desktop content max-width: 900px (list/form screens), 500px unchanged for swipe
- Hover effect hook wrapping Pressable `hovered` state
- Desktop layout wrapper component with centered content area
- Web transition/cursor utilities

### Non-Functional
- Zero impact on mobile
- Under 200 lines per file

## Architecture
```
breakpoints.ts  ─── wider MAX_CONTENT_WIDTH.desktop (500 → 900)
                     add MAX_CONTENT_WIDTH.swipe = 500 (preserve swipe width)
webStyles.ts    ─── add hoverScale, hoverOpacity, transitionFast, cursorPointer utilities
layouts/web-desktop-layout.tsx  ─── NEW: wrapper with max-width + centered content
hooks/useHoverEffect.ts        ─── NEW: simple hook for Pressable hover states
```

## File Ownership (EXCLUSIVE)

### Files to Modify
- `src/theme/breakpoints.ts` - Update `MAX_CONTENT_WIDTH.desktop` to 900, add `swipe` key
- `src/theme/webStyles.ts` - Add hover/transition utility styles

### Files to Create
- `src/layouts/web-desktop-layout.tsx` - Desktop content wrapper
- `src/hooks/useHoverEffect.ts` - Hover state hook

### Files NOT Touched
- `src/theme/tokens.ts` (DO NOT MODIFY)
- `src/hooks/useResponsive.ts` (no changes needed)

## Implementation Steps

### 1. Update `src/theme/breakpoints.ts`
1. Change `MAX_CONTENT_WIDTH.desktop` from 500 to 900
2. Change `MAX_CONTENT_WIDTH.wide` from 500 to 900
3. Add `SWIPE_CONTENT_WIDTH = 500` constant for swipe screen
4. Keep `CARD_WIDTH` and `CARD_MAX_WIDTH` unchanged

### 2. Update `src/theme/webStyles.ts`
1. Add `hoverScale` style: `{ transform: [{ scale: 1.02 }] }`
2. Add `hoverOpacity` style: `{ opacity: 0.85 }`
3. Add `transitionFast` style: `{ transition: 'all 0.15s ease' }`
4. Add `transitionMedium` style: `{ transition: 'all 0.25s ease' }`
5. Add `cursorPointer` style: `{ cursor: 'pointer' }`
6. Update `centeredContainer.maxWidth` to use new desktop width
7. Update `mainContent.maxWidth` to use new desktop width

### 3. Create `src/layouts/web-desktop-layout.tsx`
1. Accept `children`, optional `maxWidth` prop
2. Use `useResponsive` to detect desktop
3. On mobile: render children directly (passthrough)
4. On desktop web: wrap in centered `View` with `maxWidth`, horizontal padding
5. Apply `webStyles.centeredContainer` base style
6. Export as named export

### 4. Create `src/hooks/useHoverEffect.ts`
1. Accept optional config: `{ scale?: number, opacity?: number }`
2. Return `{ isHovered, hoverProps }` where `hoverProps` = `{ onHoverIn, onHoverOut }`
3. Use `useState` for `isHovered`
4. Only activate on `Platform.OS === 'web'`
5. Return noop handlers on native

## Todo List
- [ ] Update breakpoints.ts with wider desktop width + swipe constant
- [ ] Add hover/transition utilities to webStyles.ts
- [ ] Create web-desktop-layout.tsx wrapper component
- [ ] Create useHoverEffect.ts hook
- [ ] Verify mobile builds unchanged (no runtime breakage)

## Success Criteria
- `MAX_CONTENT_WIDTH.desktop === 900`
- `SWIPE_CONTENT_WIDTH === 500`
- `useHoverEffect` returns correct hover state on web, noop on native
- `WebDesktopLayout` renders centered content on desktop, passthrough on mobile
- All files under 200 lines

## Conflict Prevention
- Only this phase touches `breakpoints.ts` and `webStyles.ts`
- New files (`layouts/`, `useHoverEffect.ts`) don't exist yet
- Phase 2 imports from `breakpoints.ts` but only reads existing exports

## Risk Assessment
- **Low:** Changing `MAX_CONTENT_WIDTH.desktop` affects any screen using `webStyles.centeredContainer` or `useResponsive().maxContentWidth`. The HomeSwipeScreen must use `SWIPE_CONTENT_WIDTH` instead.
- **Mitigation:** Search codebase for `MAX_CONTENT_WIDTH.desktop` references and update swipe screen to use new `SWIPE_CONTENT_WIDTH`.

## Security Considerations
- None (purely visual/layout changes)

## Next Steps
- After merge: update HomeSwipeScreen to use `SWIPE_CONTENT_WIDTH` instead of `maxContentWidth`
- Other screens auto-benefit from wider layout via `useResponsive().maxContentWidth`
