import { describe, expect, it } from 'vitest'
import { formatRelativeTime, slugify } from './format'

describe('formatRelativeTime', () => {
  const now = new Date('2026-06-15T12:00:00.000Z').getTime()
  const ago = (seconds: number) => new Date(now - seconds * 1000).toISOString()

  it('formats recent and older moments', () => {
    expect(formatRelativeTime(ago(10), now)).toBe('just now')
    expect(formatRelativeTime(ago(5 * 60), now)).toBe('5 minutes ago')
    expect(formatRelativeTime(ago(3 * 3600), now)).toBe('3 hours ago')
    expect(formatRelativeTime(ago(24 * 3600), now)).toBe('yesterday')
    expect(formatRelativeTime(ago(14 * 24 * 3600), now)).toBe('2 weeks ago')
  })
})

describe('slugify', () => {
  it('makes file-name friendly slugs', () => {
    expect(slugify('Acme Analytics!')).toBe('acme-analytics')
    expect(slugify('  Café — Menu_2026 ')).toBe('cafe-menu-2026')
    expect(slugify('!!!')).toBe('page')
  })
})
