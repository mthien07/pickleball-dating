-- PickleBall Dating App - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2026-01-02
-- Description: Create all tables with constraints, indexes, and triggers

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "postgis";        -- Geo-spatial queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Full-text search
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Encryption

-- =====================================================
-- 2. HELPER FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- ================
-- Table: users
-- ================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  bio TEXT,
  avatar_urls TEXT[] NOT NULL DEFAULT '{}',
  skill_level VARCHAR(20) NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'pro')),
  play_style VARCHAR(20) NOT NULL CHECK (play_style IN ('competitive', 'casual', 'social')),
  looking_for TEXT[] NOT NULL DEFAULT '{}',
  availability JSONB,
  preferred_location GEOGRAPHY(POINT, 4326),
  preferred_address VARCHAR(255),
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  matches_count INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(2,1) NOT NULL DEFAULT 0.0 CHECK (average_rating >= 0 AND average_rating <= 5),
  is_online BOOLEAN NOT NULL DEFAULT FALSE,
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE users IS 'User profiles for players';
COMMENT ON COLUMN users.id IS 'User ID (same as auth.users.id)';
COMMENT ON COLUMN users.avatar_urls IS 'Array of image URLs (max 6)';
COMMENT ON COLUMN users.looking_for IS 'Array of: opponent, doubles_partner, dating';
COMMENT ON COLUMN users.availability IS 'Schedule: {"monday": ["morning", "evening"]}';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST (preferred_location);
CREATE INDEX IF NOT EXISTS idx_users_skill_level ON users (skill_level);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users (last_active DESC);

-- Trigger
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: swipes
-- ================
CREATE TABLE IF NOT EXISTS swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  swiped_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('right', 'left')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_no_self_swipe CHECK (swiper_id != swiped_id),
  CONSTRAINT uq_swipe_pair UNIQUE (swiper_id, swiped_id)
);

COMMENT ON TABLE swipes IS 'Swipe actions between users';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes (swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes (swiped_id);
CREATE INDEX IF NOT EXISTS idx_swipes_mutual ON swipes (swiper_id, swiped_id, direction) WHERE direction = 'right';

-- ================
-- Table: matches
-- ================
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversation_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  CONSTRAINT chk_user_order CHECK (user_id_1 < user_id_2),
  CONSTRAINT uq_match_pair UNIQUE (user_id_1, user_id_2)
);

COMMENT ON TABLE matches IS 'Mutual matches between users';
COMMENT ON COLUMN matches.user_id_1 IS 'First user (lower UUID)';
COMMENT ON COLUMN matches.user_id_2 IS 'Second user (higher UUID)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches (user_id_1) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches (user_id_2) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_matched_at ON matches (matched_at DESC);

-- ================
-- Table: conversations
-- ================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE conversations IS 'Conversation metadata for matched users';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_match ON conversations (match_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations (updated_at DESC);

-- Trigger
DROP TRIGGER IF EXISTS set_conversations_updated_at ON conversations;
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: messages
-- ================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('text', 'image')) DEFAULT 'text',
  image_url VARCHAR(500),
  status VARCHAR(15) NOT NULL CHECK (status IN ('sending', 'sent', 'delivered', 'read')) DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,

  CONSTRAINT chk_content_or_image CHECK (
    (message_type = 'text' AND content IS NOT NULL) OR
    (message_type = 'image' AND image_url IS NOT NULL)
  )
);

COMMENT ON TABLE messages IS 'Chat messages between matched users';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages (conversation_id, status) WHERE status != 'read';

-- ================
-- Table: courts
-- ================
CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  price_per_hour INTEGER NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  court_type VARCHAR(10) NOT NULL CHECK (court_type IN ('indoor', 'outdoor')),
  operating_hours JSONB NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  is_partner BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  CONSTRAINT chk_price_range CHECK (price_min IS NULL OR price_max IS NULL OR price_min <= price_max)
);

COMMENT ON TABLE courts IS 'Pickleball court information (admin-managed)';
COMMENT ON COLUMN courts.operating_hours IS '{"monday": {"open": "06:00", "close": "22:00"}}';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courts_location ON courts USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_courts_type ON courts (court_type) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_courts_rating ON courts (rating DESC);
CREATE INDEX IF NOT EXISTS idx_courts_partner ON courts (is_partner) WHERE is_partner = TRUE AND is_active = TRUE;

-- Trigger
DROP TRIGGER IF EXISTS set_courts_updated_at ON courts;
CREATE TRIGGER set_courts_updated_at
BEFORE UPDATE ON courts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: court_time_slots
-- ================
CREATE TABLE IF NOT EXISTS court_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  locked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  locked_until TIMESTAMPTZ,

  CONSTRAINT uq_court_slot UNIQUE (court_id, slot_date, start_time)
);

COMMENT ON TABLE court_time_slots IS 'Court availability and slot locking';
COMMENT ON COLUMN court_time_slots.locked_by IS 'User locking slot during payment';
COMMENT ON COLUMN court_time_slots.locked_until IS 'Lock expiry (10 min)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_slots_court_date ON court_time_slots (court_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_slots_available ON court_time_slots (court_id, slot_date, is_available) WHERE is_available = TRUE;
CREATE INDEX IF NOT EXISTS idx_slots_locked ON court_time_slots (locked_until) WHERE locked_by IS NOT NULL;

-- ================
-- Table: bookings
-- ================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  court_id UUID REFERENCES courts(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(15) NOT NULL CHECK (status IN ('confirmed', 'completed', 'cancelled')) DEFAULT 'confirmed',
  payment_method VARCHAR(20) NOT NULL,
  payment_reference VARCHAR(100),
  qr_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_booking_time CHECK (start_time < end_time)
);

COMMENT ON TABLE bookings IS 'Court booking records';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id, booking_date DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_court ON bookings (court_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status) WHERE status = 'confirmed';

-- Trigger
DROP TRIGGER IF EXISTS set_bookings_updated_at ON bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: booking_slots
-- ================
CREATE TABLE IF NOT EXISTS booking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INTEGER NOT NULL
);

COMMENT ON TABLE booking_slots IS 'Individual time slots within a booking';

-- Index
CREATE INDEX IF NOT EXISTS idx_booking_slots_booking ON booking_slots (booking_id);

-- ================
-- Table: coaches
-- ================
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  display_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500) NOT NULL,
  bio TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  certifications TEXT[] NOT NULL DEFAULT '{}',
  skill_level VARCHAR(20) NOT NULL CHECK (skill_level IN ('advanced', 'pro')),
  hourly_rate INTEGER NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  location GEOGRAPHY(POINT, 4326),
  address VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  gallery_urls TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE coaches IS 'Coach profiles (admin-managed)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coaches_location ON coaches USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_coaches_rating ON coaches (rating DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_coaches_active ON coaches (is_active) WHERE is_active = TRUE;

-- ================
-- Table: reviews
-- ================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  skill_accuracy INTEGER CHECK (skill_accuracy IS NULL OR (skill_accuracy >= 1 AND skill_accuracy <= 5)),
  attitude INTEGER CHECK (attitude IS NULL OR (attitude >= 1 AND attitude <= 5)),
  punctuality INTEGER CHECK (punctuality IS NULL OR (punctuality >= 1 AND punctuality <= 5)),
  court_quality INTEGER CHECK (court_quality IS NULL OR (court_quality >= 1 AND court_quality <= 5)),
  service INTEGER CHECK (service IS NULL OR (service >= 1 AND service <= 5)),
  cleanliness INTEGER CHECK (cleanliness IS NULL OR (cleanliness >= 1 AND cleanliness <= 5)),
  comment TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_review_target CHECK (
    (reviewee_id IS NOT NULL AND court_id IS NULL AND coach_id IS NULL) OR
    (reviewee_id IS NULL AND court_id IS NOT NULL AND coach_id IS NULL) OR
    (reviewee_id IS NULL AND court_id IS NULL AND coach_id IS NOT NULL)
  ),
  CONSTRAINT chk_no_self_review CHECK (reviewer_id != reviewee_id)
);

COMMENT ON TABLE reviews IS 'Reviews for users, courts, and coaches';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews (reviewee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_court ON reviews (court_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_coach ON reviews (coach_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews (reviewer_id);

-- ================
-- Table: notifications
-- ================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN (
    'new_match', 'new_message', 'booking_confirmed',
    'booking_reminder', 'booking_cancelled', 'promotion'
  )),
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Push notification history';
COMMENT ON COLUMN notifications.data IS 'Additional data (deep link, etc.)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;

-- ================
-- Table: user_blocks
-- ================
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_block UNIQUE (blocker_id, blocked_id),
  CONSTRAINT chk_no_self_block CHECK (blocker_id != blocked_id)
);

COMMENT ON TABLE user_blocks IS 'Blocked users';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON user_blocks (blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON user_blocks (blocked_id);

-- ================
-- Table: user_reports
-- ================
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(30) NOT NULL CHECK (reason IN ('spam', 'fake', 'harassment', 'inappropriate', 'other')),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_no_self_report CHECK (reporter_id != reported_id)
);

COMMENT ON TABLE user_reports IS 'User reports for moderation';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_status ON user_reports (status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_reports_reported ON user_reports (reported_id);

-- =====================================================
-- 4. ADD FOREIGN KEY FOR conversations.match_id
-- =====================================================
-- (Must be added after matches table is created)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_matches_conversation'
  ) THEN
    ALTER TABLE matches
    ADD CONSTRAINT fk_matches_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant select/insert/update/delete on tables (RLS will control access)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;

-- =====================================================
-- END OF MIGRATION 001
-- =====================================================


-- ============================================
-- Migration 002: RLS Policies
-- ============================================


-- PickleBall Dating App - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Created: 2026-01-02
-- Description: Enable RLS and create security policies for all tables

-- =====================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile fully
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can view other active users (for discovery)
DROP POLICY IF EXISTS "Users can view other active users" ON users;
CREATE POLICY "Users can view other active users"
ON users FOR SELECT
TO authenticated
USING (
  is_active = TRUE
  AND profile_complete = TRUE
  AND id NOT IN (SELECT blocked_id FROM user_blocks WHERE blocker_id = auth.uid())
  AND id NOT IN (SELECT blocker_id FROM user_blocks WHERE blocked_id = auth.uid())
);

-- Users can insert their own profile (during signup)
DROP POLICY IF EXISTS "Users can create own profile" ON users;
CREATE POLICY "Users can create own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. SWIPES TABLE POLICIES
-- =====================================================

-- Users can view their own swipes
DROP POLICY IF EXISTS "Users can view own swipes" ON swipes;
CREATE POLICY "Users can view own swipes"
ON swipes FOR SELECT
TO authenticated
USING (auth.uid() = swiper_id);

-- Users can only create their own swipes
DROP POLICY IF EXISTS "Users can create swipes" ON swipes;
CREATE POLICY "Users can create swipes"
ON swipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = swiper_id);

-- =====================================================
-- 4. MATCHES TABLE POLICIES
-- =====================================================

-- Users can see matches they're part of
DROP POLICY IF EXISTS "Users can view own matches" ON matches;
CREATE POLICY "Users can view own matches"
ON matches FOR SELECT
TO authenticated
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Users can unmatch (update is_active)
DROP POLICY IF EXISTS "Users can unmatch" ON matches;
CREATE POLICY "Users can unmatch"
ON matches FOR UPDATE
TO authenticated
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2)
WITH CHECK (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Only system can create matches (via trigger)
-- No INSERT policy = users cannot manually insert

-- =====================================================
-- 5. CONVERSATIONS TABLE POLICIES
-- =====================================================

-- Users can view conversations they're part of
DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
CREATE POLICY "Users can view own conversations"
ON conversations FOR SELECT
TO authenticated
USING (
  match_id IN (
    SELECT id FROM matches
    WHERE user_id_1 = auth.uid() OR user_id_2 = auth.uid()
  )
);

-- Only system can create conversations (via trigger)
-- No INSERT policy

-- =====================================================
-- 6. MESSAGES TABLE POLICIES
-- =====================================================

-- Users can read messages in their conversations
DROP POLICY IF EXISTS "Users can read conversation messages" ON messages;
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

-- Users can send messages to their conversations
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
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

-- Users can update their own messages (e.g., mark as read)
DROP POLICY IF EXISTS "Users can update message status" ON messages;
CREATE POLICY "Users can update message status"
ON messages FOR UPDATE
TO authenticated
USING (
  conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

-- =====================================================
-- 7. COURTS TABLE POLICIES (Public Read)
-- =====================================================

-- Anyone (authenticated) can view active courts
DROP POLICY IF EXISTS "Courts are publicly readable" ON courts;
CREATE POLICY "Courts are publicly readable"
ON courts FOR SELECT
TO authenticated, anon
USING (is_active = TRUE);

-- Only admins can modify courts (no policy = no access)
-- Admin uses service_role key which bypasses RLS

-- =====================================================
-- 8. COURT_TIME_SLOTS TABLE POLICIES
-- =====================================================

-- Anyone can view available slots
DROP POLICY IF EXISTS "Slots are publicly readable" ON court_time_slots;
CREATE POLICY "Slots are publicly readable"
ON court_time_slots FOR SELECT
TO authenticated
USING (TRUE);

-- Users can lock slots (update locked_by)
DROP POLICY IF EXISTS "Users can lock slots" ON court_time_slots;
CREATE POLICY "Users can lock slots"
ON court_time_slots FOR UPDATE
TO authenticated
USING (
  is_available = TRUE
  AND (locked_by IS NULL OR locked_until < NOW())
)
WITH CHECK (auth.uid() = locked_by);

-- =====================================================
-- 9. BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can see their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own bookings
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g., cancel)
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 10. BOOKING_SLOTS TABLE POLICIES
-- =====================================================

-- Users can view slots for their bookings
DROP POLICY IF EXISTS "Users can view booking slots" ON booking_slots;
CREATE POLICY "Users can view booking slots"
ON booking_slots FOR SELECT
TO authenticated
USING (
  booking_id IN (
    SELECT id FROM bookings WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- 11. COACHES TABLE POLICIES (Public Read)
-- =====================================================

-- Anyone can view active coaches
DROP POLICY IF EXISTS "Coaches are publicly readable" ON coaches;
CREATE POLICY "Coaches are publicly readable"
ON coaches FOR SELECT
TO authenticated, anon
USING (is_active = TRUE);

-- =====================================================
-- 12. REVIEWS TABLE POLICIES
-- =====================================================

-- Anyone can read reviews
DROP POLICY IF EXISTS "Reviews are publicly readable" ON reviews;
CREATE POLICY "Reviews are publicly readable"
ON reviews FOR SELECT
TO authenticated
USING (TRUE);

-- Users can create reviews
DROP POLICY IF EXISTS "Users can write reviews" ON reviews;
CREATE POLICY "Users can write reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id);

-- =====================================================
-- 13. NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can only see their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
CREATE POLICY "Users can delete own notifications"
ON notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- System can insert notifications (via trigger or server-side)
-- No INSERT policy = users cannot manually create

-- =====================================================
-- 14. USER_BLOCKS TABLE POLICIES
-- =====================================================

-- Users can view who they blocked
DROP POLICY IF EXISTS "Users can view own blocks" ON user_blocks;
CREATE POLICY "Users can view own blocks"
ON user_blocks FOR SELECT
TO authenticated
USING (auth.uid() = blocker_id);

-- Users can block other users
DROP POLICY IF EXISTS "Users can create blocks" ON user_blocks;
CREATE POLICY "Users can create blocks"
ON user_blocks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock (delete block)
DROP POLICY IF EXISTS "Users can delete blocks" ON user_blocks;
CREATE POLICY "Users can delete blocks"
ON user_blocks FOR DELETE
TO authenticated
USING (auth.uid() = blocker_id);

-- =====================================================
-- 15. USER_REPORTS TABLE POLICIES
-- =====================================================

-- Users can view their own reports
DROP POLICY IF EXISTS "Users can view own reports" ON user_reports;
CREATE POLICY "Users can view own reports"
ON user_reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Users can create reports
DROP POLICY IF EXISTS "Users can create reports" ON user_reports;
CREATE POLICY "Users can create reports"
ON user_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- =====================================================
-- END OF MIGRATION 002
-- =====================================================


-- ============================================
-- Migration 003: Functions
-- ============================================


-- PickleBall Dating App - Database Functions & Triggers
-- Migration: 003_functions.sql
-- Created: 2026-01-02
-- Description: Create RPC functions and triggers for business logic

-- =====================================================
-- 1. MATCH CREATION TRIGGER
-- =====================================================

-- Function to create match when both users swipe right
CREATE OR REPLACE FUNCTION create_match_on_mutual_swipe()
RETURNS TRIGGER AS $$
DECLARE
  mutual_swipe_exists BOOLEAN;
  new_match_id UUID;
  new_conversation_id UUID;
  user1 UUID;
  user2 UUID;
BEGIN
  -- Only process right swipes
  IF NEW.direction != 'right' THEN
    RETURN NEW;
  END IF;

  -- Check for mutual swipe
  SELECT EXISTS (
    SELECT 1 FROM swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND direction = 'right'
  ) INTO mutual_swipe_exists;

  IF mutual_swipe_exists THEN
    -- Order user IDs consistently (lower UUID first)
    IF NEW.swiper_id < NEW.swiped_id THEN
      user1 := NEW.swiper_id;
      user2 := NEW.swiped_id;
    ELSE
      user1 := NEW.swiped_id;
      user2 := NEW.swiper_id;
    END IF;

    -- Check if match already exists
    IF NOT EXISTS (
      SELECT 1 FROM matches
      WHERE user_id_1 = user1 AND user_id_2 = user2
    ) THEN
      -- Create conversation first
      INSERT INTO conversations DEFAULT VALUES
      RETURNING id INTO new_conversation_id;

      -- Create match
      INSERT INTO matches (user_id_1, user_id_2, conversation_id)
      VALUES (user1, user2, new_conversation_id)
      RETURNING id INTO new_match_id;

      -- Increment matches_count for both users
      UPDATE users SET matches_count = matches_count + 1 WHERE id IN (user1, user2);

      -- Create notifications for both users
      INSERT INTO notifications (user_id, notification_type, title, body, data)
      VALUES
        (user1, 'new_match', 'New Match!', 'You have a new match!', jsonb_build_object('match_id', new_match_id)),
        (user2, 'new_match', 'New Match!', 'You have a new match!', jsonb_build_object('match_id', new_match_id));
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_match_on_swipe ON swipes;
CREATE TRIGGER trigger_create_match_on_swipe
AFTER INSERT ON swipes
FOR EACH ROW
EXECUTE FUNCTION create_match_on_mutual_swipe();

-- =====================================================
-- 2. UPDATE RATING TRIGGER
-- =====================================================

-- Function to update average rating when review is created
CREATE OR REPLACE FUNCTION update_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user rating
  IF NEW.reviewee_id IS NOT NULL THEN
    UPDATE users SET average_rating = (
      SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewee_id = NEW.reviewee_id
    ) WHERE id = NEW.reviewee_id;
  END IF;

  -- Update court rating and review_count
  IF NEW.court_id IS NOT NULL THEN
    UPDATE courts SET
      rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE court_id = NEW.court_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE court_id = NEW.court_id)
    WHERE id = NEW.court_id;
  END IF;

  -- Update coach rating and review_count
  IF NEW.coach_id IS NOT NULL THEN
    UPDATE coaches SET
      rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE coach_id = NEW.coach_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE coach_id = NEW.coach_id)
    WHERE id = NEW.coach_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_rating_on_review ON reviews;
CREATE TRIGGER trigger_update_rating_on_review
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_average_rating();

-- =====================================================
-- 3. UPDATE CONVERSATION TIMESTAMP
-- =====================================================

-- Function to update conversation updated_at when new message
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON messages;
CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-- =====================================================
-- 4. CLEANUP EXPIRED SLOT LOCKS
-- =====================================================

-- Function to cleanup expired locks (run via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_locks()
RETURNS void AS $$
BEGIN
  UPDATE court_time_slots
  SET locked_by = NULL, locked_until = NULL
  WHERE locked_until < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_locks IS 'Cleanup expired slot locks (run every minute via cron)';

-- Note: Setup cron via Supabase pg_cron extension:
-- SELECT cron.schedule('cleanup-locks', '* * * * *', 'SELECT cleanup_expired_locks()');

-- =====================================================
-- 5. GET SWIPE PROFILES RPC
-- =====================================================

-- Function to get profiles for swiping (with smart filtering)
CREATE OR REPLACE FUNCTION get_swipe_profiles(
  limit_count INT DEFAULT 20,
  max_distance_km FLOAT DEFAULT 50,
  skill_filter TEXT DEFAULT NULL,
  cursor_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  display_name VARCHAR,
  date_of_birth DATE,
  gender VARCHAR,
  avatar_urls TEXT[],
  bio TEXT,
  skill_level VARCHAR,
  play_style VARCHAR,
  looking_for TEXT[],
  availability JSONB,
  preferred_address VARCHAR,
  average_rating DECIMAL,
  distance_km FLOAT,
  is_online BOOLEAN,
  common_availability_slots INT
) AS $$
DECLARE
  current_user_location GEOGRAPHY;
BEGIN
  -- Get current user's location
  SELECT preferred_location INTO current_user_location
  FROM users WHERE users.id = auth.uid();

  RETURN QUERY
  SELECT
    u.id,
    u.display_name,
    u.date_of_birth,
    u.gender,
    u.avatar_urls,
    u.bio,
    u.skill_level,
    u.play_style,
    u.looking_for,
    u.availability,
    u.preferred_address,
    u.average_rating,
    CASE
      WHEN current_user_location IS NOT NULL AND u.preferred_location IS NOT NULL THEN
        ST_Distance(current_user_location, u.preferred_location) / 1000
      ELSE NULL
    END as distance_km,
    u.is_online,
    0 as common_availability_slots  -- TODO: Calculate common slots if needed
  FROM users u
  WHERE
    -- Not current user
    u.id != auth.uid()
    -- Active and profile complete
    AND u.is_active = TRUE
    AND u.profile_complete = TRUE
    -- Not already swiped
    AND u.id NOT IN (
      SELECT swiped_id FROM swipes WHERE swiper_id = auth.uid()
    )
    -- Not blocked
    AND u.id NOT IN (
      SELECT blocked_id FROM user_blocks WHERE blocker_id = auth.uid()
    )
    AND u.id NOT IN (
      SELECT blocker_id FROM user_blocks WHERE blocked_id = auth.uid()
    )
    -- Distance filter
    AND (
      current_user_location IS NULL
      OR u.preferred_location IS NULL
      OR ST_DWithin(current_user_location, u.preferred_location, max_distance_km * 1000)
    )
    -- Skill level filter (optional)
    AND (skill_filter IS NULL OR u.skill_level = skill_filter)
    -- Cursor pagination
    AND (cursor_id IS NULL OR u.id > cursor_id)
  ORDER BY
    -- Prioritize online users
    u.is_online DESC,
    -- Prioritize closer distance
    ST_Distance(current_user_location, u.preferred_location) ASC NULLS LAST,
    -- Prioritize higher rating
    u.average_rating DESC,
    u.id ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_swipe_profiles IS 'Get profiles for swiping with smart filtering and sorting';

-- =====================================================
-- 6. GET MY MATCHES RPC
-- =====================================================

-- Function to get user's matches with last message
CREATE OR REPLACE FUNCTION get_my_matches(
  limit_count INT DEFAULT 50,
  cursor_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  matched_at TIMESTAMPTZ,
  conversation_id UUID,
  is_active BOOLEAN,
  matched_user_id UUID,
  matched_user_display_name VARCHAR,
  matched_user_avatar_urls TEXT[],
  matched_user_is_online BOOLEAN,
  matched_user_last_active TIMESTAMPTZ,
  last_message_content TEXT,
  last_message_sent_at TIMESTAMPTZ,
  last_message_sender_id UUID,
  last_message_type VARCHAR,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.matched_at,
    m.conversation_id,
    m.is_active,
    CASE
      WHEN m.user_id_1 = auth.uid() THEN m.user_id_2
      ELSE m.user_id_1
    END as matched_user_id,
    u.display_name as matched_user_display_name,
    u.avatar_urls as matched_user_avatar_urls,
    u.is_online as matched_user_is_online,
    u.last_active as matched_user_last_active,
    msg.content as last_message_content,
    msg.created_at as last_message_sent_at,
    msg.sender_id as last_message_sender_id,
    msg.message_type as last_message_type,
    (
      SELECT COUNT(*)
      FROM messages msg2
      WHERE msg2.conversation_id = m.conversation_id
      AND msg2.sender_id != auth.uid()
      AND msg2.status != 'read'
    ) as unread_count
  FROM matches m
  JOIN users u ON (
    CASE
      WHEN m.user_id_1 = auth.uid() THEN m.user_id_2
      ELSE m.user_id_1
    END = u.id
  )
  LEFT JOIN LATERAL (
    SELECT * FROM messages
    WHERE conversation_id = m.conversation_id
    ORDER BY created_at DESC
    LIMIT 1
  ) msg ON TRUE
  WHERE
    (m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid())
    AND m.is_active = TRUE
    AND (cursor_id IS NULL OR m.id > cursor_id)
  ORDER BY
    msg.created_at DESC NULLS LAST,
    m.matched_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_my_matches IS 'Get user matches with last message and unread count';

-- =====================================================
-- 7. SEARCH COURTS RPC
-- =====================================================

-- Function to search courts with geo-spatial filter
CREATE OR REPLACE FUNCTION search_courts(
  user_lat FLOAT,
  user_lng FLOAT,
  max_distance_km FLOAT DEFAULT 25,
  court_type_filter TEXT DEFAULT NULL,
  min_rating_filter FLOAT DEFAULT NULL,
  max_price_filter INT DEFAULT NULL,
  is_partner_only BOOLEAN DEFAULT FALSE,
  search_query TEXT DEFAULT NULL,
  limit_count INT DEFAULT 20,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  address VARCHAR,
  images TEXT[],
  price_per_hour INT,
  price_min INT,
  price_max INT,
  court_type VARCHAR,
  rating DECIMAL,
  review_count INT,
  is_partner BOOLEAN,
  distance_km FLOAT
) AS $$
DECLARE
  user_location GEOGRAPHY;
BEGIN
  -- Create user location point
  user_location := ST_SetSRID(ST_Point(user_lng, user_lat), 4326)::geography;

  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.address,
    c.images,
    c.price_per_hour,
    c.price_min,
    c.price_max,
    c.court_type,
    c.rating,
    c.review_count,
    c.is_partner,
    ST_Distance(user_location, c.location) / 1000 as distance_km
  FROM courts c
  WHERE
    c.is_active = TRUE
    -- Distance filter
    AND ST_DWithin(user_location, c.location, max_distance_km * 1000)
    -- Court type filter
    AND (court_type_filter IS NULL OR c.court_type = court_type_filter)
    -- Rating filter
    AND (min_rating_filter IS NULL OR c.rating >= min_rating_filter)
    -- Price filter
    AND (max_price_filter IS NULL OR c.price_per_hour <= max_price_filter)
    -- Partner filter
    AND (NOT is_partner_only OR c.is_partner = TRUE)
    -- Search query (name or address)
    AND (
      search_query IS NULL
      OR c.name ILIKE '%' || search_query || '%'
      OR c.address ILIKE '%' || search_query || '%'
    )
  ORDER BY
    -- Prioritize partner courts
    c.is_partner DESC,
    -- Then by distance
    distance_km ASC,
    -- Then by rating
    c.rating DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION search_courts IS 'Search courts with geo-spatial and filter support';

-- =====================================================
-- 8. MARK MESSAGES AS READ RPC
-- =====================================================

CREATE OR REPLACE FUNCTION mark_messages_read(conversation_id_param UUID)
RETURNS INT AS $$
DECLARE
  marked_count INT;
BEGIN
  -- Update all unread messages in conversation to 'read'
  UPDATE messages
  SET status = 'read', read_at = NOW()
  WHERE conversation_id = conversation_id_param
  AND sender_id != auth.uid()
  AND status != 'read';

  GET DIAGNOSTICS marked_count = ROW_COUNT;

  RETURN marked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_messages_read IS 'Mark all messages in conversation as read';

-- =====================================================
-- END OF MIGRATION 003
-- =====================================================


-- ============================================
-- Migration 004: Seed Data
-- ============================================


-- PickleBall Dating App - Seed Data
-- Migration: 004_seed_data.sql
-- Created: 2026-01-02
-- Description: Insert sample data for development

-- =====================================================
-- 1. INSERT SAMPLE COURTS
-- =====================================================

INSERT INTO courts (
  name, address, location, images, description, amenities,
  price_per_hour, price_min, price_max, court_type, operating_hours,
  rating, review_count, is_partner, is_active
) VALUES
(
  'Premium Pickleball Center',
  '123 Nguyen Hue St, District 1, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7011, 10.7763), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1606045345900-4379d95b5d9b?w=800',
    'https://images.unsplash.com/photo-1587280506354-e3e0db1c1b21?w=800'
  ],
  'Modern indoor facility with 6 professional courts, air conditioning, and premium equipment.',
  ARRAY['Parking', 'Locker', 'Canteen', 'Equipment Rental', 'Showers', 'Wi-Fi', 'Air Conditioning'],
  200000,
  150000,
  300000,
  'indoor',
  '{
    "monday": {"open": "06:00", "close": "22:00"},
    "tuesday": {"open": "06:00", "close": "22:00"},
    "wednesday": {"open": "06:00", "close": "22:00"},
    "thursday": {"open": "06:00", "close": "22:00"},
    "friday": {"open": "06:00", "close": "23:00"},
    "saturday": {"open": "06:00", "close": "23:00"},
    "sunday": {"open": "07:00", "close": "22:00"}
  }'::jsonb,
  4.8,
  156,
  TRUE,
  TRUE
),
(
  'District 2 Sports Complex',
  '456 Thao Dien St, District 2, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7411, 10.8013), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'
  ],
  'Outdoor courts with beautiful garden views. Great for casual play.',
  ARRAY['Parking', 'Equipment Rental', 'Canteen', 'Wi-Fi'],
  120000,
  100000,
  150000,
  'outdoor',
  '{
    "monday": {"open": "06:00", "close": "21:00"},
    "tuesday": {"open": "06:00", "close": "21:00"},
    "wednesday": {"open": "06:00", "close": "21:00"},
    "thursday": {"open": "06:00", "close": "21:00"},
    "friday": {"open": "06:00", "close": "21:00"},
    "saturday": {"open": "06:00", "close": "22:00"},
    "sunday": {"open": "06:00", "close": "22:00"}
  }'::jsonb,
  4.5,
  89,
  TRUE,
  TRUE
),
(
  'Binh Thanh Pickleball Club',
  '789 Xo Viet Nghe Tinh St, Binh Thanh, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.7104, 10.8079), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
  ],
  'Community-focused club with friendly atmosphere. Perfect for beginners.',
  ARRAY['Parking', 'Locker', 'Equipment Rental', 'Showers'],
  100000,
  80000,
  120000,
  'indoor',
  '{
    "monday": {"open": "07:00", "close": "21:00"},
    "tuesday": {"open": "07:00", "close": "21:00"},
    "wednesday": {"open": "07:00", "close": "21:00"},
    "thursday": {"open": "07:00", "close": "21:00"},
    "friday": {"open": "07:00", "close": "22:00"},
    "saturday": {"open": "08:00", "close": "22:00"},
    "sunday": {"open": "08:00", "close": "21:00"}
  }'::jsonb,
  4.3,
  67,
  FALSE,
  TRUE
),
(
  'Tan Binh Arena',
  '321 Cong Hoa St, Tan Binh, Ho Chi Minh City',
  ST_SetSRID(ST_Point(106.6421, 10.8014), 4326)::geography,
  ARRAY[
    'https://images.unsplash.com/photo-1606045345900-4379d95b5d9b?w=800'
  ],
  'Large facility with 8 courts. Hosts regular tournaments.',
  ARRAY['Parking', 'Locker', 'Canteen', 'Equipment Rental', 'Showers', 'Pro Shop'],
  180000,
  150000,
  250000,
  'indoor',
  '{
    "monday": {"open": "06:00", "close": "22:00"},
    "tuesday": {"open": "06:00", "close": "22:00"},
    "wednesday": {"open": "06:00", "close": "22:00"},
    "thursday": {"open": "06:00", "close": "22:00"},
    "friday": {"open": "06:00", "close": "23:00"},
    "saturday": {"open": "06:00", "close": "23:00"},
    "sunday": {"open": "07:00", "close": "22:00"}
  }'::jsonb,
  4.7,
  203,
  TRUE,
  TRUE
);

-- =====================================================
-- 2. INSERT SAMPLE COACHES
-- =====================================================

INSERT INTO coaches (
  display_name, avatar_url, bio, experience_years, certifications,
  skill_level, hourly_rate, rating, review_count,
  location, address, phone, email, gallery_urls, is_active
) VALUES
(
  'Coach Alex Tran',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
  'Professional pickleball coach with 10+ years of experience. Former national team player. Specializing in advanced techniques and competitive play.',
  10,
  ARRAY['IPTPA Certified', 'PPR Certified Pro', 'National Team Coach'],
  'pro',
  500000,
  4.9,
  34,
  ST_SetSRID(ST_Point(106.7011, 10.7763), 4326)::geography,
  'District 1, Ho Chi Minh City',
  '+84 901 234 567',
  'alex.tran@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800',
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800'
  ],
  TRUE
),
(
  'Coach Sarah Nguyen',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  'Friendly and patient coach perfect for beginners. Focus on fundamentals and building confidence.',
  5,
  ARRAY['IPTPA Level 2', 'Beginner Specialist'],
  'advanced',
  350000,
  4.7,
  28,
  ST_SetSRID(ST_Point(106.7411, 10.8013), 4326)::geography,
  'District 2, Ho Chi Minh City',
  '+84 902 345 678',
  'sarah.nguyen@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800'
  ],
  TRUE
),
(
  'Coach David Le',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400',
  'Tournament player and strategic coach. Expert in doubles strategy and match tactics.',
  8,
  ARRAY['USAPA Certified', 'Tournament Director'],
  'pro',
  450000,
  4.8,
  41,
  ST_SetSRID(ST_Point(106.7104, 10.8079), 4326)::geography,
  'Binh Thanh, Ho Chi Minh City',
  '+84 903 456 789',
  'david.le@email.com',
  ARRAY[
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800',
    'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800'
  ],
  TRUE
);

-- =====================================================
-- 3. HELPFUL QUERIES FOR VERIFICATION
-- =====================================================

-- Count tables
-- SELECT COUNT(*) as court_count FROM courts WHERE is_active = TRUE;
-- SELECT COUNT(*) as coach_count FROM coaches WHERE is_active = TRUE;

-- View sample data
-- SELECT id, name, court_type, price_per_hour, rating, is_partner FROM courts;
-- SELECT id, display_name, skill_level, hourly_rate, rating FROM coaches;

-- =====================================================
-- END OF MIGRATION 004
-- =====================================================
