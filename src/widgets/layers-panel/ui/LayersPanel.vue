<script setup lang="ts">
import { Eye, EyeOff, GripVertical, Layers, Puzzle } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import { BREAKPOINT_META, type BlockNode, resolveStyle, useBlockRegistry } from '@/entities/block'
import { useDocumentStore } from '@/entities/document'
import { useEditorStore } from '@/entities/editor'
import { useBlockActions } from '@/features/block-actions'
import {
  type DragPayload,
  DropIndicator,
  startDrag,
  toMoveIndex,
  useDropList,
} from '@/features/drag-drop'
import { cn } from '@/shared/lib'
import { focusRing, UiIconButton } from '@/shared/ui'

const registry = useBlockRegistry()
const documentStore = useDocumentStore()
const editor = useEditorStore()
const actions = useBlockActions()
const { blocks } = storeToRefs(documentStore)

const list = useTemplateRef<HTMLElement>('list')

useDropList('layers', list, {
  onDrop(payload: DragPayload, index: number) {
    if (payload.kind === 'new') return actions.addBlock(payload.blockType, index)
    const from = documentStore.indexOf(payload.blockId)
    if (from !== -1) actions.moveBlock(payload.blockId, toMoveIndex(from, index))
  },
})

const definitionOf = (block: BlockNode) => registry.get(block.type)
const nameOf = (block: BlockNode) => definitionOf(block)?.meta.name ?? block.type

/** A recognizable hint next to the block name: its title, brand or first question. */
function summaryOf(block: BlockNode): string {
  for (const key of ['title', 'brand', 'eyebrow']) {
    const value = block.props[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return ''
}

const isHidden = (block: BlockNode) => resolveStyle(block.style, editor.breakpoint).hidden

function onHandlePointerDown(event: PointerEvent, block: BlockNode) {
  startDrag(event, {
    kind: 'move',
    blockId: block.id,
    label: nameOf(block),
    icon: definitionOf(block)?.meta.icon ?? Puzzle,
  })
}
</script>

<template>
  <div class="p-2">
    <div v-if="!blocks.length" class="px-4 py-10 text-center">
      <Layers class="mx-auto size-6 text-fg-muted" aria-hidden="true" />
      <p class="mt-3 text-sm text-fg-muted">No blocks yet. Add one from the library.</p>
    </div>

    <div ref="list" class="relative">
      <ol class="space-y-0.5" aria-label="Page layers">
        <li
          v-for="block in blocks"
          :key="block.id"
          data-drop-item
          :class="
            cn(
              'group flex items-center gap-1 rounded-lg pr-1 transition-colors',
              block.id === editor.selectedBlockId
                ? 'bg-accent-soft'
                : block.id === editor.hoveredBlockId
                  ? 'bg-surface-muted'
                  : 'hover:bg-surface-muted',
            )
          "
          @pointerenter="editor.hover(block.id)"
          @pointerleave="editor.hover(null)"
        >
          <button
            type="button"
            class="grid h-9 w-6 shrink-0 cursor-grab touch-none place-items-center text-fg-muted opacity-40 group-hover:opacity-100"
            :aria-label="`Drag ${nameOf(block)} to reorder`"
            @pointerdown="onHandlePointerDown($event, block)"
          >
            <GripVertical class="size-3.5" />
          </button>

          <button
            type="button"
            :class="[
              'flex min-w-0 flex-1 items-center gap-2 rounded-md py-2 text-left',
              focusRing,
              'focus-visible:ring-offset-0',
              isHidden(block) && 'opacity-50',
            ]"
            :aria-current="block.id === editor.selectedBlockId || undefined"
            @click="editor.select(block.id)"
          >
            <component
              :is="definitionOf(block)?.meta.icon ?? Puzzle"
              :class="[
                'size-4 shrink-0',
                block.id === editor.selectedBlockId ? 'text-accent' : 'text-fg-muted',
              ]"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate text-[13px]">
              <span class="font-medium text-fg">{{ nameOf(block) }}</span>
              <span v-if="summaryOf(block)" class="text-fg-muted"> · {{ summaryOf(block) }}</span>
            </span>
          </button>

          <UiIconButton
            size="sm"
            :label="`${isHidden(block) ? 'Show' : 'Hide'} on ${BREAKPOINT_META[editor.breakpoint].label}`"
            :class="
              isHidden(block) ? '' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
            "
            @click="actions.toggleHidden(block.id, editor.breakpoint)"
          >
            <EyeOff v-if="isHidden(block)" />
            <Eye v-else />
          </UiIconButton>
        </li>
      </ol>
      <DropIndicator list-id="layers" />
    </div>
  </div>
</template>
