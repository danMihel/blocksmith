import { describe, expect, it } from 'vitest'
import { fuzzyFilter, fuzzyMatch } from './fuzzy'

describe('fuzzyMatch', () => {
  it('matches subsequences case-insensitively and reports positions', () => {
    expect(fuzzyMatch('dupl', 'Duplicate block')?.positions).toEqual([0, 1, 2, 3])
    expect(fuzzyMatch('ahr', 'Add Hero')?.positions).toEqual([0, 4, 6])
    expect(fuzzyMatch('xyz', 'Add Hero')).toBeNull()
  })

  it('ignores spaces in the query and matches anything when empty', () => {
    expect(fuzzyMatch('add hero', 'Add Hero')).not.toBeNull()
    expect(fuzzyMatch('  ', 'Anything')).toEqual({ score: 0, positions: [] })
  })

  it('prefers word starts and consecutive characters', () => {
    const wordStart = fuzzyMatch('add', 'Add Hero')!.score
    const scattered = fuzzyMatch('add', 'Load data')!.score

    expect(wordStart).toBeGreaterThan(scattered)
  })
})

describe('fuzzyFilter', () => {
  const items = ['Load data', 'Add Hero', 'Add FAQ', 'Undo']

  it('filters and ranks', () => {
    expect(fuzzyFilter(items, 'add', (s) => s).map((r) => r.item)).toEqual([
      'Add FAQ',
      'Add Hero',
      'Load data',
    ])
  })

  it('keeps the original order for an empty query', () => {
    expect(fuzzyFilter(items, '', (s) => s).map((r) => r.item)).toEqual(items)
  })
})
