import { z } from 'zod'
import { longText, shortText } from '@/entities/block'

export type Testimonial = {
  quote: string
  author: string
  role: string
}

export type TestimonialsProps = {
  eyebrow: string
  title: string
  subtitle: string
  items: Testimonial[]
}

export const testimonialsSchema = z.object({
  eyebrow: shortText(60),
  title: shortText(120),
  subtitle: longText(320),
  items: z
    .array(
      z.object({
        quote: longText(500).min(1),
        author: shortText(60).min(1),
        role: shortText(80),
      }),
    )
    .min(1)
    .max(9),
}) satisfies z.ZodType<TestimonialsProps>

export const testimonialsDefaults = (): TestimonialsProps => ({
  eyebrow: 'Testimonials',
  title: 'Loved by teams everywhere',
  subtitle: '',
  items: [
    {
      quote: 'We shipped our new landing page in an afternoon. The conversion rate went up by 18%.',
      author: 'Maria Lopez',
      role: 'Head of Growth, Northwind',
    },
    {
      quote: 'Finally a tool our designers and marketers both enjoy using.',
      author: 'James Chen',
      role: 'Design Lead, Lumen',
    },
    {
      quote: 'It just works on every screen. We stopped worrying about mobile.',
      author: 'Aisha Khan',
      role: 'Founder, Brightside',
    },
  ],
})
