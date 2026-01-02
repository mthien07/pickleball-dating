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
