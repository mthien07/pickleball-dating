# Phase 4: Refactor Animation Hooks

**Priority:** MEDIUM | **Status:** Completed | **Est:** 1h

## Context

- [Scout Report](../reports/scout-260321-1559-codebase-optimization-analysis.md)
- 4 animation hook files with overlapping patterns
- ~40 lines of duplicated useSharedValue + useAnimatedStyle boilerplate

## Overview

Create animation factory to reduce boilerplate. Consolidate hook files while maintaining backward-compatible exports.

## Related Files

**Current:**
- `src/hooks/useAnimation.ts` — Generic animation hook
- `src/hooks/useAnimations.ts` — Re-export aggregator
- `src/hooks/use-press-elevation-fade-animations.ts` — Press/elevation/fade variants
- `src/hooks/use-misc-animations.ts` — Ripple/bounce/shimmer/slide variants
- `src/animations/presets.ts` (220 lines) — Animation presets

**New:**
- `src/animations/animation-factory.ts` — Higher-order hook factory

## Implementation Steps

1. Read all 4 animation hook files, identify common pattern
2. Create `animation-factory.ts` with `createAnimationHook` helper:
   ```typescript
   export function createAnimationHook<T>(config: AnimationConfig) {
     return () => {
       const value = useSharedValue(config.initial);
       const style = useAnimatedStyle(() => config.transform(value));
       const trigger = useCallback(() => { ... }, []);
       return { animatedStyle: style, trigger };
     };
   }
   ```
3. Refactor existing hooks to use factory
4. Keep all existing exports intact (backward compat)
5. Run tests: `npx jest --testPathPattern=animation`

## Todo

- [x] Create `src/animations/animation-utils.ts` (factory not feasible; utils extracted instead — worklet constraint)
- [x] Refactor `use-press-elevation-fade-animations.ts` to use shared utils
- [x] Refactor `use-misc-animations.ts` to use shared utils
- [x] Verify `useAnimations.ts` re-exports still work
- [x] Run animation tests — 52 passed
- [ ] Visual verify animations on device

## Success Criteria

- Factory file under 60 lines
- Each hook file reduced by ~10-15 lines
- All animation tests pass
- No visual animation changes

## Risk

- Reanimated worklets have constraints (can't capture closures)
- Factory must produce worklet-compatible functions
- Test on both iOS and Android
