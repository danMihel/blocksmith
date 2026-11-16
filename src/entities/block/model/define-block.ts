import { markRaw } from 'vue'
import { createId } from '@/shared/lib'
import { type BlockStyle, DEFAULT_BLOCK_STYLE } from './styles'
import type { BlockDefinition, BlockNode, BlockProps } from './types'

export function defineBlock<P extends BlockProps>(
  definition: BlockDefinition<P>,
): BlockDefinition<P> {
  return {
    ...definition,
    component: markRaw(definition.component),
    meta: { ...definition.meta, icon: markRaw(definition.meta.icon) },
  }
}

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
