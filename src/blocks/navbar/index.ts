import { Menu } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import NavbarBlock from './NavbarBlock.vue'
import { navbarDefaults, navbarSchema } from './schema'

export const navbarBlock = defineBlock({
  type: 'navbar',
  meta: {
    name: 'Navigation',
    description: 'Logo, links and a button; collapses into a menu on mobile',
    category: 'header',
    icon: Menu,
  },
  schema: navbarSchema,
  defaults: navbarDefaults,
  defaultStyle: { spacingTop: 'none', spacingBottom: 'none' },
  fields: [
    { key: 'brand', control: 'text', label: 'Brand' },
    {
      key: 'links',
      control: 'list',
      label: 'Links',
      itemLabel: 'link',
      titleKey: 'label',
      max: 6,
      createItem: () => ({ label: 'Link', href: '#' }),
      fields: [
        { key: 'label', control: 'text', label: 'Label' },
        { key: 'href', control: 'text', label: 'URL', placeholder: 'https://' },
      ],
    },
    { key: 'action', control: 'link', label: 'Button' },
  ],
  component: NavbarBlock,
})

export type { NavbarProps } from './schema'
