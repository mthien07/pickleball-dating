/**
 * useCourts - Dual-mode hook for court data
 *
 * Authenticated: fetches from Supabase courts table
 * Unauthenticated / error: falls back to MOCK_COURTS
 *
 * Returns data as any[] so both Supabase and mock shapes work
 * with existing CourtCard component.
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getCourts } from '../services/api/court.service';
import { MOCK_COURTS } from '@data/mockData';

export const useCourts = (courtType?: string) => {
  const authContext = useContext(AuthContext);
  const isRealMode = !!authContext?.user?.id;

  const [courts, setCourts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    if (isRealMode) {
      try {
        const data = await getCourts(courtType);
        setCourts(data);
      } catch (e) {
        console.error('[useCourts] Supabase fetch failed, falling back to mock:', e);
        const fallback = courtType
          ? MOCK_COURTS.filter((c) => c.court_type === courtType)
          : MOCK_COURTS;
        setCourts(fallback);
      }
    } else {
      const filtered = courtType
        ? MOCK_COURTS.filter((c) => c.court_type === courtType)
        : MOCK_COURTS;
      setCourts(filtered);
    }
    setIsLoading(false);
  }, [isRealMode, courtType]);

  useEffect(() => {
    load();
  }, [load]);

  return { courts, isLoading, refresh: load };
};
