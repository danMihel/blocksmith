import type { Component } from 'vue'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ControlSize = 'sm' | 'md'

export interface SegmentedOption<T extends string | number = string> {
  value: T
  label: string
  icon?: Component
  iconOnly?: boolean
}
