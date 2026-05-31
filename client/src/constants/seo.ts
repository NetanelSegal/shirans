import { BASE_URL } from '@/constants/urls';

export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;
export const OG_LOCALE = 'he_IL';

export function buildCanonicalUrl(path: string): string {
  if (path === '/' || path === '') {
    return `${BASE_URL}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalized}`;
}
