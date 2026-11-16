import type { AnyBlockDefinition } from '@/entities/block'
import { ctaBlock } from './cta'
import { faqBlock } from './faq'
import { featuresBlock } from './features'
import { footerBlock } from './footer'
import { heroBlock } from './hero'
import { navbarBlock } from './navbar'
import { pricingBlock } from './pricing'
import { testimonialsBlock } from './testimonials'

export const blockDefinitions: readonly AnyBlockDefinition[] = [
  navbarBlock,
  heroBlock,
  featuresBlock,
  testimonialsBlock,
  faqBlock,
  pricingBlock,
  ctaBlock,
  footerBlock,
]

export { PAGE_TEMPLATES, type PageTemplate } from './templates'
