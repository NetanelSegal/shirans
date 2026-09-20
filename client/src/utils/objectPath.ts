/**
 * Returns a copy of `source` with `path` ("a.b.c") set to `value`.
 *
 * Copies only the objects along the path rather than deep-cloning the whole
 * thing, so React sees a new reference exactly where one changed.
 */
export function setByPath<T extends object>(
  source: T,
  path: string,
  value: unknown,
): T {
  const [head, ...rest] = path.split('.');
  const current = (source as Record<string, unknown>)[head];

  return {
    ...source,
    [head]:
      rest.length === 0
        ? value
        : setByPath(current as object, rest.join('.'), value),
  };
}

/** Reads "a.b.c" out of a nested object; undefined if any step is missing. */
export function getByPath(source: object, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      source,
    );
}
