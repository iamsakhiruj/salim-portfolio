import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', '_status', 'updatedAt'],
  },
  versions: { drafts: true },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences shown on cards and in search results.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'results',
      type: 'array',
      admin: { description: 'Headline numbers, e.g. "10,000+" / "organic visitors a month".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'content', type: 'richText' },
    slugField(),
    {
      name: 'stack',
      type: 'text',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
