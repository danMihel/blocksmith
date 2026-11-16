import { z } from 'zod'
import { longText, shortText } from '@/entities/block'
import { CONTENT_ICON_NAMES, type ContentIconName } from '@/shared/ui'

export type FeatureItem = {
  icon: ContentIconName
  title: string
  description: string
}

export type FeaturesProps = {
  eyebrow: string
  title: string
  subtitle: string
  columns: 2 | 3 | 4
  items: FeatureItem[]
}

export const featuresSchema = z.object({
  eyebrow: shortText(60),
  title: shortText(120),
  subtitle: longText(320),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  items: z
    .array(
      z.object({
        icon: z.enum(CONTENT_ICON_NAMES),
        title: shortText(80).min(1),
        description: longText(240),
      }),
    )
    .min(1)
    .max(12),
}) satisfies z.ZodType<FeaturesProps>

export const featuresDefaults = (): FeaturesProps => ({
  eyebrow: 'Features',
  title: 'Everything you need to ship',
  subtitle: 'A focused toolkit that stays out of your way.',
  columns: 3,
  items: [
    {
      icon: 'zap',
      title: 'Fast by default',
      description: 'Pages load instantly — no heavy runtime.',
    },
    {
      icon: 'palette',
      title: 'On-brand themes',
      description: 'Colors, fonts and radii in one place.',
    },
    {
      icon: 'shield',
      title: 'Reliable',
      description: 'Every change is validated against a schema.',
    },
  ],
})
