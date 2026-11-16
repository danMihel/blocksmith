import { Monitor, Smartphone, Tablet } from '@lucide/vue'
import { type Component, markRaw } from 'vue'
import { z } from 'zod'

/*
 * Responsive block styles with a desktop-first cascade: tablet inherits from desktop,
 * mobile inherits from tablet. Only overridden values are stored for smaller breakpoints.
 */

export const BREAKPOINTS = ['desktop', 'tablet', 'mobile'] as const
export type Breakpoint = (typeof BREAKPOINTS)[number]
export type OverrideBreakpoint = Exclude<Breakpoint, 'desktop'>

export const BREAKPOINT_META: Record<
  Breakpoint,
  { label: string; frameWidth: number; icon: Component }
> = {
  desktop: { label: 'Desktop', frameWidth: 1280, icon: markRaw(Monitor) },
  tablet: { label: 'Tablet', frameWidth: 768, icon: markRaw(Tablet) },
  mobile: { label: 'Mobile', frameWidth: 375, icon: markRaw(Smartphone) },
}

export const SPACINGS = ['none', 'sm', 'md', 'lg', 'xl'] as const
export type Spacing = (typeof SPACINGS)[number]

export type BlockStyle = {
  spacingTop: Spacing
  spacingBottom: Spacing
  hidden: boolean
}

export type ResponsiveStyle = {
  desktop: BlockStyle
  tablet?: Partial<BlockStyle>
  mobile?: Partial<BlockStyle>
}

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  spacingTop: 'lg',
  spacingBottom: 'lg',
  hidden: false,
}

const blockStyleSchema = z.object({
  spacingTop: z.enum(SPACINGS),
  spacingBottom: z.enum(SPACINGS),
  hidden: z.boolean(),
})

export const responsiveStyleSchema = z.object({
  desktop: blockStyleSchema,
  tablet: blockStyleSchema.partial().optional(),
  mobile: blockStyleSchema.partial().optional(),
}) satisfies z.ZodType<ResponsiveStyle>

/** Effective style at a breakpoint after applying the cascade. */
export function resolveStyle(style: ResponsiveStyle, breakpoint: Breakpoint): BlockStyle {
  let resolved = style.desktop
  if (breakpoint === 'desktop') return resolved
  resolved = { ...resolved, ...style.tablet }
  if (breakpoint === 'tablet') return resolved
  return { ...resolved, ...style.mobile }
}

export function isOverridden(
  style: ResponsiveStyle,
  breakpoint: Breakpoint,
  key: keyof BlockStyle,
): boolean {
  return breakpoint !== 'desktop' && style[breakpoint]?.[key] !== undefined
}

export function setStyleValue<K extends keyof BlockStyle>(
  style: ResponsiveStyle,
  breakpoint: Breakpoint,
  key: K,
  value: BlockStyle[K],
): ResponsiveStyle {
  if (breakpoint === 'desktop') return { ...style, desktop: { ...style.desktop, [key]: value } }
  return { ...style, [breakpoint]: { ...style[breakpoint], [key]: value } }
}

/** Removes an override so the value is inherited again. */
export function resetStyleValue(
  style: ResponsiveStyle,
  breakpoint: OverrideBreakpoint,
  key: keyof BlockStyle,
): ResponsiveStyle {
  const override = style[breakpoint]
  if (!override || override[key] === undefined) return style

  const rest = { ...override }
  delete rest[key]
  const next = { ...style }
  if (Object.keys(rest).length > 0) next[breakpoint] = rest
  else delete next[breakpoint]
  return next
}

/**
 * Turns the style into CSS custom properties consumed by `.page-block`
 * (see app/styles/page-theme.css), which switches between them with container queries.
 * The page stays responsive without JavaScript — this is also what the HTML export ships.
 */
export function styleToCssVars(style: ResponsiveStyle): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const breakpoint of BREAKPOINTS) {
    const resolved = resolveStyle(style, breakpoint)
    vars[`--pt-${breakpoint}`] = `var(--space-${resolved.spacingTop})`
    vars[`--pb-${breakpoint}`] = `var(--space-${resolved.spacingBottom})`
    vars[`--display-${breakpoint}`] = resolved.hidden ? 'none' : 'block'
  }
  return vars
}
