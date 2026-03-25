---
title: "Tech Stack Production Readiness Refactor"
description: "Migrate unused Zustand/TanStack Query into active use, add Sentry, EAS Build, PostHog, Supabase CLI"
status: done
priority: P1
effort: 26h
branch: main
tags: [state-management, production, devops, zustand, tanstack-query, sentry, eas, posthog]
created: 2026-03-19
---

# Tech Stack Production Readiness

## Problem
Zustand v5 and TanStack Query v5 are installed but unused. All state managed via React Context + manual useState/useEffect hooks with mock fallback. No error monitoring, no CI/CD, no analytics.

## Goal
Activate existing dependencies, eliminate manual state patterns, add production infrastructure.

## Phases

| # | Phase | Effort | Depends On | Status |
|---|-------|--------|------------|--------|
| 1 | [Zustand Auth Store](./phase-01-zustand-auth-store.md) | 3h | - | done |
| 2 | [Zustand UI Store](./phase-02-zustand-ui-store.md) | 1.5h | - | done |
| 3 | [TanStack Query Hooks](./phase-03-tanstack-query-hooks.md) | 8h | Phase 1 | done |
| 4 | [Provider Setup](./phase-04-provider-setup.md) | 1.5h | Phase 1, 3 | done |
| 5 | [Supabase Local Dev](./phase-05-supabase-local-dev.md) | 2h | - | done |
| 6 | [Sentry Error Monitoring](./phase-06-sentry-error-monitoring.md) | 3h | - | done |
| 7 | [EAS Build Pipeline](./phase-07-eas-build-pipeline.md) | 4h | Phase 6 | done |
| 8 | [Analytics (PostHog)](./phase-08-analytics-posthog.md) | 3h | - | done |

## Key Dependencies
- Phase 3 requires Phase 1 (auth store provides `isAuthenticated` for query `enabled` flags)
- Phase 4 requires Phases 1+3 (final provider tree restructure)
- Phase 7 benefits from Phase 6 (Sentry source maps in EAS builds)
- Phases 2, 5, 6, 8 are independent -- can run in parallel

## Risk Summary
- State refactor touches 13+ files (5 hooks, 5 screens, AuthContext, App.tsx, RootNavigator)
- Mock fallback removal must preserve dev-mode preview capability
- Supabase CLI requires Docker on dev machines

## Research References
- [State Management Research](./research/researcher-01-state-management.md)
- [Production Tooling Research](./research/researcher-02-production-tooling.md)
- [Brainstorm Summary](../reports/brainstorm-260319-2219-tech-stack-evaluation.md)
