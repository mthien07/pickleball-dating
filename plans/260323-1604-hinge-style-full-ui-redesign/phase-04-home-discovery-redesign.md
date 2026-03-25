# Phase 4: Home & Discovery Redesign

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md), [Phase 2](phase-02-core-components-redesign.md) (EditorialProfileCard)
- HomeSwipeScreen: `src/screens/main/HomeSwipeScreen/index.tsx`
- SwipeCardList: `src/screens/main/HomeSwipeScreen/swipe-card-list.tsx`
- SwipeGestureHandler: `src/screens/main/HomeSwipeScreen/swipe-gesture-handler.tsx`
- SwipeCard component: `src/components/SwipeCard.tsx`
- useSwipeGesture hook: `src/hooks/useSwipeGesture.ts`
- useDiscoveryProfiles: `src/hooks/use-discovery-profiles.ts`
- CourtDiscoveryScreen: `src/screens/discovery/court-discovery/CourtDiscoveryScreen.tsx`
- CourtDetailScreen: `src/screens/court/court-detail/CourtDetailScreen.tsx`
- [Research: Hinge UI Patterns](research/researcher-hinge-ui-patterns.md)

## Overview
- **Priority**: P1 (highest-impact visual change)
- **Status**: pending
- **Effort**: 6h
- **Description**: Convert HomeSwipeScreen from Tinder-style horizontal swipe card stack to Hinge-style vertical scrollable profile feed with section-level likes. Restyle CourtDiscovery and CourtDetail screens.

## Key Insights
- Current HomeSwipeScreen uses: SwipeCard component with gesture handler, card stacking, LIKE/NOPE overlays, action buttons (pass/superlike/like)
- `useDiscoveryProfiles` hook returns `currentProfile`, `nextProfile`, `hasMore`, `handleSwipe` -- this API stays unchanged
- `DiscoveryProfile` type contains: name, age, photos[], bio, skillLevel, playStyle, distance, prompts[]
- Hinge model: User scrolls through ONE profile at a time, vertically. Photos and prompts are interspersed. User can like/comment on specific sections. After scrolling past profile, next one loads.
- SwipeCard.tsx and useSwipeGesture.ts can be KEPT (not deleted) for potential fallback
- CourtDiscoveryScreen has map + list toggle + filter modal
- CourtDetailScreen has photo gallery, details, booking CTA

## Requirements

### Functional
1. Replace swipe card stack with vertical ScrollView/FlatList showing one profile at a time
2. Each profile renders as: header info -> photo 1 -> prompt 1 -> photo 2 -> prompt 2 -> photo 3 -> prompt 3 -> action buttons (pass/like)
3. Like buttons appear inline on each photo and prompt section
4. "Pass" and "Like" buttons at bottom of each profile (replace swipe left/right)
5. After user passes or likes, animate transition to next profile
6. CourtDiscoveryScreen: Editorial court cards in list, refined map view
7. CourtDetailScreen: Full-bleed hero photo, editorial details layout

### Non-Functional
- `useDiscoveryProfiles` hook API unchanged (still use `handleSwipe('left'|'right')`)
- Navigation unchanged (HomeSwipeScreen still lives at same route)
- Performance: Smooth 60fps scrolling through profile content
- Keep SwipeCard.tsx intact (don't delete, just stop importing in HomeSwipeScreen)

## Architecture

### New Home Feed Structure
```
HomeSwipeScreen (renamed internally to HomeFeedScreen, same export/route)
├── Header (app logo + profile icon)
├── ScrollView (vertical, one profile at a time)
│   ├── ProfileHeader (name, age, location, skill badge)
│   ├── EditorialProfileCard (from Phase 2)
│   │   ├── PhotoSection[0] + LikeButton
│   │   ├── PromptSection[0] + LikeButton
│   │   ├── PhotoSection[1] + LikeButton
│   │   ├── PromptSection[1] + LikeButton
│   │   ├── PhotoSection[2] + LikeButton
│   │   └── PromptSection[2] + LikeButton
│   └── ActionBar (Pass button | Like button)
└── (next profile loads on action)
```

### Profile Transition Animation
```
Current profile: fadeOut + translateY(-20) over 300ms
Next profile: fadeIn + translateY(20 -> 0) over 400ms with spring
Use Reanimated withSpring(springPresets.gentle)
```

### Data Flow (unchanged)
```
useDiscoveryProfiles() -> currentProfile (DiscoveryProfile)
User likes section -> visual feedback (heart pulse animation)
User taps "Like" bottom button -> handleSwipe('right')
User taps "Pass" bottom button -> handleSwipe('left')
Hook advances to next profile automatically
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/screens/main/HomeSwipeScreen/index.tsx` | Replace swipe card stack with vertical scroll feed |
| `src/screens/main/HomeSwipeScreen/swipe-card-list.tsx` | Replace entirely with editorial feed layout |
| `src/screens/main/HomeSwipeScreen/swipe-gesture-handler.tsx` | Simplify: remove pan gesture, keep keyboard shortcuts (web) |
| `src/screens/discovery/court-discovery/CourtDiscoveryScreen.tsx` | Restyle with editorial court cards |
| `src/screens/discovery/court-discovery/court-discovery-components.tsx` | Refined filter chips, search bar |
| `src/screens/discovery/court-discovery/court-filter-modal.tsx` | Cleaner modal styling |
| `src/screens/court/court-detail/CourtDetailScreen.tsx` | Full-bleed hero, editorial layout |
| `src/screens/court/court-detail/court-detail-sections.tsx` | Refined section styles |
| `src/theme/breakpoints.ts` | Already updated in Phase 1 (EDITORIAL_FEED_WIDTH) |

### Files to Create
| File | Purpose |
|------|---------|
| `src/screens/main/HomeSwipeScreen/editorial-profile-feed.tsx` | New feed component replacing swipe-card-list |
| `src/screens/main/HomeSwipeScreen/profile-action-bar.tsx` | Pass/Like bottom buttons |
| `src/screens/main/HomeSwipeScreen/profile-header-section.tsx` | Name, age, location, skill at top |

### Files to Keep Unchanged (not deleted)
| File | Reason |
|------|--------|
| `src/components/SwipeCard.tsx` | Kept as fallback, no longer imported by HomeSwipeScreen |
| `src/hooks/useSwipeGesture.ts` | Kept as utility, no longer used in home feed |

## Implementation Steps

1. **Create profile-header-section.tsx**: Display name (Barlow-Bold), age, location, skill badge at top of each profile. Use muted styling.

2. **Create editorial-profile-feed.tsx**: Main feed component.
   - Accept `currentProfile: DiscoveryProfile` prop
   - Render ScrollView with: ProfileHeader -> interleaved PhotoSections + PromptSections -> ActionBar
   - Map profile.photos and profile.prompts into alternating layout
   - Use EditorialProfileCard sub-components from Phase 2
   - Wrap in Animated.View for entry/exit transitions

3. **Create profile-action-bar.tsx**: Bottom bar with two buttons.
   - "Pass" button (X icon, outline style, left)
   - "Like" button (heart icon, filled rose, right)
   - Both trigger `handleSwipe('left'|'right')` from parent

4. **Update HomeSwipeScreen/index.tsx**:
   - Remove SwipeCardList import, replace with EditorialProfileFeed
   - Remove swipeCardRef (no more imperative swipe API)
   - Keep useDiscoveryProfiles hook call (unchanged)
   - Keep responsive layout logic
   - Add profile transition animation (Reanimated)
   - Keep header (logo + profile icon)

5. **Update swipe-gesture-handler.tsx**: Remove pan gesture handler. Keep only keyboard event handlers (ArrowLeft = pass, ArrowRight = like) for web accessibility.

6. **Restyle CourtDiscoveryScreen**:
   - Map view: keep functional, update marker colors to muted palette
   - List view: use restyled CourtCard from Phase 2
   - Search bar: cleaner, editorial style
   - Filter chips: pill-style, muted colors

7. **Restyle CourtDetailScreen**:
   - Full-bleed hero photo at top (no rounded corners on top image)
   - Serif court name heading
   - Clean metadata layout (address, rating, amenities)
   - Refined booking CTA button at bottom

8. **Transition animation**: Use `useSharedValue` + `withSpring` for profile entry. When handleSwipe triggers, current profile fades out, next profile springs in from below.

## Todo List
- [ ] Create profile-header-section.tsx
- [ ] Create editorial-profile-feed.tsx (core feed component)
- [ ] Create profile-action-bar.tsx (Pass/Like buttons)
- [ ] Update HomeSwipeScreen/index.tsx (replace swipe stack with feed)
- [ ] Simplify swipe-gesture-handler.tsx (keyboard only)
- [ ] Add profile transition animation (fade out / spring in)
- [ ] Test feed with mock profiles (photos + prompts interleaved)
- [ ] Test inline like buttons on photos and prompts
- [ ] Test Pass/Like bottom action bar
- [ ] Restyle CourtDiscoveryScreen (editorial cards, clean filters)
- [ ] Restyle court-discovery-components (filter chips, search)
- [ ] Restyle court-filter-modal (clean modal)
- [ ] Restyle CourtDetailScreen (full-bleed hero, serif name)
- [ ] Restyle court-detail-sections
- [ ] Test on web (keyboard shortcuts for pass/like)
- [ ] Compile check all modified files
- [ ] Visual review: complete flow from home feed to court discovery

## Success Criteria
- Home screen shows vertical scrollable profile (not swipe cards)
- Photos and prompts are interleaved in editorial layout
- Inline like buttons work on each section
- Pass/Like bottom buttons trigger profile transition
- Profile transitions animate smoothly (spring-based)
- Court Discovery renders with editorial cards
- Court Detail has full-bleed hero photo layout
- Keyboard shortcuts work on web (arrow keys)
- 60fps scroll performance in profile feed

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| Profile feed scroll perf with large images | High | Use OptimizedImage, lazy loading, limit visible images |
| Profile transition animation janky | Medium | Use simple fade if spring feels wrong; test on low-end device |
| DiscoveryProfile type missing prompts field | High | Check type definition; add prompts to mock data if missing |
| Breaking useDiscoveryProfiles API | High | DO NOT change hook API; only change how results render |

## Security Considerations
- No changes to data flow, API calls, or authentication

## Next Steps
- Phase 5 (Matches/Chat) and Phase 6 (Profile) can start after Phase 2, independent of Phase 4
