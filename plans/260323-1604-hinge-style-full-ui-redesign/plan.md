---
title: "Hinge-Style Full UI Redesign"
description: "Convert PickleBall Dating from Tinder-style swipe to Hinge-style editorial vertical profiles with refined design system"
status: pending
priority: P1
effort: 32h
branch: main
tags: [ui-redesign, hinge-style, design-system, visual-only]
created: 2026-03-23
---

# Hinge-Style Full UI Redesign

## Goal
Convert from Tinder-style (horizontal swipe cards) to Hinge-style (vertical scrollable editorial profiles with section-level likes). Visual-only changes -- no functionality, navigation, or data flow modifications.

## Phases

| # | Phase | Effort | Status | File |
|---|-------|--------|--------|------|
| 1 | Design System Foundation | 4h | pending | [phase-01](phase-01-design-system-foundation.md) |
| 2 | Core Components Redesign | 5h | pending | [phase-02](phase-02-core-components-redesign.md) |
| 3 | Auth Flow Redesign | 4h | pending | [phase-03](phase-03-auth-flow-redesign.md) |
| 4 | Home & Discovery Redesign | 6h | pending | [phase-04](phase-04-home-discovery-redesign.md) |
| 5 | Matches, Chat & Social | 4h | pending | [phase-05](phase-05-matches-chat-social.md) |
| 6 | Profile & Settings | 3h | pending | [phase-06](phase-06-profile-settings.md) |
| 7 | Booking & Coach | 3h | pending | [phase-07](phase-07-booking-coach.md) |
| 8 | Web Responsive & Polish | 3h | pending | [phase-08](phase-08-web-responsive-polish.md) |

## Key Decisions
- **Font pairing**: Add PlayfairDisplay (serif) for editorial headlines; keep Barlow for body
- **Color shift**: Muted warm palette (Slate-based neutrals + softer blue/rose accents)
- **Core mechanic**: HomeSwipeScreen swipe cards -> vertical scrollable feed with section-level likes
- **Animations**: Replace bold sport animations with spring-based micro-interactions
- **Preserve**: ThemeContext architecture, navigation structure, all hooks, Supabase integration, mock data

## Dependencies
- Download PlayfairDisplay font files (.ttf) from Google Fonts
- No new npm packages required (Reanimated, expo-linear-gradient already installed)

## Research
- [Hinge UI Patterns](research/researcher-hinge-ui-patterns.md)

## Risk
- Largest risk: Phase 4 HomeSwipeScreen conversion (most code change)
- Mitigation: Keep SwipeCard intact as fallback; build EditorialProfileFeed alongside
