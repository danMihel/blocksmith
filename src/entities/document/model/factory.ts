import type { BlockNode } from '@/entities/block'
import { DEFAULT_THEME, type PageTheme } from '@/entities/theme'
import { createId } from '@/shared/lib'
import { DOCUMENT_VERSION, type PageDocument } from './types'

export function createDocument({
  name,
  blocks = [],
  theme = DEFAULT_THEME,
}: {
  name: string
  blocks?: BlockNode[]
  theme?: PageTheme
}): PageDocument {
  const now = new Date().toISOString()
  return {
    version: DOCUMENT_VERSION,
    id: createId('page'),
    name,
    createdAt: now,
    updatedAt: now,
    theme: { ...theme },
    blocks,
  }
}

export function cloneDocument(document: PageDocument, name = document.name): PageDocument {
  const now = new Date().toISOString()
  return {
    ...structuredClone(document),
    id: createId('page'),
    name,
    createdAt: now,
    updatedAt: now,
  }
}
