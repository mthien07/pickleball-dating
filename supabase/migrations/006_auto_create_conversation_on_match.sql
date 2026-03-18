-- Auto-create conversation when a new match is created
-- This ensures chat is available immediately after matching

CREATE OR REPLACE FUNCTION create_conversation_on_match()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO conversations (match_id)
  VALUES (NEW.id)
  ON CONFLICT (match_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_match_create_conversation ON matches;
CREATE TRIGGER on_match_create_conversation
  AFTER INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION create_conversation_on_match();
