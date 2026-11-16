import {
  type Component,
  markRaw,
  onScopeDispose,
  reactive,
  readonly,
  type ShallowRef,
  watch,
} from 'vue'
import { computeDropIndex } from './drop-index'

/*
 * A small pointer-events drag & drop engine (no HTML5 DnD: it can't style the drag image,
 * doesn't work on touch and fires unreliable events).
 *
 * - `startDrag()` is called from a pointerdown handler; the drag only starts after the
 *   pointer has moved a few pixels, so plain clicks keep working.
 * - Drop lists register with `useDropList()`; items inside them are marked with
 *   `data-drop-item`. The engine finds the list under the pointer and the gap between items.
 * - Containers marked with `data-autoscroll` scroll when the pointer nears their edges.
 */

export type DragPayload =
  | { kind: 'new'; blockType: string; label: string; icon: Component }
  | { kind: 'move'; blockId: string; label: string; icon: Component }

type DropTarget = { listId: string; index: number; offset: number }

type DropList = {
  id: string
  el: HTMLElement
  accepts: (payload: DragPayload) => boolean
  onDrop: (payload: DragPayload, index: number) => void
}

const DRAG_THRESHOLD = 4
const AUTOSCROLL_EDGE = 72
const AUTOSCROLL_MAX_SPEED = 20

const lists = new Map<string, DropList>()

const state = reactive({
  payload: null as DragPayload | null,
  x: 0,
  y: 0,
  target: null as DropTarget | null,
})

export const dragState = readonly(state)

function findTarget(x: number, y: number, payload: DragPayload): DropTarget | null {
  const listEl = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drop-list]')
  const list = listEl ? lists.get(listEl.dataset.dropList ?? '') : undefined
  if (!list || !list.accepts(payload)) return null

  const items = [...list.el.querySelectorAll<HTMLElement>('[data-drop-item]')]
  const rects = items.map((item) => item.getBoundingClientRect())
  const index = computeDropIndex(rects, y)

  const listTop = list.el.getBoundingClientRect().top
  const visible = rects.filter((r) => r.height > 0)
  const next = rects.slice(index).find((r) => r.height > 0)
  const edge = next ? next.top : (visible.at(-1)?.bottom ?? listTop)

  return { listId: list.id, index, offset: edge - listTop }
}

/** Scrolls the container under the pointer while the pointer is near its top/bottom edge. */
function createAutoScroller(onScroll: () => void) {
  let frame = 0
  let container: HTMLElement | null = null
  let speed = 0

  const tick = () => {
    if (!container || speed === 0) {
      frame = 0
      return
    }
    container.scrollTop += speed
    onScroll()
    frame = requestAnimationFrame(tick)
  }

  return {
    update(x: number, y: number) {
      container = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-autoscroll]') ?? null
      if (!container) {
        speed = 0
        return
      }
      const rect = container.getBoundingClientRect()
      const fromTop = y - rect.top
      const fromBottom = rect.bottom - y
      speed =
        fromTop < AUTOSCROLL_EDGE
          ? -AUTOSCROLL_MAX_SPEED * (1 - fromTop / AUTOSCROLL_EDGE)
          : fromBottom < AUTOSCROLL_EDGE
            ? AUTOSCROLL_MAX_SPEED * (1 - fromBottom / AUTOSCROLL_EDGE)
            : 0
      if (speed !== 0 && frame === 0) frame = requestAnimationFrame(tick)
    },
    stop() {
      cancelAnimationFrame(frame)
      frame = 0
      speed = 0
    },
  }
}

/** The click that follows a drag must not select or activate anything. */
function suppressNextClick() {
  const swallow = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
  }
  window.addEventListener('click', swallow, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
}

export function startDrag(event: PointerEvent, payload: DragPayload) {
  if (event.button !== 0 || state.payload) return

  const startX = event.clientX
  const startY = event.clientY
  const rawPayload = { ...payload, icon: markRaw(payload.icon) }
  let active = false

  const refreshTarget = () => {
    state.target = findTarget(state.x, state.y, rawPayload)
  }
  const scroller = createAutoScroller(refreshTarget)

  const onMove = (e: PointerEvent) => {
    if (!active) {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD) return
      active = true
      state.payload = rawPayload
      document.documentElement.classList.add('is-dragging')
    }
    e.preventDefault()
    state.x = e.clientX
    state.y = e.clientY
    refreshTarget()
    scroller.update(e.clientX, e.clientY)
  }

  const finish = (commit: boolean) => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('keydown', onKeydown, true)
    scroller.stop()

    if (active) {
      suppressNextClick()
      const target = state.target
      if (commit && target) lists.get(target.listId)?.onDrop(rawPayload, target.index)
    }

    state.payload = null
    state.target = null
    document.documentElement.classList.remove('is-dragging')
  }

  const onUp = () => finish(true)
  const onCancel = () => finish(false)
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !active) return
    e.stopPropagation()
    finish(false)
  }

  window.addEventListener('pointermove', onMove, { passive: false })
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onCancel)
  window.addEventListener('keydown', onKeydown, true)
}

/** Registers an element as a drop list for as long as the calling component lives. */
export function useDropList(
  id: string,
  el: Readonly<ShallowRef<HTMLElement | null>>,
  options: Pick<DropList, 'onDrop'> & Partial<Pick<DropList, 'accepts'>>,
) {
  watch(
    el,
    (node) => {
      if (node) {
        node.dataset.dropList = id
        lists.set(id, { id, el: node, accepts: options.accepts ?? (() => true), ...options })
      } else {
        lists.delete(id)
      }
    },
    { immediate: true },
  )
  onScopeDispose(() => lists.delete(id))
}
