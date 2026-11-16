import { z } from 'zod'
import { type BlockLink, linkSchema, longText, shortText } from '@/entities/block'

export type PricingPlan = {
  name: string
  price: string
  period: string
  description: string
  features: string
  action: BlockLink
  highlighted: boolean
}

export type PricingProps = {
  eyebrow: string
  title: string
  subtitle: string
  plans: PricingPlan[]
}

export const pricingSchema = z.object({
  eyebrow: shortText(60),
  title: shortText(120),
  subtitle: longText(320),
  plans: z
    .array(
      z.object({
        name: shortText(40).min(1),
        price: shortText(20).min(1),
        period: shortText(30),
        description: longText(200),
        features: longText(1000),
        action: linkSchema,
        highlighted: z.boolean(),
      }),
    )
    .min(1)
    .max(4),
}) satisfies z.ZodType<PricingProps>

export const createPlan = (overrides: Partial<PricingPlan> = {}): PricingPlan => ({
  name: 'Plan',
  price: '$19',
  period: '/month',
  description: 'For growing teams.',
  features: 'Unlimited pages\nCustom domain\nAnalytics',
  action: { label: 'Choose plan', href: '#' },
  highlighted: false,
  ...overrides,
})

export const pricingDefaults = (): PricingProps => ({
  eyebrow: 'Pricing',
  title: 'Simple, transparent pricing',
  subtitle: 'Start free. Upgrade when you grow.',
  plans: [
    createPlan({
      name: 'Starter',
      price: '$0',
      description: 'For side projects.',
      features: '1 page\nBlocksmith subdomain\nCommunity support',
      action: { label: 'Start free', href: '#' },
    }),
    createPlan({
      name: 'Pro',
      price: '$19',
      description: 'For growing products.',
      features: 'Unlimited pages\nCustom domain\nAnalytics\nPriority support',
      action: { label: 'Start trial', href: '#' },
      highlighted: true,
    }),
    createPlan({
      name: 'Team',
      price: '$49',
      description: 'For marketing teams.',
      features: 'Everything in Pro\n5 editors\nSSO\nDedicated manager',
      action: { label: 'Contact sales', href: '#' },
    }),
  ],
})
