/**
 * Match Service - Supabase real data for matches
 *
 * Fetches matches where current user is user_id_1 or user_id_2,
 * transforms result to pick the other user and attach conversation_id.
 */

import { supabase } from '../supabase';

export interface MatchWithUser {
  id: string;
  matched_at: string;
  conversation_id: string;
  matched_user: {
    id: string;
    display_name: string;
    avatar_urls: string[];
    is_online: boolean;
    skill_level: string;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

export const getMatches = async (): Promise<MatchWithUser[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('matches')
    .select(
      `
      id, matched_at,
      conversations(id),
      user_1:users!matches_user_id_1_fkey(id, display_name, avatar_urls, is_online, skill_level),
      user_2:users!matches_user_id_2_fkey(id, display_name, avatar_urls, is_online, skill_level)
    `
    )
    .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
    .order('matched_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((m: any) => {
    const matchedUser = m.user_1?.id === user.id ? m.user_2 : m.user_1;
    return {
      id: m.id,
      matched_at: m.matched_at,
      conversation_id: m.conversations?.[0]?.id || '',
      matched_user: matchedUser || {
        id: '',
        display_name: 'Unknown',
        avatar_urls: [],
        is_online: false,
        skill_level: 'beginner',
      },
      unread_count: 0,
    };
  });
};
