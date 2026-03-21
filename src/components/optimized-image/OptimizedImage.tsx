/**
 * OptimizedImage
 *
 * Wrapper around expo-image with consistent defaults:
 * - cachePolicy="memory-disk" for fast repeated loads
 * - contentFit="cover" for standard card/profile image layouts
 */

import React from 'react';
import { Image, ImageProps } from 'expo-image';

type OptimizedImageProps = Omit<ImageProps, 'cachePolicy' | 'contentFit'> & {
  cachePolicy?: ImageProps['cachePolicy'];
  contentFit?: ImageProps['contentFit'];
};

export const OptimizedImage = ({
  cachePolicy = 'memory-disk',
  contentFit = 'cover',
  ...props
}: OptimizedImageProps) => <Image cachePolicy={cachePolicy} contentFit={contentFit} {...props} />;

export default OptimizedImage;
