/**
 * Swipe Service - Supabase CRUD for discovery and swiping
 *
 * Handles:
 * - Fetching discovery profiles via get_swipe_profiles RPC
 * - Recording swipe actions (like, pass, super_like)
 * - Detecting mutual matches and creating match records
 *
 * Column names match DB schema:
 *   swipes: swiper_id, swiped_id, direction
 *   matches: user_id_1, user_id_2, matched_at
 */

import { supabase } from '../supabase';

export interface DiscoveryProfile {
  id: string;
  display_name: string;
  date_of_birth: string;
  avatar_urls: string[];
  bio: string;
  skill_level: string;
  play_style: string;
  preferred_address: string;
  distance_km?: number;
}

export type SwipeDirection = 'like' | 'pass' | 'super_like';

export interface SwipeResult {
  isMatch: boolean;
}

/**
 * Fetches profiles available for swiping via the get_swipe_profiles RPC.
 * The server-side function handles exclusion of already-swiped users.
 */
export const getDiscoveryProfiles = async (limit = 10): Promise<DiscoveryProfile[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.rpc('get_swipe_profiles', {
    limit_count: limit,
  });

  if (error) {
    throw error;
  }
  return (data || []) as DiscoveryProfile[];
};

/**
 * Records a swipe action and checks for a mutual match.
 * If both users liked each other, creates a match record.
 */
export const recordSwipe = async (
  targetUserId: string,
  direction: SwipeDirection
): Promise<SwipeResult> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error: swipeError } = await supabase.from('swipes').insert({
    swiper_id: user.id,
    swiped_id: targetUserId,
    direction,
  });
  if (swipeError) {
    throw swipeError;
  }

  // Only check for match on positive swipes
  if (direction !== 'like' && direction !== 'super_like') {
    return { isMatch: false };
  }

  const { data: mutual } = await supabase
    .from('swipes')
    .select('id')
    .eq('swiper_id', targetUserId)
    .eq('swiped_id', user.id)
    .in('direction', ['like', 'super_like'])
    .maybeSingle();

  if (!mutual) {
    return { isMatch: false };
  }

  // Use upsert to prevent duplicate matches from simultaneous swipes
  const [id1, id2] = [user.id, targetUserId].sort();
  const { data: upsertData, error: matchError } = await supabase
    .from('matches')
    .upsert(
      { user_id_1: id1, user_id_2: id2, matched_at: new Date().toISOString() },
      { onConflict: 'user_id_1,user_id_2', ignoreDuplicates: true }
    )
    .select('id');

  // ignoreDuplicates returns empty array (not error) for existing rows
  return { isMatch: !matchError && Array.isArray(upsertData) && upsertData.length > 0 };
};
