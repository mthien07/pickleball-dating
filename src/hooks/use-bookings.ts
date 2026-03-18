/**
 * useBookings - Dual-mode hook for user booking history
 *
 * Authenticated: fetches from Supabase bookings table
 * Unauthenticated / error: falls back to MOCK_BOOKINGS
 *
 * Returns data shaped like MOCK_BOOKINGS items so existing BookingCard
 * component (which accesses booking.court, booking.date) works unchanged.
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getMyBookings } from '../services/api/booking.service';
import { MOCK_BOOKINGS } from '@data/mockData';

// Map Supabase booking (courts join field) to the mock-compatible shape
const normalizeSupabaseBooking = (b: any): any => ({
  ...b,
  date: b.booking_date,
  court: b.courts ?? null,
});

export const useBookings = () => {
  const authContext = useContext(AuthContext);
  const isRealMode = !!authContext?.user?.id;

  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    if (isRealMode) {
      try {
        const data = await getMyBookings();
        setBookings(data.map(normalizeSupabaseBooking));
      } catch (e) {
        console.error('[useBookings] Supabase fetch failed, falling back to mock:', e);
        setBookings(MOCK_BOOKINGS);
      }
    } else {
      setBookings(MOCK_BOOKINGS);
    }
    setIsLoading(false);
  }, [isRealMode]);

  useEffect(() => {
    load();
  }, [load]);

  return { bookings, isLoading, refresh: load };
};
