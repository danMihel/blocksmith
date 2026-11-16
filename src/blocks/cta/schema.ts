import { z } from 'zod'
import { type BlockLink, linkSchema, longText, shortText } from '@/entities/block'

export type CtaProps = {
  title: string
  subtitle: string
  action: BlockLink
  tone: 'accent' | 'subtle'
}

export const ctaSchema = z.object({
  title: shortText(120).min(1),
  subtitle: longText(240),
  action: linkSchema,
  tone: z.enum(['accent', 'subtle']),
}) satisfies z.ZodType<CtaProps>

export const ctaDefaults = (): CtaProps => ({
  title: 'Ready to build your page?',
  subtitle: 'Start from a template or a blank canvas — it takes less than a minute.',
  action: { label: 'Start for free', href: '#' },
  tone: 'accent',
})
