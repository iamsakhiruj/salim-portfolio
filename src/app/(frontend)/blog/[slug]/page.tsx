import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDate, getPayloadClient } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

const getPost = async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
  })
  return docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  return post ? { title: post.title, description: post.excerpt ?? undefined } : {}
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug)
  if (!post) notFound()

  return (
    <article className="wrap subpage narrow">
      <Link href="/blog" className="back">
        ← Writing
      </Link>
      <h1>{post.title}</h1>
      {post.publishedAt && (
        <time className="muted" dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
      )}
      {post.content && <RichText data={post.content} className="prose" />}
    </article>
  )
}
