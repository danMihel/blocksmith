<script setup lang="ts">
import { RotateCcw } from '@lucide/vue'
import { computed } from 'vue'
import {
  BREAKPOINT_META,
  BREAKPOINTS,
  type BlockNode,
  type BlockStyle,
  isOverridden,
  resetStyleValue,
  resolveStyle,
  setStyleValue,
  type Spacing,
  SPACINGS,
} from '@/entities/block'
import { useEditorStore } from '@/entities/editor'
import { useBlockActions } from '@/features/block-actions'
import { type SegmentedOption, UiSegmented, UiSwitch } from '@/shared/ui'

const { block } = defineProps<{ block: BlockNode }>()

const editor = useEditorStore()
const actions = useBlockActions()

const breakpoint = computed(() => editor.breakpoint)
const breakpointLabel = computed(() => BREAKPOINT_META[breakpoint.value].label)
const resolved = computed(() => resolveStyle(block.style, breakpoint.value))

const breakpointOptions: SegmentedOption<(typeof BREAKPOINTS)[number]>[] = BREAKPOINTS.map(
  (bp) => ({
    value: bp,
    label: BREAKPOINT_META[bp].label,
    icon: BREAKPOINT_META[bp].icon,
  }),
)

const SPACING_LABELS: Record<Spacing, string> = { none: '0', sm: 'S', md: 'M', lg: 'L', xl: 'XL' }
const spacingOptions = SPACINGS.map((value) => ({ value, label: SPACING_LABELS[value] }))

const spacingFields = [
  { key: 'spacingTop', label: 'Space above' },
  { key: 'spacingBottom', label: 'Space below' },
] as const

function set<K extends keyof BlockStyle>(key: K, value: BlockStyle[K]) {
  actions.updateStyle(block.id, setStyleValue(block.style, breakpoint.value, key, value))
}

function reset(key: keyof BlockStyle) {
  if (breakpoint.value === 'desktop') return
  actions.updateStyle(block.id, resetStyleValue(block.style, breakpoint.value, key))
}

const overridden = (key: keyof BlockStyle) => isOverridden(block.style, breakpoint.value, key)
</script>

<template>
  <div class="space-y-5 p-4">
    <div class="space-y-1.5">
      <p class="text-[13px] font-medium text-fg">Breakpoint</p>
      <UiSegmented
        v-model="editor.breakpoint"
        size="sm"
        stretch
        label="Breakpoint"
        :options="breakpointOptions"
      />
      <p class="text-xs text-fg-muted">
        <template v-if="breakpoint === 'desktop'">
          Desktop values apply to every screen unless a smaller one overrides them.
        </template>
        <template v-else>
          Changes apply to {{ breakpointLabel }} and smaller. Untouched values are inherited.
        </template>
      </p>
    </div>

    <div v-for="item in spacingFields" :key="item.key" class="space-y-1.5">
      <div class="flex min-h-5 items-center justify-between gap-2">
        <p class="text-[13px] font-medium text-fg">{{ item.label }}</p>
        <button
          v-if="overridden(item.key)"
          type="button"
          class="inline-flex items-center gap-1 rounded text-xs text-accent hover:underline"
          :title="`Inherit from the larger breakpoint`"
          @click="reset(item.key)"
        >
          <RotateCcw class="size-3" aria-hidden="true" />
          Reset
        </button>
      </div>
      <UiSegmented
        size="sm"
        stretch
        :label="item.label"
        :options="spacingOptions"
        :model-value="resolved[item.key]"
        @update:model-value="set(item.key, $event)"
      />
    </div>

    <div class="space-y-1.5">
      <UiSwitch
        :label="`Hide on ${breakpointLabel}`"
        :hint="
          breakpoint === 'desktop'
            ? 'Hidden everywhere unless a smaller screen shows it.'
            : `Also applies to smaller screens.`
        "
        :model-value="resolved.hidden"
        @update:model-value="set('hidden', $event)"
      />
      <button
        v-if="overridden('hidden')"
        type="button"
        class="inline-flex items-center gap-1 text-xs text-accent hover:underline"
        @click="reset('hidden')"
      >
        <RotateCcw class="size-3" aria-hidden="true" />
        Reset visibility
      </button>
    </div>
  </div>
</template>
