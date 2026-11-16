export const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

const LABELS: Record<string, string> = isMac
  ? { mod: '⌘', shift: '⇧', alt: '⌥', enter: '↵', backspace: '⌫', delete: '⌦' }
  : {
      mod: 'Ctrl',
      shift: 'Shift',
      alt: 'Alt',
      enter: 'Enter',
      backspace: 'Backspace',
      delete: 'Del',
    }

/** `['mod', 'z']` → `['⌘', 'Z']` on macOS, `['Ctrl', 'Z']` elsewhere. */
export function shortcutKeys(keys: readonly string[]): string[] {
  return keys.map((key) => LABELS[key] ?? (key.length === 1 ? key.toUpperCase() : key))
}

/** True when the event target is a place where the user is typing text. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true
  return (
    target instanceof HTMLInputElement &&
    !['button', 'checkbox', 'radio', 'color', 'range', 'submit'].includes(target.type)
  )
}
