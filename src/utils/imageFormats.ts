/**
 * Helpers for the AVIF / WebP / original triplet that `scripts/convert-to-avif.mjs`
 * generates next to every image in `public/`.
 *
 * Every source image has a sibling `.webp` and `.avif` with the same basename,
 * plus `-thumb.webp` / `-thumb.avif` for gallery-sized variants.
 */

/**
 * Some filenames contain spaces (e.g. `post inst-11.jpg`). In a `srcSet` a space
 * separates the URL from its descriptor and a comma separates candidates, so an
 * unescaped one makes the whole <source> invalid — the browser silently skips it
 * and falls back to the original file. These paths only ever feed srcSet, so
 * they are always escaped.
 */
const escapeForSrcSet = (path: string): string =>
  path.replace(/ /g, '%20').replace(/,/g, '%2C');

const withExtension = (src: string, suffix: string, ext: string): string => {
  const query = src.indexOf('?');
  const path = query === -1 ? src : src.slice(0, query);
  const search = query === -1 ? '' : src.slice(query);

  const lastDot = path.lastIndexOf('.');
  if (lastDot === -1 || lastDot < path.lastIndexOf('/')) return escapeForSrcSet(src);

  return escapeForSrcSet(`${path.slice(0, lastDot)}${suffix}${ext}${search}`);
};

/** `/images/cars/juke-1/g0.jpg` -> `/images/cars/juke-1/g0.avif` */
export const getAvifPath = (src: string, thumb = false): string =>
  withExtension(src, thumb ? '-thumb' : '', '.avif');

/** `/images/cars/juke-1/g0.jpg` -> `/images/cars/juke-1/g0.webp` */
export const getWebPPath = (src: string, thumb = false): string =>
  withExtension(src, thumb ? '-thumb' : '', '.webp');

/**
 * CSS `background-image` cannot use `<picture>`, so those live as `.bg-*`
 * classes in `src/index.css` where a plain `url()` declaration can be followed
 * by an `image-set()` one that only supporting browsers apply.
 */
