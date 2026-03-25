# Phase 7: EAS Build Pipeline

## Context Links
- [Production Tooling Research](./research/researcher-02-production-tooling.md) -- Section 2
- Phase 6 (Sentry source maps integrated into build)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 4h
- **Depends on:** Phase 6 (Sentry plugin configured before first build)
- **Description:** Configure EAS Build with dev/preview/production profiles, environment variables, and GitHub Actions CI

## Key Insights
- Three profiles: development (dev-client), preview (TestFlight/internal), production
- Single EXPO_TOKEN for GitHub Actions auth
- Environment variables per-profile via eas.json `env` field
- Sentry source maps upload automatically during EAS Build
- EAS Workflows can chain build -> submit

## Requirements
**Functional:**
- `eas build -p ios --profile preview` produces TestFlight build
- `eas build -p android --profile preview` produces internal APK
- `eas build --profile production` produces store-ready builds
- GitHub Actions: lint + type-check + test on every PR
- GitHub Actions: trigger preview build on merge to main

**Non-functional:**
- Build credentials managed by EAS (no local cert management)
- Environment variables injected per profile
- Build cache for faster iterations

## Architecture
```
GitHub PR:
  --> GitHub Actions --> lint, type-check, test
  --> Pass/Fail status check

Merge to main:
  --> GitHub Actions --> eas build --profile preview --no-wait
  --> Build runs on EAS servers
  --> Artifacts: TestFlight + Internal APK

Manual production release:
  --> eas build --profile production
  --> eas submit
```

## Related Code Files
**Create:**
- `eas.json` -- Build profiles and env vars
- `.github/workflows/ci.yml` -- PR checks (lint, type-check, test)
- `.github/workflows/preview-build.yml` -- Preview build on merge

**Modify:**
- `app.json` -- Add EAS project ID, update version/build config
- `package.json` -- Add CI-friendly scripts if missing

## Implementation Steps

1. Install EAS CLI and configure:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. Create `eas.json` with profiles:
   ```json
   {
     "cli": { "version": ">= 12.0.0" },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "env": {
           "EXPO_PUBLIC_SUPABASE_URL": "http://localhost:54321",
           "EXPO_PUBLIC_ENV": "development"
         }
       },
       "preview": {
         "distribution": "internal",
         "env": {
           "EXPO_PUBLIC_SUPABASE_URL": "<staging-url>",
           "EXPO_PUBLIC_ENV": "preview"
         }
       },
       "production": {
         "env": {
           "EXPO_PUBLIC_SUPABASE_URL": "<production-url>",
           "EXPO_PUBLIC_ENV": "production"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

3. Set EAS secrets:
   ```bash
   eas secret:create --name SENTRY_AUTH_TOKEN --value <token>
   eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <key>
   ```

4. Create `.github/workflows/ci.yml`:
   - Trigger: on pull_request
   - Jobs: checkout, setup node, install deps, run lint, type-check, test
   - Use `expo-github-action` for Expo CLI setup

5. Create `.github/workflows/preview-build.yml`:
   - Trigger: on push to main
   - Job: trigger EAS preview build using EXPO_TOKEN
   - `eas build --platform all --profile preview --no-wait`

6. Set GitHub repository secrets:
   - `EXPO_TOKEN` -- from expo.dev account settings

7. Update app.json:
   - Add `"extra": { "eas": { "projectId": "<id>" } }`

8. Test locally:
   ```bash
   eas build --profile preview --platform ios --local  # optional local test
   eas build --profile preview --platform ios           # remote test
   ```

## Todo List
- [ ] Install and login to EAS CLI
- [ ] Run eas build:configure
- [ ] Create eas.json with 3 profiles
- [ ] Set EAS secrets (Sentry token, Supabase keys)
- [ ] Create GitHub Actions CI workflow
- [ ] Create GitHub Actions preview build workflow
- [ ] Set EXPO_TOKEN in GitHub secrets
- [ ] Update app.json with EAS project ID
- [ ] Test preview build end-to-end
- [ ] Verify Sentry source maps upload in build

## Success Criteria
- PR triggers CI checks (lint, type-check, test)
- Merge to main triggers preview build
- Preview build installs on test devices
- Sentry receives source maps from build
- Production build produces store-ready binary

## Risk Assessment
- **Risk:** Apple Developer credentials not configured
  - **Mitigation:** EAS manages credentials. First build prompts for Apple login. Document in team guide.
- **Risk:** CI flaky due to Expo CLI version mismatch
  - **Mitigation:** Pin versions in ci.yml. Use `expo-github-action@v8` with specific SDK version.
- **Risk:** Build cache misses slow down builds
  - **Mitigation:** EAS automatically caches node_modules. Accept initial build is slower.

## Security Considerations
- EXPO_TOKEN is a deployment secret -- only in GitHub Secrets, never committed
- SENTRY_AUTH_TOKEN only in EAS secrets
- Supabase anon key is public-facing but manage via EAS env vars for environment separation
- Service role key NEVER in client builds

## Next Steps
- Consider EAS Update for OTA patches (future iteration)
- Consider eas submit automation for app store releases
