# Phase 2: Zustand UI Store

## Context Links
- [State Management Research](./research/researcher-01-state-management.md) -- Section 1 (store design)
- [Brainstorm Summary](../reports/brainstorm-260319-2219-tech-stack-evaluation.md)

## Overview
- **Priority:** P2
- **Status:** pending
- **Effort:** 1.5h
- **Description:** Create lightweight Zustand store for client-only UI state (filters, onboarding, preferences)

## Key Insights
- Research recommends: Zustand for client state, React Context for theme (affects entire tree)
- ThemeContext stays as-is (correct use of Context)
- UI store handles ephemeral + persisted client preferences without server sync
- No existing store -- this is net-new

## Requirements
**Functional:**
- Court/coach filter persistence (type, distance, price range)
- Discovery sort preferences
- Onboarding completion tracking
- App-level UI flags (has seen feature tour, dismissed banners)

**Non-functional:**
- Persist to AsyncStorage (survive app restart)
- No provider needed (Zustand advantage)

## Architecture
```
useUIStore() --> Zustand store --> AsyncStorage (persist)
  |
  +-- filters: { courtType, maxDistance, priceRange }
  +-- onboarding: { completedSteps, skipped }
  +-- preferences: { defaultTab, hasSeenTour }
```

## Related Code Files
**Create:**
- `src/stores/ui-store.ts`

**Modify (later, when integrating):**
- Screens that currently use local useState for filters can adopt store
- Not required in this phase -- opt-in integration

## Implementation Steps

1. Create `src/stores/ui-store.ts`:
   - Zustand store with `persist` middleware
   - Slices:
     - `courtFilters`: `{ courtType?: string, maxDistance?: number }`
     - `onboarding`: `{ completedSteps: string[], isComplete: boolean }`
     - `preferences`: `{ hasSeenTour: boolean }`
   - Actions: `setCourtFilters`, `markOnboardingStep`, `completeOnboarding`, `resetUI`
   - Persist key: `'ui-store'`, version: 1

2. Export typed selectors:
   - `useCourtFilters()` = `useUIStore(state => state.courtFilters)`
   - `useOnboardingStatus()` = `useUIStore(state => state.onboarding)`

## Todo List
- [ ] Create `src/stores/ui-store.ts`
- [ ] Export convenience selectors
- [ ] Test persist/rehydration

## Success Criteria
- Store accessible anywhere without provider
- Filters persist across sessions
- Onboarding state trackable
- Store < 60 lines

## Risk Assessment
- **Risk:** Over-engineering -- adding state that screens don't need yet
  - **Mitigation:** Start minimal. Only add slices when screens actually consume them (YAGNI)

## Security Considerations
- No sensitive data in UI store
- Safe to persist all fields to AsyncStorage

## Next Steps
- Screens can opt-in to using UI store filters when needed
- Independent of other phases
