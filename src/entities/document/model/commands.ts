import type { BlockNode, BlockProps, ResponsiveStyle } from '@/entities/block'
import type { PageTheme } from '@/entities/theme'
import * as ops from './operations'
import type { PageDocument } from './types'

export interface Command {
  readonly label: string
  execute(doc: PageDocument): PageDocument
  undo(doc: PageDocument): PageDocument
  merge?(next: Command): Command | null
}

export const MERGE_WINDOW_MS = 1000

const withBlocks = (doc: PageDocument, blocks: BlockNode[]): PageDocument =>
  blocks === doc.blocks ? doc : { ...doc, blocks }

const pick = <T extends object>(source: T, keys: string[]): Partial<T> =>
  Object.fromEntries(keys.map((key) => [key, source[key as keyof T]])) as Partial<T>

const sameKeys = (a: object, b: object) => {
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return ka.length === kb.length && ka.every((k) => kb.includes(k))
}

const changesSomething = (source: object, patch: object) =>
  Object.entries(patch).some(([key, value]) => source[key as keyof typeof source] !== value)

export class InsertBlockCommand implements Command {
  readonly label: string
  private readonly block: BlockNode
  private readonly index: number | undefined

  constructor(block: BlockNode, index?: number, label = 'Add block') {
    this.block = block
    this.index = index
    this.label = label
  }

  execute(doc: PageDocument) {
    return withBlocks(doc, ops.insertBlock(doc.blocks, this.block, this.index))
  }

  undo(doc: PageDocument) {
    return withBlocks(doc, ops.removeBlock(doc.blocks, this.block.id))
  }
}

export class RemoveBlockCommand implements Command {
  readonly label: string
  private readonly blockId: string
  private removed: { block: BlockNode; index: number } | null = null

  constructor(blockId: string, label = 'Delete block') {
    this.blockId = blockId
    this.label = label
  }

  execute(doc: PageDocument) {
    const index = doc.blocks.findIndex((b) => b.id === this.blockId)
    const block = doc.blocks[index]
    if (!block) return doc
    this.removed = { block, index }
    return withBlocks(doc, ops.removeBlock(doc.blocks, this.blockId))
  }

  undo(doc: PageDocument) {
    if (!this.removed) return doc
    return withBlocks(doc, ops.insertBlock(doc.blocks, this.removed.block, this.removed.index))
  }
}

export class MoveBlockCommand implements Command {
  readonly label: string
  private readonly blockId: string
  private readonly toIndex: number
  private fromIndex = -1

  constructor(blockId: string, toIndex: number, label = 'Move block') {
    this.blockId = blockId
    this.toIndex = toIndex
    this.label = label
  }

  execute(doc: PageDocument) {
    this.fromIndex = doc.blocks.findIndex((b) => b.id === this.blockId)
    return withBlocks(doc, ops.moveBlock(doc.blocks, this.blockId, this.toIndex))
  }

  undo(doc: PageDocument) {
    if (this.fromIndex === -1) return doc
    return withBlocks(doc, ops.moveBlock(doc.blocks, this.blockId, this.fromIndex))
  }
}

export class DuplicateBlockCommand implements Command {
  readonly label: string
  private readonly sourceId: string
  private readonly copyId: string

  constructor(sourceId: string, copyId: string, label = 'Duplicate block') {
    this.sourceId = sourceId
    this.copyId = copyId
    this.label = label
  }

  execute(doc: PageDocument) {
    return withBlocks(doc, ops.duplicateBlock(doc.blocks, this.sourceId, this.copyId))
  }

  undo(doc: PageDocument) {
    return withBlocks(doc, ops.removeBlock(doc.blocks, this.copyId))
  }
}

export class UpdateBlockPropsCommand implements Command {
  readonly label: string
  readonly blockId: string
  readonly patch: BlockProps
  readonly at: number
  private previous: BlockProps | null

  constructor(
    blockId: string,
    patch: BlockProps,
    label = 'Edit block',
    previous: BlockProps | null = null,
    at = Date.now(),
  ) {
    this.blockId = blockId
    this.patch = patch
    this.label = label
    this.previous = previous
    this.at = at
  }

  execute(doc: PageDocument) {
    const block = doc.blocks.find((b) => b.id === this.blockId)
    if (!block || !changesSomething(block.props, this.patch)) return doc
    this.previous ??= pick(block.props, Object.keys(this.patch))
    return withBlocks(doc, ops.updateBlockProps(doc.blocks, this.blockId, this.patch))
  }

  undo(doc: PageDocument) {
    if (!this.previous) return doc
    return withBlocks(doc, ops.updateBlockProps(doc.blocks, this.blockId, this.previous))
  }

  merge(next: Command) {
    if (
      !(next instanceof UpdateBlockPropsCommand) ||
      next.blockId !== this.blockId ||
      next.at - this.at > MERGE_WINDOW_MS ||
      !sameKeys(this.patch, next.patch)
    ) {
      return null
    }
    return new UpdateBlockPropsCommand(this.blockId, next.patch, this.label, this.previous, next.at)
  }
}

export class UpdateBlockStyleCommand implements Command {
  readonly label: string
  readonly blockId: string
  readonly style: ResponsiveStyle
  readonly at: number
  private previous: ResponsiveStyle | null

  constructor(
    blockId: string,
    style: ResponsiveStyle,
    label = 'Edit style',
    previous: ResponsiveStyle | null = null,
    at = Date.now(),
  ) {
    this.blockId = blockId
    this.style = style
    this.label = label
    this.previous = previous
    this.at = at
  }

  private apply(doc: PageDocument, style: ResponsiveStyle) {
    const index = doc.blocks.findIndex((b) => b.id === this.blockId)
    const block = doc.blocks[index]
    if (!block || block.style === style) return doc
    return withBlocks(doc, doc.blocks.with(index, { ...block, style }))
  }

  execute(doc: PageDocument) {
    this.previous ??= doc.blocks.find((b) => b.id === this.blockId)?.style ?? null
    return this.apply(doc, this.style)
  }

  undo(doc: PageDocument) {
    return this.previous ? this.apply(doc, this.previous) : doc
  }

  merge(next: Command) {
    if (
      !(next instanceof UpdateBlockStyleCommand) ||
      next.blockId !== this.blockId ||
      next.at - this.at > MERGE_WINDOW_MS
    ) {
      return null
    }
    return new UpdateBlockStyleCommand(this.blockId, next.style, this.label, this.previous, next.at)
  }
}

export class RenameDocumentCommand implements Command {
  readonly label = 'Rename page'
  readonly name: string
  readonly at: number
  private previous: string | null

  constructor(name: string, previous: string | null = null, at = Date.now()) {
    this.name = name
    this.previous = previous
    this.at = at
  }

  execute(doc: PageDocument) {
    if (doc.name === this.name) return doc
    this.previous ??= doc.name
    return { ...doc, name: this.name }
  }

  undo(doc: PageDocument) {
    return this.previous === null ? doc : { ...doc, name: this.previous }
  }

  merge(next: Command) {
    if (!(next instanceof RenameDocumentCommand) || next.at - this.at > MERGE_WINDOW_MS) return null
    return new RenameDocumentCommand(next.name, this.previous, next.at)
  }
}

export class UpdateThemeCommand implements Command {
  readonly label: string
  readonly patch: Partial<PageTheme>
  readonly at: number
  private previous: Partial<PageTheme> | null

  constructor(
    patch: Partial<PageTheme>,
    label = 'Edit theme',
    previous: Partial<PageTheme> | null = null,
    at = Date.now(),
  ) {
    this.patch = patch
    this.label = label
    this.previous = previous
    this.at = at
  }

  execute(doc: PageDocument) {
    if (!changesSomething(doc.theme, this.patch)) return doc
    this.previous ??= pick(doc.theme, Object.keys(this.patch))
    return { ...doc, theme: { ...doc.theme, ...this.patch } }
  }

  undo(doc: PageDocument) {
    return this.previous ? { ...doc, theme: { ...doc.theme, ...this.previous } } : doc
  }

  merge(next: Command) {
    if (
      !(next instanceof UpdateThemeCommand) ||
      next.at - this.at > MERGE_WINDOW_MS ||
      !sameKeys(this.patch, next.patch)
    ) {
      return null
    }
    return new UpdateThemeCommand(next.patch, this.label, this.previous, next.at)
  }
}
