import type { Metadata } from 'next'
import Link from 'next/link'

import { formatDate, getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on performance marketing, marketing automation and healthcare SEO.',
}

export default async function BlogPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 50,
  })

  return (
    <section className="wrap subpage narrow">
      <div className="kicker">Field notes</div>
      <h1>Writing</h1>
      <p className="lede">Practical guides on tracking, lead routing and healthcare SEO.</p>
      {docs.length === 0 ? (
        <p className="empty">The first articles are on the way.</p>
      ) : (
        <ul className="post-list">
          {docs.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`}>
                <h2>{post.title}</h2>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                )}
                {post.excerpt && <p>{post.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
