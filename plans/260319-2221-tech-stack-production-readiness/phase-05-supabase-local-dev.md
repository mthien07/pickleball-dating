# Phase 5: Supabase Local Dev Workflow

## Context Links
- [Production Tooling Research](./research/researcher-02-production-tooling.md) -- Section 4
- [Supabase Client Config](../src/services/supabase.ts)

## Overview
- **Priority:** P2
- **Status:** pending
- **Effort:** 2h
- **Depends on:** None (independent)
- **Description:** Setup Supabase CLI for local development with Docker, migrations, and TypeScript type generation

## Key Insights
- Supabase CLI provides full local stack: postgres, auth, storage, realtime
- `supabase db diff` captures schema changes as migration files
- `supabase gen types typescript` auto-generates DB types
- Shadow database pattern ensures migration consistency
- Docker required on dev machines

## Requirements
**Functional:**
- Local Supabase stack runs via single command
- Schema changes captured as versioned migration files
- TypeScript types auto-generated from local DB schema
- npm scripts for common operations

**Non-functional:**
- Mirrors production environment locally
- Type-safe Supabase client queries
- Team-sharable workflow via committed config

## Architecture
```
Developer Machine:
  Docker --> supabase start --> local postgres + auth + storage + realtime
                            --> supabase studio (localhost:54323)

Workflow:
  Make schema changes in Studio --> supabase db diff --> migration file
  --> supabase gen types --> src/types/supabase.ts
  --> commit migration + types
```

## Related Code Files
**Create:**
- `supabase/config.toml` (via `supabase init`)
- `supabase/migrations/` directory
- `src/types/supabase.ts` -- Auto-generated DB types
- `supabase/seed.sql` -- Dev seed data (optional)

**Modify:**
- `package.json` -- Add npm scripts
- `src/services/supabase.ts` -- Use generated types with client
- `.gitignore` -- Ensure supabase/.temp/ excluded

## Implementation Steps

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase project:
   ```bash
   supabase init
   supabase link --project-ref <project-id>
   ```

3. Pull existing remote schema:
   ```bash
   supabase db pull
   ```
   Creates initial migration from production schema.

4. Add npm scripts to package.json:
   ```json
   {
     "db:start": "supabase start",
     "db:stop": "supabase stop",
     "db:reset": "supabase db reset --local",
     "db:diff": "supabase db diff -f",
     "db:push": "supabase db push",
     "db:types": "supabase gen types typescript --local > src/types/supabase.ts"
   }
   ```

5. Generate TypeScript types:
   ```bash
   npm run db:types
   ```

6. Update Supabase client to use generated types:
   ```typescript
   import { Database } from '../types/supabase';
   export const supabase = createClient<Database>(url, key);
   ```

7. Update .gitignore:
   ```
   supabase/.temp/
   supabase/.env
   ```

8. Document workflow in README or docs/:
   - How to start local stack
   - How to create migrations
   - How to generate types after schema changes

## Todo List
- [ ] Install Supabase CLI
- [ ] Initialize and link project
- [ ] Pull existing schema as baseline migration
- [ ] Add npm scripts to package.json
- [ ] Generate TypeScript types
- [ ] Update Supabase client with Database generic
- [ ] Update .gitignore
- [ ] Document workflow

## Success Criteria
- `npm run db:start` spins up full local Supabase stack
- `npm run db:types` generates accurate TypeScript types
- Supabase client queries are type-checked against DB schema
- Migration files committed and versioned

## Risk Assessment
- **Risk:** Docker not installed on all dev machines
  - **Mitigation:** Document Docker requirement in setup guide. Docker Desktop is standard for dev.
- **Risk:** Remote schema drift if team uses Dashboard for production changes
  - **Mitigation:** Enforce migrations-only workflow. Pull from remote periodically.

## Security Considerations
- Never commit `supabase/.env` (contains local service role key)
- Local service role key is development-only, not production secret
- Production credentials stay in Supabase Dashboard / EAS env vars

## Next Steps
- Type-safe client improves DX for all service files
- Migration workflow enables safe schema evolution
