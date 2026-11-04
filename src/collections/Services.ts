import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'timeline', 'featured', 'order'],
  },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'icon', type: 'text', admin: { description: 'One emoji, e.g. 🎯' } },
      ],
    },
    { name: 'pitch', type: 'textarea', required: true, admin: { description: 'One sentence: the result the client gets.' } },
    {
      name: 'includes',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        { name: 'timeline', type: 'text' },
        { name: 'bestFor', type: 'text' },
      ],
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Ask about it →' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlight as "Most complete".' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
