import type { Plugin } from 'vue'
import {
  createIndexedDbRepository,
  createMemoryRepository,
  DOCUMENT_REPOSITORY_KEY,
} from '@/entities/document'

/** IndexedDB in the browser; in-memory where it's unavailable (some private modes, SSR, tests). */
export const documentRepository: Plugin = {
  install(app) {
    const repository =
      typeof indexedDB === 'undefined' ? createMemoryRepository() : createIndexedDbRepository()
    app.provide(DOCUMENT_REPOSITORY_KEY, repository)
  },
}
