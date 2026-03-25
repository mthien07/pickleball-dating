# Phase 3: Auth Flow Redesign

## Context Links
- Depends on: [Phase 1](phase-01-design-system-foundation.md), [Phase 2](phase-02-core-components-redesign.md)
- Auth screens: `src/screens/auth/`
- Welcome: `src/screens/auth/welcome/WelcomeScreen.tsx`, `welcome-brand-panel.tsx`
- Login: `src/screens/auth/login/LoginScreen.tsx`
- LoginRegister: `src/screens/auth/login-register/LoginRegisterScreen.tsx`
- EmailSignup: `src/screens/auth/email-signup/EmailSignupScreen.tsx`, `email-signup-components.tsx`
- ProfileSetup: `src/screens/auth/profile-setup/ProfileSetupScreen.tsx` + 5 step files
- Onboarding: `src/screens/auth/onboarding/OnboardingScreen.tsx`, `onboarding-animated-components.tsx`

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 4h
- **Description**: Restyle all auth screens to editorial/sophisticated Hinge aesthetic. Serif headlines, clean forms, elegant onboarding. No navigation or flow changes.

## Key Insights
- Auth flow: Welcome -> Login/Register -> Email/Phone Signup -> ProfileSetup (5 steps) -> Onboarding -> Home
- WelcomeScreen has brand panel with gradient background and app tagline
- ProfileSetup has 5 steps: basic-info, photo, skill-level, play-style, bio -- each in separate file
- OnboardingScreen uses animated components with slide transitions
- All screens use `createStyles(colors: ThemeColors)` pattern
- PhoneSignupScreen exists but is a simpler variant of EmailSignupScreen

## Requirements

### Functional
1. WelcomeScreen: Replace bold sport gradient with elegant editorial layout. Serif app name. Clean CTA buttons.
2. LoginScreen/LoginRegisterScreen: Minimal, centered form with serif heading. Social login buttons refined.
3. EmailSignupScreen: Clean form fields, step indicator refined, serif section titles.
4. PhoneSignupScreen: Same treatment as EmailSignupScreen.
5. ProfileSetupScreen: Hinge-style prompt-based UI. Serif step titles. Pill-style selections for skill level/play style.
6. OnboardingScreen: Sophisticated slides with editorial typography. Subtle page transitions.

### Non-Functional
- Auth flow logic unchanged (same navigation, same validation, same Supabase calls)
- Animations should use spring presets from Phase 1

## Architecture

### WelcomeScreen Transformation
```
BEFORE (Vibrant Sport):              AFTER (Hinge Editorial):
- Bold gradient background           - Clean off-white or dark bg
- Large condensed "PickleBall"       - PlayfairDisplay "PickleBall"
- Electric blue CTA buttons          - Muted primary CTA, clean outline secondary
- Glassmorphism overlay              - Minimal, text-focused

Layout:
┌─────────────────────┐
│                     │
│   [App Logo/Icon]   │
│                     │
│  "PickleBall        │  <- PlayfairDisplay-Bold, 42pt
│   Dating"           │
│                     │
│  "Find your perfect │  <- Barlow-Regular, 17pt, muted
│   match on the      │
│   court"            │
│                     │
│  ┌───────────────┐  │
│  │  Get Started  │  │  <- Primary button, muted blue
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  I have an    │  │  <- Text/outline button
│  │  account      │  │
│  └───────────────┘  │
│                     │
└─────────────────────┘
```

### ProfileSetup: Hinge Prompt Style
```
BEFORE: Standard form fields
AFTER:  Prompt-based questions with serif labels

"What's your skill level?"  <- PlayfairDisplay-Italic prompt
┌──────────────────────────────────┐
│  ● Beginner  ● Intermediate     │  <- Pill-style selectors
│  ● Advanced  ● Pro              │
└──────────────────────────────────┘
```

## Related Code Files

### Files to Modify
| File | Change |
|------|--------|
| `src/screens/auth/welcome/WelcomeScreen.tsx` | Replace gradient hero with clean editorial layout |
| `src/screens/auth/welcome/welcome-brand-panel.tsx` | Serif app name, muted colors, remove glassmorphism |
| `src/screens/auth/login/LoginScreen.tsx` | Serif heading, clean form, refined buttons |
| `src/screens/auth/login-register/LoginRegisterScreen.tsx` | Minimal layout, serif heading |
| `src/screens/auth/email-signup/EmailSignupScreen.tsx` | Clean form, serif section titles |
| `src/screens/auth/email-signup/email-signup-components.tsx` | Refined sub-components |
| `src/screens/auth/PhoneSignupScreen.tsx` | Same treatment as email signup |
| `src/screens/auth/profile-setup/ProfileSetupScreen.tsx` | Prompt-based layout, serif step titles |
| `src/screens/auth/profile-setup/profile-setup-basic-info-step.tsx` | Serif prompts for name/age/location |
| `src/screens/auth/profile-setup/profile-setup-photo-step.tsx` | Clean photo grid upload |
| `src/screens/auth/profile-setup/profile-setup-skill-level-step.tsx` | Pill-style selection |
| `src/screens/auth/profile-setup/profile-setup-play-style-step.tsx` | Pill-style selection |
| `src/screens/auth/profile-setup/profile-setup-bio-step.tsx` | Serif prompt, clean text area |
| `src/screens/auth/onboarding/OnboardingScreen.tsx` | Editorial slides, serif headlines |
| `src/screens/auth/onboarding/onboarding-animated-components.tsx` | Softer animations, spring-based transitions |
| `src/screens/auth/SignupScreenDesign.tsx` | Update design reference screen |
| `src/screens/auth/signup-design/signup-design-components.tsx` | Refined design components |

### Files to Create
None -- all changes are restyling existing files.

## Implementation Steps

1. **WelcomeScreen**: Replace gradient background with solid warm off-white (light) or true dark (dark mode). Use PlayfairDisplay-Bold for app name. Clean Barlow body text. Two CTA buttons: primary (filled, muted blue) and secondary (outline/text).
2. **welcome-brand-panel**: Remove GlassView/glassmorphism. Simple centered layout with serif title + tagline.
3. **LoginScreen**: Serif heading "Welcome back". Clean email/password inputs using updated Input component. Muted primary login button.
4. **LoginRegisterScreen**: Minimal tab/toggle between login and register. Serif section heading.
5. **EmailSignupScreen**: Step indicator with subtle dots (not bold progress bar). Serif heading per step. Clean form fields.
6. **PhoneSignupScreen**: Match EmailSignupScreen styling approach.
7. **ProfileSetupScreen orchestrator**: Update step titles to serif. Progress indicator refined.
8. **profile-setup-basic-info-step**: Replace form labels with PlayfairDisplay-Italic prompts. E.g. "What should we call you?" instead of "Name".
9. **profile-setup-photo-step**: Clean 2x3 photo grid. Subtle add-photo placeholder. No bold borders.
10. **profile-setup-skill-level-step**: Pill-style horizontal selectors. Serif prompt "How do you play?".
11. **profile-setup-play-style-step**: Same pill-style as skill level.
12. **profile-setup-bio-step**: Serif prompt "Tell us about yourself". Clean multi-line text input.
13. **OnboardingScreen**: Replace bold slide animations with gentle fade/spring. Serif headlines. Muted illustration style.
14. **onboarding-animated-components**: Use `springPresets.gentle` from animation-presets. Fade-in on mount.

## Todo List
- [ ] Restyle WelcomeScreen (editorial layout, serif app name)
- [ ] Restyle welcome-brand-panel (remove glassmorphism)
- [ ] Restyle LoginScreen (serif heading, clean form)
- [ ] Restyle LoginRegisterScreen (minimal layout)
- [ ] Restyle EmailSignupScreen (serif titles, clean forms)
- [ ] Restyle email-signup-components
- [ ] Restyle PhoneSignupScreen
- [ ] Restyle ProfileSetupScreen orchestrator
- [ ] Restyle profile-setup-basic-info-step (prompt-based)
- [ ] Restyle profile-setup-photo-step (clean grid)
- [ ] Restyle profile-setup-skill-level-step (pill selectors)
- [ ] Restyle profile-setup-play-style-step (pill selectors)
- [ ] Restyle profile-setup-bio-step (serif prompt)
- [ ] Restyle OnboardingScreen (editorial slides)
- [ ] Update onboarding-animated-components (spring animations)
- [ ] Compile check all auth screens
- [ ] Visual review full auth flow (Welcome -> Setup -> Onboarding)

## Success Criteria
- Complete auth flow renders with Hinge aesthetic
- Serif typography visible on all headings/prompts
- No navigation or validation logic changes
- Works in both light and dark mode
- All form inputs functional with updated styling

## Risk Assessment
| Risk | Impact | Mitigation |
|------|--------|------------|
| ProfileSetup step layout breaks with new typography | Medium | Test each step individually |
| Onboarding animations stutter with spring config | Low | Fallback to simple fade if spring causes issues |

## Security Considerations
- No changes to auth logic, validation, or Supabase calls

## Next Steps
- Independent of Phase 4-7 (can proceed in parallel after Phase 2)
