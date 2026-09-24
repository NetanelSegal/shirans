/**
 * Project titles are written "name - tagline" (or "name | tagline"). Lists
 * set the two apart: the name as the heading, the tagline under it.
 */
export function splitProjectTitle(title: string): { name: string; tagline?: string } {
  const [name, ...rest] = title.split(/\s+[-–|]\s+/);
  return { name: name.trim(), tagline: rest.join(' · ').trim() || undefined };
}
