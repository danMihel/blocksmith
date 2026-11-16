<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib'
import { buttonVariants, focusRing } from './styles'
import type { ButtonVariant, ControlSize } from './types'

const {
  label,
  variant = 'ghost',
  size = 'md',
  pressed = undefined,
  disabled = false,
} = defineProps<{
  /** Accessible name; also shown as a native tooltip. */
  label: string
  variant?: ButtonVariant
  size?: ControlSize
  /** Makes the button a toggle (aria-pressed). */
  pressed?: boolean
  disabled?: boolean
}>()

defineSlots<{ default: () => unknown }>()

const sizes: Record<ControlSize, string> = {
  sm: 'size-8 rounded-md',
  md: 'size-10 rounded-lg',
}

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center transition-colors select-none',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4.5',
    focusRing,
    buttonVariants[variant],
    sizes[size],
    pressed && 'bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent',
  ),
)
</script>

<template>
  <button
    type="button"
    :class="classes"
    :aria-label="label"
    :title="label"
    :aria-pressed="pressed"
    :disabled
  >
    <slot />
  </button>
</template>
