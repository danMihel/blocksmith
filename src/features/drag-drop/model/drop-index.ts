export function computeDropIndex(rects: readonly { top: number; height: number }[], y: number) {
  const index = rects.findIndex((rect) => rect.height > 0 && y < rect.top + rect.height / 2)
  return index === -1 ? rects.length : index
}

export function toMoveIndex(fromIndex: number, dropIndex: number) {
  return fromIndex < dropIndex ? dropIndex - 1 : dropIndex
}
