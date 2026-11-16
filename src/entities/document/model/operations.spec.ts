import { describe, expect, it } from 'vitest'
import { type BlockNode, DEFAULT_BLOCK_STYLE } from '@/entities/block'
import { duplicateBlock, insertBlock, moveBlock, removeBlock, updateBlockProps } from './operations'

const block = (id: string, props: BlockNode['props'] = {}): BlockNode => ({
  id,
  type: 'test',
  props,
  style: { desktop: DEFAULT_BLOCK_STYLE },
})

const ids = (blocks: readonly BlockNode[]) => blocks.map((b) => b.id)

const a = block('a')
const b = block('b')
const c = block('c')
const list: readonly BlockNode[] = Object.freeze([a, b, c])

describe('block operations', () => {
  describe('insertBlock', () => {
    it('appends by default and inserts at an index', () => {
      expect(ids(insertBlock(list, block('x')))).toEqual(['a', 'b', 'c', 'x'])
      expect(ids(insertBlock(list, block('x'), 1))).toEqual(['a', 'x', 'b', 'c'])
    })

    it('clamps out-of-range indexes', () => {
      expect(ids(insertBlock(list, block('x'), -5))).toEqual(['x', 'a', 'b', 'c'])
      expect(ids(insertBlock(list, block('x'), 99))).toEqual(['a', 'b', 'c', 'x'])
    })
  })

  describe('removeBlock', () => {
    it('removes a block by id', () => {
      expect(ids(removeBlock(list, 'b'))).toEqual(['a', 'c'])
    })

    it('returns the same array when the block is missing', () => {
      expect(removeBlock(list, 'missing')).toBe(list)
    })
  })

  describe('moveBlock', () => {
    it('moves a block forward and backward', () => {
      expect(ids(moveBlock(list, 'a', 2))).toEqual(['b', 'c', 'a'])
      expect(ids(moveBlock(list, 'c', 0))).toEqual(['c', 'a', 'b'])
    })

    it('clamps the target index', () => {
      expect(ids(moveBlock(list, 'a', 99))).toEqual(['b', 'c', 'a'])
    })

    it('returns the same array for no-op moves', () => {
      expect(moveBlock(list, 'b', 1)).toBe(list)
      expect(moveBlock(list, 'missing', 0)).toBe(list)
    })
  })

  describe('updateBlockProps', () => {
    it('shallow-merges props and keeps other blocks untouched', () => {
      const source = [block('a', { title: 'Old', subtitle: 'Keep' }), b]

      const next = updateBlockProps(source, 'a', { title: 'New' })

      expect(next[0]!.props).toEqual({ title: 'New', subtitle: 'Keep' })
      expect(next[1]).toBe(b)
      expect(source[0]!.props.title).toBe('Old')
    })

    it('returns the same array when the block is missing', () => {
      expect(updateBlockProps(list, 'missing', { title: 'x' })).toBe(list)
    })
  })

  describe('duplicateBlock', () => {
    it('inserts a deep copy right after the original', () => {
      const source = [block('a', { items: [{ title: 'One' }] }), b]

      const next = duplicateBlock(source, 'a', 'copy')

      expect(ids(next)).toEqual(['a', 'copy', 'b'])
      expect(next[1]!.props).toEqual(next[0]!.props)
      expect(next[1]!.props.items).not.toBe(next[0]!.props.items)
    })
  })

  it('never mutates the input', () => {
    insertBlock(list, block('x'))
    removeBlock(list, 'a')
    moveBlock(list, 'a', 2)
    updateBlockProps(list, 'a', { title: 'x' })
    duplicateBlock(list, 'a', 'copy')

    expect(ids(list)).toEqual(['a', 'b', 'c'])
    expect(a.props).toEqual({})
  })
})
