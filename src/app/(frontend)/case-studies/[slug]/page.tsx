import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

const getStudy = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
  })
  return docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getStudy((await params).slug)
  return study ? { title: study.title, description: study.summary } : {}
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await getStudy((await params).slug)
  if (!study) notFound()

  return (
    <article className="wrap subpage narrow">
      <Link href="/case-studies" className="back">
        ← Case studies
      </Link>
      <h1>{study.title}</h1>
      <p className="lede">{study.summary}</p>

      {study.results && study.results.length > 0 && (
        <dl className="result-grid">
          {study.results.map((result) => (
            <div key={result.id}>
              <dt>{result.label}</dt>
              <dd>{result.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {study.stack && study.stack.length > 0 && (
        <ul className="tags">
          {study.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {study.content && <RichText data={study.content} className="prose" />}
    </article>
  )
}
