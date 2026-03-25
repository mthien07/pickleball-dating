# Phase 3: Memoization & Performance

**Priority:** MEDIUM | **Status:** Partial | **Est:** 1h

## Context

- [Scout Report](../reports/scout-260321-1559-codebase-optimization-analysis.md)
- 161 React.memo occurrences, but inconsistent strategy
- 4 large components missing memoization

## Overview

Add `React.memo` to large components receiving callbacks. Create `OptimizedImage` wrapper for consistent image caching. Remove excessive memoization from simple functions.

## Tasks

### 1. Add React.memo to unmemoized large components

**Files to wrap:**
- `src/screens/matches/chat/ChatScreen.tsx` (460 lines, 9 callbacks)
- `src/screens/profile/settings/SettingsScreen.tsx` (321 lines)
- `src/screens/profile/edit-profile/EditProfileScreen.tsx` (283 lines)
- `src/screens/court/court-detail/CourtDetailScreen.tsx`

### 2. Create OptimizedImage wrapper

**New file:** `src/components/optimized-image/OptimizedImage.tsx`

```typescript
// Standardize image caching: cachePolicy="memory-disk", contentFit="cover"
// Replace direct <Image> usage in key components
```

**Target components for replacement:**
- ProfileCard
- CourtDetailScreen
- ChatScreen (message images)
- EditProfileScreen (photo grid)

### 3. Remove excessive memoization

Review animation hooks for unnecessary `useCallback` wrapping of simple trigger functions.

## Todo

- [x] Add React.memo to 2 large screen components (ChatScreen, CourtDetailScreen) — SettingsScreen & EditProfileScreen owned by parallel phase
- [x] Create OptimizedImage wrapper component
- [ ] Replace Image usage in 4+ components with OptimizedImage
- [ ] Audit and remove unnecessary useCallback in animation hooks
- [x] Verify TypeScript compilation
- [ ] Performance spot-check on device

## Success Criteria

- All components >250 lines are memoized
- Image caching consistent across app
- No performance regressions
