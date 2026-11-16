import { MessageSquareQuote } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import { testimonialsDefaults, testimonialsSchema } from './schema'
import TestimonialsBlock from './TestimonialsBlock.vue'

export const testimonialsBlock = defineBlock({
  type: 'testimonials',
  meta: {
    name: 'Testimonials',
    description: 'Customer quotes in a masonry grid',
    category: 'content',
    icon: MessageSquareQuote,
  },
  schema: testimonialsSchema,
  defaults: testimonialsDefaults,
  fields: [
    { key: 'eyebrow', control: 'text', label: 'Eyebrow' },
    { key: 'title', control: 'text', label: 'Title' },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 2 },
    {
      key: 'items',
      control: 'list',
      label: 'Quotes',
      itemLabel: 'quote',
      titleKey: 'author',
      min: 1,
      max: 9,
      createItem: () => ({ quote: 'What a great product!', author: 'Jane Doe', role: '' }),
      fields: [
        { key: 'quote', control: 'textarea', label: 'Quote', rows: 3 },
        { key: 'author', control: 'text', label: 'Author' },
        { key: 'role', control: 'text', label: 'Role & company' },
      ],
    },
  ],
  component: TestimonialsBlock,
})

export type { TestimonialsProps } from './schema'
