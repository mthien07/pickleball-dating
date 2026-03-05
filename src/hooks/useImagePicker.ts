/**
 * useImagePicker Hook
 *
 * Unified image picking from gallery or camera.
 * Handles permissions and returns compressed images ready for upload.
 */

import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { compressImage } from '../services/storage.service';
import type {
  ImagePickerResult,
  UseImagePickerOptions,
  UseImagePickerReturn,
} from './useImagePicker.types';

export type { ImagePickerResult, UseImagePickerOptions, UseImagePickerReturn };

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

  const processImages = async (
    assets: ImagePicker.ImagePickerAsset[]
  ): Promise<ImagePickerResult[]> => {
    const processedImages: ImagePickerResult[] = [];
    for (const asset of assets) {
      let uri = asset.uri;
      if (autoCompress) {
        uri = await compressImage(uri);
      }
      processedImages.push({ uri, width: asset.width, height: asset.height, type: asset.mimeType });
    }
    return processedImages;
  };

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
      return await processImages(result.assets);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [allowsEditing, allowsMultiple, aspect, quality, autoCompress]);

  const takePhoto = useCallback(async (): Promise<ImagePickerResult | null> => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({ allowsEditing, aspect, quality });
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

  const addImages = useCallback((newImages: ImagePickerResult[]) => {
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return { pickImage, takePhoto, images, addImages, removeImage, clearImages, isLoading };
}

export default useImagePicker;
