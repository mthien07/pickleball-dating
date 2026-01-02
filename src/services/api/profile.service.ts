/**
 * Profile Service
 *
 * Handles user profile operations:
 * - Create/complete profile after signup
 * - Update profile information
 * - Upload profile photos
 * - Get user profile
 * - Update online status
 *
 * @see design/database/schema.md - users table
 */

import { supabase } from '../supabase';

// =====================================================
// TYPES
// =====================================================

export interface CreateProfileParams {
  displayName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  bio?: string;
  avatarUrls: string[]; // At least 1 required
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  playStyle: 'competitive' | 'casual' | 'social';
  lookingFor: ('opponent' | 'doubles_partner' | 'dating')[];
  availability?: Record<string, string[]>; // { "monday": ["morning", "evening"] }
  preferredLat?: number;
  preferredLng?: number;
  preferredAddress?: string;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  avatarUrls?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  playStyle?: 'competitive' | 'casual' | 'social';
  lookingFor?: ('opponent' | 'doubles_partner' | 'dating')[];
  availability?: Record<string, string[]>;
  preferredLat?: number;
  preferredLng?: number;
  preferredAddress?: string;
}

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  email?: string;
  phone?: string;
  display_name: string;
  date_of_birth: string;
  gender: string;
  bio?: string;
  avatar_urls: string[];
  skill_level: string;
  play_style: string;
  looking_for: string[];
  availability?: Record<string, string[]>;
  preferred_address?: string;
  phone_verified: boolean;
  email_verified: boolean;
  matches_count: number;
  games_played: number;
  average_rating: number;
  is_online: boolean;
  last_active: string;
  profile_complete: boolean;
  is_active: boolean;
}

// =====================================================
// PROFILE CRUD
// =====================================================

/**
 * Create user profile after signup
 *
 * This should be called after successful authentication
 * to complete the user's profile setup.
 */
export const createProfile = async (
  params: CreateProfileParams
): Promise<UserProfile> => {
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Prepare location point (if provided)
  let locationPoint = null;
  if (params.preferredLat && params.preferredLng) {
    locationPoint = `POINT(${params.preferredLng} ${params.preferredLat})`;
  }

  // Insert user profile
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

  if (error) throw error;

  return data as UserProfile;
};

/**
 * Get current user's profile
 */
export const getMyProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return data as UserProfile;
};

/**
 * Get user profile by ID (public profile view)
 */
export const getUserProfile = async (
  userId: string
): Promise<Partial<UserProfile> | null> => {
  const { data, error } = await supabase
    .from('users')
    .select(`
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
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data;
};

/**
 * Update current user's profile
 */
export const updateProfile = async (
  params: UpdateProfileParams
): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Prepare update object
  const updates: any = {};

  if (params.displayName) updates.display_name = params.displayName;
  if (params.bio !== undefined) updates.bio = params.bio;
  if (params.avatarUrls) updates.avatar_urls = params.avatarUrls;
  if (params.skillLevel) updates.skill_level = params.skillLevel;
  if (params.playStyle) updates.play_style = params.playStyle;
  if (params.lookingFor) updates.looking_for = params.lookingFor;
  if (params.availability) updates.availability = params.availability;
  if (params.preferredAddress) updates.preferred_address = params.preferredAddress;

  // Update location if provided
  if (params.preferredLat && params.preferredLng) {
    updates.preferred_location = `POINT(${params.preferredLng} ${params.preferredLat})`;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;

  return data as UserProfile;
};

/**
 * Update user's online status
 */
export const updateOnlineStatus = async (isOnline: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('users')
    .update({
      is_online: isOnline,
      last_active: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
};

// =====================================================
// PROFILE PHOTOS
// =====================================================

/**
 * Upload profile photo to Supabase Storage
 *
 * @param file - Image file (from Expo ImagePicker)
 * @param userId - User ID (for folder naming)
 * @returns Public URL of uploaded image
 */
export const uploadProfilePhoto = async (
  file: { uri: string; type: string },
  userId: string
): Promise<string> => {
  // Generate unique filename
  const timestamp = Date.now();
  const filename = `${userId}/${timestamp}.jpg`;

  // Convert URI to blob (for React Native)
  const response = await fetch(file.uri);
  const blob = await response.blob();

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(filename, blob, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Delete profile photo from storage
 */
export const deleteProfilePhoto = async (
  photoUrl: string,
  userId: string
): Promise<void> => {
  // Extract path from URL
  const path = photoUrl.split('/profile-photos/')[1];
  if (!path) throw new Error('Invalid photo URL');

  const { error } = await supabase.storage
    .from('profile-photos')
    .remove([path]);

  if (error) throw error;
};
