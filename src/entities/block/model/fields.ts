import { z } from 'zod'

export type BlockLink = {
  label: string
  href: string
}

export const linkSchema = z.object({
  label: z.string().max(40),
  href: z.string().max(500),
}) satisfies z.ZodType<BlockLink>

export const shortText = (max = 80) => z.string().max(max)
export const longText = (max = 400) => z.string().max(max)
