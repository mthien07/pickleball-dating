# Supabase Setup Guide - PickleBall Dating App

**Version**: 1.0
**Created**: 2026-01-02
**Backend**: Supabase (All-in-One BaaS)

---

## Table of Contents

1. [Create Supabase Project](#1-create-supabase-project)
2. [Enable PostgreSQL Extensions](#2-enable-postgresql-extensions)
3. [Environment Variables](#3-environment-variables)
4. [Run Database Migrations](#4-run-database-migrations)
5. [Configure Authentication](#5-configure-authentication)
6. [Setup Storage Buckets](#6-setup-storage-buckets)
7. [Enable Realtime](#7-enable-realtime)
8. [Verify Setup](#8-verify-setup)

---

## 1. Create Supabase Project

### Step 1.1: Sign Up / Log In

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Sign in with GitHub, Google, or Email

### Step 1.2: Create New Project

1. Click **"New Project"**
2. Fill in project details:
   - **Organization**: Select or create organization
   - **Project Name**: `pickleball-dating` (or your preferred name)
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: **Southeast Asia (Singapore)** - `ap-southeast-1`
   - **Pricing Plan**: Free tier (sufficient for development)

3. Click **"Create new project"**
4. Wait 2-3 minutes for project provisioning

### Step 1.3: Get Project Credentials

Once project is ready:

1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - **anon / public key**: Safe to use in client apps (with RLS enabled)
     - **service_role / secret key**: NEVER expose in client apps (admin access)

3. Go to **Settings** → **Database**
4. Copy **Connection String** (URI format) if needed for direct DB access

---

## 2. Enable PostgreSQL Extensions

### Step 2.1: Navigate to SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard sidebar
2. Click **"+ New query"**

### Step 2.2: Run Extension Setup

Copy and paste this SQL, then click **"Run"**:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geo-spatial queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable full-text search (trigram matching)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

**Verify**:
```sql
-- Check installed extensions
SELECT * FROM pg_extension;
```

You should see all 4 extensions listed.

---

## 3. Environment Variables

### Step 3.1: Create `.env` File

In your project root, create `.env`:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# DO NOT expose these in client apps!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=your-database-password

# App Configuration
APP_ENV=development
API_BASE_URL=https://xxxxxxxxxxxxx.supabase.co/rest/v1
```

**Important**:
- `EXPO_PUBLIC_*` prefix is required for Expo to expose variables to client
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` is SAFE to expose (RLS protects your data)
- `SUPABASE_SERVICE_ROLE_KEY` is for server-side only (bypasses RLS)

### Step 3.2: Create `.env.example` Template

```bash
# Supabase Configuration (Get from: Settings → API)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only (NEVER commit to git!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_DB_PASSWORD=your-database-password

# App Configuration
APP_ENV=development
API_BASE_URL=https://your-project-ref.supabase.co/rest/v1
```

### Step 3.3: Add to `.gitignore`

Ensure `.env` is in `.gitignore`:

```bash
# Environment variables
.env
.env.local
.env.*.local
```

---

## 4. Run Database Migrations

### Step 4.1: Navigate to SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"+ New query"**

### Step 4.2: Run Migrations in Order

Run these migration files **one by one** in SQL Editor:

#### Migration 1: Initial Schema

**File**: `supabase/migrations/001_initial_schema.sql`

1. Open the file from your project
2. Copy entire SQL content
3. Paste into SQL Editor
4. Click **"Run"**
5. Verify: Go to **Table Editor** → You should see 14 new tables

#### Migration 2: Row-Level Security Policies

**File**: `supabase/migrations/002_rls_policies.sql`

1. Copy and paste SQL content
2. Click **"Run"**
3. Verify: Go to **Authentication** → **Policies** → Tables should show RLS enabled

#### Migration 3: Database Functions & Triggers

**File**: `supabase/migrations/003_functions.sql`

1. Copy and paste SQL content
2. Click **"Run"**
3. Verify: Go to **Database** → **Functions** → Should see new functions

#### Migration 4: Seed Data

**File**: `supabase/migrations/004_seed_data.sql`

1. Copy and paste SQL content
2. Click **"Run"**
3. Verify: Go to **Table Editor** → `courts` and `coaches` tables should have sample data

### Step 4.3: Verify Migrations

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output: 14 tables
-- bookings, booking_slots, coaches, conversations, courts, court_time_slots,
-- matches, messages, notifications, reviews, swipes, user_blocks, user_reports, users
```

---

## 5. Configure Authentication

### Step 5.1: Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Toggle **Enable Email provider** to ON
4. Configure settings:
   - ✅ **Confirm email**: ON (recommended for production)
   - ✅ **Secure email change**: ON
   - **Minimum password length**: 8

5. Click **"Save"**

### Step 5.2: Enable Phone Provider (OTP)

1. Go to **Authentication** → **Providers**
2. Find **Phone** provider
3. Toggle **Enable Phone provider** to ON
4. Configure SMS provider:
   - **Provider**: Choose Twilio / MessageBird / etc.
   - **Account SID**: Your Twilio Account SID
   - **Auth Token**: Your Twilio Auth Token
   - **Phone Number**: Your Twilio phone number (+84xxxxxxxxx)

5. Click **"Save"**

**Note**: Phone OTP requires paid SMS provider. For development, use Email provider only.

### Step 5.3: Configure OAuth Providers

#### Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** provider
3. Toggle **Enable Google provider** to ON
4. Get OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID
   - Copy **Client ID** and **Client Secret**

5. Paste into Supabase:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `xxxxxxxxxxxxxx`
   - **Redirect URL**: Use Supabase's auto-generated URL

6. Click **"Save"**

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create Facebook App
3. Get **App ID** and **App Secret**
4. In Supabase: Enable **Facebook** provider
5. Paste credentials
6. Click **"Save"**

#### Apple Sign In

1. Go to [Apple Developer](https://developer.apple.com)
2. Create Service ID and Key
3. Get **Service ID**, **Team ID**, **Key ID**, and **Private Key**
4. In Supabase: Enable **Apple** provider
5. Paste credentials
6. Click **"Save"**

### Step 5.4: Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Configure:
   - **JWT expiry**: 3600 (1 hour)
   - **Refresh token rotation**: ON
   - **Minimum password strength**: 3/4
   - **Auto-logout**: 604800 (7 days)

3. **Redirect URLs** (for deep linking):
   ```
   myapp://auth/callback
   http://localhost:19006/auth/callback  (Expo web)
   ```

4. Click **"Save"**

### Step 5.5: Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize templates:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**
   - **Change email address**

3. Use app branding and deep link URLs:
   ```
   {{ .ConfirmationURL }}
   → myapp://auth/confirm?token={{ .Token }}
   ```

---

## 6. Setup Storage Buckets

### Step 6.1: Create Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"Create bucket"**

Create these 4 buckets:

#### Bucket 1: profile-photos

- **Name**: `profile-photos`
- **Public**: ✅ ON (images publicly readable)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket 2: court-images

- **Name**: `court-images`
- **Public**: ✅ ON
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg, image/png`

#### Bucket 3: message-images

- **Name**: `message-images`
- **Public**: ❌ OFF (private, RLS-protected)
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/gif`

#### Bucket 4: review-images

- **Name**: `review-images`
- **Public**: ✅ ON
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png`

### Step 6.2: Configure Storage Policies

1. Go to **Storage** → **Policies**
2. Click **"New policy"** for each bucket

Run `supabase/storage/policies.sql` in SQL Editor to create all storage policies.

### Step 6.3: Verify Storage Setup

1. Go to **Storage** → `profile-photos`
2. Click **"Upload files"**
3. Upload a test image
4. Click on uploaded file → Copy **Public URL**
5. Open URL in browser → Should load image

---

## 7. Enable Realtime

### Step 7.1: Enable Realtime for Tables

1. Go to **Database** → **Replication**
2. Enable Realtime for these tables:
   - ✅ **conversations**
   - ✅ **messages**
   - ✅ **matches**
   - ✅ **notifications**
   - ✅ **court_time_slots** (for live slot availability)

3. Click **"Save"**

### Step 7.2: Configure Realtime Settings

1. Go to **Settings** → **Realtime**
2. Configure:
   - **Max connections**: 100 (Free tier limit)
   - **Max joins per second**: 100
   - **Rate limit**: Enabled

3. Click **"Save"**

---

## 8. Verify Setup

### Step 8.1: Test Database Connection

```sql
-- Run in SQL Editor
SELECT NOW() as current_time;
-- Should return current timestamp
```

### Step 8.2: Test Authentication

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in email + password
4. Click **"Create user"**
5. Verify user appears in list

### Step 8.3: Test RLS Policies

```sql
-- Switch to authenticated user context
SET request.jwt.claims = '{"sub":"user-uuid-from-auth-users"}';

-- Try to query users table (should work)
SELECT * FROM users;
-- Should return only that user's data
```

### Step 8.4: Test Storage Upload

Use Supabase Dashboard:
1. **Storage** → `profile-photos`
2. Upload test image
3. Get public URL
4. Verify accessible

### Step 8.5: Test Realtime

1. Open **Database** → **Table Editor** → `messages`
2. Insert a new row manually
3. Open browser console with Realtime subscription code
4. Should receive INSERT event in real-time

---

## 9. Next Steps

✅ **Supabase Backend is Ready!**

Now you can:

1. **Install Supabase SDK** in React Native app:
   ```bash
   npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
   ```

2. **Initialize Supabase Client** (`src/services/supabase.ts`)

3. **Implement API Services** (`src/services/api/`)

4. **Replace mock data** with real API calls

5. **Test end-to-end flows** (signup → login → swipe → match → chat → booking)

---

## 10. Troubleshooting

### Issue: "Could not connect to Supabase"

**Solution**:
- Check **Project URL** and **Anon Key** are correct in `.env`
- Ensure `.env` variables have `EXPO_PUBLIC_` prefix
- Restart Expo development server after changing `.env`

### Issue: "RLS policy violation"

**Solution**:
- Verify user is authenticated (`supabase.auth.getUser()`)
- Check RLS policies in **Authentication** → **Policies**
- Test policy with specific user UUID in SQL Editor

### Issue: "Extension does not exist"

**Solution**:
- Go to **SQL Editor**
- Run `CREATE EXTENSION IF NOT EXISTS "extension-name";`
- Some extensions require Supabase support (contact support)

### Issue: "Storage upload fails"

**Solution**:
- Check bucket exists and is public (if needed)
- Verify file size < limit
- Check MIME type is allowed
- Ensure storage policy allows upload

### Issue: "Realtime not working"

**Solution**:
- Verify table has Realtime enabled (**Database** → **Replication**)
- Check subscription filter matches data
- Use unique channel names
- Ensure proper cleanup (`channel.unsubscribe()`)

---

## 11. Important Notes

### Security Best Practices

1. **NEVER expose `service_role` key** in client apps
2. **Always enable RLS** on tables with user data
3. **Test RLS policies** thoroughly before production
4. **Use HTTPS** in production (automatic with Supabase)
5. **Rotate secrets** regularly

### Performance Tips

1. **Add indexes** on frequently queried columns
2. **Use RPC functions** for complex queries
3. **Enable connection pooling** for high traffic
4. **Cache static data** client-side
5. **Use CDN** for images (Supabase Storage auto-CDN)

### Cost Management (Free Tier)

- **Database size**: 500 MB
- **Bandwidth**: 5 GB/month
- **Storage**: 1 GB
- **Realtime connections**: 200 concurrent
- **Auth users**: Unlimited

Upgrade to Pro ($25/month) for:
- 8 GB database
- 50 GB bandwidth
- 100 GB storage
- 500 concurrent realtime

---

## 12. Useful Resources

### Official Docs

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [Database Functions Reference](https://supabase.com/docs/guides/database/functions)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Community

- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

### Local References

- `docs/references/supabase-react-native-setup.md`
- `docs/references/supabase-auth-api.md`
- `docs/references/supabase-rls-policies.md`
- `docs/references/supabase-realtime.md`

---

**Document End**
