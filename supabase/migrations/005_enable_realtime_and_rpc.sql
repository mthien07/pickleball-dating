-- Enable realtime on messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime on conversations table
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- RPC function: mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(conversation_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE messages
  SET status = 'read', read_at = NOW()
  WHERE conversation_id = conversation_id_param
    AND sender_id != auth.uid()
    AND status != 'read';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for messages (if not exist)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in their conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can read own conversation messages'
  ) THEN
    CREATE POLICY "Users can read own conversation messages" ON messages
      FOR SELECT USING (
        conversation_id IN (
          SELECT c.id FROM conversations c
          JOIN matches m ON c.match_id = m.id
          WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
        )
      );
  END IF;
END $$;

-- Users can insert messages in their conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can send messages'
  ) THEN
    CREATE POLICY "Users can send messages" ON messages
      FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
          SELECT c.id FROM conversations c
          JOIN matches m ON c.match_id = m.id
          WHERE m.user_id_1 = auth.uid() OR m.user_id_2 = auth.uid()
        )
      );
  END IF;
END $$;
