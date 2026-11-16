/**
 * Index at which a dragged item would be inserted into a vertical list:
 * before the first item whose vertical middle is below the pointer.
 * Collapsed (hidden) items have no height and are passed through.
 */
export function computeDropIndex(rects: readonly { top: number; height: number }[], y: number) {
  const index = rects.findIndex((rect) => rect.height > 0 && y < rect.top + rect.height / 2)
  return index === -1 ? rects.length : index
}

/**
 * Converts a drop index (a gap between items, counted with the dragged item still in place)
 * into the target index for a move operation.
 */
export function toMoveIndex(fromIndex: number, dropIndex: number) {
  return fromIndex < dropIndex ? dropIndex - 1 : dropIndex
}
