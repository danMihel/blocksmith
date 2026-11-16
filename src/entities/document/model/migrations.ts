import { DEFAULT_BLOCK_STYLE } from '@/entities/block'
import { DEFAULT_THEME } from '@/entities/theme'
import { DOCUMENT_VERSION } from './types'

type RawDocument = Record<string, unknown> & { version: number }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const MIGRATIONS: Record<number, (doc: RawDocument) => RawDocument> = {
  1: (doc) => ({
    ...doc,
    version: 2,
    theme: DEFAULT_THEME,
    blocks: Array.isArray(doc.blocks)
      ? doc.blocks.map((block) =>
          isObject(block) ? { ...block, style: { desktop: DEFAULT_BLOCK_STYLE } } : block,
        )
      : doc.blocks,
  }),
}

export function migrateDocument(input: unknown): unknown {
  if (!isObject(input) || typeof input.version !== 'number') return input

  let doc = input as RawDocument
  while (doc.version < DOCUMENT_VERSION) {
    const migrate = MIGRATIONS[doc.version]
    if (!migrate) break
    doc = migrate(doc)
  }
  return doc
}
