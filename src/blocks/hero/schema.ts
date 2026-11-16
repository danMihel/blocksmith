import { z } from 'zod'
import { type BlockLink, linkSchema, longText, shortText } from '@/entities/block'

export type HeroProps = {
  eyebrow: string
  title: string
  subtitle: string
  primaryAction: BlockLink
  secondaryAction: BlockLink
  align: 'left' | 'center'
}

export const heroSchema = z.object({
  eyebrow: shortText(60),
  title: shortText(120).min(1),
  subtitle: longText(320),
  primaryAction: linkSchema,
  secondaryAction: linkSchema,
  align: z.enum(['left', 'center']),
}) satisfies z.ZodType<HeroProps>

export const heroDefaults = (): HeroProps => ({
  eyebrow: 'New in 2.0',
  title: 'Launch your landing page in minutes',
  subtitle:
    'Pick ready-made blocks, tune the content and ship a page that looks great on every device.',
  primaryAction: { label: 'Get started', href: '#' },
  secondaryAction: { label: 'Learn more', href: '#' },
  align: 'center',
})
