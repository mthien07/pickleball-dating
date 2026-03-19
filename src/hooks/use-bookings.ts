/** useBookings - TanStack Query hook for user booking history */

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import { getMyBookings } from '../services/api/booking.service';
import { queryKeys } from '../config/query-keys';
import { MOCK_BOOKINGS } from '@data/mockData';

/** Normalize Supabase booking (courts join) to the shape expected by BookingCard */
const normalizeBooking = (b: any): any => ({
  ...b,
  date: b.booking_date,
  court: b.courts ?? null,
});

export const useBookings = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.bookings.list(),
    queryFn: getMyBookings,
    enabled: isAuthenticated,
    select: (data) => data.map(normalizeBooking),
    placeholderData: __DEV__ ? (MOCK_BOOKINGS as any) : undefined,
  });

  return { bookings, isLoading, refresh: refetch };
};
