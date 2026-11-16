import { z } from 'zod'

/*
 * Reusable schema primitives for block props.
 * Types are declared explicitly (instead of z.infer) because Vue's `defineProps<T>()`
 * compiler must be able to resolve them statically.
 */

export type BlockLink = {
  label: string
  href: string
}

/** A link rendered as a button; an empty label hides it. */
export const linkSchema = z.object({
  label: z.string().max(40),
  href: z.string().max(500),
}) satisfies z.ZodType<BlockLink>

export const shortText = (max = 80) => z.string().max(max)
export const longText = (max = 400) => z.string().max(max)
