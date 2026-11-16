import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  DEFAULT_THEME,
  luminance,
  pageThemeSchema,
  readableTextOn,
  THEME_PRESETS,
  themeToCssVars,
} from './theme'

describe('theme', () => {
  it('computes WCAG luminance and contrast', () => {
    expect(luminance('#000000')).toBe(0)
    expect(luminance('#ffffff')).toBeCloseTo(1)
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1)
  })

  it('picks readable text for a background', () => {
    expect(readableTextOn('#4f46e5')).toBe('#ffffff')
    expect(readableTextOn('#fde047')).toBe('#0a0a0a')
  })

  it.each(THEME_PRESETS.map((p) => [p.id, p.theme] as const))(
    'preset "%s" is valid and has readable body text',
    (_, theme) => {
      expect(pageThemeSchema.safeParse(theme).success).toBe(true)
      expect(contrastRatio(theme.background, theme.foreground)).toBeGreaterThanOrEqual(4.5)
    },
  )

  it('rejects malformed colors', () => {
    expect(pageThemeSchema.safeParse({ ...DEFAULT_THEME, primary: 'red' }).success).toBe(false)
  })

  it('maps a theme to page CSS variables', () => {
    const vars = themeToCssVars(DEFAULT_THEME)

    expect(vars).toMatchObject({
      '--page-primary': DEFAULT_THEME.primary,
      '--page-bg': DEFAULT_THEME.background,
      '--page-fg': DEFAULT_THEME.foreground,
      '--page-primary-fg': '#ffffff',
    })
  })
})
