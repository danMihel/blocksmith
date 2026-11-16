import type { BlockNode } from '@/entities/block'
import type { PageTheme } from '@/entities/theme'

/** Bumped on every breaking change of the document shape; old documents go through migrations. */
export const DOCUMENT_VERSION = 2

/** A landing page: a serializable JSON document, the single source of truth for the editor. */
export type PageDocument = {
  version: typeof DOCUMENT_VERSION
  id: string
  name: string
  /** ISO 8601 */
  createdAt: string
  /** ISO 8601 */
  updatedAt: string
  theme: PageTheme
  blocks: BlockNode[]
}
