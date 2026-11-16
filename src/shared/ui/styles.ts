import type { ButtonVariant, ControlSize } from './types'

export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg'

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg shadow-xs hover:bg-accent-hover',
  secondary: 'border border-line bg-surface text-fg shadow-xs hover:bg-surface-muted',
  ghost: 'text-fg-muted hover:bg-surface-muted hover:text-fg',
  danger: 'bg-danger text-danger-fg shadow-xs hover:opacity-90',
}

export const inputBase =
  'w-full border border-line bg-surface text-fg shadow-xs transition-colors outline-none placeholder:text-fg-muted/70 hover:border-fg-muted/40 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-invalid:border-danger'

export const inputSizes: Record<ControlSize, string> = {
  sm: 'h-8 rounded-md px-2.5 text-[13px]',
  md: 'h-10 rounded-lg px-3 text-sm',
}
