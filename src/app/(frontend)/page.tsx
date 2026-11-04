import Link from 'next/link'

import { AskAi } from '@/components/site/AskAi'
import { AuditForm } from '@/components/site/AuditForm'
import { Globe } from '@/components/site/Globe'
import { HealthCheck } from '@/components/site/HealthCheck'
import { Journey } from '@/components/site/Journey'
import {
  getPayloadClient,
  getProfile,
  linkedinURL,
  readingTime,
  siteURL,
  whatsappURL,
} from '@/lib/payload'
import type { Post } from '@/payload-types'

const year = (date?: string | null) => (date ? new Date(date).getFullYear() : 'Now')

const POST_BADGE: Record<string, string> = {
  Tracking: 'CAPI',
  Automation: 'API',
  SEO: '#1',
  'Paid Ads': 'ADS',
  Strategy: '→',
}

function PostCard({ post, feature }: { post: Post; feature?: boolean }) {
  const minutes = readingTime(post.content)
  const cover = typeof post.coverImage === 'object' ? post.coverImage : null
  return (
    <Link href={`/blog/${post.slug}`} className={`post reveal${feature ? ' feature' : ''}`}>
      <div
        className="cover"
        style={
          cover?.url
            ? { backgroundImage: `url(${cover.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {
                background:
                  'radial-gradient(400px 220px at 80% 20%, rgba(139,92,246,.35), transparent 70%), radial-gradient(300px 200px at 10% 100%, rgba(52,245,197,.18), transparent 70%), #0a0d1d',
              }
        }
      >
        {!cover?.url && <div className="badge grad">{POST_BADGE[post.category ?? ''] ?? 'NOTE'}</div>}
      </div>
      <div className="body">
        <div className="meta">
          {post.category && <span className="cat">{post.category}</span>}
          {minutes && <span>{minutes} min read</span>}
        </div>
        <h3>{post.title}</h3>
        {feature && post.excerpt && <p>{post.excerpt}</p>}
        <span className="read">{feature ? 'Read the guide →' : 'Read →'}</span>
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const profile = await getProfile()
  const [services, testimonials, posts, roles] = await Promise.all([
    payload.find({ collection: 'services', limit: 8, depth: 0 }),
    payload.find({ collection: 'testimonials', where: { published: { equals: true } }, limit: 6 }),
    payload.find({ collection: 'posts', where: { _status: { equals: 'published' } }, limit: 3 }),
    payload.find({ collection: 'experience', limit: 4, depth: 0 }),
  ])
  const wa = whatsappURL(profile.whatsapp)
  const linkedin = linkedinURL(profile.linkedin)
  const askAi = (profile.askAi ?? []).map(({ question, answer }) => ({ question, answer }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: siteURL,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { '@type': 'PostalAddress', addressLocality: profile.location } : undefined,
    sameAs: linkedin ? [linkedin] : [],
    makesOffer: services.docs.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.pitch },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* HERO */}
      <section className="wrap hero">
        <div>
          <div className="kicker">
            <span className="blink" />
            Growth engineer{profile.location && ` · ${profile.location.split(',')[0]}`}
          </div>
          <h1>
            <span className="line">
              <span>Every lead</span>
            </span>
            <span className="line">
              <span>has a journey.</span>
            </span>
            <span className="line">
              <span className="grad">I engineer it.</span>
            </span>
          </h1>
          {profile.tagline && <p>{profile.tagline}</p>}
          <div className="row">
            <a href="#audit" className="btn btn-glow">
              Get a free tracking audit →
            </a>
            <a href="#services" className="btn btn-line">
              See services
            </a>
          </div>
        </div>
        <div className="globe-wrap">
          <Globe />
          <div className="globe-core">Full business development</div>
          <div className="globe-legend">
            <span>
              <i />
              KL · Manila · Jakarta
            </span>
            <span>drag to rotate</span>
          </div>
        </div>
        <div className="scroll-hint">SCROLL</div>
      </section>

      {profile.stats && profile.stats.length > 0 && (
        <div className="ribbon">
          <div className="wrap">
            {profile.stats.map((stat) => (
              <div className="cell reveal" key={stat.id}>
                <b data-count={stat.value}>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SERVICES */}
      {services.docs.length > 0 && (
        <section className="wrap" id="services">
          <div className="section-head reveal">
            <div className="kicker">Services</div>
            <h2>
              Pick one fix, or <span className="grad">the whole engine.</span>
            </h2>
            <p className="lead-text">
              For clinics, hotels and service businesses in Malaysia, the Philippines and Indonesia that run ads and sell through WhatsApp.
            </p>
          </div>
          <div className="services">
            {services.docs.map((s) => (
              <div key={s.id} className={`svc reveal${s.featured ? ' star' : ''}`}>
                {s.featured && <span className="ribbon-tag">Most complete</span>}
                {s.icon && <div className="ic">{s.icon}</div>}
                <h3>{s.title}</h3>
                <p className="pitch">{s.pitch}</p>
                {s.includes && s.includes.length > 0 && (
                  <ul>
                    {s.includes.map((inc) => (
                      <li key={inc.id}>{inc.item}</li>
                    ))}
                  </ul>
                )}
                <div className="facts">
                  {s.timeline && (
                    <span>
                      <b>Timeline:</b> {s.timeline}
                    </span>
                  )}
                  {s.bestFor && (
                    <span>
                      <b>Best for:</b> {s.bestFor}
                    </span>
                  )}
                </div>
                <a href="#audit" className="go">
                  {s.ctaLabel || 'Ask about it →'}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HEALTH CHECK */}
      <section className="wrap" id="check">
        <div className="section-head reveal">
          <div className="kicker">60-second health check</div>
          <h2>
            Is your marketing <span className="grad">leaking leads?</span>
          </h2>
          <p className="lead-text">Answer 5 questions and see your score instantly.</p>
        </div>
        <HealthCheck />
      </section>

      {/* JOURNEY */}
      <section className="wrap" id="journey">
        <div className="section-head reveal">
          <div className="kicker">The journey of one lead</div>
          <h2>
            Five stages. <span className="grad">Five systems</span> I built or run.
          </h2>
          <p className="lead-text">
            Scroll to follow a single patient inquiry from the first ad they see to the report that makes next week better.
          </p>
        </div>
        <Journey />
      </section>

      {/* PROOF */}
      {testimonials.docs.length > 0 && (
        <section className="wrap" id="proof">
          <div className="section-head reveal">
            <div className="kicker">Results</div>
            <h2>
              Numbers first, <span className="grad">then words.</span>
            </h2>
          </div>
          <div className="proof">
            {testimonials.docs.map((t) => {
              const photo = typeof t.photo === 'object' ? t.photo : null
              return (
                <div key={t.id} className="quote reveal">
                  {t.kind === 'result' && t.value ? (
                    <div className="big grad">{t.value}</div>
                  ) : (
                    <div className="stars" aria-label="5 stars">
                      ★★★★★
                    </div>
                  )}
                  <p>{t.kind === 'quote' ? `“${t.text}”` : t.text}</p>
                  <div className="who">
                    {photo?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt="" width={40} height={40} style={{ borderRadius: '50%' }} />
                    ) : (
                      <i />
                    )}
                    <div>
                      {t.name}
                      <small>{[t.role, t.business, t.location].filter(Boolean).join(' · ')}</small>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ASK AI */}
      {askAi.length > 0 && (
        <section className="wrap" id="ask">
          <div className="ask reveal">
            <div className="ask-top">
              <div className="kicker" style={{ justifyContent: 'center' }}>
                <span className="blink" />
                Ask my AI analyst
              </div>
              <h2>
                Short on time? <span className="grad">Just ask.</span>
              </h2>
              <p>Pick a question, the way a client or recruiter would.</p>
            </div>
            <AskAi items={askAi} />
          </div>
        </section>
      )}

      {/* WRITING */}
      {posts.docs.length > 0 && (
        <section className="wrap" id="writing">
          <div className="section-head reveal">
            <div className="kicker">Field notes</div>
            <h2>
              I write about what I <span className="grad">actually run.</span>
            </h2>
            <p className="lead-text">Practical guides on tracking, lead routing and healthcare SEO, from real campaigns rather than theory.</p>
          </div>
          <div className="posts">
            {posts.docs.map((post, i) => (
              <PostCard key={post.id} post={post} feature={i === 0} />
            ))}
          </div>
          <div className="writing-foot reveal">
            <span />
            <Link href="/blog" className="btn btn-line">
              All articles →
            </Link>
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {roles.docs.length > 0 && (
        <section className="wrap" id="log">
          <div className="section-head reveal">
            <div className="kicker">Mission log</div>
            <h2>
              From network engineer to <span className="grad">growth engineer.</span>
            </h2>
          </div>
          <div className="log">
            {roles.docs.map((role) => (
              <div key={role.id} className={`entry reveal${role.endDate ? '' : ' now'}`}>
                <div className="yr">
                  {year(role.startDate)} — {role.endDate ? year(role.endDate) : 'NOW'}
                </div>
                <h4>{role.role}</h4>
                <div className="co">
                  {role.company}
                  {role.industry && ` · ${role.industry.split('—')[0].trim()}`}
                </div>
                {role.highlights?.[0] && <p>{role.highlights[0].text}</p>}
              </div>
            ))}
          </div>
          <div className="writing-foot reveal">
            <span />
            <Link href="/resume" className="btn btn-line">
              Full resume →
            </Link>
          </div>
        </section>
      )}

      {/* AUDIT */}
      <section className="wrap audit" id="audit">
        <div className="halo" />
        <div className="reveal">
          <div className="kicker">
            <span className="blink" />
            Free · no obligation
          </div>
          <h2>
            Get a free <span className="grad">tracking audit.</span>
          </h2>
          <p className="lead-text">I&apos;ll check your setup and show you exactly where leads and ad budget are leaking.</p>
          <ul className="gets">
            <li>
              <span className="n">1</span>
              <span>
                <b>GTM, Meta Pixel &amp; TikTok Pixel</b>: is every event firing correctly?
              </span>
            </li>
            <li>
              <span className="n">2</span>
              <span>
                <b>Conversions API</b>: are you losing iOS conversions?
              </span>
            </li>
            <li>
              <span className="n">3</span>
              <span>
                <b>WhatsApp leads</b>: can you trace each one back to its ad?
              </span>
            </li>
            <li>
              <span className="n">4</span>
              <span>
                <b>A written report in 48 hours</b> with the top fixes, ranked.
              </span>
            </li>
          </ul>
        </div>
        <AuditForm bookingUrl={profile.bookingUrl} whatsappUrl={wa} />
      </section>
    </>
  )
}
