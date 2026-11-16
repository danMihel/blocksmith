import { describe, expect, it } from 'vitest'
import { computeDropIndex, toMoveIndex } from './drop-index'

// Three 100px items stacked from y = 0.
const rects = [
  { top: 0, height: 100 },
  { top: 100, height: 100 },
  { top: 200, height: 100 },
]

describe('computeDropIndex', () => {
  it('inserts before the item whose middle is below the pointer', () => {
    expect(computeDropIndex(rects, -10)).toBe(0)
    expect(computeDropIndex(rects, 49)).toBe(0)
    expect(computeDropIndex(rects, 51)).toBe(1)
    expect(computeDropIndex(rects, 260)).toBe(3)
  })

  it('skips collapsed items', () => {
    const withHidden = [rects[0]!, { top: 100, height: 0 }, { top: 100, height: 100 }]

    expect(computeDropIndex(withHidden, 120)).toBe(2)
  })

  it('handles an empty list', () => {
    expect(computeDropIndex([], 0)).toBe(0)
  })
})

describe('toMoveIndex', () => {
  it('accounts for the dragged item being removed first', () => {
    expect(toMoveIndex(0, 3)).toBe(2) // to the end of a 3-item list
    expect(toMoveIndex(2, 0)).toBe(0)
    expect(toMoveIndex(1, 1)).toBe(1) // dropped in place
    expect(toMoveIndex(1, 2)).toBe(1) // right after itself: still in place
  })
})
