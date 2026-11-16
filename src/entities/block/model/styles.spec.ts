import { describe, expect, it } from 'vitest'
import {
  isOverridden,
  resetStyleValue,
  resolveStyle,
  type ResponsiveStyle,
  responsiveStyleSchema,
  setStyleValue,
  styleToCssVars,
} from './styles'

const style: ResponsiveStyle = {
  desktop: { spacingTop: 'xl', spacingBottom: 'lg', hidden: false },
  tablet: { spacingTop: 'md' },
  mobile: { hidden: true },
}

describe('responsive styles', () => {
  it('cascades desktop → tablet → mobile', () => {
    expect(resolveStyle(style, 'desktop')).toEqual(style.desktop)
    expect(resolveStyle(style, 'tablet')).toEqual({
      spacingTop: 'md',
      spacingBottom: 'lg',
      hidden: false,
    })
    expect(resolveStyle(style, 'mobile')).toEqual({
      spacingTop: 'md',
      spacingBottom: 'lg',
      hidden: true,
    })
  })

  it('knows which values are overridden', () => {
    expect(isOverridden(style, 'tablet', 'spacingTop')).toBe(true)
    expect(isOverridden(style, 'mobile', 'spacingTop')).toBe(false)
    expect(isOverridden(style, 'desktop', 'spacingTop')).toBe(false)
  })

  it('sets values immutably at the given breakpoint', () => {
    const next = setStyleValue(style, 'mobile', 'spacingBottom', 'none')

    expect(next.mobile).toEqual({ hidden: true, spacingBottom: 'none' })
    expect(next.desktop).toBe(style.desktop)
    expect(style.mobile).toEqual({ hidden: true })
  })

  it('resets an override and drops empty override objects', () => {
    const next = resetStyleValue(style, 'mobile', 'hidden')

    expect(next).not.toHaveProperty('mobile')
    expect(resolveStyle(next, 'mobile').hidden).toBe(false)
    expect(resetStyleValue(style, 'tablet', 'hidden')).toBe(style)
  })

  it('emits a CSS variable set for every breakpoint', () => {
    expect(styleToCssVars(style)).toEqual({
      '--pt-desktop': 'var(--space-xl)',
      '--pb-desktop': 'var(--space-lg)',
      '--display-desktop': 'block',
      '--pt-tablet': 'var(--space-md)',
      '--pb-tablet': 'var(--space-lg)',
      '--display-tablet': 'block',
      '--pt-mobile': 'var(--space-md)',
      '--pb-mobile': 'var(--space-lg)',
      '--display-mobile': 'none',
    })
  })

  it('validates partial overrides but requires a full desktop style', () => {
    expect(responsiveStyleSchema.safeParse(style).success).toBe(true)
    expect(responsiveStyleSchema.safeParse({ mobile: { hidden: true } }).success).toBe(false)
    expect(
      responsiveStyleSchema.safeParse({ ...style, tablet: { spacingTop: 'huge' } }).success,
    ).toBe(false)
  })
})
