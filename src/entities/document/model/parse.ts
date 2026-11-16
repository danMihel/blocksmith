import { z } from 'zod'
import { type BlockNode, type BlockRegistry, responsiveStyleSchema } from '@/entities/block'
import { pageThemeSchema } from '@/entities/theme'
import { migrateDocument } from './migrations'
import { DOCUMENT_VERSION, type PageDocument } from './types'

const blockNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
  style: responsiveStyleSchema,
}) satisfies z.ZodType<BlockNode>

const pageDocumentSchema = z.object({
  version: z.literal(DOCUMENT_VERSION, {
    error: `Unsupported document version (expected ${DOCUMENT_VERSION})`,
  }),
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  theme: pageThemeSchema,
  blocks: z.array(blockNodeSchema).superRefine((blocks, ctx) => {
    const seen = new Set<string>()
    blocks.forEach((block, index) => {
      if (seen.has(block.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate block id "${block.id}"`,
          path: [index, 'id'],
        })
      }
      seen.add(block.id)
    })
  }),
}) satisfies z.ZodType<PageDocument>

export type DocumentIssue = {
  path: string
  message: string
  blockId?: string
}

export type ParseResult =
  | { ok: true; document: PageDocument; issues: DocumentIssue[] }
  | { ok: false; issues: DocumentIssue[] }

const toPath = (path: readonly PropertyKey[]) => path.map(String).join('.')

export function parseDocument(input: unknown, registry: BlockRegistry): ParseResult {
  const structure = pageDocumentSchema.safeParse(migrateDocument(input))
  if (!structure.success) {
    return {
      ok: false,
      issues: structure.error.issues.map((issue) => ({
        path: toPath(issue.path),
        message: issue.message,
      })),
    }
  }

  const document = structure.data
  const issues: DocumentIssue[] = []

  document.blocks.forEach((block, index) => {
    const definition = registry.get(block.type)

    if (!definition) {
      issues.push({
        path: `blocks.${index}.type`,
        message: `Unknown block type "${block.type}"`,
        blockId: block.id,
      })
      return
    }

    const props = definition.schema.safeParse(block.props)
    if (!props.success) {
      issues.push(
        ...props.error.issues.map((issue) => ({
          path: toPath(['blocks', index, 'props', ...issue.path]),
          message: issue.message,
          blockId: block.id,
        })),
      )
    }
  })

  return { ok: true, document, issues }
}
