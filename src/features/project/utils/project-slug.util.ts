/** Matches API kebab-case: segments of a-z / digits, single hyphens, max 120 chars */
export const PROJECT_SLUG_MAX_LENGTH = 120

export const PROJECT_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function normalizeProjectSlugInput(raw: string): string {
  return raw.trim().toLowerCase().slice(0, PROJECT_SLUG_MAX_LENGTH)
}

/** Empty is valid (optional). Non-empty must match API rules. */
export function isValidProjectSlugForApi(normalized: string): boolean {
  if (normalized.length === 0) return true
  return (
    normalized.length <= PROJECT_SLUG_MAX_LENGTH &&
    PROJECT_SLUG_REGEX.test(normalized)
  )
}

/** Create: omit when empty (whitespace-only). */
export function projectSlugForCreateApi(raw: string): string | undefined {
  const s = normalizeProjectSlugInput(raw)
  return s.length > 0 ? s : undefined
}

/**
 * Update: empty string removes slug; non-empty sets it (normalized).
 * Send the normalized value so the payload matches stored form intent.
 */
export function projectSlugForUpdateApi(raw: string): string {
  return normalizeProjectSlugInput(raw)
}
