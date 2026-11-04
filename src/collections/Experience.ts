import type { CollectionConfig } from 'payload'

export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: { singular: 'Role', plural: 'Experience' },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'company', 'startDate', 'endDate'],
  },
  defaultSort: '-startDate',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'role', type: 'text', required: true },
        { name: 'company', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'industry', type: 'text' },
        { name: 'location', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
            description: 'Leave empty for a current role.',
          },
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
  ],
}
