export type FetchSource = 'api' | 'fallback';

export interface FetchResult<T> {
  data: T;
  source: FetchSource;
}

/**
 * Tries the API first. On any error, returns fallback data instead of throwing.
 * Used for projects, categories, and testimonials GET requests.
 */
export async function fetchWithFallback<T>(
  apiFn: () => Promise<T>,
  fallbackData: T,
): Promise<FetchResult<T>> {
  try {
    const data = await apiFn();
    return { data, source: 'api' };
  } catch {
    return { data: fallbackData, source: 'fallback' };
  }
}
