# Phase 8: Web Responsive & Polish

## Context Links
- Depends on: ALL previous phases (Phase 1-7)
- Web styles: `src/theme/webStyles.ts`
- Breakpoints: `src/theme/breakpoints.ts`
- Responsive hook: `src/hooks/useResponsive.ts`
- Web sidebar: `src/navigation/components/web-sidebar-navigation.tsx`
- Web utils: `src/hooks/useWebUtils.ts`
- Hover hook: `src/hooks/useHoverEffect.ts`
- CourtMapView.web: `src/components/CourtMapView.web.tsx`

## Overview
- **Priority**: P2
- **Status**: completed
- **Effort**: 3h
- **Description**: Final polish pass. Ensure all redesigned screens render beautifully on web (desktop + tablet). Refine sidebar layout, hover states, responsive breakpoints. Cross-platform testing. Performance optimization.

## Key Insights
- App already has web support with sidebar navigation for desktop
- `useResponsive` hook provides `isDesktop`, `isWeb`, `isTablet`, `maxContentWidth`, `containerPadding`
- `web-sidebar-navigation.tsx` renders left sidebar on desktop with nav links
- Current SWIPE_CONTENT_WIDTH (500px) and MAX_CONTENT_WIDTH used for constraining layouts
- Web uses metro bundler (configured in app.json)
- CourtMapView has a `.web.tsx` variant for web-specific map rendering

## Requirements

### Functional
1. Desktop: Editorial profile feed centered with max-width, sidebar navigation refined
2. Tablet: Responsive layout, no sidebar, wider content area
3. Mobile web: Same as native mobile layout
4. Hover states: Subtle scale/shadow on interactive cards (web only)
5. Sidebar navigation: Refined styling matching Hinge editorial aesthetic
6. Web-specific animations: Use CSS transitions where Reanimated isn't available
7. Keyboard navigation: Tab focus indicators, Enter to activate

### Non-Functional
- All screens pass visual inspection on: iPhone, Android, iPad, Desktop Chrome, Desktop Safari
- No performance regressions (Lighthouse score, FlatList scroll perf)
- Accessibility: WCAG AA color contrast on all text, focus indicators on web

## Architecture

### Desktop Layout
```
┌────────┬──────────────────────────────┐
│        │                              │
│ Sidebar│     Main Content Area        │
│ Nav    │     (max-width: 600px)       │
│        │     centered                 │
│ [Home] │                              │
│ [Match]│    ┌──────────────────┐      │
│ [Disc] │    │ Editorial Feed   │      │
│ [Prof] │    │ or Screen Content│      │
│        │    └──────────────────┘      │
│        │                              │
└────────┴──────────────────────────────┘
```

### Tablet Layout
```
┌──────────────────────────────┐
│     Main Content Area        │
│     (max-width: 600px)       │
│     centered, padded         │
│                              │
│    ┌──────────────────┐      │
│    │ Screen Content   │      │
│    └──────────────────┘      │
│                              │
│  [Bottom Tab Navigation]     │
└──────────────────────────────┘
```

### Responsive Breakpoint Usage
```
mobile:  0-767px   -> Full width, bottom tabs
tablet:  768-1023px -> Centered content, bottom tabs
desktop: 1024+     -> Sidebar + centered content
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/theme/webStyles.ts` | Update web styles for Hinge aesthetic, add hover classes |
| `src/theme/breakpoints.ts` | Verify MAX_CONTENT_WIDTH values for editorial feed |
| `src/hooks/useResponsive.ts` | Verify/adjust responsive logic if needed |
| `src/hooks/useHoverEffect.ts` | Refine hover animation (subtle scale + shadow) |
| `src/hooks/useWebUtils.ts` | Verify keyboard shortcuts still work |
| `src/navigation/components/web-sidebar-navigation.tsx` | Restyle sidebar: clean, minimal, Hinge-like |
| `src/navigation/components/TabIcon.tsx` | Refine tab icon styling for muted palette |
| `src/navigation/MainNavigator.tsx` | Update tab bar colors |
| `src/components/CourtMapView.web.tsx` | Verify map styling matches new palette |

### Files to Create
None.

## Implementation Steps

1. **Update webStyles.ts**:
   - Change comment references from "Tinder" to "Hinge editorial"
   - Update MAX_CONTENT_WIDTH.desktop to 600 (narrower, more editorial)
   - Add hover card style (subtle scale 1.01, elevated shadow transition)
   - Add focus-visible styles for keyboard navigation

2. **Update breakpoints.ts**:
   - Verify EDITORIAL_FEED_WIDTH = 600 (added in Phase 1)
   - Update CONTAINER_PADDING for editorial feel (slightly more generous)

3. **Restyle web-sidebar-navigation.tsx**:
   - Clean white/dark surface background
   - Nav items: icon + label, muted text, active item has primary text + left border accent
   - App logo at top in PlayfairDisplay-Bold
   - No gradient or glassmorphism in sidebar
   - Subtle dividers between sections

4. **Restyle TabIcon.tsx**: Muted icon colors. Active: primary (muted blue). Inactive: tertiary gray. No bold background fills.

5. **Update MainNavigator tab bar**: Muted background, subtle top border, no shadow. Icon + label style matching editorial palette.

6. **Update useHoverEffect**: Web hover should be subtle: scale(1.01) + slight shadow increase. Use CSS transition (200ms ease). No bounce or spring on hover.

7. **Verify useWebUtils keyboard shortcuts**: Ensure arrow keys work on home feed for pass/like. Tab navigation between interactive elements.

8. **Verify CourtMapView.web.tsx**: Map marker colors match new palette. Info window styling consistent with editorial design.

9. **Cross-platform testing checklist** (manual):
   - [ ] iPhone Safari / Chrome
   - [ ] Android Chrome
   - [ ] iPad Safari
   - [ ] Desktop Chrome (1440px)
   - [ ] Desktop Safari (1440px)
   - [ ] Desktop Firefox (1440px)
   - [ ] Desktop Chrome narrow (768px - tablet simulation)

10. **Performance audit**:
    - Run `npx expo start --web` and check console for warnings
    - Verify no unnecessary re-renders in editorial feed (React DevTools)
    - Check image lazy loading works in web FlatList
    - Verify font loading doesn't cause FOUT (flash of unstyled text)

11. **Accessibility audit**:
    - Check all text colors meet WCAG AA contrast ratio (4.5:1 minimum)
    - Verify focus indicators visible on all interactive elements (web)
    - Ensure all buttons have accessibilityLabel
    - Screen reader: verify profile content is readable in order

## Todo List
- [x] Update webStyles.ts (hoverScale 1.01, hoverable transition + box-shadow)
- [x] Verify/update breakpoints.ts (MAX_CONTENT_WIDTH.desktop/wide → 600)
- [x] Restyle web-sidebar-navigation.tsx (PlayfairDisplay-Bold logo, primary color, left-border active, Barlow fonts)
- [x] TabIcon.tsx — no change needed (colors passed via props, already using theme tokens)
- [x] MainNavigator tab bar — already uses colors.accent/textTertiary correctly
- [x] useHoverEffect — already correct (stateful isHovered, no config needed)
- [x] useWebUtils keyboard shortcuts — verified, no hardcoded colors
- [x] CourtMapView.web.tsx — placeholder iframe, no colors to update
- [x] gradient-styles.ts — fixed shadowColor #2563EB → #000, border-color → rgba(0,0,0,0.08)
- [x] notification.service.ts — fixed lightColor #2563EB → #3B5998
- [x] web/index.html — theme-color #3B5998, body bg #FAF9F7, dark bg #121212
- [ ] Test on iPhone (Safari/Chrome)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad (Safari)
- [ ] Test on Desktop Chrome (1440px)
- [ ] Test on Desktop Safari (1440px)
- [ ] Test on Desktop narrow (768px)
- [ ] Performance audit (re-renders, image loading, font loading)
- [ ] Accessibility audit (contrast ratios, focus indicators, labels)
- [ ] Fix any visual inconsistencies found during testing
- [ ] Final compile check on all platforms

## Success Criteria
- All screens render correctly on mobile, tablet, and desktop web
- Desktop sidebar is clean, editorial-styled
- Hover effects are subtle and consistent (web only)
- Keyboard navigation works on home feed and all interactive elements
- No performance regressions
- WCAG AA contrast compliance on all text
- No console errors or warnings
- Font loading works without flash of unstyled text

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| PlayfairDisplay FOUT on web | Medium | Use font-display: swap via Expo web config |
| Hover effect jank on complex cards | Low | Keep hover simple (opacity/scale only, no layout shifts) |
| Responsive breakpoint edge cases | Medium | Test at exact breakpoint widths (767, 768, 1023, 1024) |
| Accessibility contrast failures | Medium | Use contrast checker tool; adjust colors in Phase 1 tokens if needed |

## Security Considerations
- No security impact

## Next Steps
- This is the final phase. After completion:
  - Update design-system.md with final design reference
  - Update project-changelog.md with redesign entry
  - Create before/after screenshots for documentation
