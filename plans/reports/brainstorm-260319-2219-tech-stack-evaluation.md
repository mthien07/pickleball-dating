# Tech Stack Evaluation - Brainstorm Summary

**Date:** 2026-03-19
**Goal:** Production-ready app for thousands of users
**Pain Points:** Expo limitations, Supabase friction, State management complexity

## Key Finding

Zustand and TanStack Query are in package.json but **NOT USED** in codebase. All state managed via React Context + local useState. This is an architectural gap, not a tooling problem.

## Decisions

### 1. Expo SDK 54 → KEEP
- Add `expo-dev-client` for development builds
- No native limitations with dev client workflow
- Switching to bare RN = net negative DX

### 2. React Navigation v6 → KEEP FOR NOW
- Migration to Expo Router is large effort
- Not blocking production readiness
- Consider for future iteration

### 3. Supabase → KEEP + Improve Workflow
- Setup Supabase CLI for local development
- Use Edge Functions for business logic
- Proper migration workflow: local → staging → production
- Auto-generate TypeScript types

### 4. State Architecture → REFACTOR (Critical)
- **Server state:** TanStack Query (profiles, courts, bookings, messages, matches)
- **Auth state:** Migrate AuthContext → Zustand store (reduce re-renders)
- **Client state:** Zustand thin stores (UI preferences, filters, onboarding)
- **Theme state:** Keep React Context (affects entire tree)

### 5. Production Readiness → ADD
- P0: Sentry (error monitoring), EAS Build
- P1: PostHog/Mixpanel (analytics), GitHub Actions CI
- P2: EAS Update (OTA), App Store configs

## Implementation Priority
1. State architecture refactor (highest impact on DX)
2. Supabase local dev setup
3. Sentry + EAS Build
4. Analytics + CI/CD

## Risks
- State refactor touches many screens → needs careful testing
- Supabase CLI requires Docker
- Sentry setup needs source map config for Expo
