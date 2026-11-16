import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'
import type { BlockNode } from '@/entities/block'
import type { Command } from './commands'
import type { PageDocument } from './types'

const HISTORY_LIMIT = 100

/**
 * Holds the document being edited and its undo/redo history.
 *
 * The document is immutable and kept in a `shallowRef`: every change produces a new object.
 * Changes are cheap to detect, and snapshots are free for autosave and thumbnails.
 * All mutations go through `execute(command)` — there is no other way to change the document.
 */
export const useDocumentStore = defineStore('document', () => {
  const document = shallowRef<PageDocument | null>(null)
  const past = shallowRef<readonly Command[]>([])
  const future = shallowRef<readonly Command[]>([])
  /** Merging is only allowed right after another execute — never across undo/redo. */
  let canMerge = false

  const blocks = computed<readonly BlockNode[]>(() => document.value?.blocks ?? [])
  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)
  const undoLabel = computed(() => past.value.at(-1)?.label)
  const redoLabel = computed(() => future.value.at(-1)?.label)

  const touch = (doc: PageDocument): PageDocument => ({
    ...doc,
    updatedAt: new Date().toISOString(),
  })

  function reset(doc: PageDocument | null) {
    document.value = doc
    past.value = []
    future.value = []
    canMerge = false
  }

  const open = (doc: PageDocument) => reset(doc)
  const close = () => reset(null)

  /** Applies a command. Returns false if it changed nothing (and records nothing). */
  function execute(command: Command): boolean {
    const current = document.value
    if (!current) return false

    const next = command.execute(current)
    if (next === current) return false

    const last = past.value.at(-1)
    const merged = canMerge && last?.merge ? last.merge(command) : null
    past.value = merged
      ? [...past.value.slice(0, -1), merged]
      : [...past.value, command].slice(-HISTORY_LIMIT)
    future.value = []
    canMerge = true
    document.value = touch(next)
    return true
  }

  function undo() {
    const command = past.value.at(-1)
    if (!command || !document.value) return
    document.value = touch(command.undo(document.value))
    past.value = past.value.slice(0, -1)
    future.value = [...future.value, command]
    canMerge = false
  }

  function redo() {
    const command = future.value.at(-1)
    if (!command || !document.value) return
    document.value = touch(command.execute(document.value))
    future.value = future.value.slice(0, -1)
    past.value = [...past.value, command]
    canMerge = false
  }

  function getBlock(id: string): BlockNode | undefined {
    return blocks.value.find((b) => b.id === id)
  }

  function indexOf(id: string): number {
    return blocks.value.findIndex((b) => b.id === id)
  }

  return {
    document,
    blocks,
    canUndo,
    canRedo,
    undoLabel,
    redoLabel,
    open,
    close,
    execute,
    undo,
    redo,
    getBlock,
    indexOf,
  }
})
