# Phase 2: EditProfileScreen Tinder-Style Redesign

## Context
- Plan: [plan.md](plan.md)
- Depends on: Phase 1 (shared design patterns)
- Design ref: `design/uiuxguides.md`

## Overview
- **Priority**: High
- **Status**: Pending
- **Description**: Redesign EditProfileScreen with 3x3 photo grid, bio editor with counter, preference sections

## Key Insights
- Current EditProfileScreen is 269 lines (over 200-line guideline)
- Has `sanitizeInput()` security function — MUST preserve
- PhotoGrid component (63 lines) handles 6 slots — expand to 9
- Uses `useImagePicker`, `storageService`, `profileService`

## Requirements

### EditProfileScreen Layout (top to bottom)
1. **Header**: "Edit Profile" title + back arrow + Save button (top-right)
2. **Photo Grid 3x3**:
   - Slot 1: larger main photo (spans or visually emphasized)
   - Slots 2-9: additional photos
   - Empty slots: dashed border + "+" icon
   - Tap to add/replace photo
   - Long press to remove (with confirmation)
3. **About Section** (card):
   - Display name input
   - Age input (number)
   - Location input
4. **Bio Editor** (card):
   - Multi-line TextInput, max 300 chars
   - Character counter: "125/300" bottom-right, turns red near limit
5. **Play Preferences** (card):
   - Skill level: segmented control (Beginner/Intermediate/Advanced/Pro)
   - Play style: multi-select pills
   - Preferred schedule: morning/afternoon/evening toggles
6. **Save Button**: Fixed bottom, gradient button (primary)

## Related Code Files
- `src/screens/profile/edit-profile/EditProfileScreen.tsx` (MODIFY)
- `src/screens/profile/edit-profile/edit-profile-styles.ts` (REWRITE)
- `src/screens/profile/edit-profile/edit-profile-photo-grid.tsx` (REWRITE)

## Implementation Steps

### 1. Rewrite `edit-profile-photo-grid.tsx`
1. 3x3 grid layout using flexWrap
2. Slot 1 (main photo): slightly larger or has "Main" badge
3. Each slot:
   - If has photo: Image + remove button (X icon, top-right)
   - If empty: dashed border container + Plus icon
4. Tap handler: trigger image picker
5. Props: `photos: string[], onAddPhoto: (index) => void, onRemovePhoto: (index) => void`
6. Keep under 120 lines

### 2. Rewrite `edit-profile-styles.ts`
1. `photoGrid`: flexDirection row, flexWrap wrap, gap 8, padding 16
2. `photoSlot`: width calc (33% - gap), aspectRatio 1, borderRadius 16
3. `photoSlotEmpty`: dashed border 2px, borderColor border
4. `mainPhotoBadge`: absolute top-left, small pill "Main"
5. `removeButton`: absolute top-right, 24px circle, red bg
6. `sectionCard`: surface bg, borderRadius 20, margin 16, padding 20
7. `bioInput`: minHeight 100, textAlignVertical top
8. `charCounter`: position absolute bottom-right, 12px text
9. `saveButton`: margin 16, borderRadius 16
10. `segmentedControl`: flexDirection row, borderRadius 12, overflow hidden
11. `segmentItem`: flex 1, paddingV 10, alignItems center
12. `segmentActive`: bg primary, text white
13. `pillToggle`: paddingH 16, paddingV 8, borderRadius full, border
14. `pillToggleActive`: bg primary, borderColor primary, text white

### 3. Update `EditProfileScreen.tsx`
1. Restructure into ScrollView with section cards:
   - Photo Grid section
   - About section (name, age, location inputs)
   - Bio section (multi-line + char counter)
   - Preferences section (skill level segmented + play style pills + schedule toggles)
2. PRESERVE sanitizeInput() function
3. PRESERVE existing save logic (profileService, storageService)
4. Add character counter state for bio (max 300)
5. Try to stay under 200 lines; if necessary extract preference section to sub-component
6. Fixed bottom save button with KeyboardAvoidingView

## Todo List
- [ ] Rewrite edit-profile-photo-grid.tsx with 3x3 grid
- [ ] Rewrite edit-profile-styles.ts with Tinder-style
- [ ] Update EditProfileScreen.tsx with new layout + char counter
- [ ] Preserve sanitizeInput() security
- [ ] Verify type check passes

## Success Criteria
- 3x3 photo grid with main photo emphasis
- Bio editor with visible character counter
- Skill level segmented control works
- Play style multi-select pills
- Save button submits all changes
- sanitizeInput still active on all text fields
- Files under 200 lines (or close, with justification)

## Risk Assessment
- **Medium**: EditProfileScreen already 269 lines; may need to extract preferences into sub-component
- **Low**: Photo grid expansion from 6→9 slots; mock data may have fewer photos

## Next Steps
- Test on web + mobile after both phases complete
- Commit changes
