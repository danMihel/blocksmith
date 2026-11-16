import { CreditCard } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import PricingBlock from './PricingBlock.vue'
import { createPlan, pricingDefaults, pricingSchema } from './schema'

export const pricingBlock = defineBlock({
  type: 'pricing',
  meta: {
    name: 'Pricing',
    description: 'Up to four plans with a highlighted one',
    category: 'conversion',
    icon: CreditCard,
  },
  schema: pricingSchema,
  defaults: pricingDefaults,
  fields: [
    { key: 'eyebrow', control: 'text', label: 'Eyebrow' },
    { key: 'title', control: 'text', label: 'Title' },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 2 },
    {
      key: 'plans',
      control: 'list',
      label: 'Plans',
      itemLabel: 'plan',
      titleKey: 'name',
      min: 1,
      max: 4,
      createItem: () => createPlan(),
      fields: [
        { key: 'name', control: 'text', label: 'Name' },
        { key: 'price', control: 'text', label: 'Price' },
        { key: 'period', control: 'text', label: 'Period', placeholder: '/month' },
        { key: 'description', control: 'text', label: 'Description' },
        {
          key: 'features',
          control: 'textarea',
          label: 'Features',
          hint: 'One feature per line.',
          rows: 4,
        },
        { key: 'action', control: 'link', label: 'Button' },
        { key: 'highlighted', control: 'toggle', label: 'Highlight as most popular' },
      ],
    },
  ],
  component: PricingBlock,
})

export type { PricingProps } from './schema'
