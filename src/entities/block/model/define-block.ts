import { markRaw } from 'vue'
import { createId } from '@/shared/lib'
import { type BlockStyle, DEFAULT_BLOCK_STYLE } from './styles'
import type { BlockDefinition, BlockNode, BlockProps } from './types'

/**
 * Ties a block's props type to its schema, defaults, inspector fields and component.
 * Gives full inference at the definition site and a uniform shape for the registry.
 */
export function defineBlock<P extends BlockProps>(
  definition: BlockDefinition<P>,
): BlockDefinition<P> {
  // Components and icons must never be wrapped in reactive proxies.
  return {
    ...definition,
    component: markRaw(definition.component),
    meta: { ...definition.meta, icon: markRaw(definition.meta.icon) },
  }
}

/** Creates a new block instance with default props, optionally overriding some of them. */
export function createBlock<P extends BlockProps>(
  definition: BlockDefinition<P>,
  overrides: Partial<P> = {},
  style: Partial<BlockStyle> = {},
): BlockNode<P> {
  return {
    id: createId('blk'),
    type: definition.type,
    props: { ...definition.defaults(), ...overrides },
    style: { desktop: { ...DEFAULT_BLOCK_STYLE, ...definition.defaultStyle, ...style } },
  }
}
