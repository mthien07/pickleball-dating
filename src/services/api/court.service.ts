/**
 * Court Service - Supabase CRUD for courts and time slots
 */

import { supabase } from '../supabase';

export interface Court {
  id: string;
  name: string;
  address: string;
  court_type: string;
  amenities: string[];
  images: string[];
  price_min: number | null;
  price_max: number | null;
  operating_hours: any;
  is_partner: boolean;
  description: string | null;
}

export interface CourtTimeSlot {
  id: string;
  court_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  price: number;
  is_available: boolean;
}

/**
 * Fetch active courts, optionally filtered by type
 */
export const getCourts = async (courtType?: string): Promise<Court[]> => {
  let query = supabase.from('courts').select('*').eq('is_active', true);
  if (courtType) {
    query = query.eq('court_type', courtType);
  }
  const { data, error } = await query.order('name');
  if (error) {
    throw error;
  }
  return (data || []) as Court[];
};

/**
 * Fetch a single court by ID
 */
export const getCourtById = async (id: string): Promise<Court> => {
  const { data, error } = await supabase.from('courts').select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as Court;
};

/**
 * Fetch available time slots for a court on a given date
 * date: YYYY-MM-DD string
 */
export const getCourtTimeSlots = async (
  courtId: string,
  date: string
): Promise<CourtTimeSlot[]> => {
  // Parse date parts explicitly to avoid UTC offset shifting the day of week
  const [year, month, day] = date.split('-').map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const { data, error } = await supabase
    .from('court_time_slots')
    .select('*')
    .eq('court_id', courtId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .order('start_time');
  if (error) {
    throw error;
  }
  return (data || []) as unknown as CourtTimeSlot[];
};
