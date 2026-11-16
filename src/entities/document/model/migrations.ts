import { DEFAULT_BLOCK_STYLE } from '@/entities/block'
import { DEFAULT_THEME } from '@/entities/theme'
import { DOCUMENT_VERSION } from './types'

type RawDocument = Record<string, unknown> & { version: number }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Each migration upgrades a document by exactly one version.
 * They work on raw data and must never throw: validation happens afterwards.
 */
const MIGRATIONS: Record<number, (doc: RawDocument) => RawDocument> = {
  // v1 → v2: page themes and responsive block styles.
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

/** Brings a document of any older version up to the current one. Unknown input is returned as is. */
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
