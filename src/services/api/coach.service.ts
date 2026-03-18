/**
 * Coach Service
 *
 * Handles fetching coach data from Supabase.
 * Used by useCoaches hook with mock fallback.
 *
 * @see design/database/schema.md - coaches table
 */

import { supabase } from '../supabase';

export interface Coach {
  id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  certifications: string[];
  experience_years: number;
  hourly_rate: number;
  specialties: string[];
  rating: number;
  review_count: number;
  gallery_urls: string[];
  address: string | null;
}

export const getCoaches = async (): Promise<Coach[]> => {
  const { data, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });
  if (error) {
    throw error;
  }
  return (data || []) as unknown as Coach[];
};

export const getCoachById = async (id: string): Promise<Coach> => {
  const { data, error } = await supabase.from('coaches').select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data as unknown as Coach;
};
