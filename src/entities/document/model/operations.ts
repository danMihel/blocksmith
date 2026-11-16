import type { BlockNode, BlockProps } from '@/entities/block'

type Blocks = readonly BlockNode[]

const clampIndex = (index: number, length: number) => Math.min(Math.max(index, 0), length)

export function insertBlock(blocks: Blocks, block: BlockNode, index = blocks.length): BlockNode[] {
  const next = [...blocks]
  next.splice(clampIndex(index, blocks.length), 0, block)
  return next
}

export function removeBlock(blocks: Blocks, id: string): BlockNode[] {
  const index = blocks.findIndex((b) => b.id === id)
  if (index === -1) return blocks as BlockNode[]
  return blocks.toSpliced(index, 1)
}

export function moveBlock(blocks: Blocks, id: string, toIndex: number): BlockNode[] {
  const from = blocks.findIndex((b) => b.id === id)
  const to = clampIndex(toIndex, blocks.length - 1)
  if (from === -1 || from === to) return blocks as BlockNode[]

  const next = [...blocks]
  const [block] = next.splice(from, 1)
  next.splice(to, 0, block!)
  return next
}

export function updateBlockProps(blocks: Blocks, id: string, patch: BlockProps): BlockNode[] {
  const index = blocks.findIndex((b) => b.id === id)
  const block = blocks[index]
  if (!block) return blocks as BlockNode[]

  return blocks.with(index, { ...block, props: { ...block.props, ...patch } })
}

export function duplicateBlock(blocks: Blocks, id: string, newId: string): BlockNode[] {
  const index = blocks.findIndex((b) => b.id === id)
  const block = blocks[index]
  if (!block) return blocks as BlockNode[]

  const copy: BlockNode = { ...block, id: newId, props: structuredClone(block.props) }
  return blocks.toSpliced(index + 1, 0, copy)
}
