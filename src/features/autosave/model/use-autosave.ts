import { useEventListener } from '@vueuse/core'
import { onScopeDispose, ref, watch } from 'vue'
import { type PageDocument, useDocumentRepository, useDocumentStore } from '@/entities/document'
import { toast } from '@/shared/ui'

export type SaveStatus = 'saved' | 'pending' | 'saving' | 'error'

/**
 * Saves the open document after a short pause in editing.
 * Thanks to the immutable document, "has it changed since the last save?" is a reference
 * comparison. Pending changes are flushed when the page is hidden or the editor unmounts.
 */
export function useAutosave({ delay = 700 }: { delay?: number } = {}) {
  const repository = useDocumentRepository()
  const store = useDocumentStore()

  const status = ref<SaveStatus>('saved')
  let lastSaved: PageDocument | null = store.document
  let timer: ReturnType<typeof setTimeout> | undefined
  let inFlight: Promise<void> | null = null

  async function flush(): Promise<void> {
    clearTimeout(timer)
    if (inFlight) await inFlight

    const doc = store.document
    if (!doc || doc === lastSaved) {
      if (status.value === 'pending') status.value = 'saved'
      return
    }

    status.value = 'saving'
    inFlight = repository
      .save(doc)
      .then(() => {
        lastSaved = doc
        status.value = store.document === doc ? 'saved' : 'pending'
      })
      .catch((error: unknown) => {
        status.value = 'error'
        console.error('[autosave]', error)
        toast({ tone: 'error', title: 'Couldn’t save the page', description: String(error) })
      })
      .finally(() => (inFlight = null))
    await inFlight
  }

  watch(
    () => store.document,
    (doc, previous) => {
      // Opening another document is not an edit.
      if (!doc || !previous || doc.id !== previous.id) {
        lastSaved = doc
        status.value = 'saved'
        return
      }
      status.value = 'pending'
      clearTimeout(timer)
      timer = setTimeout(() => void flush(), delay)
    },
  )

  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush()
  })
  useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
    if (status.value === 'saved') return
    void flush()
    event.preventDefault()
  })
  onScopeDispose(() => void flush())

  return { status, flush }
}
