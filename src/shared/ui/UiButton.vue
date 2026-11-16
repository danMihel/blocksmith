<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib'
import { buttonVariants, focusRing } from './styles'
import type { ButtonVariant, ControlSize } from './types'

const {
  variant = 'secondary',
  size = 'md',
  type = 'button',
  block = false,
  disabled = false,
} = defineProps<{
  variant?: ButtonVariant
  size?: ControlSize
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  disabled?: boolean
}>()

defineSlots<{
  default?: () => unknown
  icon?: () => unknown
}>()

const sizes: Record<ControlSize, string> = {
  sm: 'h-8 gap-1.5 rounded-md px-3 text-[13px]',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
}

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors select-none',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    focusRing,
    buttonVariants[variant],
    sizes[size],
    block && 'w-full',
  ),
)
</script>

<template>
  <button :type :disabled :class="classes">
    <slot name="icon" />
    <slot />
  </button>
</template>
