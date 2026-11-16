import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type BlockNode, DEFAULT_BLOCK_STYLE } from '@/entities/block'
import {
  DuplicateBlockCommand,
  InsertBlockCommand,
  MERGE_WINDOW_MS,
  MoveBlockCommand,
  RemoveBlockCommand,
  RenameDocumentCommand,
  UpdateBlockPropsCommand,
  UpdateBlockStyleCommand,
  UpdateThemeCommand,
} from './commands'
import { createDocument } from './factory'
import { useDocumentStore } from './store'

const block = (id: string): BlockNode => ({
  id,
  type: 'text',
  props: { text: id },
  style: { desktop: DEFAULT_BLOCK_STYLE },
})

describe('useDocumentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00.000Z') })
  })

  function openStore() {
    const store = useDocumentStore()
    store.open(createDocument({ name: 'Page', blocks: [block('a'), block('b')] }))
    vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'))
    return store
  }

  const ids = (store: ReturnType<typeof useDocumentStore>) => store.blocks.map((b) => b.id)

  it('applies commands immutably and bumps updatedAt', () => {
    const store = openStore()
    const before = store.document

    expect(store.execute(new MoveBlockCommand('a', 1))).toBe(true)

    expect(ids(store)).toEqual(['b', 'a'])
    expect(before?.blocks.map((b) => b.id)).toEqual(['a', 'b'])
    expect(store.document?.updatedAt).toBe('2026-01-02T00:00:00.000Z')
  })

  it('records nothing for no-op commands', () => {
    const store = openStore()
    const before = store.document

    expect(store.execute(new RemoveBlockCommand('missing'))).toBe(false)
    expect(store.execute(new MoveBlockCommand('a', 0))).toBe(false)
    expect(store.execute(new UpdateBlockPropsCommand('a', { text: 'a' }))).toBe(false)

    expect(store.document).toBe(before)
    expect(store.canUndo).toBe(false)
  })

  it('undoes and redoes every kind of command', () => {
    const store = openStore()
    const initial = store.document!
    const commands = [
      new InsertBlockCommand(block('c'), 1),
      new RemoveBlockCommand('a'),
      new MoveBlockCommand('b', 1),
      new DuplicateBlockCommand('c', 'c2'),
      new UpdateBlockPropsCommand('b', { text: 'changed' }),
      new UpdateBlockStyleCommand('b', {
        desktop: DEFAULT_BLOCK_STYLE,
        mobile: { hidden: true },
      }),
      new RenameDocumentCommand('Renamed'),
      new UpdateThemeCommand({ primary: '#ff0000' }),
    ]
    for (const command of commands) store.execute(command)
    const final = store.document!

    for (const _ of commands) store.undo()
    expect(store.document?.blocks).toEqual(initial.blocks)
    expect(store.document?.name).toBe(initial.name)
    expect(store.document?.theme).toEqual(initial.theme)
    expect(store.canUndo).toBe(false)

    for (const _ of commands) store.redo()
    expect(store.document?.blocks).toEqual(final.blocks)
    expect(store.document?.name).toBe('Renamed')
    expect(store.document?.theme.primary).toBe('#ff0000')
    expect(store.canRedo).toBe(false)
  })

  it('exposes labels of the next undo and redo steps', () => {
    const store = openStore()

    store.execute(new RemoveBlockCommand('a', 'Delete Hero'))
    expect(store.undoLabel).toBe('Delete Hero')

    store.undo()
    expect(store.undoLabel).toBeUndefined()
    expect(store.redoLabel).toBe('Delete Hero')
  })

  it('clears the redo stack on a new change', () => {
    const store = openStore()

    store.execute(new MoveBlockCommand('a', 1))
    store.undo()
    store.execute(new RemoveBlockCommand('b'))

    expect(store.canRedo).toBe(false)
  })

  it('merges a typing burst into one undo step', () => {
    const store = openStore()

    store.execute(new UpdateBlockPropsCommand('a', { text: 'H' }, 'Edit', null, 0))
    store.execute(new UpdateBlockPropsCommand('a', { text: 'He' }, 'Edit', null, 300))
    store.execute(new UpdateBlockPropsCommand('a', { text: 'Hey' }, 'Edit', null, 600))
    store.undo()

    expect(store.getBlock('a')?.props).toEqual({ text: 'a' })
    expect(store.canUndo).toBe(false)
  })

  it('does not merge after a pause, across fields or across undo', () => {
    const store = openStore()

    store.execute(new UpdateBlockPropsCommand('a', { text: '1' }, 'Edit', null, 0))
    store.execute(
      new UpdateBlockPropsCommand('a', { text: '2' }, 'Edit', null, MERGE_WINDOW_MS + 1),
    )
    store.execute(
      new UpdateBlockPropsCommand('a', { title: 'x' }, 'Edit', null, MERGE_WINDOW_MS + 2),
    )
    store.undo()
    store.execute(
      new UpdateBlockPropsCommand('a', { text: '3' }, 'Edit', null, MERGE_WINDOW_MS + 3),
    )

    store.undo()
    expect(store.getBlock('a')?.props.text).toBe('2')
    store.undo()
    expect(store.getBlock('a')?.props.text).toBe('1')
    store.undo()
    expect(store.getBlock('a')?.props.text).toBe('a')
  })

  it('ignores commands when no document is open', () => {
    const store = useDocumentStore()

    expect(store.execute(new InsertBlockCommand(block('a')))).toBe(false)
    expect(store.document).toBeNull()
  })

  it('resets history when another document is opened', () => {
    const store = openStore()
    store.execute(new MoveBlockCommand('a', 1))

    store.open(createDocument({ name: 'Other' }))

    expect(store.canUndo).toBe(false)
    expect(store.blocks).toEqual([])
  })
})
