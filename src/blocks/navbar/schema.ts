import { z } from 'zod'
import { type BlockLink, linkSchema, shortText } from '@/entities/block'

export type NavbarProps = {
  brand: string
  links: BlockLink[]
  action: BlockLink
}

export const navbarSchema = z.object({
  brand: shortText(40).min(1),
  links: z.array(linkSchema).max(6),
  action: linkSchema,
}) satisfies z.ZodType<NavbarProps>

export const navbarDefaults = (): NavbarProps => ({
  brand: 'Acme',
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  action: { label: 'Sign up', href: '#' },
})
