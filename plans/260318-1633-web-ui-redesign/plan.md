---
title: "Web UI Desktop Redesign"
description: "Improve web/desktop experience with sidebar nav, wider layouts, hover effects, and split auth screens"
status: completed
priority: P2
effort: 3h
branch: main
tags: [web, ui, desktop, responsive]
created: 2026-03-18
---

# Web UI Desktop Redesign

## Goal
Transform the 500px Tinder-style mobile layout into a proper desktop web experience with sidebar navigation, wider content areas, hover effects, and split-screen auth.

## Phases (All Parallel - No Shared Files)

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Theme & Layout Foundation | 1h | pending | [phase-01](phase-01-theme-layout-foundation.md) |
| 2 | Navigation & Desktop Sidebar | 1h | pending | [phase-02](phase-02-navigation-desktop-sidebar.md) |
| 3 | Auth Screens Desktop Split | 1h | pending | [phase-03](phase-03-auth-screens-desktop-split.md) |

## Dependency Graph

```
Phase 1 (theme/layout)  ──┐
Phase 2 (sidebar nav)   ──┼── All independent, parallel-safe
Phase 3 (auth split)    ──┘
```

No file conflicts. Each phase owns exclusive files. Phase 2 imports from `breakpoints.ts` but uses existing exported values (no build-order dependency).

## Key Constraints
- Must NOT break mobile (use `Platform.OS === 'web'` + `useResponsive`)
- Keep existing design tokens/colors unchanged
- Follow `useThemedStyles` / `createStyles` pattern
- Files under 200 lines
- Swipe card stays at 380px max width

## Post-Integration
After all 3 phases merge, verify:
1. Mobile app unchanged (iOS/Android simulators)
2. Desktop web shows sidebar + wider content
3. Auth screens show split layout on desktop
4. Hover effects work on buttons/cards
5. Run `npx expo export:web` to rebuild web bundle

## Risk
- Reanimated animations in TabIcon may behave differently in sidebar context
- `createBottomTabNavigator` sidebar mode may need custom drawer instead
