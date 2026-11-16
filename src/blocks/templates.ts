import { createBlock } from '@/entities/block'
import { createDocument, type PageDocument } from '@/entities/document'
import { THEME_PRESETS } from '@/entities/theme'
import { ctaBlock } from './cta'
import { faqBlock } from './faq'
import { featuresBlock } from './features'
import { footerBlock } from './footer'
import { heroBlock } from './hero'
import { navbarBlock } from './navbar'
import { createPlan } from './pricing/schema'
import { pricingBlock } from './pricing'
import { testimonialsBlock } from './testimonials'

export type PageTemplate = {
  id: string
  name: string
  description: string
  create: (name?: string) => PageDocument
}

const preset = (id: string) => THEME_PRESETS.find((p) => p.id === id)!.theme

const saas: PageTemplate = {
  id: 'saas',
  name: 'SaaS product',
  description: 'Full product page with pricing and FAQ',
  create: (name = 'Acme Analytics') =>
    createDocument({
      name,
      theme: preset('indigo'),
      blocks: [
        createBlock(navbarBlock, { brand: 'Acme' }),
        createBlock(heroBlock, {
          eyebrow: 'Now with real-time dashboards',
          title: 'Understand your users without the guesswork',
          subtitle:
            'Acme turns raw events into clear answers. Set up in five minutes, no data team required.',
          primaryAction: { label: 'Start free trial', href: '#' },
          secondaryAction: { label: 'Book a demo', href: '#' },
        }),
        createBlock(featuresBlock, {
          eyebrow: 'Why Acme',
          title: 'Analytics that answer questions',
          subtitle: 'Everything a growing product team needs — and nothing it doesn’t.',
          columns: 3,
          items: [
            { icon: 'gauge', title: 'Real-time', description: 'Events show up in under a second.' },
            {
              icon: 'users',
              title: 'Cohorts & funnels',
              description: 'See where users drop off and who comes back.',
            },
            {
              icon: 'lock',
              title: 'Privacy first',
              description: 'No cookies, GDPR-compliant, data stays in the EU.',
            },
            {
              icon: 'puzzle',
              title: '40+ integrations',
              description: 'Connect Stripe, HubSpot, Segment and more in one click.',
            },
            {
              icon: 'chart',
              title: 'Custom reports',
              description: 'Build any chart with a visual query builder.',
            },
            {
              icon: 'sparkles',
              title: 'AI insights',
              description: 'Get notified when a metric changes unexpectedly.',
            },
          ],
        }),
        createBlock(testimonialsBlock),
        createBlock(pricingBlock),
        createBlock(faqBlock),
        createBlock(ctaBlock, {
          title: 'Start making better product decisions',
          subtitle: '14-day free trial. No credit card required.',
          action: { label: 'Create an account', href: '#' },
        }),
        createBlock(footerBlock),
      ],
    }),
}

const mobileApp: PageTemplate = {
  id: 'app',
  name: 'Mobile app',
  description: 'Launch page for an app with a left-aligned hero',
  create: (name = 'Pocket') =>
    createDocument({
      name,
      theme: preset('emerald'),
      blocks: [
        createBlock(navbarBlock, {
          brand: 'Pocket',
          links: [
            { label: 'How it works', href: '#' },
            { label: 'Reviews', href: '#' },
          ],
          action: { label: 'Download', href: '#' },
        }),
        createBlock(heroBlock, {
          eyebrow: 'Rated 4.9 on the App Store',
          title: 'Your money, finally under control',
          subtitle:
            'Pocket sorts every expense automatically and tells you what you can spend today.',
          primaryAction: { label: 'Download for free', href: '#' },
          secondaryAction: { label: 'See how it works', href: '#' },
          align: 'left',
        }),
        createBlock(featuresBlock, {
          eyebrow: 'How it works',
          title: 'Budgeting without spreadsheets',
          subtitle: '',
          columns: 2,
          items: [
            {
              icon: 'zap',
              title: 'Automatic categories',
              description: 'Connect your bank once — Pocket does the rest.',
            },
            {
              icon: 'chart',
              title: 'Daily allowance',
              description: 'One number that tells you how much you can spend today.',
            },
            {
              icon: 'shield',
              title: 'Bank-level security',
              description: 'Read-only access, encrypted end to end.',
            },
            {
              icon: 'users',
              title: 'Shared budgets',
              description: 'Plan together with your partner or roommates.',
            },
          ],
        }),
        createBlock(testimonialsBlock, {
          eyebrow: 'Reviews',
          title: '120,000 people budget with Pocket',
        }),
        createBlock(ctaBlock, {
          title: 'Take control of your money today',
          subtitle: 'Free on iOS and Android.',
          action: { label: 'Get the app', href: '#' },
          tone: 'subtle',
        }),
        createBlock(footerBlock, {
          brand: 'Pocket',
          tagline: 'Budgeting that runs itself.',
          copyright: '© 2026 Pocket Finance Ltd.',
        }),
      ],
    }),
}

const course: PageTemplate = {
  id: 'course',
  name: 'Online course',
  description: 'Editorial look with curriculum, pricing and FAQ',
  create: (name = 'The Craft of Writing') =>
    createDocument({
      name,
      theme: preset('editorial'),
      blocks: [
        createBlock(navbarBlock, {
          brand: 'The Craft',
          links: [
            { label: 'Curriculum', href: '#' },
            { label: 'Enroll', href: '#' },
          ],
          action: { label: 'Join the course', href: '#' },
        }),
        createBlock(heroBlock, {
          eyebrow: 'Next cohort starts March 3',
          title: 'Write clearly. Think clearly.',
          subtitle:
            'A six-week course on writing that people actually finish reading. Live sessions, weekly feedback, a small group.',
          primaryAction: { label: 'Reserve your seat', href: '#' },
          secondaryAction: { label: 'Read the syllabus', href: '#' },
        }),
        createBlock(featuresBlock, {
          eyebrow: 'Curriculum',
          title: 'What you’ll learn',
          subtitle: '',
          columns: 3,
          items: [
            {
              icon: 'layers',
              title: 'Structure',
              description: 'Outline before you write; lead with the point.',
            },
            {
              icon: 'sparkles',
              title: 'Style',
              description: 'Short sentences, concrete words, active voice.',
            },
            {
              icon: 'heart',
              title: 'Voice',
              description: 'Sound like a person, not a press release.',
            },
          ],
        }),
        createBlock(pricingBlock, {
          eyebrow: 'Enroll',
          title: 'Two ways to join',
          subtitle: '',
          plans: [
            createPlan({
              name: 'Self-paced',
              price: '$149',
              period: 'once',
              description: 'All recordings and exercises.',
              features: '6 recorded lessons\nExercises & templates\nLifetime access',
              action: { label: 'Buy self-paced', href: '#' },
            }),
            createPlan({
              name: 'Cohort',
              price: '$490',
              period: 'once',
              description: 'Live sessions and personal feedback.',
              features: 'Everything in self-paced\n6 live workshops\nWeekly feedback\nCertificate',
              action: { label: 'Join the cohort', href: '#' },
              highlighted: true,
            }),
          ],
        }),
        createBlock(faqBlock, {
          title: 'Questions',
          subtitle: '',
          items: [
            {
              question: 'Who is this course for?',
              answer: 'Anyone who writes at work: engineers, designers, founders, managers.',
            },
            {
              question: 'How much time does it take?',
              answer: 'About three hours a week: one live session and one writing exercise.',
            },
          ],
        }),
        createBlock(footerBlock, {
          brand: 'The Craft',
          tagline: 'A course on clear writing.',
          columns: [],
          copyright: '© 2026 The Craft of Writing',
        }),
      ],
    }),
}

export const PAGE_TEMPLATES: readonly PageTemplate[] = [saas, mobileApp, course]
