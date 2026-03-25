# Phase 6: Profile & Settings

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md), [Phase 2](phase-02-core-components-redesign.md)
- ProfileMeScreen: `src/screens/profile/profile-me/ProfileMeScreen.tsx`, `profile-me-components.tsx`
- EditProfileScreen: `src/screens/profile/edit-profile/EditProfileScreen.tsx`, `edit-profile-form-section.tsx`, `edit-profile-photo-grid.tsx`
- SettingsScreen: `src/screens/profile/settings/SettingsScreen.tsx`, `settings-components.tsx`, `settings-appearance-section.tsx`, `settings-account-section.tsx`, `settings-danger-zone-section.tsx`

## Overview
- **Priority**: P2
- **Status**: pending
- **Effort**: 3h
- **Description**: Restyle profile viewing, editing, and settings to Hinge editorial aesthetic. Hinge-style own-profile preview, prompt-based editing, organized settings.

## Key Insights
- ProfileMeScreen shows user's own profile (photo, bio, stats, quick actions)
- EditProfileScreen has photo grid + form fields for bio, skill level, etc.
- SettingsScreen is modularized into 4 section files (appearance, account, components, danger zone)
- Hinge's own-profile view mirrors the editorial card format (how others see you)
- Edit mode on Hinge lets you reorder photos and edit prompts inline

## Requirements

### Functional
1. ProfileMeScreen: Show own profile in same EditorialProfileCard format (preview of what others see)
2. EditProfileScreen: Photo grid (3x2) with drag-to-reorder feel. Prompt editing with serif labels.
3. SettingsScreen: Grouped sections with clean dividers. Section headers in Barlow-SemiBold.
4. Appearance section: Refined theme toggle (light/dark/system)
5. Account section: Clean list items with icons
6. Danger zone: Muted red (not alarming), clean layout

### Non-Functional
- Profile data flow unchanged (same Supabase calls, same stores)
- Settings persistence unchanged (same AsyncStorage keys)

## Architecture

### ProfileMeScreen Layout
```
┌─────────────────────────────────┐
│  "Your Profile" (Barlow-Bold)   │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │  [Your Photo 1]           │  │  <- Same EditorialProfileCard
│  │  "A prompt you answered"  │  │     format others see
│  │  [Your Photo 2]           │  │
│  │  "Another prompt"         │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  [Edit Profile] button          │  <- Primary CTA
│  [Settings] button              │  <- Text/outline
└─────────────────────────────────┘
```

### EditProfileScreen Layout
```
┌─────────────────────────────────┐
│  "Edit Profile" (Barlow-Bold)   │
├─────────────────────────────────┤
│  Photos                         │
│  ┌──┐ ┌──┐ ┌──┐               │  <- 3x2 grid
│  │  │ │  │ │  │               │     tap to replace
│  └──┘ └──┘ └──┘               │     subtle add icon on empty
│  ┌──┐ ┌──┐ ┌──┐               │
│  │  │ │  │ │+ │               │
│  └──┘ └──┘ └──┘               │
├─────────────────────────────────┤
│  "Your prompts"                 │  <- Serif section header
│  ┌───────────────────────────┐  │
│  │ Prompt 1 (italic label)   │  │  <- Tap to edit
│  │ Your response text...     │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ Prompt 2                  │  │
│  │ Your response...          │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  "About you"                    │  <- Serif section header
│  Bio text area                  │
│  Skill level pill selector      │
│  Play style pill selector       │
└─────────────────────────────────┘
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/screens/profile/profile-me/ProfileMeScreen.tsx` | Reuse EditorialProfileCard format for own profile preview |
| `src/screens/profile/profile-me/profile-me-components.tsx` | Restyle sub-components (stats, actions) |
| `src/screens/profile/edit-profile/EditProfileScreen.tsx` | Serif section headers, clean layout |
| `src/screens/profile/edit-profile/edit-profile-form-section.tsx` | Prompt-based form fields, pill selectors |
| `src/screens/profile/edit-profile/edit-profile-photo-grid.tsx` | Clean 3x2 grid, subtle placeholders |
| `src/screens/profile/settings/SettingsScreen.tsx` | Clean grouped layout |
| `src/screens/profile/settings/settings-components.tsx` | Refined list items with icons |
| `src/screens/profile/settings/settings-appearance-section.tsx` | Refined theme toggle UI |
| `src/screens/profile/settings/settings-account-section.tsx` | Clean account items |
| `src/screens/profile/settings/settings-danger-zone-section.tsx` | Muted red, less alarming |

### Files to Create
None.

## Implementation Steps

1. **ProfileMeScreen**: Replace current layout with ScrollView showing own profile in EditorialProfileCard format. Add "Edit Profile" primary button and "Settings" text button below. Display profile completeness indicator (subtle progress, not bold).

2. **profile-me-components**: Restyle stats section (matches count, rating). Use clean cards with neutral bg. Remove colored backgrounds/gradients.

3. **EditProfileScreen**: Section headers in Barlow-SemiBold (not serif -- editing is functional, not editorial). Clean navigation header with "Done"/"Save" text button.

4. **edit-profile-photo-grid**: 3x2 grid. Photos have rounded corners (borderRadius.lg). Empty slots: dashed border with "+" icon, muted color. On tap: image picker (unchanged logic).

5. **edit-profile-form-section**: Prompt fields with PlayfairDisplay-Italic labels. Response areas: multi-line text input, clean border. Skill level and play style: pill-style selectors (same as Phase 3 ProfileSetup).

6. **SettingsScreen**: Group sections with section headers (Barlow-SemiBold, uppercase, small, muted). Clean dividers between groups. Remove any gradients or colored section backgrounds.

7. **settings-appearance-section**: Three-option selector for theme (Light / Dark / System). Use pill-style or segmented control. Show preview swatch next to each option.

8. **settings-account-section**: Clean list items with left icon + label + right chevron. Items: email, phone, linked accounts, notifications. Standard spacing.

9. **settings-danger-zone-section**: Section header "Account" (not "Danger Zone" -- less alarming). Items in muted red text (not bright red background). "Delete Account" and "Log Out" as text buttons.

## Todo List
- [ ] Restyle ProfileMeScreen (editorial card format)
- [ ] Restyle profile-me-components (clean stats, actions)
- [ ] Restyle EditProfileScreen (serif sections, clean layout)
- [ ] Restyle edit-profile-form-section (prompt-based fields)
- [ ] Restyle edit-profile-photo-grid (clean 3x2 grid)
- [ ] Restyle SettingsScreen (grouped sections)
- [ ] Restyle settings-components (refined list items)
- [ ] Restyle settings-appearance-section (pill theme selector)
- [ ] Restyle settings-account-section (clean list)
- [ ] Restyle settings-danger-zone-section (muted red)
- [ ] Compile check all modified files
- [ ] Visual review: profile view -> edit -> settings flow

## Success Criteria
- Own profile shows in editorial card format
- Edit profile has clean photo grid + prompt editing
- Settings are organized, clean, grouped
- No data flow or storage logic changes
- Works in light + dark mode

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| EditorialProfileCard in ProfileMe doesn't match edit flow | Low | Keep consistent structure; editing is functional, viewing is editorial |
| Photo grid layout breaks on different screen sizes | Medium | Use responsive widths (% based), test on narrow and wide screens |

## Security Considerations
- No changes to auth, profile data handling, or storage

## Next Steps
- Independent of Phase 4, 5, 7
