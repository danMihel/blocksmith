import { Box } from '@lucide/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import { createBlock, defineBlock } from './define-block'
import { BlockRegistry } from './registry'
import type { BlockCategory } from './types'

const makeDefinition = (type: string, category: BlockCategory = 'content') =>
  defineBlock({
    type,
    meta: { name: type, description: '', category, icon: Box },
    schema: z.object({ title: z.string(), tags: z.array(z.string()) }),
    defaults: () => ({ title: 'Default', tags: ['a'] }),
    fields: [{ key: 'title', control: 'text', label: 'Title' }],
    component: defineComponent({ render: () => null }),
  })

describe('BlockRegistry', () => {
  it('registers and looks up definitions', () => {
    const hero = makeDefinition('hero')
    const registry = new BlockRegistry([hero])

    expect(registry.has('hero')).toBe(true)
    expect(registry.get('hero')).toBe(hero)
    expect(registry.get('missing')).toBeUndefined()
  })

  it('rejects duplicate types', () => {
    const registry = new BlockRegistry([makeDefinition('hero')])

    expect(() => registry.register(makeDefinition('hero'))).toThrow(/already registered/)
  })

  it('groups definitions by category in registration order', () => {
    const registry = new BlockRegistry([
      makeDefinition('hero', 'header'),
      makeDefinition('features'),
      makeDefinition('faq'),
    ])

    const groups = registry.groupByCategory()

    expect([...groups.keys()]).toEqual(['header', 'content'])
    expect(groups.get('content')?.map((d) => d.type)).toEqual(['features', 'faq'])
  })
})

describe('createBlock', () => {
  it('creates an instance with default props and applies overrides', () => {
    const block = createBlock(makeDefinition('hero'), { title: 'Custom' })

    expect(block).toMatchObject({ type: 'hero', props: { title: 'Custom', tags: ['a'] } })
    expect(block.id).toMatch(/^blk_[a-z0-9]{12}$/)
  })

  it('never shares nested defaults between instances', () => {
    const definition = makeDefinition('hero')
    const a = createBlock(definition)
    const b = createBlock(definition)

    a.props.tags.push('mutated')

    expect(b.props.tags).toEqual(['a'])
    expect(a.id).not.toBe(b.id)
  })
})
