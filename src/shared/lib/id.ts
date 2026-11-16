import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

/** Short, URL-safe, human-readable ids: `blk_x7f2k9q1m3ab`. */
export function createId(prefix: string): string {
  return `${prefix}_${nanoid()}`
}
