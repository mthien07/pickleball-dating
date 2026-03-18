/**
 * Booking Service - Supabase CRUD for court bookings
 */

import { supabase } from '../supabase';

export interface CreateBookingParams {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  paymentMethod: string;
}

export interface BookingWithCourt {
  id: string;
  user_id: string;
  court_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_reference: string | null;
  qr_code: string | null;
  courts: any;
}

/**
 * Create a new booking for the current authenticated user
 */
export const createBooking = async (params: CreateBookingParams): Promise<BookingWithCourt> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      court_id: params.courtId,
      booking_date: params.date,
      start_time: params.startTime,
      end_time: params.endTime,
      total_amount: params.totalAmount,
      payment_method: params.paymentMethod,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as unknown as BookingWithCourt;
};

/**
 * Fetch all bookings for the current authenticated user, newest first
 */
export const getMyBookings = async (): Promise<BookingWithCourt[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*, courts(*)')
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false });

  if (error) {
    throw error;
  }
  return (data || []) as BookingWithCourt[];
};

/**
 * Cancel a booking by setting its status to 'cancelled'
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);
  if (error) {
    throw error;
  }
};
