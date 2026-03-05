/**
 * Profile Service
 *
 * Handles user profile CRUD operations:
 * - Create/complete profile after signup
 * - Update profile information
 * - Get user profile
 * - Update online status
 *
 * @see design/database/schema.md - users table
 */

import { supabase } from '../supabase';
import type { CreateProfileParams, UpdateProfileParams, UserProfile } from './profile.types';

// Re-export types for consumers
export type { CreateProfileParams, UpdateProfileParams, UserProfile };

// Re-export photo functions
export { uploadProfilePhoto, deleteProfilePhoto } from './profile-photos.service';

/**
 * Create user profile after signup
 */
export const createProfile = async (params: CreateProfileParams): Promise<UserProfile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  let locationPoint = null;
  if (params.preferredLat && params.preferredLng) {
    locationPoint = `POINT(${params.preferredLng} ${params.preferredLat})`;
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: user.email,
      phone: user.phone,
      display_name: params.displayName,
      date_of_birth: params.dateOfBirth,
      gender: params.gender,
      bio: params.bio,
      avatar_urls: params.avatarUrls,
      skill_level: params.skillLevel,
      play_style: params.playStyle,
      looking_for: params.lookingFor,
      availability: params.availability,
      preferred_location: locationPoint,
      preferred_address: params.preferredAddress,
      phone_verified: !!user.phone_confirmed_at,
      email_verified: !!user.email_confirmed_at,
      profile_complete: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as UserProfile;
};

/**
 * Get current user's profile
 */
export const getMyProfile = async (): Promise<UserProfile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    } // No rows found
    throw error;
  }

  return data as UserProfile;
};

/**
 * Get user profile by ID (public profile view)
 */
export const getUserProfile = async (userId: string): Promise<Partial<UserProfile> | null> => {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      id,
      display_name,
      avatar_urls,
      gender,
      skill_level,
      play_style,
      bio,
      average_rating,
      matches_count,
      is_online,
      last_active
    `
    )
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  if (data) {
    return { ...data, bio: data.bio ?? undefined };
  }

  return null;
};

/**
 * Update current user's profile
 */
export const updateProfile = async (params: UpdateProfileParams): Promise<UserProfile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const updates: Record<string, unknown> = {};

  if (params.displayName) {
    updates.display_name = params.displayName;
  }
  if (params.bio !== undefined) {
    updates.bio = params.bio;
  }
  if (params.avatarUrls) {
    updates.avatar_urls = params.avatarUrls;
  }
  if (params.skillLevel) {
    updates.skill_level = params.skillLevel;
  }
  if (params.playStyle) {
    updates.play_style = params.playStyle;
  }
  if (params.lookingFor) {
    updates.looking_for = params.lookingFor;
  }
  if (params.availability) {
    updates.availability = params.availability;
  }
  if (params.preferredAddress) {
    updates.preferred_address = params.preferredAddress;
  }
  if (params.preferredLat && params.preferredLng) {
    updates.preferred_location = `POINT(${params.preferredLng} ${params.preferredLat})`;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as UserProfile;
};

/**
 * Update user's online status
 */
export const updateOnlineStatus = async (isOnline: boolean): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const { error } = await supabase
    .from('users')
    .update({ is_online: isOnline, last_active: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    throw error;
  }
};
