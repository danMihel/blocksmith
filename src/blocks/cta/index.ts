import { Megaphone } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import CtaBlock from './CtaBlock.vue'
import { ctaDefaults, ctaSchema } from './schema'

export const ctaBlock = defineBlock({
  type: 'cta',
  meta: {
    name: 'Call to action',
    description: 'Highlighted banner with a single action',
    category: 'conversion',
    icon: Megaphone,
  },
  schema: ctaSchema,
  defaults: ctaDefaults,
  defaultStyle: { spacingTop: 'sm', spacingBottom: 'lg' },
  fields: [
    { key: 'title', control: 'textarea', label: 'Title', rows: 2 },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 2 },
    { key: 'action', control: 'link', label: 'Button' },
    {
      key: 'tone',
      control: 'choice',
      label: 'Style',
      options: [
        { value: 'accent', label: 'Accent' },
        { value: 'subtle', label: 'Subtle' },
      ],
    },
  ],
  component: CtaBlock,
})

export type { CtaProps } from './schema'
