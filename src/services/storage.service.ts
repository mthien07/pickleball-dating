/**
 * Storage Service
 *
 * Handles image upload/download with Supabase Storage.
 * Includes image compression and URL generation.
 */

import { supabase } from './supabase';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// ============================================
// CONFIGURATION
// ============================================

const BUCKET_NAME = 'avatars';
const MAX_IMAGE_SIZE = 1024; // Max width/height in pixels
const COMPRESSION_QUALITY = 0.8;

// ============================================
// TYPES
// ============================================

export interface UploadResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

// ============================================
// IMAGE COMPRESSION
// ============================================

/**
 * Compress and resize image before upload
 */
export async function compressImage(uri: string): Promise<string> {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_IMAGE_SIZE } }],
      { compress: COMPRESSION_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri; // Return original if compression fails
  }
}

// ============================================
// UPLOAD FUNCTIONS
// ============================================

/**
 * Upload profile image to Supabase Storage
 */
export async function uploadProfileImage(imageUri: string, userId: string): Promise<UploadResult> {
  try {
    // Compress image first
    const compressedUri = await compressImage(imageUri);

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(compressedUri, {
      encoding: 'base64',
    });

    // Create file path
    const fileExt = 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Decode base64 to ArrayBuffer
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Upload to Supabase
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, byteArray, {
      contentType: 'image/jpeg',
      upsert: true,
    });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  imageUris: string[],
  userId: string
): Promise<UploadResult[]> {
  const results = await Promise.all(imageUris.map((uri) => uploadProfileImage(uri, userId)));
  return results;
}

// ============================================
// DELETE FUNCTIONS
// ============================================

/**
 * Delete image from storage
 */
export async function deleteImage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Delete all images for a user
 */
export async function deleteUserImages(userId: string): Promise<boolean> {
  try {
    const { data: files, error: listError } = await supabase.storage.from(BUCKET_NAME).list(userId);

    if (listError) {
      throw listError;
    }

    if (files && files.length > 0) {
      const paths = files.map((file) => `${userId}/${file.name}`);
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove(paths);

      if (deleteError) {
        throw deleteError;
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting user images:', error);
    return false;
  }
}

// ============================================
// URL HELPERS
// ============================================

/**
 * Get public URL for an image path
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get signed URL for private images (expires in 1 hour)
 */
export async function getSignedUrl(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, 3600);

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return null;
  }
}
