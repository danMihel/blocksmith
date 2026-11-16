import type { Component } from 'vue'

export type PaletteCommand = {
  id: string
  label: string
  group: string
  icon?: Component
  /** Shortcut hint, e.g. `['mod', 'z']`. */
  shortcut?: string[]
  /** Extra words to match against, not displayed. */
  keywords?: string
  disabled?: boolean
  run: () => void
}
