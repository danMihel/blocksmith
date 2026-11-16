import { createStore, del, get, set, values } from 'idb-keyval'
import { inject, type InjectionKey } from 'vue'
import type { PageDocument } from '../model/types'

export interface DocumentRepository {
  list(): Promise<unknown[]>
  get(id: string): Promise<unknown>
  save(document: PageDocument): Promise<void>
  remove(id: string): Promise<void>
}

const toJson = (document: PageDocument): PageDocument => JSON.parse(JSON.stringify(document))

export function createIndexedDbRepository(): DocumentRepository {
  const store = createStore('blocksmith', 'documents')
  return {
    list: () => values(store),
    get: (id) => get(id, store),
    save: (document) => set(document.id, toJson(document), store),
    remove: (id) => del(id, store),
  }
}

export function createMemoryRepository(initial: PageDocument[] = []): DocumentRepository {
  const items = new Map(initial.map((doc) => [doc.id, toJson(doc)]))
  return {
    list: async () => [...items.values()],
    get: async (id) => items.get(id),
    save: async (document) => void items.set(document.id, toJson(document)),
    remove: async (id) => void items.delete(id),
  }
}

export const DOCUMENT_REPOSITORY_KEY: InjectionKey<DocumentRepository> =
  Symbol('DocumentRepository')

export function useDocumentRepository(): DocumentRepository {
  const repository = inject(DOCUMENT_REPOSITORY_KEY, null)
  if (!repository) {
    throw new Error(
      'Document repository is not provided. Install it in the app (see app/providers).',
    )
  }
  return repository
}
