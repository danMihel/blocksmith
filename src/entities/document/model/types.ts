import type { BlockNode } from '@/entities/block'
import type { PageTheme } from '@/entities/theme'

export const DOCUMENT_VERSION = 2

export type PageDocument = {
  version: typeof DOCUMENT_VERSION
  id: string
  name: string
  createdAt: string
  updatedAt: string
  theme: PageTheme
  blocks: BlockNode[]
}
