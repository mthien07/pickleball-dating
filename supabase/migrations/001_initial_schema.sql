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
CREATE TABLE users (
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
CREATE INDEX idx_users_location ON users USING GIST (preferred_location);
CREATE INDEX idx_users_skill_level ON users (skill_level);
CREATE INDEX idx_users_is_active ON users (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_users_last_active ON users (last_active DESC);

-- Trigger
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: swipes
-- ================
CREATE TABLE swipes (
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
CREATE INDEX idx_swipes_swiper ON swipes (swiper_id);
CREATE INDEX idx_swipes_swiped ON swipes (swiped_id);
CREATE INDEX idx_swipes_mutual ON swipes (swiper_id, swiped_id, direction) WHERE direction = 'right';

-- ================
-- Table: matches
-- ================
CREATE TABLE matches (
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
CREATE INDEX idx_matches_user1 ON matches (user_id_1) WHERE is_active = TRUE;
CREATE INDEX idx_matches_user2 ON matches (user_id_2) WHERE is_active = TRUE;
CREATE INDEX idx_matches_matched_at ON matches (matched_at DESC);

-- ================
-- Table: conversations
-- ================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE conversations IS 'Conversation metadata for matched users';

-- Indexes
CREATE INDEX idx_conversations_match ON conversations (match_id);
CREATE INDEX idx_conversations_updated ON conversations (updated_at DESC);

-- Trigger
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: messages
-- ================
CREATE TABLE messages (
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
CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages (sender_id);
CREATE INDEX idx_messages_unread ON messages (conversation_id, status) WHERE status != 'read';

-- ================
-- Table: courts
-- ================
CREATE TABLE courts (
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
CREATE INDEX idx_courts_location ON courts USING GIST (location);
CREATE INDEX idx_courts_type ON courts (court_type) WHERE is_active = TRUE;
CREATE INDEX idx_courts_rating ON courts (rating DESC);
CREATE INDEX idx_courts_partner ON courts (is_partner) WHERE is_partner = TRUE AND is_active = TRUE;

-- Trigger
CREATE TRIGGER set_courts_updated_at
BEFORE UPDATE ON courts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: court_time_slots
-- ================
CREATE TABLE court_time_slots (
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
CREATE INDEX idx_slots_court_date ON court_time_slots (court_id, slot_date);
CREATE INDEX idx_slots_available ON court_time_slots (court_id, slot_date, is_available) WHERE is_available = TRUE;
CREATE INDEX idx_slots_locked ON court_time_slots (locked_until) WHERE locked_by IS NOT NULL;

-- ================
-- Table: bookings
-- ================
CREATE TABLE bookings (
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
CREATE INDEX idx_bookings_user ON bookings (user_id, booking_date DESC);
CREATE INDEX idx_bookings_court ON bookings (court_id, booking_date);
CREATE INDEX idx_bookings_status ON bookings (status) WHERE status = 'confirmed';

-- Trigger
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ================
-- Table: booking_slots
-- ================
CREATE TABLE booking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INTEGER NOT NULL
);

COMMENT ON TABLE booking_slots IS 'Individual time slots within a booking';

-- Index
CREATE INDEX idx_booking_slots_booking ON booking_slots (booking_id);

-- ================
-- Table: coaches
-- ================
CREATE TABLE coaches (
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
CREATE INDEX idx_coaches_location ON coaches USING GIST (location);
CREATE INDEX idx_coaches_rating ON coaches (rating DESC) WHERE is_active = TRUE;
CREATE INDEX idx_coaches_active ON coaches (is_active) WHERE is_active = TRUE;

-- ================
-- Table: reviews
-- ================
CREATE TABLE reviews (
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
CREATE INDEX idx_reviews_reviewee ON reviews (reviewee_id, created_at DESC);
CREATE INDEX idx_reviews_court ON reviews (court_id, created_at DESC);
CREATE INDEX idx_reviews_coach ON reviews (coach_id, created_at DESC);
CREATE INDEX idx_reviews_reviewer ON reviews (reviewer_id);

-- ================
-- Table: notifications
-- ================
CREATE TABLE notifications (
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
CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;

-- ================
-- Table: user_blocks
-- ================
CREATE TABLE user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_block UNIQUE (blocker_id, blocked_id),
  CONSTRAINT chk_no_self_block CHECK (blocker_id != blocked_id)
);

COMMENT ON TABLE user_blocks IS 'Blocked users';

-- Indexes
CREATE INDEX idx_blocks_blocker ON user_blocks (blocker_id);
CREATE INDEX idx_blocks_blocked ON user_blocks (blocked_id);

-- ================
-- Table: user_reports
-- ================
CREATE TABLE user_reports (
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
CREATE INDEX idx_reports_status ON user_reports (status) WHERE status = 'pending';
CREATE INDEX idx_reports_reported ON user_reports (reported_id);

-- =====================================================
-- 4. ADD FOREIGN KEY FOR conversations.match_id
-- =====================================================
-- (Must be added after matches table is created)

ALTER TABLE matches
ADD CONSTRAINT fk_matches_conversation
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL;

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
