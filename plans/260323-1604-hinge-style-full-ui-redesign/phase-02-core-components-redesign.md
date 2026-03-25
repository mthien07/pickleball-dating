# Phase 2: Core Components Redesign

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md) (tokens must be updated first)
- Components dir: `src/components/`
- Button: `src/components/button/Button.tsx`, `button-styles.tsx`, `button-variants.tsx`
- Card: `src/components/Card.tsx`
- Input: `src/components/input/input-base.tsx`, `input-variants.tsx`
- Avatar: `src/components/avatar/Avatar.tsx`, `avatar-size-variants.tsx`

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 5h
- **Description**: Restyle all shared components to Hinge editorial aesthetic. Create new EditorialProfileCard component for vertical scrollable profiles. Update existing MatchCard, CourtCard, ProfileCard.

## Key Insights
- Components use `useThemedStyles(createStyles)` pattern; styles defined via factory functions accepting ThemeColors
- Button has 6 variants: primary, secondary, text, icon, gradient, elevated
- Current Card.tsx re-exports ProfileCard; the "card" abstraction is used across many screens
- MatchCard and CourtCard have colored shadows (rose/emerald) that need neutralizing
- New EditorialProfileCard is the biggest net-new component -- core to Hinge mechanic

## Requirements

### Functional
1. Restyle Button -- softer corners, remove uppercase text, reduce colored shadow glow
2. Restyle Input -- cleaner borders, subtle focus state, serif label option
3. Restyle Avatar -- softer border, subtle shadow
4. Create EditorialProfileCard -- vertical card with photo slots + prompt slots + inline like buttons
5. Restyle MatchCard -- clean horizontal list item (not bold sport card)
6. Restyle CourtCard -- editorial court card with photo + metadata
7. Update GradientBackground -- muted gradient colors
8. Update SkeletonLoaders -- match new borderRadius and color tones
9. Update EmptyState -- serif headline, softer illustration style
10. Update LoadingScreen -- minimal, elegant
11. Update BottomSheet -- refined styling
12. Update GlassView -- reduce glassmorphism intensity (Hinge is more opaque)

### Non-Functional
- No API signature changes on any component (only style changes)
- EditorialProfileCard must be performant in FlatList (memoized, no unnecessary re-renders)

## Architecture

### EditorialProfileCard Structure
```
EditorialProfileCard
├── PhotoSection (image with inline like button overlay)
│   ├── OptimizedImage
│   └── LikeButton (heart icon, positioned bottom-right)
├── PromptSection (serif text prompt with response + like button)
│   ├── PromptLabel (PlayfairDisplay-Italic, small, muted)
│   ├── PromptResponse (PlayfairDisplay-Regular, larger)
│   └── LikeButton (inline, right-aligned)
├── InfoPill (age, location, skill level -- horizontal row)
└── Divider (subtle line between profiles in feed)
```

### Component Styling Pattern (unchanged)
```typescript
// Each component keeps its createStyles(colors: ThemeColors) => StyleSheet pattern
// Only the style VALUES change, not the structure
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,  // values updated in Phase 1
    ...shadows.card,                // shadows softened in Phase 1
  },
});
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/components/button/button-styles.tsx` | Remove uppercase, softer radius, neutral shadows, refined gradient |
| `src/components/button/button-variants.tsx` | Update variant color mappings for muted palette |
| `src/components/input/input-base.tsx` | Cleaner border, refined focus ring, optional serif label |
| `src/components/input/input-variants.tsx` | Update variant styles |
| `src/components/input/input-web.tsx` | Match web input styling |
| `src/components/avatar/Avatar.tsx` | Softer border color, subtle shadow, refined sizes |
| `src/components/avatar/avatar-size-variants.tsx` | Adjust size scale if needed |
| `src/components/Card.tsx` | Update re-export if ProfileCard interface changes |
| `src/components/profile-card/ProfileCard.tsx` | Simplify to cleaner card layout |
| `src/components/MatchCard.tsx` | Clean list-item style (less bold, more minimal) |
| `src/components/CourtCard.tsx` | Editorial card with photo + metadata |
| `src/components/gradient-background/GradientBackground.tsx` | Muted gradient colors, softer transitions |
| `src/components/GlassView.tsx` | Reduce blur intensity, more opaque |
| `src/components/SkeletonLoaders.tsx` | Update colors and borderRadius |
| `src/components/EmptyState.tsx` | Serif headline, refined layout |
| `src/components/LoadingScreen.tsx` | Minimal elegant loading |
| `src/components/BottomSheet/BottomSheet.tsx` | Refined sheet styling |
| `src/components/LikeButton.tsx` | Restyle for inline section-level like (heart with subtle animation) |
| `src/components/ProgressBar.tsx` | Softer colors, rounder |
| `src/components/MessageBubble.tsx` | Delegate to Phase 5 |

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/editorial-profile-card/EditorialProfileCard.tsx` | Main Hinge-style profile card |
| `src/components/editorial-profile-card/editorial-photo-section.tsx` | Photo with inline like overlay |
| `src/components/editorial-profile-card/editorial-prompt-section.tsx` | Prompt text with like button |
| `src/components/editorial-profile-card/editorial-info-pills.tsx` | Age, location, skill pills |
| `src/components/editorial-profile-card/index.ts` | Barrel export |
| `src/components/EditorialProfileCard.tsx` | Re-export for backward compat pattern |

## Implementation Steps

1. **Button restyle**: Remove `textTransform: 'uppercase'` from button typography. Change borderRadius to softer value. Replace colored shadows (blue/rose) with neutral shadow. Update gradient to use muted primary colors.
2. **Input restyle**: Reduce borderWidth to 1px with muted border color. Add subtle `borderColor` transition on focus. Increase padding slightly for editorial feel.
3. **Avatar restyle**: Use neutral border color instead of primary. Add subtle neutral shadow. Keep existing size system.
4. **Create EditorialProfileCard**: Build 3 sub-components (photo section, prompt section, info pills). Photo section: full-width image with rounded corners, heart like button bottom-right. Prompt section: serif prompt label + regular response text + like button. Info pills: horizontal row of pill badges.
5. **Restyle MatchCard**: Convert from bold sport card to clean list item. Remove colored shadows. Use small avatar + name + last message preview.
6. **Restyle CourtCard**: Clean photo + metadata layout. Remove emerald glow shadow. Use neutral card shadow.
7. **Update GradientBackground**: Replace vibrant gradients with muted versions. Primary gradient: muted blue -> light blue. Accent gradient: soft rose -> pink.
8. **Update GlassView**: Increase background opacity (0.72 -> 0.85). Reduce blur. Warmer tint.
9. **Update SkeletonLoaders**: Use warm gray shimmer colors matching new palette.
10. **Update EmptyState**: Use serif for headline. Softer icon color.
11. **Update LoadingScreen**: Minimal spinner with muted primary color.
12. **Update BottomSheet**: Refined handle bar, softer shadow, warmer surface color.

## Todo List
- [ ] Restyle Button (remove uppercase, neutral shadows, softer radius)
- [ ] Restyle Input (cleaner border, refined focus)
- [ ] Restyle Avatar (neutral border, subtle shadow)
- [ ] Create EditorialProfileCard component (photo + prompt + info pills)
- [ ] Create editorial-photo-section sub-component
- [ ] Create editorial-prompt-section sub-component
- [ ] Create editorial-info-pills sub-component
- [ ] Restyle MatchCard (clean list item)
- [ ] Restyle CourtCard (editorial card)
- [ ] Update GradientBackground (muted gradients)
- [ ] Update GlassView (more opaque, warmer)
- [ ] Update SkeletonLoaders (warm gray shimmer)
- [ ] Update EmptyState (serif headline)
- [ ] Update LoadingScreen (minimal)
- [ ] Update BottomSheet (refined styling)
- [ ] Restyle LikeButton for inline section-level use
- [ ] Update ProgressBar (softer colors)
- [ ] Compile check: `npx expo start --web`
- [ ] Visual review all restyled components in isolation

## Success Criteria
- All restyled components render without errors
- EditorialProfileCard renders photo + prompt + info layout correctly
- No component API changes (props interfaces identical)
- Visual style consistent with Hinge aesthetic across all components
- Components work in both light and dark mode

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| EditorialProfileCard perf in FlatList | High | Use React.memo, minimize re-renders, lazy-load images |
| Style regressions on screens | Medium | Phase-by-phase visual review after each component update |
| MatchCard/CourtCard layout breaks | Medium | Keep existing layout structure, only change colors/shadows/radii |

## Security Considerations
- No security impact

## Next Steps
- Phase 3 (Auth Flow) and Phase 4 (Home & Discovery) both depend on these components
- EditorialProfileCard is consumed exclusively by Phase 4
