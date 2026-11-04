import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
  },
  versions: { drafts: true },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea' },
    {
      name: 'category',
      type: 'select',
      options: ['Tracking', 'Automation', 'SEO', 'Paid Ads', 'Strategy'],
      admin: { position: 'sidebar' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText' },
    slugField(),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            !value && siblingData._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
  ],
}
