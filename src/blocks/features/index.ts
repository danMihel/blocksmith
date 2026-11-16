import { LayoutGrid } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import FeaturesBlock from './FeaturesBlock.vue'
import { featuresDefaults, featuresSchema } from './schema'

export const featuresBlock = defineBlock({
  type: 'features',
  meta: {
    name: 'Features',
    description: 'Grid of feature cards with icons',
    category: 'content',
    icon: LayoutGrid,
  },
  schema: featuresSchema,
  defaults: featuresDefaults,
  defaultStyle: { spacingTop: 'lg', spacingBottom: 'md' },
  fields: [
    { key: 'eyebrow', control: 'text', label: 'Eyebrow' },
    { key: 'title', control: 'text', label: 'Title' },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 2 },
    {
      key: 'columns',
      control: 'choice',
      label: 'Columns on desktop',
      options: [
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
      ],
    },
    {
      key: 'items',
      control: 'list',
      label: 'Features',
      itemLabel: 'feature',
      titleKey: 'title',
      min: 1,
      max: 12,
      createItem: () => ({
        icon: 'sparkles' as const,
        title: 'New feature',
        description: 'Describe the benefit in one sentence.',
      }),
      fields: [
        { key: 'icon', control: 'icon', label: 'Icon' },
        { key: 'title', control: 'text', label: 'Title' },
        { key: 'description', control: 'textarea', label: 'Description', rows: 2 },
      ],
    },
  ],
  component: FeaturesBlock,
})

export type { FeaturesProps } from './schema'
