/**
 * useImagePicker Hook
 *
 * React hook for unified image picking from gallery or camera.
 * Handles permissions and returns compressed images ready for upload.
 */

import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { compressImage } from '../services/storage.service';

// ============================================
// TYPES
// ============================================

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
}

export interface UseImagePickerOptions {
  /** Allow multiple image selection */
  allowsMultiple?: boolean;
  /** Aspect ratio for cropping [width, height] */
  aspect?: [number, number];
  /** Allow editing/cropping */
  allowsEditing?: boolean;
  /** Auto-compress images */
  autoCompress?: boolean;
  /** Image quality (0-1) */
  quality?: number;
}

interface UseImagePickerReturn {
  /** Pick image from gallery */
  pickImage: () => Promise<ImagePickerResult[] | null>;
  /** Take photo with camera */
  takePhoto: () => Promise<ImagePickerResult | null>;
  /** Currently selected images */
  images: ImagePickerResult[];
  /** Add images to selection */
  addImages: (newImages: ImagePickerResult[]) => void;
  /** Remove image at index */
  removeImage: (index: number) => void;
  /** Clear all images */
  clearImages: () => void;
  /** Whether an operation is in progress */
  isLoading: boolean;
}

// ============================================
// HOOK
// ============================================

export function useImagePicker(options: UseImagePickerOptions = {}): UseImagePickerReturn {
  const {
    allowsMultiple = false,
    aspect,
    allowsEditing = true,
    autoCompress = true,
    quality = 0.8,
  } = options;

  const [images, setImages] = useState<ImagePickerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Request gallery permission
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Cần quyền truy cập',
          'Vui lòng cho phép truy cập thư viện ảnh trong cài đặt.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  // Request camera permission
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép truy cập camera trong cài đặt.', [
          { text: 'OK' },
        ]);
        return false;
      }
    }
    return true;
  };

  // Process picked images
  const processImages = async (
    assets: ImagePicker.ImagePickerAsset[]
  ): Promise<ImagePickerResult[]> => {
    const processedImages: ImagePickerResult[] = [];

    for (const asset of assets) {
      let uri = asset.uri;

      // Compress if enabled
      if (autoCompress) {
        uri = await compressImage(uri);
      }

      processedImages.push({
        uri,
        width: asset.width,
        height: asset.height,
        type: asset.mimeType,
      });
    }

    return processedImages;
  };

  // Pick from gallery
  const pickImage = useCallback(async (): Promise<ImagePickerResult[] | null> => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      return null;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: allowsEditing && !allowsMultiple,
        allowsMultipleSelection: allowsMultiple,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      const processedImages = await processImages(result.assets);
      return processedImages;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [allowsEditing, allowsMultiple, aspect, quality, autoCompress]);

  // Take photo with camera
  const takePhoto = useCallback(async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets?.length) {
        return null;
      }

      const processedImages = await processImages(result.assets);
      return processedImages[0] || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [allowsEditing, aspect, quality, autoCompress]);

  // Add images to state
  const addImages = useCallback((newImages: ImagePickerResult[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Remove image at index
  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all images
  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    pickImage,
    takePhoto,
    images,
    addImages,
    removeImage,
    clearImages,
    isLoading,
  };
}

export default useImagePicker;
