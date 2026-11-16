import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Breakpoint } from '@/entities/block'

/**
 * Transient state of the editing session: what is selected, hovered and previewed.
 * Deliberately separate from the document — none of it is saved or undoable.
 */
export const useEditorStore = defineStore('editor', () => {
  const selectedBlockId = ref<string | null>(null)
  const hoveredBlockId = ref<string | null>(null)
  const breakpoint = ref<Breakpoint>('desktop')

  function select(id: string | null) {
    selectedBlockId.value = id
  }

  function hover(id: string | null) {
    hoveredBlockId.value = id
  }

  function reset() {
    selectedBlockId.value = null
    hoveredBlockId.value = null
    breakpoint.value = 'desktop'
  }

  return { selectedBlockId, hoveredBlockId, breakpoint, select, hover, reset }
})
