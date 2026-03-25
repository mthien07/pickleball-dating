# Phase 5: Cleanup Dependencies & Misc

**Priority:** LOW | **Status:** Complete | **Est:** 30m

## Context

- [Scout Report](../reports/scout-260321-1559-codebase-optimization-analysis.md)

## Tasks

### 1. Review `posthog-react-native` usage

**File:** `src/config/analytics.ts`
- Check if PostHog is initialized in app startup (`App.tsx` or similar)
- If not used → remove package and analytics config
- If used → document analytics strategy, keep

### 2. Verify re-export files are all valid

- 31 re-export files identified
- Quick grep to ensure all point to valid modules
- Remove any orphaned re-exports

### 3. Review ChatScreen size (460 lines)

- Largest non-auto-generated file
- After Phase 1 pattern is established, consider modularizing:
  - `chat-message-list.tsx` — Message rendering
  - `chat-input-bar.tsx` — Input + send logic
  - `chat-header.tsx` — Header with user info

### 4. Code comments cleanup

- Remove any TODO/FIXME comments that are already resolved
- Add brief comments to complex logic sections

## Todo

- [x] Audit and decide on posthog-react-native — KEEP (initialized in App.tsx line 28)
- [x] Verify all 31 re-export files are valid — all targets exist, no orphans
- [ ] Modularize ChatScreen if time permits — deferred (out of scope for this pass)
- [x] Cleanup stale TODO/FIXME comments — none found in src/
- [x] Final `npx tsc --noEmit` check — PASS (no errors)
- [ ] Final `npx expo start` verification — manual step

## Success Criteria

- No unused dependencies
- All re-exports valid
- Clean TypeScript build
- App starts without errors
