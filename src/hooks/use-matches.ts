/**
 * useMatches hook - Dual-mode: real Supabase data or mock fallback
 *
 * Uses real data when user is authenticated, falls back to MOCK_MATCHES otherwise.
 * Uses useContext(AuthContext) directly for test-safe access (no throw).
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getMatches, MatchWithUser } from '../services/api/match.service';
import { MOCK_MATCHES } from '@data/mockData';

export const useMatches = () => {
  const authContext = useContext(AuthContext);
  const isRealMode = !!authContext?.user?.id;

  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMatches = useCallback(async () => {
    setIsLoading(true);
    if (isRealMode) {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (e) {
        console.error('Matches load failed, falling back to mock:', e);
        setMatches(MOCK_MATCHES);
      }
    } else {
      setMatches(MOCK_MATCHES);
    }
    setIsLoading(false);
  }, [isRealMode]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const refresh = useCallback(() => loadMatches(), [loadMatches]);

  // Split: new matches have no last_message, conversations have messages
  const newMatches = matches.filter((m) => !m.last_message);
  const conversations = matches.filter((m) => m.last_message || m.unread_count > 0);

  return { matches, newMatches, conversations, isLoading, refresh };
};
