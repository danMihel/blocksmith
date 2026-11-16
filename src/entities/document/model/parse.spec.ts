import { Box } from '@lucide/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import { BlockRegistry, DEFAULT_BLOCK_STYLE, defineBlock } from '@/entities/block'
import { DEFAULT_THEME } from '@/entities/theme'
import { parseDocument } from './parse'
import { DOCUMENT_VERSION } from './types'

const registry = new BlockRegistry([
  defineBlock({
    type: 'text',
    meta: { name: 'Text', description: '', category: 'content', icon: Box },
    schema: z.object({ text: z.string().min(1) }),
    defaults: () => ({ text: 'Hi' }),
    fields: [],
    component: defineComponent({ render: () => null }),
  }),
])

const style = { desktop: DEFAULT_BLOCK_STYLE }

const validDocument = () => ({
  version: DOCUMENT_VERSION,
  id: 'page_1',
  name: 'Landing',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  theme: DEFAULT_THEME,
  blocks: [{ id: 'blk_1', type: 'text', props: { text: 'Hello' }, style }],
})

describe('parseDocument', () => {
  it('accepts a valid document without issues', () => {
    const result = parseDocument(validDocument(), registry)

    expect(result).toEqual({ ok: true, document: validDocument(), issues: [] })
  })

  it('migrates a v1 document', () => {
    const { theme: _theme, ...v2 } = validDocument()
    const v1 = { ...v2, version: 1, blocks: [{ id: 'blk_1', type: 'text', props: { text: 'Hi' } }] }

    const result = parseDocument(v1, registry)

    expect(result.ok).toBe(true)
    expect(result.ok && result.document.theme).toEqual(DEFAULT_THEME)
    expect(result.ok && result.document.blocks[0]?.style).toEqual(style)
  })

  it('rejects a structurally broken document', () => {
    const result = parseDocument({ ...validDocument(), version: 99, blocks: 'nope' }, registry)

    expect(result.ok).toBe(false)
    expect(result.issues.map((i) => i.path)).toEqual(['version', 'blocks'])
  })

  it('rejects duplicate block ids', () => {
    const doc = validDocument()
    doc.blocks.push({ ...doc.blocks[0]! })

    const result = parseDocument(doc, registry)

    expect(result.ok).toBe(false)
    expect(result.issues).toEqual([{ path: 'blocks.1.id', message: 'Duplicate block id "blk_1"' }])
  })

  it('keeps the document usable but reports unknown blocks and invalid props', () => {
    const doc = validDocument()
    doc.blocks.push(
      { id: 'blk_2', type: 'video', props: {} as never, style },
      { id: 'blk_3', type: 'text', props: { text: '' }, style },
    )

    const result = parseDocument(doc, registry)

    expect(result.ok).toBe(true)
    expect(result.issues).toEqual([
      { path: 'blocks.1.type', message: 'Unknown block type "video"', blockId: 'blk_2' },
      { path: 'blocks.2.props.text', message: expect.any(String), blockId: 'blk_3' },
    ])
  })
})
