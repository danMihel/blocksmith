import type { Component } from 'vue'

export type PaletteCommand = {
  id: string
  label: string
  group: string
  icon?: Component
  shortcut?: string[]
  keywords?: string
  disabled?: boolean
  run: () => void
}
