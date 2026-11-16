import type { Component } from 'vue'
import type { z } from 'zod'
import type { FieldDef } from './inspector'
import type { BlockStyle, ResponsiveStyle } from './styles'

export type BlockProps = Record<string, unknown>

export type BlockNode<P extends BlockProps = BlockProps> = {
  id: string
  type: string
  props: P
  style: ResponsiveStyle
}

export const BLOCK_CATEGORIES = {
  header: 'Header',
  content: 'Content',
  conversion: 'Conversion',
  footer: 'Footer',
} as const

export type BlockCategory = keyof typeof BLOCK_CATEGORIES

export type BlockMeta = {
  name: string
  description: string
  category: BlockCategory
  icon: Component
}

export type BlockDefinition<P extends BlockProps = BlockProps> = {
  type: string
  meta: BlockMeta
  schema: z.ZodType<P>
  defaults: () => P
  fields: FieldDef<P>[]
  defaultStyle?: Partial<BlockStyle>
  component: Component
}
