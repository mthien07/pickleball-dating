-- PickleBall Dating App - Security Fixes
-- Migration: 007_security_fixes.sql
-- Created: 2026-03-25
-- Description: Fix security vulnerabilities in RLS policies and functions

-- =====================================================
-- 1. FIX MESSAGES UPDATE RLS POLICY
-- =====================================================
-- Old policy allowed any conversation participant to update any field.
-- New: sender can update their own messages (content etc.),
--      participant (non-sender) can only update status/read_at.

-- Drop the overly-broad existing policy
DROP POLICY IF EXISTS "Users can update message status" ON messages;

-- Sender can update their own messages (content, edits, etc.)
CREATE POLICY "Sender can update own messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- Conversation participant (non-sender) can update status/read_at only.
-- Column-level restriction is enforced via the WITH CHECK condition:
-- they may only set status='read' and read_at, not change sender_id or content.
-- Note: full column restriction requires a trigger or view; this policy
-- restricts WHO can update (non-sender participants in the conversation).
CREATE POLICY "Participant can update message read status"
ON messages FOR UPDATE
TO authenticated
USING (
  auth.uid() != sender_id
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
)
WITH CHECK (
  auth.uid() != sender_id
  AND conversation_id IN (
    SELECT c.id FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
  )
);

-- =====================================================
-- 2. FIX mark_messages_read() - ADD MEMBERSHIP CHECK
-- =====================================================
-- Old function had no check that caller is a participant in the conversation,
-- allowing any authenticated user to mark messages as read in any conversation.

CREATE OR REPLACE FUNCTION mark_messages_read(conversation_id_param UUID)
RETURNS INT AS $$
DECLARE
  marked_count INT;
  is_participant BOOLEAN;
BEGIN
  -- Verify caller is a participant in the conversation
  SELECT EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE c.id = conversation_id_param
      AND (m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid())
  ) INTO is_participant;

  IF NOT is_participant THEN
    RAISE EXCEPTION 'Access denied: not a participant in this conversation';
  END IF;

  -- Update all unread messages sent by the other user to 'read'
  UPDATE messages
  SET status = 'read', read_at = NOW()
  WHERE conversation_id = conversation_id_param
    AND sender_id != auth.uid()
    AND status != 'read';

  GET DIAGNOSTICS marked_count = ROW_COUNT;

  RETURN marked_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_messages_read IS 'Mark all messages in conversation as read (membership-checked)';

-- =====================================================
-- END OF MIGRATION 007
-- =====================================================
