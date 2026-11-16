import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, undefined, null, { b: true, c: false }, ['d'])).toBe('a b d')
  })

  it('resolves conflicting tailwind utilities', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('resolves conflicts between custom design tokens', () => {
    expect(cn('bg-surface text-fg', 'bg-accent')).toBe('text-fg bg-accent')
  })
})
