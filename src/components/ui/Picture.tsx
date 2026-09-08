import React from 'react';
import { getAvifPath, getWebPPath } from '../../utils/imageFormats';

interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Use the `-thumb` variants instead of the full-size ones. */
  thumb?: boolean;
  /** Class for the wrapping <picture>. Defaults to `contents` so the wrapper
   *  is transparent to layout and the <img> keeps sizing against its real
   *  parent (`h-full`, flex/grid placement, absolute positioning, …). */
  pictureClassName?: string;
}

/**
 * Drop-in replacement for `<img>` that serves AVIF, then WebP, then the
 * original file. Every image under `public/` has all three variants; they are
 * produced by `scripts/convert-to-avif.mjs`.
 */
export const Picture: React.FC<PictureProps> = ({
  src,
  thumb = false,
  pictureClassName = 'contents',
  ...imgProps
}) => (
  <picture className={pictureClassName}>
    <source srcSet={getAvifPath(src, thumb)} type="image/avif" />
    <source srcSet={getWebPPath(src, thumb)} type="image/webp" />
    <img src={src} {...imgProps} />
  </picture>
);
