# Phase 2: Navigation & Desktop Sidebar

## Parallelization
- **Can run in parallel** with Phase 1 and Phase 3
- **No shared files** with other phases

## Context Links
- Main navigator: `src/navigation/MainNavigator.tsx` (102 lines)
- Tab icon: `src/navigation/components/TabIcon.tsx` (43 lines)
- Stack navigators: `src/navigation/components/stack-navigators.tsx` (72 lines)
- Web styles ref: `src/theme/webStyles.ts` (read-only, Phase 1 owns)

## Overview
- **Priority:** High (biggest desktop UX improvement)
- **Status:** Pending
- **Description:** Replace bottom tab bar with left sidebar on desktop web

## Key Insights
- `MainNavigator.tsx` uses `createBottomTabNavigator` with 4 tabs
- React Navigation's `tabBarPosition: 'left'` is only for Material Top Tabs, NOT Bottom Tabs
- Best approach: conditionally hide bottom tabs on desktop + render custom sidebar
- TabIcon uses Reanimated animations; reuse in sidebar with larger size
- `useResponsive` available for breakpoint detection

## Requirements

### Functional
- Desktop web: left sidebar (240px) with nav items, hide bottom tabs
- Sidebar shows: app logo, 4 nav items (icons + labels), active state highlight
- Mobile/tablet: unchanged bottom tab bar
- Sidebar nav items match current tabs: Home, Matches, Courts, Profile
- Unread badge on Matches item

### Non-Functional
- Smooth transition between active states
- Sidebar takes full viewport height
- No layout shift when switching tabs

## Architecture
```
MainNavigator.tsx
├── Desktop web: tabBarStyle.display = 'none' + custom sidebar overlay
│   └── web-sidebar-navigation.tsx (NEW)
│       ├── Logo section
│       ├── Nav items (icon + label + badge)
│       └── Uses useNavigation() to switch tabs
└── Mobile: unchanged bottom tabs
```

## File Ownership (EXCLUSIVE)

### Files to Modify
- `src/navigation/MainNavigator.tsx` - Add Platform check, hide tabs on desktop, wrap with sidebar layout
- `src/navigation/components/TabIcon.tsx` - Add optional `large` prop for sidebar icons

### Files to Create
- `src/navigation/components/web-sidebar-navigation.tsx` - Sidebar nav component

### Files NOT Touched
- `src/navigation/components/stack-navigators.tsx`
- `src/navigation/RootNavigator.tsx`
- `src/navigation/AuthNavigator.tsx`

## Implementation Steps

### 1. Create `src/navigation/components/web-sidebar-navigation.tsx`
1. Props: `{ activeTab: string, onTabPress: (tab: string) => void, unreadCount: number }`
2. Render vertical list of nav items: Home, Matches, Courts, Profile
3. Each item: `Pressable` with icon (Ionicons, size 24) + label text
4. Active item: highlight background (`colors.backgroundCircle`), accent-colored icon/text
5. Matches item: show badge if `unreadCount > 0`
6. Top section: logo (`Ionicons tennisball` + "PickleBall" text)
7. Style: `width: 240px`, `backgroundColor: colors.surface`, full height, left border
8. Use `useThemeColors` for theming
9. Add hover effect on items using Pressable `hovered` state (web-only)

### 2. Update `src/navigation/components/TabIcon.tsx`
1. Add optional `size` override prop (already exists, default `iconSizes.md`)
2. No changes needed if sidebar uses Ionicons directly (likely simpler)
3. Only modify if sidebar needs animated tab icons

### 3. Update `src/navigation/MainNavigator.tsx`
1. Import `Platform` and `useResponsive`
2. Import `WebSidebarNavigation`
3. Detect desktop web: `const { isDesktop, isWeb } = useResponsive(); const showSidebar = isWeb && isDesktop;`
4. When `showSidebar`:
   - Set `tabBarStyle: { display: 'none' }` to hide bottom tabs
   - Wrap `Tab.Navigator` in a `View` with `flexDirection: 'row'`
   - Render `WebSidebarNavigation` on the left
   - Track active tab via `navigation.getState().index` and tab names
   - Wire `onTabPress` to `navigation.navigate(tabName)`
5. When NOT `showSidebar`: render current code unchanged

## Todo List
- [x] Create web-sidebar-navigation.tsx with nav items, logo, badge
- [x] Update MainNavigator.tsx to conditionally show sidebar on desktop web
- [x] Add hover states to sidebar nav items
- [x] Verify bottom tabs still work on mobile
- [x] Test tab switching via sidebar
- [x] Verify unread badge displays correctly

## Success Criteria
- Desktop web: sidebar visible on left, bottom tabs hidden
- Mobile: bottom tabs visible, no sidebar
- Active tab highlighted in sidebar
- Tab switching works via sidebar clicks
- Unread badge on Matches item
- File sizes under 200 lines

## Conflict Prevention
- Only this phase modifies `MainNavigator.tsx` and `TabIcon.tsx`
- New `web-sidebar-navigation.tsx` doesn't exist yet
- Reads `breakpoints` values but doesn't modify them

## Risk Assessment
- **Medium:** Wrapping `Tab.Navigator` in a row layout may affect tab content rendering. Need to ensure `flex: 1` on content area.
- **Medium:** `navigation.getState().index` may not update reactively. May need `useNavigationState` hook instead.
- **Mitigation:** Test thoroughly with all 4 tabs. Use `useNavigationState(state => state.index)` for reactive updates.

## Security Considerations
- None (navigation/UI only)

## Next Steps
- After merge: test all tab navigation flows on desktop
- Consider adding sidebar collapse/expand for tablet breakpoint
