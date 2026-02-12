import { BACKEND_URL } from '../constants/urls';

/**
 * Resolves a relative image URL (from the API) to a full URL by prepending BACKEND_URL.
 * Absolute URLs (e.g., YouTube embeds) are returned as-is.
 */
export function resolveImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
}
