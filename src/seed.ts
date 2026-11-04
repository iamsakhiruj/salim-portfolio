/**
 * Seeds the profile, experience and draft case studies from the resume.
 * Run with: npm run seed
 * Skips collections that already contain documents, so it is safe to re-run.
 */
import { getPayload } from 'payload'

import config from '@/payload.config'

const text = (value: string) => ({
  type: 'text',
  text: value,
  format: 0,
  mode: 'normal',
  style: '',
  detail: 0,
  version: 1,
})

const block = (type: 'heading' | 'paragraph', value: string) => ({
  type,
  ...(type === 'heading' ? { tag: 'h2' } : { textFormat: 0, textStyle: '' }),
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [text(value)],
})

/** Builds a Lexical document from [heading, paragraph] pairs. */
const richText = (sections: [string, string][]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: sections.flatMap(([heading, body]) => [
      block('heading', heading),
      block('paragraph', body),
    ]),
  },
})

const payload = await getPayload({ config })

const existingProfile = await payload.findGlobal({ slug: 'profile' })

// Only fill the profile on a fresh database, so edits made in the admin are kept.
if (!existingProfile.name) await payload.updateGlobal({
  slug: 'profile',
  data: {
    name: 'Md Sakhirujjaman Salim',
    headline: 'Digital Marketing Manager building the systems marketing runs on',
    tagline:
      'Performance marketing, marketing automation and AI for a multi-country private healthcare group.',
    summary:
      'Digital marketing manager with 4+ years leading marketing for a multi-country private healthcare group. I lead a team across content, design, paid media and web, own a portfolio of 9 clinic websites in Malaysia, the Philippines and Indonesia, and direct approximately RM480,000 a year in paid media managed to cost-per-lead and conversion targets.\n\nI build the automation the marketing runs on, rather than buying it: a Meta Graph API reporting pipeline covering 17 Facebook Pages with AI-generated weekly analysis, and a custom omnichannel lead management platform handling 50–200 inquiries a day across Meta and WhatsApp.',
    location: 'Kuala Lumpur, Malaysia',
    email: 'sakhiruj.jaman.salim@gmail.com',
    linkedin: 'linkedin.com/in/sakhiruj-jaman-salim',
    stats: [
      { value: 'RM480k', label: 'Annual paid media managed' },
      { value: '9', label: 'Clinic websites across 3 countries' },
      { value: '17', label: 'Facebook Pages on automated reporting' },
      { value: '50–200', label: 'Inquiries a day through my lead system' },
    ],
    skills: [
      {
        category: 'Automation & AI',
        items:
          'AI agents for automated reporting and analysis, Claude API, Meta Graph API pipelines, webhook architecture, scheduled data collection, workflow automation',
      },
      {
        category: 'Marketing technology',
        items:
          'Meta Conversions API (server-side tracking), WhatsApp Cloud API, Meta Graph API, Google Tag Manager, Google Analytics 4, schema markup, conversion tracking & attribution',
      },
      {
        category: 'Paid media',
        items: 'Google Ads, Meta Ads Manager & Pixel, TikTok Ads, LinkedIn Ads, YouTube',
      },
      {
        category: 'SEO',
        items:
          'SEMrush, Google Search Console, technical audits, Core Web Vitals, local SEO, backlink acquisition',
      },
      {
        category: 'Development',
        items:
          'WordPress (custom plugins & themes), PHP, JavaScript, React, Node.js, Next.js, Tailwind, MySQL, MongoDB',
      },
      {
        category: 'Design',
        items: 'Figma, Adobe XD, Photoshop, Illustrator, Premiere Pro, Canva, CapCut',
      },
    ],
    education: [
      {
        degree: 'PhD in ICT',
        institution: 'University Selangor (UNISEL), Malaysia',
        period: 'Feb 2023 – Expected 2027',
        details:
          'Research area: An Enhanced Requirement Engineering Framework for IoT-based Application Development',
      },
      {
        degree: 'Master of Software Engineering',
        institution: 'Asia Pacific University of Technology & Innovation (APU), Malaysia',
        period: '2022',
      },
      {
        degree: 'BSc in Telecommunication Engineering',
        institution: 'United International University, Bangladesh',
        period: '2016',
      },
    ],
    certifications: [
      { name: 'DevOps Engineering', issuer: 'CSL Training', year: '2025' },
      { name: 'CCNA Security', issuer: 'Cisco Networking Academy', year: '2017' },
      { name: 'Full Stack Web Development', issuer: 'Coderstrust', year: '2017' },
      { name: 'CCNA', issuer: 'Cisco Networking Academy', year: '2016' },
    ],
    languages: [
      { language: 'English', level: 'Professional working proficiency' },
      { language: 'Malay', level: 'Professional working proficiency' },
      { language: 'Bangla', level: 'Native' },
      { language: 'Hindi', level: 'Basic' },
    ],
  },
})
payload.logger.info(existingProfile.name ? 'Profile already set, skipped' : 'Profile seeded')

// Fields added with the client-facing home page. Each is only set while still empty.
const profile = await payload.findGlobal({ slug: 'profile' })
const oldTagline =
  'Performance marketing, marketing automation and AI for a multi-country private healthcare group.'
await payload.updateGlobal({
  slug: 'profile',
  data: {
    ...(!profile.tagline || profile.tagline === oldTagline
      ? {
          tagline:
            "I'm Salim, a digital marketing manager who builds the systems behind the funnel: ads, tracking, WhatsApp lead routing and AI reporting, for a healthcare group across Malaysia, the Philippines and Indonesia.",
        }
      : {}),
    ...(!profile.askAi?.length
      ? {
          askAi: [
            {
              question: 'What did Salim actually build?',
              answer:
                'Two systems running in production:\n• A Meta Graph API reporting pipeline across 17 Facebook Pages + Instagram, with an AI agent that writes the weekly analysis.\n• An omnichannel lead hub that routes 50–200 WhatsApp and Messenger inquiries a day.\nHe also built server-side Conversions API tracking, a booking system and custom WordPress plugins.',
            },
            {
              question: 'Can he fix my tracking?',
              answer:
                'Yes. He sets up Google Tag Manager, Meta Pixel, TikTok Pixel and the Conversions API so your ads see every lead, including iOS. Start with the free tracking audit below.',
            },
            {
              question: 'How big is the budget he manages?',
              answer:
                'About RM40,000 a month, roughly RM480,000 a year, across Meta, Google, TikTok and LinkedIn. He sets KPIs, watches cost per lead and moves budget monthly.',
            },
            {
              question: 'Why him over a typical agency?',
              answer:
                'Because he can do both: set the strategy and build the tools that run it. Fewer SaaS subscriptions, better data, faster decisions.',
            },
            {
              question: 'How do I start?',
              answer:
                'Request the free tracking audit at the bottom of this page, or message him on WhatsApp. He is based in Kuala Lumpur and works with businesses across Malaysia, the Philippines and Indonesia.',
            },
          ],
        }
      : {}),
  },
})

const { totalDocs: serviceCount } = await payload.count({ collection: 'services' })
if (serviceCount === 0) {
  const services = [
    {
      title: 'Tracking Setup',
      icon: '🎯',
      pitch: 'See every lead your ads actually bring in, even after iOS.',
      includes: ['Google Tag Manager', 'Meta Pixel + Conversions API', 'TikTok Pixel + Events API', 'GA4 conversions & test report'],
      timeline: '5–7 days',
      bestFor: 'anyone running ads',
      ctaLabel: 'Start with a free audit →',
    },
    {
      title: 'WhatsApp Lead System',
      icon: '💬',
      pitch: 'Every inquiry captured, assigned and traced back to its ad.',
      includes: ['WhatsApp Cloud API setup', 'Auto-assign to your team', 'Source tracking per page & ad', 'Lead dashboard'],
      timeline: '2–3 weeks',
      bestFor: 'clinics & services',
    },
    {
      title: 'SEO to #1',
      icon: '📈',
      pitch: 'Get found on Google for the services people search for.',
      includes: ['Technical SEO audit & fixes', 'E-E-A-T content strategy', 'Local SEO & schema', 'Link building & tracking'],
      timeline: 'monthly',
      bestFor: 'local & healthcare',
    },
    {
      title: 'Growth Partner',
      icon: '🚀',
      pitch: 'Full business development: ads, tracking, leads and SEO, run as one system.',
      includes: ['Meta, Google & TikTok ads', 'Tracking + WhatsApp system', 'SEO every month', 'AI-written weekly report'],
      timeline: 'monthly retainer',
      bestFor: 'growing businesses',
      ctaLabel: 'Book a call →',
      featured: true,
    },
  ]
  for (const [order, { includes, ...service }] of services.entries()) {
    await payload.create({
      collection: 'services',
      data: { ...service, order, includes: includes.map((item) => ({ item })) },
    })
  }
  payload.logger.info(`Seeded ${services.length} services`)
}

const { totalDocs: testimonialCount } = await payload.count({ collection: 'testimonials' })
if (testimonialCount === 0) {
  await payload.create({
    collection: 'testimonials',
    data: {
      kind: 'result',
      value: '−30%',
      text: 'Customer acquisition cost, after restructuring paid campaigns, landing pages and conversion tracking.',
      name: 'Easy Hotel',
      business: 'Hospitality',
      location: 'Kuala Lumpur',
      published: true,
    },
  })
  payload.logger.info('Seeded 1 result card (add real client quotes in the admin)')
}

const { totalDocs: roleCount } = await payload.count({ collection: 'experience' })
if (roleCount === 0) {
  const roles = [
    {
      role: 'Digital Marketing Manager',
      company: 'Klinik Dr Inder Sdn Bhd',
      industry: 'Private healthcare group — Malaysia, the Philippines and Indonesia',
      location: 'Kuala Lumpur',
      startDate: '2022-05-01',
      highlights: [
        'Lead a team across content, design, paid media and web, setting priorities, reviewing output and building capability to support clinic operations in three markets.',
        'Own a portfolio of 9 clinic websites across Malaysia, the Philippines and Indonesia, covering content cycles, on-page optimization, information architecture, uptime and technical health.',
        'Plan and manage RM40,000 per month (approx. RM480,000 annually) in paid media across Google Ads, Meta, TikTok and LinkedIn, setting campaign KPIs, monitoring cost per lead and reallocating budget monthly against performance.',
        'Built server-side conversion tracking on the Meta Conversions API, restoring attribution accuracy lost to browser and iOS signal restrictions.',
        'Built and operate an automated Meta Graph API reporting pipeline covering 17 Facebook Pages and their linked Instagram accounts, with an AI agent that produces the weekly performance analysis.',
        'Designed and deployed a custom omnichannel lead management system handling 50–200 inquiries per day across 17 Facebook Pages and the WhatsApp Cloud API.',
        'Built a custom appointment booking system and custom WordPress plugins and themes deployed across the website portfolio.',
        'Run daily SEO operations in SEMrush. Secured #1 organic positions on Google for priority treatment keywords and grew the flagship site to over 10,000 organic visitors per month.',
        'Apply healthcare content standards (E-E-A-T / YMYL) to treatment and doctor pages, working with clinical staff to keep medical content accurate and search-visible.',
      ],
    },
    {
      role: 'Web Developer & Digital Marketing (Part-Time)',
      company: 'Easy Hotel Sdn Bhd',
      industry: 'Hospitality',
      location: 'Kuala Lumpur',
      startDate: '2022-01-01',
      highlights: [
        'Reduced customer acquisition cost by 30% through restructured paid campaigns, landing page optimization and improved conversion tracking.',
        'Built and maintain the hotel website and manage OTA promotions.',
        'Implement SEO, Google Analytics, Search Console, Google Ads and Tag Manager; run retargeting, display and YouTube campaigns.',
      ],
    },
    {
      role: 'Web Developer',
      company: 'Ant Robotics Ltd',
      industry: 'IoT technology',
      location: 'Dhaka, Bangladesh',
      startDate: '2019-01-01',
      endDate: '2021-11-01',
      highlights: [
        'Developed and optimized IoT-based web platforms, integrating new technologies and improving site performance against user feedback.',
        'Implemented security protocols to improve data integrity and system reliability; provided technical training to internal teams.',
      ],
    },
    {
      role: 'Project Engineer, SOC (Contract)',
      company: 'Robi Axiata Ltd',
      industry: 'Telecommunications',
      location: 'Dhaka, Bangladesh',
      startDate: '2017-11-01',
      endDate: '2018-12-01',
      highlights: [
        'Monitored 3G and 4G network performance in real time and managed first-line support for Radio Access Network quality and uptime.',
      ],
    },
  ]

  for (const { highlights, ...role } of roles) {
    await payload.create({
      collection: 'experience',
      data: { ...role, highlights: highlights.map((item) => ({ text: item })) },
    })
  }
  payload.logger.info(`Seeded ${roles.length} roles`)
}

const { totalDocs: studyCount } = await payload.count({ collection: 'case-studies' })
if (studyCount === 0) {
  // Created as drafts: each needs a full write-up and verified results before publishing.
  const studies = [
    {
      title: 'Automated Meta reporting with an AI analyst',
      summary:
        'A Graph API pipeline that collects metrics from 17 Facebook Pages and their Instagram accounts, and an AI agent that writes the weekly performance analysis.',
      stack: ['Meta Graph API', 'Claude API', 'Scheduled jobs', 'SQL'],
      results: [{ value: '17', label: 'Facebook Pages + linked Instagram accounts' }],
      featured: true,
      order: 1,
      content: richText([
        ['The problem', 'Weekly reporting across many pages was manual and slow. [Describe the before state and time spent.]'],
        ['What I built', 'Batched Graph API requests, scheduled collection into a metrics database, and an AI agent that produces the weekly analysis.'],
        ['Results', '[Hours saved per week, decisions it changed.]'],
      ]),
    },
    {
      title: 'Omnichannel lead management platform',
      summary:
        'A custom system that ingests 50–200 inquiries a day from 17 Facebook Pages and WhatsApp, assigns them to agents and attributes every lead to its source.',
      stack: ['WhatsApp Cloud API', 'Meta Webhooks', 'Node.js', 'SQL'],
      results: [{ value: '50–200', label: 'Inquiries handled per day' }],
      featured: true,
      order: 2,
      content: richText([
        ['The problem', '[How leads were handled before and what was lost.]'],
        ['What I built', 'Webhook ingestion, a normalized lead database, automated agent assignment and per-page source attribution.'],
        ['Results', '[Response time, lead-to-booking rate, lost leads.]'],
      ]),
    },
    {
      title: 'Server-side tracking with the Meta Conversions API',
      summary:
        'Restoring attribution lost to browser and iOS signal restrictions across a multi-site clinic group.',
      stack: ['Meta Conversions API', 'Google Tag Manager', 'GA4'],
      featured: true,
      order: 3,
      content: richText([
        ['The problem', 'Browser and iOS restrictions were hiding conversions from ad platforms.'],
        ['What I built', '[Event design, deduplication, how it was deployed across sites.]'],
        ['Results', '[Event Match Quality, attributed conversions, CPL change.]'],
      ]),
    },
    {
      title: 'Healthcare SEO: 10,000+ organic visitors a month',
      summary:
        'Technical SEO, E-E-A-T content standards and link acquisition that took priority treatment keywords to #1 on Google.',
      stack: ['SEMrush', 'Search Console', 'Schema markup', 'WordPress'],
      results: [{ value: '10,000+', label: 'Organic visitors a month' }],
      order: 4,
      content: richText([
        ['The problem', '[Starting traffic and rankings.]'],
        ['What I did', 'Technical audits, keyword gap and competitor analysis, E-E-A-T / YMYL standards on treatment and doctor pages, and backlink acquisition.'],
        ['Results', 'Secured #1 positions for priority treatment keywords. [Growth from X.]'],
      ]),
    },
  ]

  for (const study of studies) {
    await payload.create({
      collection: 'case-studies',
      draft: true,
      data: { ...study, _status: 'draft' },
    })
  }
  payload.logger.info(`Seeded ${studies.length} draft case studies`)
}

process.exit(0)
