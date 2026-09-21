import { BASE_URL } from '@/constants/urls';
import {
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '@shirans/shared';
import { DEFAULT_SHARE_IMAGE } from './pageMeta';

export const OG_LOCALE = 'he_IL';
export { SHARE_IMAGE_WIDTH, SHARE_IMAGE_HEIGHT };

/** Preview images must be absolute; crawlers don't resolve relative URLs. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export const DEFAULT_OG_IMAGE = absoluteUrl(DEFAULT_SHARE_IMAGE);

export function buildCanonicalUrl(path: string): string {
  if (path === '/' || path === '') {
    return `${BASE_URL}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}
