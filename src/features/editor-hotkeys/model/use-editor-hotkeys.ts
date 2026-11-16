import { useEventListener } from '@vueuse/core'
import { isEditableTarget } from '@/shared/lib'

export type EditorHotkeyHandlers = {
  undo: () => void
  redo: () => void
  openPalette: () => void
  removeSelected: () => void
  duplicateSelected: () => void
  moveSelected: (delta: -1 | 1) => void
  deselect: () => void
}

/**
 * Global editor shortcuts. Text-editing keys (Delete, Backspace…) are ignored while
 * the user types in a field; undo/redo always go to the document history, because
 * every field is bound to the document anyway.
 */
export function useEditorHotkeys(handlers: EditorHotkeyHandlers) {
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing) return

    const mod = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()

    if (mod && key === 'k') {
      event.preventDefault()
      handlers.openPalette()
      return
    }
    if (mod && key === 'z') {
      event.preventDefault()
      if (event.shiftKey) handlers.redo()
      else handlers.undo()
      return
    }
    if (mod && key === 'y') {
      event.preventDefault()
      handlers.redo()
      return
    }

    if (isEditableTarget(event.target)) return
    // Native dialogs handle their own keys.
    if (event.target instanceof Element && event.target.closest('dialog[open]')) return

    if (mod && key === 'd') {
      event.preventDefault()
      handlers.duplicateSelected()
    } else if (key === 'delete' || key === 'backspace') {
      event.preventDefault()
      handlers.removeSelected()
    } else if (event.altKey && (key === 'arrowup' || key === 'arrowdown')) {
      event.preventDefault()
      handlers.moveSelected(key === 'arrowup' ? -1 : 1)
    } else if (key === 'escape') {
      handlers.deselect()
    }
  })
}
