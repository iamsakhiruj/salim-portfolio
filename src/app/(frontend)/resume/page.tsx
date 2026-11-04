import type { Metadata } from 'next'

import { formatPeriod, getPayloadClient, getProfile } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Resume',
}

export default async function ResumePage() {
  const payload = await getPayloadClient()
  const profile = await getProfile()
  const { docs: roles } = await payload.find({ collection: 'experience', limit: 50 })
  const resumePdf = typeof profile.resumePdf === 'object' ? profile.resumePdf : null

  return (
    <section className="wrap subpage narrow">
      <div className="head-row">
        <h1>Resume</h1>
        {resumePdf?.url && (
          <a href={resumePdf.url} className="btn btn-glow" download>
            Download PDF
          </a>
        )}
      </div>

      {profile.summary && <p className="prose-text">{profile.summary}</p>}

      <h2>Experience</h2>
      {roles.map((role) => (
        <div key={role.id} className="resume-entry">
          <div className="entry-head">
            <h3>
              {role.role} <span className="muted">· {role.company}</span>
            </h3>
            <span className="muted">{formatPeriod(role.startDate, role.endDate)}</span>
          </div>
          {(role.industry || role.location) && (
            <p className="muted small">
              {[role.industry, role.location].filter(Boolean).join(' · ')}
            </p>
          )}
          {role.highlights && role.highlights.length > 0 && (
            <ul>
              {role.highlights.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {profile.skills && profile.skills.length > 0 && (
        <>
          <h2>Skills</h2>
          <dl className="skills">
            {profile.skills.map((group) => (
              <div key={group.id}>
                <dt>{group.category}</dt>
                <dd>{group.items}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      {profile.education && profile.education.length > 0 && (
        <>
          <h2>Education</h2>
          {profile.education.map((item) => (
            <div key={item.id} className="resume-entry">
              <div className="entry-head">
                <h3>{item.degree}</h3>
                {item.period && <span className="muted">{item.period}</span>}
              </div>
              <p className="muted small">{item.institution}</p>
              {item.details && <p>{item.details}</p>}
            </div>
          ))}
        </>
      )}

      {profile.certifications && profile.certifications.length > 0 && (
        <>
          <h2>Certifications</h2>
          <ul>
            {profile.certifications.map((cert) => (
              <li key={cert.id}>
                {cert.name}
                {cert.issuer && ` — ${cert.issuer}`}
                {cert.year && ` (${cert.year})`}
              </li>
            ))}
          </ul>
        </>
      )}

      {profile.languages && profile.languages.length > 0 && (
        <>
          <h2>Languages</h2>
          <p>
            {profile.languages
              .map((l) => (l.level ? `${l.language} (${l.level})` : l.language))
              .join(' · ')}
          </p>
        </>
      )}
    </section>
  )
}
