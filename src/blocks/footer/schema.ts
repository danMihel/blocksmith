import { z } from 'zod'
import { type BlockLink, linkSchema, longText, shortText } from '@/entities/block'

export type FooterColumn = {
  title: string
  links: BlockLink[]
}

export type FooterProps = {
  brand: string
  tagline: string
  columns: FooterColumn[]
  copyright: string
}

export const footerSchema = z.object({
  brand: shortText(40).min(1),
  tagline: longText(200),
  columns: z.array(z.object({ title: shortText(40), links: z.array(linkSchema).max(8) })).max(4),
  copyright: shortText(120),
}) satisfies z.ZodType<FooterProps>

export const footerDefaults = (): FooterProps => ({
  brand: 'Acme',
  tagline: 'Landing pages that convert.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ],
  copyright: '© 2026 Acme Inc. All rights reserved.',
})
