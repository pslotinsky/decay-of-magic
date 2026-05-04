/**
 * Convert a human-readable name into a camelCase codex slug.
 * Strips non-alphanumeric characters, lowercases the first word, and
 * capitalises the leading letter of each subsequent word.
 *
 * "Wall of Fire"      -> "wallOfFire"
 * "Immune to Spells!" -> "immuneToSpells"
 */
export function nameToSlug(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      const clean = word.replace(/[^a-zA-Z0-9]/g, '');

      const lower = clean.toLowerCase();

      return index === 0
        ? lower
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}
