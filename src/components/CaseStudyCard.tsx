import Link from 'next/link'

import type { CaseStudy } from '@/payload-types'

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const topResult = study.results?.[0]

  return (
    <Link href={`/case-studies/${study.slug}`} className="card reveal">
      {topResult && (
        <p className="card-stat">
          <strong>{topResult.value}</strong> {topResult.label}
        </p>
      )}
      <h3>{study.title}</h3>
      <p>{study.summary}</p>
      {study.stack && study.stack.length > 0 && (
        <ul className="tags">
          {study.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </Link>
  )
}
