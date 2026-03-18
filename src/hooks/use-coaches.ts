/**
 * useCoaches Hook
 *
 * Dual-mode data hook for coach directory:
 * - Real mode: fetches from Supabase when user is authenticated
 * - Mock mode: uses MOCK_COACHES as fallback (unauthenticated or on error)
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getCoaches } from '../services/api/coach.service';
import { MOCK_COACHES } from '@data/mockData';

export const useCoaches = () => {
  const authContext = useContext(AuthContext);
  const isRealMode = !!authContext?.user?.id;
  const [coaches, setCoaches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    if (isRealMode) {
      try {
        const data = await getCoaches();
        setCoaches(data);
      } catch {
        setCoaches(MOCK_COACHES);
      }
    } else {
      setCoaches(MOCK_COACHES);
    }
    setIsLoading(false);
  }, [isRealMode]);

  useEffect(() => {
    load();
  }, [load]);

  return { coaches, isLoading, refresh: load };
};
