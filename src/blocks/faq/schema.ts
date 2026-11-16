import { z } from 'zod'
import { longText, shortText } from '@/entities/block'

export type FaqItem = {
  question: string
  answer: string
}

export type FaqProps = {
  title: string
  subtitle: string
  items: FaqItem[]
}

export const faqSchema = z.object({
  title: shortText(120),
  subtitle: longText(320),
  items: z
    .array(z.object({ question: shortText(160).min(1), answer: longText(1000) }))
    .min(1)
    .max(20),
}) satisfies z.ZodType<FaqProps>

export const faqDefaults = (): FaqProps => ({
  title: 'Frequently asked questions',
  subtitle: 'Can’t find the answer? Write to us any time.',
  items: [
    {
      question: 'Do I need to know how to code?',
      answer: 'No. Pick blocks, edit the text, choose a theme — that’s it.',
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes, on any paid plan. Point a CNAME record to us and you’re done.',
    },
    {
      question: 'Can I cancel at any time?',
      answer: 'Of course. There are no contracts — cancel with one click.',
    },
  ],
})
