import { CircleQuestionMark } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import FaqBlock from './FaqBlock.vue'
import { faqDefaults, faqSchema } from './schema'

export const faqBlock = defineBlock({
  type: 'faq',
  meta: {
    name: 'FAQ',
    description: 'Questions and answers in an accordion',
    category: 'content',
    icon: CircleQuestionMark,
  },
  schema: faqSchema,
  defaults: faqDefaults,
  fields: [
    { key: 'title', control: 'text', label: 'Title' },
    { key: 'subtitle', control: 'textarea', label: 'Subtitle', rows: 2 },
    {
      key: 'items',
      control: 'list',
      label: 'Questions',
      itemLabel: 'question',
      titleKey: 'question',
      min: 1,
      max: 20,
      createItem: () => ({ question: 'New question?', answer: 'The answer.' }),
      fields: [
        { key: 'question', control: 'text', label: 'Question' },
        { key: 'answer', control: 'textarea', label: 'Answer', rows: 3 },
      ],
    },
  ],
  component: FaqBlock,
})

export type { FaqProps } from './schema'
