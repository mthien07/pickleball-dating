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
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can view other active users (for discovery)
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
CREATE POLICY "Users can create own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- 3. SWIPES TABLE POLICIES
-- =====================================================

-- Users can view their own swipes
CREATE POLICY "Users can view own swipes"
ON swipes FOR SELECT
TO authenticated
USING (auth.uid() = swiper_id);

-- Users can only create their own swipes
CREATE POLICY "Users can create swipes"
ON swipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = swiper_id);

-- =====================================================
-- 4. MATCHES TABLE POLICIES
-- =====================================================

-- Users can see matches they're part of
CREATE POLICY "Users can view own matches"
ON matches FOR SELECT
TO authenticated
USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Users can unmatch (update is_active)
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
CREATE POLICY "Slots are publicly readable"
ON court_time_slots FOR SELECT
TO authenticated
USING (TRUE);

-- Users can lock slots (update locked_by)
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
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create bookings"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g., cancel)
CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 10. BOOKING_SLOTS TABLE POLICIES
-- =====================================================

-- Users can view slots for their bookings
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
CREATE POLICY "Coaches are publicly readable"
ON coaches FOR SELECT
TO authenticated, anon
USING (is_active = TRUE);

-- =====================================================
-- 12. REVIEWS TABLE POLICIES
-- =====================================================

-- Anyone can read reviews
CREATE POLICY "Reviews are publicly readable"
ON reviews FOR SELECT
TO authenticated
USING (TRUE);

-- Users can create reviews
CREATE POLICY "Users can write reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id);

-- =====================================================
-- 13. NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
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
CREATE POLICY "Users can view own blocks"
ON user_blocks FOR SELECT
TO authenticated
USING (auth.uid() = blocker_id);

-- Users can block other users
CREATE POLICY "Users can create blocks"
ON user_blocks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock (delete block)
CREATE POLICY "Users can delete blocks"
ON user_blocks FOR DELETE
TO authenticated
USING (auth.uid() = blocker_id);

-- =====================================================
-- 15. USER_REPORTS TABLE POLICIES
-- =====================================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
ON user_reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Users can create reports
CREATE POLICY "Users can create reports"
ON user_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- =====================================================
-- END OF MIGRATION 002
-- =====================================================
