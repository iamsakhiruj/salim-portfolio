import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getProfile = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'profile', depth: 1 })
})

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' })

export const formatPeriod = (start: string, end?: string | null) =>
  `${monthYear.format(new Date(start))} – ${end ? monthYear.format(new Date(end)) : 'Present'}`

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(date),
  )

export const siteURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const linkedinURL = (handle?: string | null) =>
  handle ? `https://${handle.replace(/^https?:\/\//, '')}` : null

export const whatsappURL = (number?: string | null, text = 'Hi Salim, I saw your website and would like to talk.') => {
  const digits = number?.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null
}

type LexicalNode = { text?: unknown; children?: unknown }

/** Rough reading time from a Lexical rich-text document (220 words a minute). */
export const readingTime = (content?: { root: unknown } | null) => {
  if (!content) return null
  const words: string[] = []
  const walk = (node: LexicalNode) => {
    if (typeof node.text === 'string') words.push(...node.text.split(/\s+/).filter(Boolean))
    if (Array.isArray(node.children)) node.children.forEach(walk)
  }
  walk(content.root as LexicalNode)
  return words.length ? Math.max(1, Math.round(words.length / 220)) : null
}
