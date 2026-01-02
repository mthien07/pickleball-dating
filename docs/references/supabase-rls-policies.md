# Supabase Row Level Security (RLS) Policies (2025)

**Source**: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) | [Authorization via RLS](https://supabase.com/features/row-level-security)

**Last Updated**: 2026-01-02

---

## What is RLS?

Row Level Security (RLS) is PostgreSQL's rule engine that adds security filters to your database queries. Think of RLS as automatically adding a `WHERE` clause to every query based on the current user.

**Key Concept**: Once RLS is enabled on a table, that table becomes inaccessible to ALL users (including authenticated ones) until you define policies that explicitly grant access.

---

## Enabling RLS

```sql
ALTER TABLE schema_name.table_name ENABLE ROW LEVEL SECURITY;
```

**After enabling RLS**:
- Table becomes inaccessible by default
- Must create policies to grant access
- Policies are evaluated for every query

---

## Policy Anatomy

```sql
CREATE POLICY "policy_name"
ON table_name
[FOR operation]  -- SELECT, INSERT, UPDATE, DELETE, or ALL
[TO role]        -- authenticated, anon, service_role
[USING (condition)]      -- For SELECT, UPDATE, DELETE
[WITH CHECK (condition)] -- For INSERT, UPDATE
```

---

## Helper Functions

### auth.uid()

Returns the ID of the user making the request.

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users view own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

### auth.jwt()

Returns the full JWT payload.

```sql
-- Example: Check custom claims
CREATE POLICY "Admin only"
ON admin_table FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Common Policy Patterns

### Pattern 1: User-Specific Data (Private)

**Use Case**: Users can only access their own records.

```sql
-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Users can view their own todos
CREATE POLICY "Users can view own todos"
ON todos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own todos
CREATE POLICY "Users can insert own todos"
ON todos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own todos
CREATE POLICY "Users can update own todos"
ON todos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own todos
CREATE POLICY "Users can delete own todos"
ON todos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

---

### Pattern 2: Public Read, Private Write

**Use Case**: Anyone can read, only owner can write.

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are publicly readable"
ON profiles FOR SELECT
USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

### Pattern 3: Match Participants Only

**Use Case**: Only users involved in a match can see messages.

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read conversation messages"
ON messages FOR SELECT
TO authenticated
USING (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);
```

---

### Pattern 4: Blocking Logic

**Use Case**: Hide users who are blocked.

```sql
CREATE POLICY "Users can view other active users"
ON users FOR SELECT
TO authenticated
USING (
  is_active = TRUE
  AND profile_complete = TRUE
  AND id NOT IN (
    -- Users I blocked
    SELECT blocked_id FROM user_blocks WHERE blocker_id = auth.uid()
  )
  AND id NOT IN (
    -- Users who blocked me
    SELECT blocker_id FROM user_blocks WHERE blocked_id = auth.uid()
  )
);
```

---

### Pattern 5: Admin + Owner Access

**Use Case**: Admins can access everything, users can access their own.

```sql
CREATE POLICY "Admin or owner can view bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id  -- Owner
  OR auth.jwt() ->> 'role' = 'admin'  -- Admin
);
```

---

## Storage RLS Policies

For Supabase Storage buckets:

```sql
-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can upload to their own folder
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Best Practices

### 1. Don't Use `FOR ALL`

❌ **Bad**:
```sql
CREATE POLICY "Users access own data"
ON users FOR ALL
USING (auth.uid() = id);
```

✅ **Good**:
```sql
-- Separate policies for each operation
CREATE POLICY "Users view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own data" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users delete own data" ON users FOR DELETE USING (auth.uid() = id);
```

**Why?**: Better debugging, clearer permissions, easier to modify.

---

### 2. Add Indexes on Policy Columns

```sql
-- If your policy filters by user_id
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- If your policy joins with another table
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

**Why?**: Policies are evaluated on every query. Without indexes, performance degrades with large tables.

---

### 3. Enable RLS Early

- Enable RLS during table creation
- Test policies in development before deploying
- Use `EXPLAIN ANALYZE` to check policy performance

---

### 4. Test Policies Thoroughly

```sql
-- Test as specific user
SET request.jwt.claims = '{"sub":"user-uuid-here"}';

-- Run query to see if policy works
SELECT * FROM users;
```

---

### 5. Use Partial Indexes for Common Filters

```sql
-- If your policy often filters by is_active = TRUE
CREATE INDEX idx_users_active
ON users(id)
WHERE is_active = TRUE;
```

---

## Common Pitfalls

### Pitfall 1: Forgetting `WITH CHECK` on INSERT/UPDATE

❌ **Bad**:
```sql
CREATE POLICY "Users insert todos" ON todos FOR INSERT USING (auth.uid() = user_id);
```

✅ **Good**:
```sql
CREATE POLICY "Users insert todos" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

### Pitfall 2: Not Handling NULL User (Unauthenticated)

```sql
-- This fails if auth.uid() is NULL (unauthenticated user)
USING (auth.uid() = user_id)

-- Better: Be explicit about authenticated users
TO authenticated
USING (auth.uid() = user_id)
```

---

### Pitfall 3: Circular Policy Dependencies

Avoid policies that reference tables with their own RLS policies in complex ways - can cause infinite loops.

---

## Debugging RLS

### Check if RLS is enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### View existing policies

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Disable RLS (for testing only!)

```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

---

## Sources

- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Authorization via Row Level Security](https://supabase.com/features/row-level-security)
- [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
- [Easy Row Level Security in Supabase and Postgres](https://maxlynch.com/2023/11/04/tips-for-row-level-security-rls-in-postgres-and-supabase/)
- [Supabase RLS Explained With Real Examples](https://medium.com/@jigsz6391/supabase-row-level-security-explained-with-real-examples-6d06ce8d221c)
