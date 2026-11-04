import type { CollectionConfig } from 'payload'

/** Leads from the "Free tracking audit" form. Anyone can submit; only admins can read. */
export const AuditRequests: CollectionConfig = {
  slug: 'audit-requests',
  labels: { singular: 'Audit Request', plural: 'Audit Requests' },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website', 'adSpend', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        // Public submissions can't set internal fields.
        if (operation === 'create' && !req.user && data) {
          data.status = 'new'
          delete data.notes
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, maxLength: 120 },
        { name: 'whatsapp', type: 'text', required: true, maxLength: 40 },
      ],
    },
    { name: 'website', type: 'text', required: true, maxLength: 300 },
    {
      type: 'row',
      fields: [
        { name: 'adSpend', type: 'text', maxLength: 60 },
        { name: 'healthScore', type: 'number', min: 0, max: 100, admin: { description: 'Score from the health check quiz, if they took it.' } },
      ],
    },
    { name: 'channels', type: 'text', hasMany: true, maxRows: 10 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Audit sent', value: 'audit-sent' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
