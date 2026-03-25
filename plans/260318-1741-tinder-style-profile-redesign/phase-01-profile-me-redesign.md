# Phase 1: ProfileMeScreen Tinder-Style Redesign

## Context
- Plan: [plan.md](plan.md)
- Design ref: `design/uiuxguides.md` Section 3 (Tinder-Style UX Flows)
- Tokens: `src/theme/tokens.ts`

## Overview
- **Priority**: High
- **Status**: Pending
- **Description**: Redesign ProfileMeScreen with Tinder-style hero photo, gradient overlay, stats bento grid, skill badges

## Key Insights
- Current ProfileMeScreen is 123 lines (orchestrator), components in profile-me-components.tsx (201 lines)
- Current layout: small avatar + text-based stats — needs full hero photo treatment
- Mock data available from `@data/mockData` for current user
- Uses `useAuth()` for user data, `useThemedStyles(createStyles)` for styling

## Requirements

### ProfileMeScreen Layout (top to bottom)
1. **Hero Photo** (60% viewport height):
   - Full-width profile photo, `resizeMode: 'cover'`
   - Bottom gradient overlay: transparent → rgba(0,0,0,0.7)
   - Name + Age: white, Barlow Bold 28px on gradient
   - Skill Level: colored pill badge on gradient
   - Distance/Location: small text under name
2. **Settings Gear**: Top-right corner, 48px circular button, absolute positioned
3. **Stats Grid**: 3-column row below hero
   - Column 1: Matches count + label
   - Column 2: Games played + label
   - Column 3: Rating (stars) + label
   - Card style: surface bg, rounded 20px, shadow
4. **Bio Section**: Card with bio text + play style tags as pills
5. **Edit Profile CTA**: Full-width gradient button (primary → primaryLight)
6. **Photos Section**: Horizontal scroll of additional photos (optional, keep if exists)

## Architecture
```
ProfileMeScreen.tsx (orchestrator, <200 lines)
├── Hero photo with LinearGradient overlay
├── Settings gear (Pressable, top-right absolute)
├── Stats grid (3 StatCard components)
├── Bio card with tag pills
└── Edit Profile gradient button

profile-me-components.tsx (sub-components, <200 lines)
├── ProfileHeroSection - photo + gradient + name/badge
├── StatCard (updated) - number + label in bento style
├── BioSection - bio text + play style tags
├── SkillBadge - colored pill
└── helpers (getSkillLevelLabel, etc.)

profile-me-styles.ts (styles, <200 lines)
└── createStyles(colors) - all themed styles
```

## Related Code Files
- `src/screens/profile/profile-me/ProfileMeScreen.tsx` (MODIFY)
- `src/screens/profile/profile-me/profile-me-styles.ts` (REWRITE)
- `src/screens/profile/profile-me/profile-me-components.tsx` (REWRITE)

## Implementation Steps

### 1. Rewrite `profile-me-components.tsx`
1. Create `ProfileHeroSection` component:
   - Full-width Image (height: 60% of screen via Dimensions)
   - LinearGradient overlay at bottom (transparent → black 70%)
   - Name + age text (Barlow Bold, 28px, white)
   - SkillBadge component (colored pill based on skill_level)
   - Location text (14px, white 80% opacity)
2. Update `StatCard`:
   - Large number (Barlow Bold 24px, primary color)
   - Label below (12px, textSecondary)
   - Surface background, borderRadius 20, shadow
3. Create `BioSection`:
   - Card container with bio text
   - Play style tags as horizontal pill list
4. Create `SkillBadge`:
   - Pill shape, color mapped: beginner=#10B981, intermediate=#F59E0B, advanced=#2563EB, pro=#F43F5E
   - White text, Barlow SemiBold 12px
5. Keep `LoadingState` and `EmptyProfileState` (update styling only)

### 2. Rewrite `profile-me-styles.ts`
1. `heroContainer`: height 60% viewport, width 100%, overflow hidden
2. `heroImage`: absoluteFill, resizeMode cover
3. `heroGradient`: absolute bottom, full width, height 50%
4. `heroContent`: absolute bottom, padding 24px
5. `nameText`: Barlow Bold 28px white
6. `settingsButton`: absolute top-right, 48px circle, surface bg, shadow
7. `statsGrid`: flexDirection row, gap 12, padding horizontal 16, marginTop -40 (overlap hero)
8. `statCard`: flex 1, surface bg, borderRadius 20, padding 16, alignItems center, shadow
9. `bioCard`: surface bg, borderRadius 20, margin 16, padding 20
10. `tagPill`: paddingH 12, paddingV 6, borderRadius full, bg bentoLight
11. `editButton`: margin 16, borderRadius 16, overflow hidden (for gradient)

### 3. Update `ProfileMeScreen.tsx`
1. Replace current layout with ScrollView containing:
   - ProfileHeroSection (with settings gear overlay)
   - Stats grid row (3 StatCards overlapping hero bottom)
   - BioSection card
   - Edit Profile gradient button
2. Use `useNavigation` for settings/edit navigation
3. Keep auth data loading + empty/loading states

## Todo List
- [x] Rewrite profile-me-components.tsx with ProfileHeroSection, SkillBadge, updated StatCard, BioSection
- [x] Rewrite profile-me-styles.ts with Tinder-style layout
- [x] Update ProfileMeScreen.tsx orchestrator
- [x] Verify type check passes
- [ ] Test on web and ensure responsive
- [ ] Fix age calculation (off by 1 before birthday — subtract years then check month/day)

## Success Criteria
- Hero photo fills 60% viewport with gradient overlay
- Name/age/skill badge visible on gradient
- Stats grid overlaps hero bottom (negative margin)
- Bio section with pill tags
- Edit Profile gradient button works
- Settings gear navigates to Settings
- All files under 200 lines

## Risk Assessment
- **Low**: Mock data may not have all required fields (fallback to defaults)
- **Low**: LinearGradient import already used in project (expo-linear-gradient)

## Next Steps
- Phase 2: EditProfileScreen redesign
