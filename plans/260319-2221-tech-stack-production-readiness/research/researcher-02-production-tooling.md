# Production Tooling Research - Expo SDK 54

**Date**: 2026-03-19 | **Duration**: 5 tool calls

---

## 1. Sentry Setup for Expo SDK 54

**Setup Complexity**: Medium

### Key Findings
- Two-plugin architecture required: `@sentry/react-native/expo` config plugin + Sentry Metro Plugin
- Config via `app.json`/`app.config.js` with URL, project, org slugs
- `SENTRY_AUTH_TOKEN` env var required for authentication
- Automatic source map upload during EAS Build and native builds via `npx expo prebuild`
- For EAS Updates, manual upload via `sentry-expo-upload-sourcemaps` command

### Setup Steps
1. Add expo plugin to app config with auth token
2. Integrate Sentry Metro Plugin via `getSentryExpoConfig()`
3. For EAS Updates: use npm/yarn scripts for source map uploads
4. Set `SENTRY_AUTH_TOKEN` in build environment

### Gotchas
- Environment variables must be set on both local and EAS Build builder
- Issue #4961: Source map upload can fail if env vars not properly configured despite valid plugin config
- Separate workflow needed for EAS Updates vs. native builds

**Recommendation**: Use Sentry for crash reporting. Setup is straightforward with Expo's excellent plugin ecosystem.

---

## 2. EAS Build Pipeline Best Practices

**Setup Complexity**: Low-Medium

### Key Findings
- Three default profiles: `development` (dev-client), `preview` (TestFlight/internal), `production`
- Single `EXPO_TOKEN` replaces complex credential management (vs. Fastlane Match + env vars)
- Environment variables injected via `eas.json` "env" field for app.config.js evaluation
- GitHub integration: specify image in eas.json for CI/CD runners
- EAS Workflows provide powerful automation engine for build → test → submit pipelines

### Best Practices
1. Initialize with `eas build:configure` to scaffold profiles
2. Define env vars per-profile to control behavior (dev toggles, API endpoints)
3. Verify locally: `eas build -p all` before CI integration
4. GitHub Actions: Use single `EXPO_TOKEN` instead of manual credential setup
5. Trigger from GitHub via `eas build --no-wait` for async workflows

### Gotchas
- Image specification required for GitHub CI (no auto-selection)
- Build credentials must exist before first CI build
- Profile-specific env vars evaluated at prebuild time, not runtime

**Recommendation**: Use EAS Build for all platforms. Manages credentials seamlessly and integrates perfectly with Expo tooling.

---

## 3. Analytics: PostHog vs Mixpanel vs Amplitude

**Setup Complexity**: Low (all platforms)

### Pricing Comparison (2026)
| Tool | Model | Free Tier | Estimated Cost (10M events/mo) |
|------|-------|-----------|--------------------------------|
| PostHog | Usage-based | Generous | $180-900 |
| Mixpanel | Per-event | 1M free | ~$2,520 |
| Amplitude | Per-MTU | 10K MTU free | $2,000-8,000 |

**PostHog is 50-75% cheaper** than competitors.

### React Native / Expo Support
- All three have React Native SDKs
- Mixpanel: session replay for mobile included
- PostHog: session recordings + feature flags included
- Amplitude: mobile SDKs mature but less feature-rich free tier

### Key Differentiation
- **PostHog**: No per-seat fees, best for small teams; self-hostable option
- **Mixpanel**: Mature product, strong session replay for mobile
- **Amplitude**: Enterprise-focused, extensive integrations

### Gotchas
- PostHog self-hosting adds DevOps overhead (Docker, maintenance)
- Mixpanel per-event pricing scales poorly with high-volume apps
- Amplitude MTU model can spike with login issues (repeated user IDs)

**Recommendation**: **PostHog** for startups/MVP (cost + feature balance). **Mixpanel** if session replay is critical. **Amplitude** only for large teams needing enterprise support.

---

## 4. Supabase CLI Local Development Workflow

**Setup Complexity**: Low

### Key Workflow
1. `npm install -g supabase` + Docker required
2. `npx supabase start` to spin up local stack (postgres, auth, storage, realtime)
3. Make schema changes via Studio Dashboard
4. `npx supabase db diff -f migration_name` to capture changes
5. `npx supabase db reset --local` to apply migrations
6. `npx supabase gen types typescript --local` for type generation

### Migration Strategy
- Shadow database pattern: diff compares local schema against shadow DB created from migration files
- Version control migrations in `/supabase/migrations/` folder
- Applied sequentially on startup
- Works across local → staging → production environments

### Type Generation
- Single command: `supabase gen types typescript --local` (or `--project-id <id>` for remote)
- Generates complete TypeScript definitions for all tables, functions, RLS policies
- Integrates with `supabase-js` client for full type safety

### Gotchas
- Docker required; no easy Node-only alternative
- Type generation command syntax varies between Supabase versions
- Shadow DB approach can fail if migrations have side effects (seed data, triggers)
- Requires manual schema sync if using Supabase Dashboard for production changes

**Recommendation**: Use Supabase CLI workflow. Local development mirrors production precisely. Type generation is excellent for DX.

---

## Summary Table

| Tool | Complexity | Cost | Recommendation |
|------|-----------|------|----------------|
| **Sentry** | Medium | Free-$200/mo | ✅ Use for crashes + source maps |
| **EAS Build** | Low-Med | Built-in | ✅ Standard for Expo projects |
| **PostHog** | Low | $180-900/mo | ✅ Best price-to-feature ratio |
| **Supabase CLI** | Low | Free | ✅ Essential for local dev |

---

## Integration Checklist

- [ ] Sentry: Add expo plugin, set `SENTRY_AUTH_TOKEN` in eas.json, test source map upload
- [ ] EAS: Scaffold eas.json profiles, define env vars per-profile, test GitHub trigger
- [ ] Analytics: Choose PostHog/Mixpanel, integrate SDK, seed initial events
- [ ] Supabase CLI: Install Docker, init local stack, create first migration, generate types

---

## Sources
- [Sentry Expo Config Plugin](https://docs.sentry.io/platforms/react-native/sourcemaps/uploading/expo/)
- [Expo Sentry Guide](https://docs.expo.dev/guides/using-sentry/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [EAS + GitHub Actions Integration](https://expo.dev/blog/how-to-integrate-eas-workflows-with-github-actions)
- [Analytics Comparison](https://www.brainforge.ai/resources/amplitude-vs-mixpanel-vs-posthog)
- [PostHog vs Mixpanel](https://posthog.com/blog/posthog-vs-mixpanel)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Supabase Database Migrations](https://supabase.com/docs/guides/deployment/database-migrations)
