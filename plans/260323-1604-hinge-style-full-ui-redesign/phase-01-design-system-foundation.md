# Phase 1: Design System Foundation

## Context Links
- [Research: Hinge UI Patterns](research/researcher-hinge-ui-patterns.md)
- Current tokens: `src/theme/tokens.ts`
- Current colors: `src/contexts/theme-colors.ts`
- Current shadows: `src/theme/shadows.ts`
- Design docs: `design/design-system.md`

## Overview
- **Priority**: P1 (blocks all other phases)
- **Status**: pending
- **Effort**: 4h
- **Description**: Update design tokens, add serif font, refine color palette from "Vibrant Sport" to "Sophisticated Editorial" while keeping the ThemeContext architecture intact.

## Key Insights
- Hinge uses ~90% neutral space + 10% accent color
- Serif + sans-serif pairing is core to editorial feel (serif for prompts/headlines, sans for body/metadata)
- Current app has 6 Barlow font files in `assets/fonts/`; fonts loaded via `useFonts` in `App.tsx`
- ThemeColors interface in `theme-colors.ts` defines all color keys; both `lightColors` and `darkColors` use it
- `tokens.ts` has `colors` (static), `typography`, `fontFamily`, `borderRadius`, `durations`, `easing` objects
- 22 screens + ~30 components all use `useThemedStyles(createStyles)` pattern -- changing tokens propagates automatically

## Requirements

### Functional
1. Add PlayfairDisplay serif font (Regular, Bold, Italic at minimum)
2. Update color palette to Hinge-inspired muted tones
3. Create serif typography entries (editorialHero, editorialH1, editorialH2, prompt)
4. Add spring animation presets for Reanimated
5. Soften shadows (remove colored glow shadows)
6. Update borderRadius to slightly rounder, softer edges

### Non-Functional
- Zero breaking changes to ThemeColors interface (add new keys, don't remove existing)
- All existing `createStyles(colors)` functions continue working unchanged
- Font loading must not increase cold-start time significantly

## Architecture

### Font Loading Flow
```
App.tsx useFonts({
  ...existing Barlow fonts,
  'PlayfairDisplay-Regular': require('./assets/fonts/PlayfairDisplay-Regular.ttf'),
  'PlayfairDisplay-Bold': require('./assets/fonts/PlayfairDisplay-Bold.ttf'),
  'PlayfairDisplay-Italic': require('./assets/fonts/PlayfairDisplay-Italic.ttf'),
})
```

### Color Palette Change (Light Mode)
```
BEFORE (Vibrant Sport)          AFTER (Hinge Editorial)
primary: #2563EB (Electric)  -> #3B5998 (Muted Slate Blue)
accent:  #F43F5E (Hot Rose)  -> #E5627D (Softer Rose)
background: #F8FAFC          -> #FAF9F7 (Warm Off-White)
surface: #FFFFFF             -> #FFFFFF (keep)
textPrimary: #0F172A         -> #1A1A2E (Warmer Black)
textSecondary: #475569       -> #6B7280 (Softer Gray)
border: #E2E8F0              -> #E8E6E1 (Warm Gray)
```

### Color Palette Change (Dark Mode)
```
BEFORE                          AFTER
background: #0F172A           -> #121212 (True Dark)
surface: #1E293B              -> #1E1E1E (Neutral Dark)
primary: #60A5FA              -> #7B9FD4 (Muted Blue)
accent: #FB7185               -> #F08B9E (Softer Rose)
border: #334155               -> #2C2C2C (Neutral)
```

### Typography Addition
```typescript
// New serif entries in typography object
editorialHero: {
  fontSize: 42, fontWeight: '700', lineHeight: 48,
  letterSpacing: -0.5, fontFamily: 'PlayfairDisplay-Bold',
},
editorialH1: {
  fontSize: 32, fontWeight: '700', lineHeight: 38,
  letterSpacing: -0.3, fontFamily: 'PlayfairDisplay-Bold',
},
editorialH2: {
  fontSize: 24, fontWeight: '400', lineHeight: 32,
  letterSpacing: 0, fontFamily: 'PlayfairDisplay-Regular',
},
prompt: {
  fontSize: 20, fontWeight: '400', lineHeight: 28,
  letterSpacing: 0, fontFamily: 'PlayfairDisplay-Italic',
},
```

### Spring Animation Presets
```typescript
// New in tokens.ts or separate animation-presets.ts
export const springPresets = {
  gentle: { damping: 20, stiffness: 150, mass: 1 },
  snappy: { damping: 15, stiffness: 300, mass: 0.8 },
  bouncy: { damping: 12, stiffness: 200, mass: 1 },
  slow: { damping: 25, stiffness: 100, mass: 1.2 },
} as const;
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/theme/tokens.ts` | Update colors, add serif typography, add springPresets, soften borderRadius |
| `src/contexts/theme-colors.ts` | Update lightColors + darkColors values, add surfaceSecondary + surfaceTertiary keys |
| `src/theme/shadows.ts` | Soften all shadows: remove colored glows, reduce opacity, use neutral shadowColor |
| `src/theme/breakpoints.ts` | Update CARD_WIDTH (wider for editorial), remove CARD_ASPECT_RATIO (no more swipe cards) |
| `src/theme/webStyles.ts` | Update comment references from "Tinder" to "Hinge" |
| `src/theme/style-utils.ts` | Add editorial base styles (editorialContainer, promptCard) |
| `App.tsx` | Add PlayfairDisplay font loading to useFonts |
| `design/design-system.md` | Update docs to reflect new design system |

### Files to Create
| File | Purpose |
|------|---------|
| `assets/fonts/PlayfairDisplay-Regular.ttf` | Serif font - Regular weight |
| `assets/fonts/PlayfairDisplay-Bold.ttf` | Serif font - Bold weight |
| `assets/fonts/PlayfairDisplay-Italic.ttf` | Serif font - Italic weight |
| `src/theme/animation-presets.ts` | Spring animation configs for Reanimated |

## Implementation Steps

1. **Download fonts**: Get PlayfairDisplay .ttf files from Google Fonts, place in `assets/fonts/`
2. **Update App.tsx**: Add 3 new font entries to `useFonts` call (lines 65-71)
3. **Update tokens.ts colors object**: Replace Electric Blue/Hot Rose palette with muted Hinge palette
4. **Add typography entries**: Add `editorialHero`, `editorialH1`, `editorialH2`, `prompt` to typography object
5. **Add fontFamily entries**: Add `serif`, `serifBold`, `serifItalic` to fontFamily object
6. **Update borderRadius**: Slightly increase card/profileCard radius for softer look
7. **Update theme-colors.ts**: Modify all values in lightColors and darkColors to match new palette; add `surfaceSecondary`, `surfaceTertiary` to ThemeColors interface
8. **Update shadows.ts**: Replace all colored shadowColor (blue, rose, emerald, violet) with `#000000`; reduce opacity by 30-50%
9. **Create animation-presets.ts**: Export springPresets object
10. **Update breakpoints.ts**: Change CARD_WIDTH for editorial feed (wider), add EDITORIAL_FEED_WIDTH
11. **Update style-utils.ts**: Add `editorialContainer`, `promptCard`, `sectionLikeButton` base styles
12. **Update design-system.md**: Document new color palette, typography pairing, animation philosophy

## Todo List
- [ ] Download PlayfairDisplay-Regular.ttf, PlayfairDisplay-Bold.ttf, PlayfairDisplay-Italic.ttf
- [ ] Add fonts to App.tsx useFonts
- [ ] Update colors object in tokens.ts
- [ ] Add serif typography entries to tokens.ts
- [ ] Add fontFamily entries for serif
- [ ] Update lightColors in theme-colors.ts
- [ ] Update darkColors in theme-colors.ts
- [ ] Add surfaceSecondary + surfaceTertiary to ThemeColors interface
- [ ] Soften shadows in shadows.ts (neutral colors, lower opacity)
- [ ] Create src/theme/animation-presets.ts with spring configs
- [ ] Update breakpoints.ts for editorial feed widths
- [ ] Add editorial base styles to style-utils.ts
- [ ] Update design-system.md documentation
- [ ] Run `npx expo start --web` to verify no compilation errors
- [ ] Verify light mode renders with new colors
- [ ] Verify dark mode renders with new colors

## Success Criteria
- App compiles and runs on iOS, Android, Web without errors
- PlayfairDisplay font renders correctly on all platforms
- Color palette visually matches Hinge's sophisticated/muted aesthetic
- No regressions in any screen (all existing createStyles functions work)
- Dark mode has refined, true-dark appearance

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| PlayfairDisplay font too large | Increases bundle ~200KB | Accept; serif is essential to Hinge aesthetic |
| Color change breaks contrast/readability | Medium | Test WCAG AA contrast ratios for new text colors |
| ThemeColors interface change breaks consumers | High | Only ADD keys, never remove. Existing keys stay |

## Security Considerations
- No security impact (visual-only changes)

## Next Steps
- Phase 2 (Core Components Redesign) depends on this phase completing first
- All subsequent phases consume the tokens defined here
