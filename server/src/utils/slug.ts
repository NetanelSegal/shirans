/**
 * Slugs for Hebrew and Latin titles.
 *
 * Hebrew letters are kept as they are rather than transliterated: a Hebrew URL
 * is percent-encoded on the wire but renders readably in the address bar and in
 * search results, and a transliteration would be guesswork.
 */
const HEBREW = /[֐-׿]/;

export function slugify(input: string): string {
  const base = input.trim();
  if (!base) return '';

  if (HEBREW.test(base)) {
    return base
      .replace(/\s+/g, '-')
      .replace(/[^֐-׿a-zA-Z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }

  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

/**
 * Appends -2, -3, … until `isTaken` says the candidate is free, so a second
 * article with the same title never trips the unique constraint.
 */
export async function uniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> {
  if (!(await isTaken(base))) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }
}

/** Hebrew reads at roughly 200 words a minute; never reports less than one. */
export function estimateReadingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
