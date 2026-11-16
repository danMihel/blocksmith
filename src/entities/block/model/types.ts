import type { Component } from 'vue'
import type { z } from 'zod'
import type { FieldDef } from './inspector'
import type { BlockStyle, ResponsiveStyle } from './styles'

/**
 * Props of a block are plain JSON: the page document must stay serializable.
 * Block prop types are declared as `type` aliases (not interfaces) so they stay
 * assignable to this record.
 */
export type BlockProps = Record<string, unknown>

/** A block instance inside a page document. */
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
  /** Human-readable name shown in the block library. */
  name: string
  description: string
  category: BlockCategory
  icon: Component
}

/**
 * Everything the editor needs to know about a block type.
 * The editor itself never references concrete blocks — only definitions in the registry.
 */
export type BlockDefinition<P extends BlockProps = BlockProps> = {
  /** Stable identifier stored in documents. Never rename once published. */
  type: string
  meta: BlockMeta
  /** Validates props coming from the outside (imports, storage, migrations). */
  schema: z.ZodType<P>
  /** Factory, so every new block gets its own copy of nested objects and arrays. */
  defaults: () => P
  /** Inspector form, type-checked against the props. */
  fields: FieldDef<P>[]
  /** Desktop style of a newly added block (merged over the global defaults). */
  defaultStyle?: Partial<BlockStyle>
  /** Receives the block props as its own props (`v-bind="block.props"`). */
  component: Component
}
