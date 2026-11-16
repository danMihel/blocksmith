<script setup lang="ts" generic="T extends string | number">
import { computed, nextTick, useTemplateRef } from 'vue'
import { cn } from '@/shared/lib'
import { focusRing } from './styles'
import type { ControlSize, SegmentedOption } from './types'

const {
  options,
  label,
  size = 'md',
  stretch = false,
} = defineProps<{
  options: readonly SegmentedOption<T>[]
  /** Accessible name of the radio group. */
  label: string
  size?: ControlSize
  /** Fill the available width, splitting it equally between options. */
  stretch?: boolean
}>()

const model = defineModel<T>({ required: true })

const items = useTemplateRef<HTMLButtonElement[]>('items')

const selectedIndex = computed(() => options.findIndex((o) => o.value === model.value))
/** Roving tabindex: exactly one option is reachable with Tab. */
const tabbableIndex = computed(() => Math.max(selectedIndex.value, 0))

function select(index: number) {
  const option = options[index]
  if (!option) return
  model.value = option.value
  void nextTick(() => items.value?.[index]?.focus())
}

function onKeydown(event: KeyboardEvent) {
  const last = options.length - 1
  const current = tabbableIndex.value
  const next = current === last ? 0 : current + 1
  const prev = current === 0 ? last : current - 1

  const targets: Partial<Record<string, number>> = {
    ArrowRight: next,
    ArrowDown: next,
    ArrowLeft: prev,
    ArrowUp: prev,
    Home: 0,
    End: last,
  }

  const target = targets[event.key]
  if (target === undefined) return

  event.preventDefault()
  select(target)
}

const sizes: Record<ControlSize, { root: string; item: string }> = {
  sm: { root: 'h-8 rounded-md', item: 'rounded-[5px] px-2 text-[13px]' },
  md: { root: 'h-10 rounded-lg', item: 'rounded-md px-3 text-sm' },
}

const itemClasses = (selected: boolean) =>
  cn(
    'inline-flex items-center justify-center gap-1.5 font-medium text-fg-muted transition-[color,background-color,box-shadow] select-none hover:text-fg',
    '[&_svg]:size-4 [&_svg]:shrink-0',
    focusRing,
    'focus-visible:ring-offset-0',
    sizes[size].item,
    stretch && 'min-w-0 flex-1',
    selected && 'bg-surface text-fg shadow-sm',
  )
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    :class="
      cn(
        'inline-flex items-stretch gap-0.5 bg-surface-muted p-0.5',
        sizes[size].root,
        stretch && 'flex w-full',
      )
    "
    @keydown="onKeydown"
  >
    <button
      v-for="(option, index) in options"
      :key="option.value"
      ref="items"
      type="button"
      role="radio"
      :aria-checked="index === selectedIndex"
      :aria-label="option.iconOnly ? option.label : undefined"
      :title="option.iconOnly ? option.label : undefined"
      :tabindex="index === tabbableIndex ? 0 : -1"
      :class="itemClasses(index === selectedIndex)"
      @click="select(index)"
    >
      <component :is="option.icon" v-if="option.icon" aria-hidden="true" />
      <span v-if="!option.iconOnly">{{ option.label }}</span>
    </button>
  </div>
</template>
