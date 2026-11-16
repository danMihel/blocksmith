import { PanelBottom } from '@lucide/vue'
import { defineBlock } from '@/entities/block'
import FooterBlock from './FooterBlock.vue'
import { footerDefaults, footerSchema } from './schema'

export const footerBlock = defineBlock({
  type: 'footer',
  meta: {
    name: 'Footer',
    description: 'Brand, link columns and copyright',
    category: 'footer',
    icon: PanelBottom,
  },
  schema: footerSchema,
  defaults: footerDefaults,
  defaultStyle: { spacingTop: 'md', spacingBottom: 'md' },
  fields: [
    { key: 'brand', control: 'text', label: 'Brand' },
    { key: 'tagline', control: 'textarea', label: 'Tagline', rows: 2 },
    {
      key: 'columns',
      control: 'list',
      label: 'Columns',
      itemLabel: 'column',
      titleKey: 'title',
      max: 4,
      createItem: () => ({ title: 'Column', links: [{ label: 'Link', href: '#' }] }),
      fields: [
        { key: 'title', control: 'text', label: 'Title' },
        {
          key: 'links',
          control: 'list',
          label: 'Links',
          itemLabel: 'link',
          titleKey: 'label',
          max: 8,
          createItem: () => ({ label: 'Link', href: '#' }),
          fields: [
            { key: 'label', control: 'text', label: 'Label' },
            { key: 'href', control: 'text', label: 'URL' },
          ],
        },
      ],
    },
    { key: 'copyright', control: 'text', label: 'Copyright' },
  ],
  component: FooterBlock,
})

export type { FooterProps } from './schema'
