---
title: "Tinder-Style Profile Redesign"
description: "Redesign ProfileMe and EditProfile screens with Tinder-inspired hero photo, stats grid, and photo management"
status: in-progress
priority: P2
effort: 2h
branch: main
tags: [ui, profile, tinder, redesign]
created: 2026-03-18
---

# Tinder-Style Profile Redesign

## Goal
Transform ProfileMeScreen and EditProfileScreen to match Tinder's profile UX: hero photo with gradient overlay, stats bento grid, skill badges, and 3x3 photo management grid.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | ProfileMeScreen Redesign | 1h | complete (web test pending) | [phase-01](phase-01-profile-me-redesign.md) |
| 2 | EditProfileScreen Redesign | 1h | pending | [phase-02-edit-profile-redesign.md](phase-02-edit-profile-redesign.md) |

## Execution Strategy
- **Sequential**: Phase 2 depends on Phase 1 (shared component patterns)
- Phase 1 modifies: `profile-me/ProfileMeScreen.tsx`, `profile-me/profile-me-styles.ts`, `profile-me/profile-me-components.tsx`
- Phase 2 modifies: `edit-profile/EditProfileScreen.tsx`, `edit-profile/edit-profile-styles.ts`, `edit-profile/edit-profile-photo-grid.tsx`

## File Ownership Matrix

| File | Phase |
|------|-------|
| `src/screens/profile/profile-me/ProfileMeScreen.tsx` | 1 |
| `src/screens/profile/profile-me/profile-me-styles.ts` | 1 |
| `src/screens/profile/profile-me/profile-me-components.tsx` | 1 |
| `src/screens/profile/edit-profile/EditProfileScreen.tsx` | 2 |
| `src/screens/profile/edit-profile/edit-profile-styles.ts` | 2 |
| `src/screens/profile/edit-profile/edit-profile-photo-grid.tsx` | 2 |

## Design Reference
- `design/uiuxguides.md` Section 3: Tinder-Style UX Flows
- `design/design-system.md` for color palette and typography
- `src/theme/tokens.ts` for design tokens
