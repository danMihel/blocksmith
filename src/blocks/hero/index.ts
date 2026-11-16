import { PanelTop } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import HeroBlock from './HeroBlock.vue'
import { heroDefaults, heroSchema } from './schema'

export const heroBlock = defineBlock({
  type: 'hero',
  meta: {
    name: 'Hero',
    description: 'Headline, subtitle and call-to-action buttons',
    category: 'header',
    icon: PanelTop,
  },
  schema: heroSchema,
  defaults: heroDefaults,
  defaultStyle: { spacingTop: 'xl', spacingBottom: 'xl' },
  fields: [
    {
      key: 'eyebrow',
      control: 'text',
      label: 'Eyebrow',
      hint: 'Small label above the title. Leave empty to hide.',
    },
    { key: 'title', control: 'textarea', label: 'Title', rows: 2 },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 3 },
    { key: 'primaryAction', control: 'link', label: 'Primary button' },
    { key: 'secondaryAction', control: 'link', label: 'Secondary button' },
    {
      key: 'align',
      control: 'choice',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
    },
  ],
  component: HeroBlock,
})

export type { HeroProps } from './schema'
