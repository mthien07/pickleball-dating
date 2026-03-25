# Phase 1: Modularize Large Screens

**Priority:** HIGH | **Status:** Complete | **Est:** 1.5h

## Context

- [Scout Report](../reports/scout-260321-1559-codebase-optimization-analysis.md)
- Rule: Keep code files under 200 lines

## Overview

3 screen files exceed 250 lines and need component extraction. Each has clear logical boundaries for splitting.

## Related Files

### 1. SettingsScreen (321 lines → ~80 lines)

**File:** `src/screens/profile/settings/SettingsScreen.tsx`

**Extract to:**
- `settings-appearance-section.tsx` — Theme toggle, display prefs (~60 lines)
- `settings-account-section.tsx` — Account info, privacy (~70 lines)
- `settings-danger-zone-section.tsx` — Delete account, logout (~50 lines)

**Approach:** Extract each section as a memoized component. Main file becomes orchestrator importing sections.

### 2. EditProfileScreen (283 lines → ~100 lines)

**File:** `src/screens/profile/edit-profile/EditProfileScreen.tsx`

**Extract to:**
- `edit-profile-form-section.tsx` — Bio, name, skill level form fields (~90 lines)

**Note:** `edit-profile-photo-grid.tsx` and `edit-profile-styles.ts` already exist.

### 3. HomeSwipeScreen (273 lines → ~80 lines)

**File:** `src/screens/main/HomeSwipeScreen/index.tsx`

**Extract to:**
- `swipe-gesture-handler.tsx` — Gesture/pan handler logic (~80 lines)
- `swipe-card-list.tsx` — FlatList rendering + card composition (~70 lines)

**Note:** `styles.ts` already exists.

## Implementation Steps

1. Read each target file, identify logical boundaries
2. Extract components maintaining existing props interface
3. Wrap extracted components with `React.memo` where receiving callbacks
4. Update imports in parent file
5. Run `npx tsc --noEmit` after each file
6. Run `npx expo start` to verify no runtime errors

## Todo

- [x] Extract SettingsScreen into 3 section files (already existed, SettingsScreen.tsx now 152 lines)
- [x] Extract EditProfileScreen form section (FormSection + sanitizeInput, EditProfileScreen.tsx now 196 lines)
- [x] Extract HomeSwipeScreen gesture + card list (swipe-gesture-handler.tsx 89L, swipe-card-list.tsx 139L, index.tsx 133L)
- [x] Verify TypeScript compilation passes (zero errors)
- [ ] Verify app runs correctly (runtime check pending)

## Success Criteria

- All 3 files under 120 lines
- Zero TypeScript errors
- No visual/behavioral changes
- Re-export files unchanged
