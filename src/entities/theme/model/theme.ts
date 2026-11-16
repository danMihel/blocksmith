import { z } from 'zod'

export const FONTS = {
  inter: { label: 'Inter', stack: "'Inter Variable', ui-sans-serif, system-ui, sans-serif" },
  'dm-sans': {
    label: 'DM Sans',
    stack: "'DM Sans Variable', ui-sans-serif, system-ui, sans-serif",
  },
  'space-grotesk': {
    label: 'Space Grotesk',
    stack: "'Space Grotesk Variable', ui-sans-serif, system-ui, sans-serif",
  },
  playfair: {
    label: 'Playfair Display',
    stack: "'Playfair Display Variable', ui-serif, Georgia, serif",
  },
  mono: { label: 'JetBrains Mono', stack: "'JetBrains Mono Variable', ui-monospace, monospace" },
} as const

export type FontId = keyof typeof FONTS
export const FONT_IDS = Object.keys(FONTS) as [FontId, ...FontId[]]

export const RADII = {
  none: { label: 'None', value: '0px' },
  sm: { label: 'S', value: '0.375rem' },
  md: { label: 'M', value: '0.875rem' },
  lg: { label: 'L', value: '1.5rem' },
} as const

export type RadiusId = keyof typeof RADII
export const RADIUS_IDS = Object.keys(RADII) as [RadiusId, ...RadiusId[]]

export type PageTheme = {
  primary: string
  background: string
  foreground: string
  radius: RadiusId
  headingFont: FontId
  bodyFont: FontId
}

const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, 'Expected a hex color like #4f46e5')

export const pageThemeSchema = z.object({
  primary: hexColor,
  background: hexColor,
  foreground: hexColor,
  radius: z.enum(RADIUS_IDS),
  headingFont: z.enum(FONT_IDS),
  bodyFont: z.enum(FONT_IDS),
}) satisfies z.ZodType<PageTheme>

export const DEFAULT_THEME: PageTheme = {
  primary: '#4f46e5',
  background: '#ffffff',
  foreground: '#111827',
  radius: 'md',
  headingFont: 'inter',
  bodyFont: 'inter',
}

export type ThemePreset = { id: string; name: string; theme: PageTheme }

export const THEME_PRESETS: readonly ThemePreset[] = [
  { id: 'indigo', name: 'Indigo', theme: DEFAULT_THEME },
  {
    id: 'emerald',
    name: 'Emerald',
    theme: {
      primary: '#059669',
      background: '#f8fbf9',
      foreground: '#0f1f17',
      radius: 'lg',
      headingFont: 'dm-sans',
      bodyFont: 'dm-sans',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    theme: {
      primary: '#ea580c',
      background: '#fffaf5',
      foreground: '#2a1608',
      radius: 'lg',
      headingFont: 'space-grotesk',
      bodyFont: 'inter',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    theme: {
      primary: '#a78bfa',
      background: '#0c0c16',
      foreground: '#ececf4',
      radius: 'md',
      headingFont: 'space-grotesk',
      bodyFont: 'inter',
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    theme: {
      primary: '#b91c1c',
      background: '#faf7f2',
      foreground: '#1c1917',
      radius: 'none',
      headingFont: 'playfair',
      bodyFont: 'inter',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    theme: {
      primary: '#22c55e',
      background: '#0a0f0b',
      foreground: '#d1fae5',
      radius: 'sm',
      headingFont: 'mono',
      bodyFont: 'mono',
    },
  },
]

export function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (light + 0.05) / (dark + 0.05)
}

export function readableTextOn(background: string): string {
  return contrastRatio(background, '#ffffff') >= contrastRatio(background, '#0a0a0a')
    ? '#ffffff'
    : '#0a0a0a'
}

export function themeToCssVars(theme: PageTheme): Record<string, string> {
  return {
    '--page-bg': theme.background,
    '--page-fg': theme.foreground,
    '--page-primary': theme.primary,
    '--page-primary-fg': readableTextOn(theme.primary),
    '--page-radius': RADII[theme.radius].value,
    '--page-font-heading': FONTS[theme.headingFont].stack,
    '--page-font-body': FONTS[theme.bodyFont].stack,
    'color-scheme': luminance(theme.background) < 0.4 ? 'dark' : 'light',
  }
}
