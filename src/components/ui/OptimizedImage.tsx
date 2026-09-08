import React, { useState, useRef, useEffect } from 'react';
import { getAvifPath, getWebPPath } from '../../utils/imageFormats';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  useThumbnail?: boolean;
  onLoad?: () => void;
}

/**
 * OptimizedImage component with AVIF/WebP support and lazy loading
 *
 * Features:
 * - Serves .avif first, then .webp, then the original file
 * - Fallback to original format for older browsers
 * - Optional thumbnail version for smaller displays
 * - Blur-up loading effect
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  useThumbnail = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const avifSrc = getAvifPath(src, useThumbnail);
  const webpSrc = getWebPPath(src, useThumbnail);
  const thumbAvifSrc = useThumbnail ? getAvifPath(src, true) : null;
  const thumbSrc = useThumbnail ? getWebPPath(src, true) : null;

  useEffect(() => {
    // Check if image is already cached/loaded
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  // If WebP failed, fall back to original
  if (hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
      />
    );
  }

  return (
    <picture>
      {/* Thumbnail for smaller viewports */}
      {thumbAvifSrc && (
        <source
          srcSet={thumbAvifSrc}
          type="image/avif"
          media="(max-width: 640px)"
        />
      )}
      {thumbSrc && (
        <source
          srcSet={thumbSrc}
          type="image/webp"
          media="(max-width: 640px)"
        />
      )}
      {/* AVIF first, WebP next, original as the last resort */}
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      {/* Fallback for older browsers */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
};
