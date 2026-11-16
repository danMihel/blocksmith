<script setup lang="ts">
import { MousePointerClick } from '@lucide/vue'
import { useElementSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, nextTick, useTemplateRef, watch } from 'vue'
import { BREAKPOINT_META } from '@/entities/block'
import { PageRenderer, useDocumentStore } from '@/entities/document'
import { useEditorStore } from '@/entities/editor'
import { useBlockActions } from '@/features/block-actions'
import {
  type DragPayload,
  dragState,
  DropIndicator,
  toMoveIndex,
  useDropList,
} from '@/features/drag-drop'
import CanvasBlock from './CanvasBlock.vue'

const documentStore = useDocumentStore()
const editor = useEditorStore()
const actions = useBlockActions()
const { document } = storeToRefs(documentStore)
const { selectedBlockId, hoveredBlockId, breakpoint } = storeToRefs(editor)

const frameWidth = computed(() => BREAKPOINT_META[breakpoint.value].frameWidth)

// On narrow screens the frame can't reach the device width: say so instead of pretending.
const frame = useTemplateRef<HTMLElement>('frame')
const { width: actualWidth } = useElementSize(frame, undefined, { box: 'border-box' })
const frameLabel = computed(() => {
  const label = BREAKPOINT_META[breakpoint.value].label
  const actual = Math.round(actualWidth.value)
  return actual > 0 && actual < frameWidth.value - 2
    ? `${label} · ${actual} of ${frameWidth.value}px`
    : `${label} · ${frameWidth.value}px`
})

const list = useTemplateRef<HTMLElement>('list')

useDropList('canvas', list, { onDrop })

function onDrop(payload: DragPayload, index: number) {
  if (payload.kind === 'new') {
    actions.addBlock(payload.blockType, index)
    return
  }
  const from = documentStore.indexOf(payload.blockId)
  if (from === -1) return
  actions.moveBlock(payload.blockId, toMoveIndex(from, index))
  editor.select(payload.blockId)
}

// Keep the selected block in view: after adding, undoing, picking it in layers or the palette.
watch(selectedBlockId, async (id) => {
  if (!id) return
  await nextTick()
  list.value
    ?.querySelector(`[data-block-id="${CSS.escape(id)}"]`)
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
})
</script>

<template>
  <div
    class="h-full overflow-auto bg-bg bg-[radial-gradient(var(--app-line)_1px,transparent_1px)] bg-size-[20px_20px] px-3 py-5 sm:px-8 sm:py-8"
    data-autoscroll
    @click.self="editor.select(null)"
  >
    <p class="mb-3 text-center text-xs font-medium text-fg-muted tabular-nums">
      {{ frameLabel }}
    </p>

    <div
      ref="frame"
      class="mx-auto overflow-clip rounded-xl border border-line shadow-xl shadow-black/5 transition-[max-width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] dark:shadow-black/40"
      :style="{ maxWidth: `${frameWidth}px` }"
    >
      <div ref="list" class="relative">
        <PageRenderer
          v-if="document"
          class="min-h-[70vh]"
          :blocks="document.blocks"
          :theme="document.theme"
        >
          <template #block="{ block, index }">
            <CanvasBlock
              :block
              :index
              :count="document.blocks.length"
              :selected="block.id === selectedBlockId"
              :hovered="block.id === hoveredBlockId && !dragState.payload"
            />
          </template>
        </PageRenderer>

        <div
          v-if="document && document.blocks.length === 0"
          class="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center font-sans"
        >
          <div class="max-w-xs">
            <span
              class="mx-auto grid size-12 place-items-center rounded-xl bg-accent-soft text-accent"
            >
              <MousePointerClick class="size-6" aria-hidden="true" />
            </span>
            <p class="mt-4 text-sm font-medium text-fg">This page is empty</p>
            <p class="mt-1 text-sm text-fg-muted">
              Drag a block here from the library, or click one to add it.
            </p>
          </div>
        </div>

        <DropIndicator list-id="canvas" />
      </div>
    </div>
  </div>
</template>
