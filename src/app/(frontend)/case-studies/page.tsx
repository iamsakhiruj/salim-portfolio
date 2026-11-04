import type { Metadata } from 'next'

import { CaseStudyCard } from '@/components/CaseStudyCard'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Marketing systems, automation and growth work, with the architecture and results.',
}

export default async function CaseStudiesPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { _status: { equals: 'published' } },
    limit: 50,
  })

  return (
    <section className="wrap subpage">
      <div className="kicker">Work</div>
      <h1>Case studies</h1>
      <p className="lede">Marketing systems I built and run, with the architecture and the results.</p>
      {docs.length === 0 ? (
        <p className="empty">Case studies are on the way.</p>
      ) : (
        <div className="card-grid">
          {docs.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </section>
  )
}
