import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'headline', type: 'text', required: true },
            { name: 'tagline', type: 'text', admin: { description: 'Short line under the headline on the home page.' } },
            { name: 'summary', type: 'textarea' },
            { name: 'photo', type: 'upload', relationTo: 'media' },
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Key numbers shown on the home page.' },
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
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'location', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'phone', type: 'text', admin: { description: 'Leave empty to keep it off the public site.' } },
            { name: 'linkedin', type: 'text' },
            {
              name: 'whatsapp',
              type: 'text',
              admin: { description: 'International format, digits only, e.g. 60123456789. Powers the WhatsApp buttons.' },
            },
            {
              name: 'bookingUrl',
              type: 'text',
              admin: { description: 'Cal.com or Calendly link for "Book a 20-min call".' },
            },
            { name: 'resumePdf', type: 'upload', relationTo: 'media', label: 'Resume PDF' },
          ],
        },
        {
          label: 'Ask AI',
          description: 'Pre-written questions and answers for the "Ask my AI analyst" section on the home page.',
          fields: [
            {
              name: 'askAi',
              type: 'array',
              labels: { singular: 'Question', plural: 'Questions' },
              maxRows: 8,
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Resume',
          fields: [
            {
              name: 'skills',
              type: 'array',
              fields: [
                { name: 'category', type: 'text', required: true },
                { name: 'items', type: 'textarea', required: true },
              ],
            },
            {
              name: 'education',
              type: 'array',
              fields: [
                { name: 'degree', type: 'text', required: true },
                { name: 'institution', type: 'text', required: true },
                { name: 'period', type: 'text' },
                { name: 'details', type: 'textarea' },
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'issuer', type: 'text' },
                { name: 'year', type: 'text' },
              ],
            },
            {
              name: 'languages',
              type: 'array',
              fields: [
                { name: 'language', type: 'text', required: true },
                { name: 'level', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
