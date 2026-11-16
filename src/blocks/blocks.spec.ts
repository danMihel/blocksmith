import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { type AnyField, BLOCK_REGISTRY_KEY, BlockRegistry, createBlock } from '@/entities/block'
import { PageRenderer, parseDocument } from '@/entities/document'
import { blockDefinitions } from './index'
import { PAGE_TEMPLATES } from './templates'

function checkFields(fields: AnyField[], sample: Record<string, unknown>, path: string): string[] {
  return fields.flatMap((field) => {
    const at = `${path}.${field.key}`
    if (!(field.key in sample)) return [`${at} is not a prop`]
    if (field.control !== 'list') return []
    const items = sample[field.key]
    if (!Array.isArray(items)) return [`${at} is not an array`]
    const item = field.createItem()
    if (typeof item !== 'object' || item === null) return []
    return checkFields(field.fields, item as Record<string, unknown>, `${at}[]`)
  })
}

describe.each(blockDefinitions.map((d) => [d.type, d] as const))('block "%s"', (_, definition) => {
  it('has defaults that pass its own schema', () => {
    const result = definition.schema.safeParse(definition.defaults())

    expect(result.error?.issues ?? []).toEqual([])
  })

  it('has inspector fields that point to real props', () => {
    expect(checkFields(definition.fields, definition.defaults(), definition.type)).toEqual([])
  })

  it('creates list items that keep the block valid', () => {
    const props = definition.defaults()
    for (const field of definition.fields) {
      if (field.control !== 'list') continue
      const items = props[field.key] as unknown[]
      props[field.key] = [...items, field.createItem()].slice(0, field.max ?? Infinity)
    }

    expect(definition.schema.safeParse(props).error?.issues ?? []).toEqual([])
  })

  it('renders with default props', () => {
    const block = createBlock(definition)
    const wrapper = mount(definition.component, { props: block.props })

    expect(wrapper.html()).not.toBe('')
  })
})

describe.each(PAGE_TEMPLATES.map((t) => [t.id, t] as const))('template "%s"', (_, template) => {
  const registry = new BlockRegistry(blockDefinitions)

  it('creates a valid document', () => {
    const result = parseDocument(template.create(), registry)

    expect(result.ok && result.issues).toEqual([])
  })

  it('creates fresh ids on every call', () => {
    const a = template.create().blocks.map((b) => b.id)
    const b = template.create().blocks.map((b) => b.id)

    expect(a.some((id) => b.includes(id))).toBe(false)
  })

  it('survives a JSON round trip', () => {
    const document = template.create()

    expect(JSON.parse(JSON.stringify(document))).toEqual(document)
  })

  it('renders every block', () => {
    const document = template.create()
    const wrapper = mount(PageRenderer, {
      props: { blocks: document.blocks, theme: document.theme },
      global: { provide: { [BLOCK_REGISTRY_KEY]: registry } },
    })

    expect(wrapper.findAll('.page-block')).toHaveLength(document.blocks.length)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })
})
