/**
 * Profile Photos Service
 *
 * Upload and delete profile photos from Supabase Storage.
 * @see design/database/schema.md - users table
 */

import { supabase } from '../supabase';

/**
 * Upload profile photo to Supabase Storage
 * @returns Public URL of uploaded image
 */
export const uploadProfilePhoto = async (
  file: { uri: string; type: string },
  userId: string
): Promise<string> => {
  const timestamp = Date.now();
  const filename = `${userId}/${timestamp}.jpg`;

  const response = await fetch(file.uri);
  const blob = await response.blob();

  const { data, error } = await supabase.storage.from('profile-photos').upload(filename, blob, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile-photos').getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Delete profile photo from storage
 */
export const deleteProfilePhoto = async (photoUrl: string, _userId: string): Promise<void> => {
  const path = photoUrl.split('/profile-photos/')[1];
  if (!path) {
    throw new Error('Invalid photo URL');
  }

  const { error } = await supabase.storage.from('profile-photos').remove([path]);
  if (error) {
    throw error;
  }
};
