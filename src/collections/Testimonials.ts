import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials & Results' },
  access: {
    read: ({ req: { user } }) => (user ? true : { published: { equals: true } }),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'business', 'kind', 'published'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'kind',
      type: 'radio',
      defaultValue: 'quote',
      options: [
        { label: 'Client quote', value: 'quote' },
        { label: 'Result (big number)', value: 'result' },
      ],
    },
    {
      name: 'value',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.kind === 'result',
        description: 'The headline number, e.g. "−30%".',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: { description: 'The quote, or what the result number means.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Person or business name' } },
        { name: 'role', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'business', type: 'text' },
        { name: 'location', type: 'text' },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Only publish quotes you have permission to use.' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
