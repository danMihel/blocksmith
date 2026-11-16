/**
 * Subsequence fuzzy matching, the way editors' command palettes work:
 * "dupl" matches "Duplicate block", "ahr" matches "Add Hero".
 *
 * Returns null when the query doesn't match, otherwise a score (higher is better) and the
 * matched character positions for highlighting. Consecutive characters and matches at
 * word starts score higher, so "add" ranks "Add Hero" above "Load data".
 */
export function fuzzyMatch(
  query: string,
  text: string,
): { score: number; positions: number[] } | null {
  const q = query.trim().toLowerCase()
  if (!q) return { score: 0, positions: [] }

  const t = text.toLowerCase()
  const positions: number[] = []
  let score = 0
  let from = 0
  let previous = -2

  for (const char of q) {
    if (char === ' ') continue
    const index = t.indexOf(char, from)
    if (index === -1) return null

    const atWordStart = index === 0 || /[\s\-_/:]/.test(t[index - 1] ?? '')
    score += 1
    if (index === previous + 1) score += 3
    if (atWordStart) score += 4

    positions.push(index)
    previous = index
    from = index + 1
  }

  // Prefer shorter texts and earlier first matches.
  score -= (positions[0] ?? 0) * 0.1 + t.length * 0.01
  return { score, positions }
}

/** Filters and sorts items by match quality; keeps the original order for an empty query. */
export function fuzzyFilter<T>(items: readonly T[], query: string, toText: (item: T) => string) {
  return items
    .map((item, index) => ({ item, index, match: fuzzyMatch(query, toText(item)) }))
    .filter((entry) => entry.match !== null)
    .sort((a, b) => b.match!.score - a.match!.score || a.index - b.index)
    .map(({ item, match }) => ({ item, positions: match!.positions }))
}
