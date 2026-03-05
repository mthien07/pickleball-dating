/** Types for useImagePicker hook */

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

export interface UseImagePickerReturn {
  pickImage: () => Promise<ImagePickerResult[] | null>;
  takePhoto: () => Promise<ImagePickerResult | null>;
  images: ImagePickerResult[];
  addImages: (newImages: ImagePickerResult[]) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  isLoading: boolean;
}
