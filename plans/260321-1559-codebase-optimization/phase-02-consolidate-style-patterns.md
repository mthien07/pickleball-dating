# Phase 2: Consolidate Style Patterns

**Priority:** HIGH | **Status:** Pending | **Est:** 1.5h

## Context

- [Scout Report](../reports/scout-260321-1559-codebase-optimization-analysis.md)
- 32 `*-styles.ts` files with duplicated patterns
- 264 occurrences of `useThemedStyles(createStyles)`

## Overview

Create shared style utilities to reduce duplication across 32 style files. Focus on common patterns: buttons, cards, sections, forms, containers.

## Related Files

**New file:** `src/theme/style-utils.ts`

**Largest style files (targets for reduction):**
- `src/screens/court/court-detail/court-detail-styles.ts` (275 lines)
- `src/screens/demo/animation-demo/animation-demo-styles.ts` (255 lines)
- `src/screens/discovery/court-discovery/court-discovery-styles.ts` (234 lines)
- `src/screens/auth/welcome/welcome-brand-panel.tsx` (224 lines — mixed)
- `src/components/profile-card/profile-card-styles.ts` (222 lines)
- `src/screens/court/payment/payment-styles.ts` (221 lines)

## Implementation Steps

1. Audit top 10 style files, catalog repeated patterns
2. Create `src/theme/style-utils.ts` with:
   - `baseCard` — common card styles (border, shadow, radius, padding)
   - `baseButton` — common button styles (padding, radius, center alignment)
   - `baseSection` — common section container (padding, margin, background)
   - `baseInput` — common input field styles
   - `baseOverlay` — common overlay/modal backdrop
   - `flexHelpers` — row, column, center, spaceBetween
3. Update style files to compose from `style-utils`
4. Only update files where it reduces >20 lines
5. Run `npx tsc --noEmit` after each batch
6. Visual spot-check key screens

## Todo

- [x] Audit and catalog repeated style patterns
- [x] Create `src/theme/style-utils.ts` with base styles (96 lines)
- [x] Update top 6 largest style files to use shared utils (3 of 6 updated; animation-demo uses hardcoded dark palette — no theme colors, profile-card is too component-specific, dreamy-ui has its own color palette)
- [ ] Update remaining style files where beneficial
- [x] Verify TypeScript compilation (0 errors)
- [ ] Verify no visual regressions

## Success Criteria

- `style-utils.ts` under 100 lines
- Reduced total style LOC by ~500+
- No visual changes
- All style files still type-safe

## Risk

- Style composition must not break any screen layout
- Test on both light/dark themes
