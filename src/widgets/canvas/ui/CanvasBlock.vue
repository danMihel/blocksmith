<script setup lang="ts">
import { ArrowDown, ArrowUp, Copy, EyeOff, GripVertical, Puzzle, Trash2 } from '@lucide/vue'
import { computed } from 'vue'
import {
  BREAKPOINT_META,
  type BlockNode,
  PageBlock,
  resolveStyle,
  useBlockRegistry,
} from '@/entities/block'
import { useEditorStore } from '@/entities/editor'
import { useBlockActions } from '@/features/block-actions'
import { startDrag } from '@/features/drag-drop'
import { cn } from '@/shared/lib'
import { UiIconButton } from '@/shared/ui'

const { block, index, count, selected, hovered } = defineProps<{
  block: BlockNode
  index: number
  count: number
  selected: boolean
  hovered: boolean
}>()

const registry = useBlockRegistry()
const editor = useEditorStore()
const actions = useBlockActions()

const definition = computed(() => registry.get(block.type))
const name = computed(() => definition.value?.meta.name ?? block.type)
const hidden = computed(() => resolveStyle(block.style, editor.breakpoint).hidden)

function onHandlePointerDown(event: PointerEvent) {
  startDrag(event, {
    kind: 'move',
    blockId: block.id,
    label: name.value,
    icon: definition.value?.meta.icon ?? Puzzle,
  })
}
</script>

<template>
  <div
    data-drop-item
    :data-block-id="block.id"
    role="group"
    tabindex="0"
    :aria-label="`${name} block`"
    :aria-current="selected || undefined"
    class="group/block relative outline-none"
    @click="editor.select(block.id)"
    @keydown.enter.self.prevent="editor.select(block.id)"
    @pointerenter="editor.hover(block.id)"
    @pointerleave="editor.hover(null)"
  >
    <!-- `inert`: the page content is not interactive in the editor (links, focus, menus) -->
    <PageBlock :block inert />

    <!-- Hidden at the current breakpoint: keep a slim placeholder so it stays reachable -->
    <div
      v-if="hidden"
      class="flex h-9 items-center justify-center gap-2 border-y border-dashed border-line bg-surface-muted/60 font-sans text-xs text-fg-muted"
    >
      <EyeOff class="size-3.5" aria-hidden="true" />
      {{ name }} is hidden on {{ BREAKPOINT_META[editor.breakpoint].label }}
    </div>

    <!-- Selection chrome uses editor tokens, never the page theme -->
    <div
      aria-hidden="true"
      :class="
        cn(
          'pointer-events-none absolute inset-0 z-10 transition-shadow duration-100',
          selected
            ? 'shadow-[inset_0_0_0_2px_var(--app-accent)]'
            : hovered
              ? 'shadow-[inset_0_0_0_1px_var(--app-accent)]'
              : 'group-focus-visible/block:shadow-[inset_0_0_0_2px_var(--app-ring)]',
        )
      "
    />
    <span
      v-if="selected || hovered"
      class="pointer-events-none absolute top-0 left-0 z-20 rounded-br-md bg-accent px-2 py-0.5 font-sans text-[11px] font-medium text-accent-fg"
      aria-hidden="true"
    >
      {{ name }}
    </span>

    <div
      v-if="selected"
      role="toolbar"
      :aria-label="`${name} actions`"
      class="absolute top-2 right-2 z-20 flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5 font-sans text-fg shadow-lg"
      @click.stop
    >
      <button
        type="button"
        class="grid size-8 cursor-grab touch-none place-items-center rounded-md text-fg-muted hover:bg-surface-muted hover:text-fg"
        :aria-label="`Drag ${name} to reorder`"
        title="Drag to reorder"
        @pointerdown="onHandlePointerDown"
      >
        <GripVertical class="size-4" />
      </button>
      <UiIconButton
        size="sm"
        label="Move up"
        :disabled="index === 0"
        @click="actions.moveBy(block.id, -1)"
      >
        <ArrowUp />
      </UiIconButton>
      <UiIconButton
        size="sm"
        label="Move down"
        :disabled="index === count - 1"
        @click="actions.moveBy(block.id, 1)"
      >
        <ArrowDown />
      </UiIconButton>
      <UiIconButton size="sm" label="Duplicate" @click="actions.duplicateBlock(block.id)">
        <Copy />
      </UiIconButton>
      <UiIconButton size="sm" label="Delete" @click="actions.removeBlock(block.id)">
        <Trash2 />
      </UiIconButton>
    </div>
  </div>
</template>
