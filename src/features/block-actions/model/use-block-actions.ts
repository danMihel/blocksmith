import {
  type BlockProps,
  type Breakpoint,
  createBlock,
  resolveStyle,
  type ResponsiveStyle,
  setStyleValue,
  useBlockRegistry,
} from '@/entities/block'
import {
  DuplicateBlockCommand,
  InsertBlockCommand,
  MoveBlockCommand,
  RemoveBlockCommand,
  UpdateBlockPropsCommand,
  UpdateBlockStyleCommand,
  useDocumentStore,
} from '@/entities/document'
import { useEditorStore } from '@/entities/editor'
import { createId } from '@/shared/lib'

/**
 * Every user-level operation on blocks, shared by the canvas, layers panel, library,
 * inspector, hotkeys and command palette. Builds commands with human-readable labels
 * ("Delete Pricing") and keeps the selection consistent.
 */
export function useBlockActions() {
  const registry = useBlockRegistry()
  const documentStore = useDocumentStore()
  const editor = useEditorStore()

  const nameOf = (id: string) => {
    const block = documentStore.getBlock(id)
    return block ? (registry.get(block.type)?.meta.name ?? block.type) : 'block'
  }

  /** New blocks go after the selected one, or to the end. */
  function insertionIndex(): number {
    const selected = editor.selectedBlockId
    const index = selected ? documentStore.indexOf(selected) : -1
    return index === -1 ? documentStore.blocks.length : index + 1
  }

  function addBlock(type: string, index = insertionIndex()) {
    const definition = registry.get(type)
    if (!definition) return
    const block = createBlock(definition)
    documentStore.execute(new InsertBlockCommand(block, index, `Add ${definition.meta.name}`))
    editor.select(block.id)
  }

  function removeBlock(id: string) {
    const index = documentStore.indexOf(id)
    if (index === -1) return
    documentStore.execute(new RemoveBlockCommand(id, `Delete ${nameOf(id)}`))
    if (editor.selectedBlockId === id) {
      const neighbour = documentStore.blocks[index] ?? documentStore.blocks[index - 1]
      editor.select(neighbour?.id ?? null)
    }
  }

  function duplicateBlock(id: string) {
    const copyId = createId('blk')
    if (documentStore.execute(new DuplicateBlockCommand(id, copyId, `Duplicate ${nameOf(id)}`))) {
      editor.select(copyId)
    }
  }

  function moveBlock(id: string, toIndex: number) {
    documentStore.execute(new MoveBlockCommand(id, toIndex, `Move ${nameOf(id)}`))
  }

  function moveBy(id: string, delta: number) {
    const index = documentStore.indexOf(id)
    if (index !== -1) moveBlock(id, index + delta)
  }

  function updateProps(id: string, patch: BlockProps) {
    documentStore.execute(new UpdateBlockPropsCommand(id, patch, `Edit ${nameOf(id)}`))
  }

  function updateStyle(id: string, style: ResponsiveStyle) {
    documentStore.execute(new UpdateBlockStyleCommand(id, style, `Edit ${nameOf(id)} style`))
  }

  function toggleHidden(id: string, breakpoint: Breakpoint) {
    const block = documentStore.getBlock(id)
    if (!block) return
    const hidden = resolveStyle(block.style, breakpoint).hidden
    documentStore.execute(
      new UpdateBlockStyleCommand(
        id,
        setStyleValue(block.style, breakpoint, 'hidden', !hidden),
        `${hidden ? 'Show' : 'Hide'} ${nameOf(id)}`,
      ),
    )
  }

  return {
    nameOf,
    addBlock,
    removeBlock,
    duplicateBlock,
    moveBlock,
    moveBy,
    updateProps,
    updateStyle,
    toggleHidden,
  }
}
