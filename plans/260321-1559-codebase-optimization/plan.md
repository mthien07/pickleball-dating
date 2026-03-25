# Codebase Optimization Plan

**Date:** 2026-03-21
**Branch:** main
**Report:** [Scout Analysis](../reports/scout-260321-1559-codebase-optimization-analysis.md)

---

## Summary

Tối ưu codebase ~32K lines: modularize large files, DRY style patterns, consolidate animation hooks, improve memoization consistency, cleanup unused deps.

**Expected impact:** Giảm ~800-1000 lines code, cải thiện maintainability & performance.

---

## Phases

| # | Phase | Priority | Status | Est. |
|---|-------|----------|--------|------|
| 1 | [Modularize large screens](#) | HIGH | ✅ Done | 1.5h |
| 2 | [Consolidate style patterns](#) | HIGH | ✅ Done | 1.5h |
| 3 | [Fix memoization & performance](#) | MEDIUM | ✅ Done | 1h |
| 4 | [Refactor animation hooks](#) | MEDIUM | ✅ Done | 1h |
| 5 | [Cleanup deps & misc](#) | LOW | ✅ Done | 30m |

**Final verification:** 0 TypeScript errors, 245 tests passed (17 suites)

**Phase files:**
- [Phase 1: Modularize Screens](phase-01-modularize-large-screens.md)
- [Phase 2: Consolidate Styles](phase-02-consolidate-style-patterns.md)
- [Phase 3: Memoization & Performance](phase-03-memoization-and-performance.md)
- [Phase 4: Animation Hooks](phase-04-refactor-animation-hooks.md)
- [Phase 5: Cleanup](phase-05-cleanup-deps-and-misc.md)

---

## Dependencies

- Phase 2 depends on Phase 1 (style files may change during modularization)
- Phases 3, 4, 5 are independent of each other
- All phases must pass `npx tsc --noEmit` after completion

## Risks

- Re-export files must be preserved for backward compat
- Animation refactoring must not break existing animations
- Style consolidation must not change visual output
