import { Box } from '@lucide/vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { z } from 'zod'
import { defineBlock } from '../model/define-block'
import { BLOCK_REGISTRY_KEY, BlockRegistry } from '../model/registry'
import { DEFAULT_BLOCK_STYLE } from '../model/styles'
import type { BlockNode } from '../model/types'
import BlockRenderer from './BlockRenderer.vue'

const style = { desktop: DEFAULT_BLOCK_STYLE }
const meta = { name: 'Test', description: '', category: 'content', icon: Box } as const

const textBlock = defineBlock({
  type: 'text',
  meta,
  schema: z.object({ text: z.string() }),
  defaults: () => ({ text: '' }),
  fields: [],
  component: defineComponent({
    props: { text: { type: String, required: true } },
    setup: (props) => () => h('p', { class: 'text-block' }, props.text),
  }),
})

const brokenBlock = defineBlock({
  type: 'broken',
  meta: { ...meta, name: 'Broken' },
  schema: z.object({}),
  defaults: () => ({}),
  fields: [],
  component: defineComponent({
    setup: () => () => {
      throw new Error('Boom')
    },
  }),
})

function render(block: BlockNode) {
  return mount(BlockRenderer, {
    props: { block },
    global: {
      provide: { [BLOCK_REGISTRY_KEY]: new BlockRegistry([textBlock, brokenBlock]) },
    },
  })
}

describe('BlockRenderer', () => {
  afterEach(() => vi.restoreAllMocks())

  it('renders the registered component with the block props', () => {
    const wrapper = render({ id: '1', type: 'text', props: { text: 'Hello' }, style })

    expect(wrapper.find('.text-block').text()).toBe('Hello')
  })

  it('shows a fallback for unknown block types', () => {
    const wrapper = render({ id: '1', type: 'video', props: {}, style })

    expect(wrapper.get('[role="alert"]').text()).toContain('Unknown block “video”')
  })

  it('isolates render errors and recovers when props change', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = render({ id: '1', type: 'broken', props: {}, style })
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[role="alert"]').text()).toContain('“Broken” failed to render')
    expect(wrapper.text()).toContain('Boom')

    await wrapper.setProps({ block: { id: '1', type: 'text', props: { text: 'Fixed' }, style } })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('.text-block').text()).toBe('Fixed')
  })

  it('throws a helpful error when the registry is not provided', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(() =>
      mount(BlockRenderer, { props: { block: { id: '1', type: 'text', props: {}, style } } }),
    ).toThrow(/registry is not provided/)
  })
})
