# Phase 3: Auth Screens Desktop Split Layout

## Parallelization
- **Can run in parallel** with Phase 1 and Phase 2
- **No shared files** with other phases

## Context Links
- Welcome screen: `src/screens/auth/welcome/WelcomeScreen.tsx` (150 lines)
- Welcome styles: `src/screens/auth/welcome/welcome-styles.ts` (146 lines)
- Signup screen: `src/screens/auth/signup-design/SignupScreenDesign.tsx` (241 lines)
- Signup styles: `src/screens/auth/signup-design/signup-design-styles.ts` (125 lines)
- Design tokens: `src/theme/tokens.ts` (read-only)

## Overview
- **Priority:** Medium (auth is first impression on desktop)
- **Status:** Pending
- **Description:** Split auth screens into branding panel (left) + form (right) on desktop web

## Key Insights
- WelcomeScreen is 150 lines (within limit); styles are 146 lines
- SignupScreenDesign is 241 lines (over 200-line limit, but we're adding minimal desktop logic)
- Both screens use `useThemedStyles(createStyles)` pattern
- App branding: "PickleBall Dating" + tennisball icon + "Tim Doi Thu Hoan Hao" tagline
- Desktop split: ~45% brand panel (left) + ~55% form (right)
- Brand panel reusable across Welcome and Signup screens

## Requirements

### Functional
- Desktop web (>= 1024px): show split layout (brand left, form right)
- Mobile/tablet: unchanged single-column layout
- Brand panel: gradient background (primary to accent), logo, tagline, decorative elements
- Form panel: existing form content, white/surface background
- Smooth appearance; no layout jump

### Non-Functional
- Brand panel reusable (shared between Welcome and Signup)
- Under 200 lines per file

## Architecture
```
Desktop Layout:
┌──────────────────────────────────────────────┐
│  Brand Panel (45%)  │  Form Content (55%)    │
│  ┌────────────────┐ │  ┌──────────────────┐  │
│  │  Logo           │ │  │  [Existing form]  │  │
│  │  Tagline        │ │  │                   │  │
│  │  Decorative     │ │  │                   │  │
│  └────────────────┘ │  └──────────────────┘  │
└──────────────────────────────────────────────┘

Mobile Layout: (unchanged)
┌────────────┐
│  [Form]    │
└────────────┘
```

## File Ownership (EXCLUSIVE)

### Files to Modify
- `src/screens/auth/welcome/WelcomeScreen.tsx` - Wrap with split layout on desktop
- `src/screens/auth/welcome/welcome-styles.ts` - Add desktop split styles
- `src/screens/auth/signup-design/SignupScreenDesign.tsx` - Wrap with split layout on desktop
- `src/screens/auth/signup-design/signup-design-styles.ts` - Add desktop split styles

### Files to Create
- `src/screens/auth/welcome/welcome-brand-panel.tsx` - Reusable branding panel

### Files NOT Touched
- `src/theme/tokens.ts`
- `src/navigation/AuthNavigator.tsx`

## Implementation Steps

### 1. Create `src/screens/auth/welcome/welcome-brand-panel.tsx`
1. Full-height panel with gradient-like background using `colors.primary`
2. Content: tennisball icon (large, 48px), "PickleBall Dating" title, tagline "Tim Doi Thu Hoan Hao / Tren & Ngoai San"
3. Use `LinearGradient` from `expo-linear-gradient` if available, else solid `colors.primary` background
4. White text for contrast
5. Center content vertically
6. Props: optional `style` override
7. Keep under 80 lines

### 2. Update `src/screens/auth/welcome/welcome-styles.ts`
1. Add `desktopWrapper` style: `{ flexDirection: 'row', flex: 1, minHeight: '100vh' }`
2. Add `brandPanel` style: `{ flex: 0.45 }` (applied only on desktop)
3. Add `formPanel` style: `{ flex: 0.55, justifyContent: 'center' }`
4. Keep all existing styles unchanged

### 3. Update `src/screens/auth/welcome/WelcomeScreen.tsx`
1. Import `useResponsive` and `WelcomeBrandPanel`
2. Import `Platform`
3. Detect desktop: `const { isDesktop, isWeb } = useResponsive(); const showSplit = isWeb && isDesktop;`
4. When `showSplit`:
   - Wrap in row container: `<View style={styles.desktopWrapper}>`
   - Left: `<WelcomeBrandPanel style={styles.brandPanel} />`
   - Right: existing `<SafeAreaView>` content in `<View style={styles.formPanel}>`
5. When NOT `showSplit`: render existing JSX unchanged
6. Keep file under 200 lines

### 4. Update `src/screens/auth/signup-design/signup-design-styles.ts`
1. Add same desktop split styles: `desktopWrapper`, `brandPanel`, `formPanel`
2. Keep existing styles unchanged

### 5. Update `src/screens/auth/signup-design/SignupScreenDesign.tsx`
1. Import `useResponsive` and `WelcomeBrandPanel` (reuse from welcome folder)
2. Same split logic as WelcomeScreen
3. Wrap content in split layout on desktop
4. File is 241 lines; adding ~10 lines of split logic is acceptable (aim to stay close to 200)

## Todo List
- [ ] Create welcome-brand-panel.tsx with gradient + branding
- [ ] Add desktop split styles to welcome-styles.ts
- [ ] Update WelcomeScreen.tsx with conditional split layout
- [ ] Add desktop split styles to signup-design-styles.ts
- [ ] Update SignupScreenDesign.tsx with conditional split layout
- [ ] Test mobile unchanged
- [ ] Test desktop split renders correctly

## Success Criteria
- Desktop web: auth screens show brand panel left + form right
- Mobile: auth screens unchanged (single column)
- Brand panel shows logo, app name, tagline on gradient background
- Form area properly centered in right panel
- Both Welcome and Signup use same brand panel component
- No new dependencies (use expo-linear-gradient if already installed, else solid color)

## Conflict Prevention
- Only this phase touches auth screen files
- Brand panel is new file in `welcome/` directory
- No overlap with Phase 1 (theme) or Phase 2 (navigation)

## Risk Assessment
- **Low:** `expo-linear-gradient` may not be installed. Fallback: solid primary color background.
- **Low:** SignupScreenDesign.tsx already 241 lines; adding split logic pushes further. Consider extracting signup form body into a sub-component in future refactor.
- **Mitigation:** Check `package.json` for `expo-linear-gradient` before using. Keep split logic minimal (conditional wrapper only).

## Security Considerations
- None (UI-only changes to auth screens, no auth logic modified)

## Next Steps
- Consider applying split layout to LoginDesign screen (not in scope)
- Future: add enter animation for brand panel (slide in from left)
