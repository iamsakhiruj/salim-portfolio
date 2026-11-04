'use client'

import { useEffect, useState } from 'react'

import { HEALTH_SCORE_EVENT } from './HealthCheck'

const SPEND = ['Under RM5,000', 'RM5,000 – 20,000', 'RM20,000 – 50,000', 'RM50,000+', 'Not running ads yet']
const CHANNELS = ['Meta', 'Google', 'TikTok', 'WhatsApp']

type Props = { bookingUrl?: string | null; whatsappUrl?: string | null }

export function AuditForm({ bookingUrl, whatsappUrl }: Props) {
  const [score, setScore] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [invalid, setInvalid] = useState<string[]>([])
  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const onScore = (e: Event) => setScore((e as CustomEvent<number>).detail)
    window.addEventListener(HEALTH_SCORE_EVENT, onScore)
    return () => window.removeEventListener(HEALTH_SCORE_EVENT, onScore)
  }, [])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    // Honeypot: real visitors never see or fill this field.
    if (form.get('company')) return setStatus('done')

    const value = (key: string) => String(form.get(key) ?? '').trim()
    const missing = ['name', 'whatsapp', 'website'].filter((k) => !value(k))
    setInvalid(missing)
    if (missing.length) return

    setStatus('sending')
    try {
      const res = await fetch('/api/audit-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: value('name'),
          whatsapp: value('whatsapp'),
          website: value('website'),
          adSpend: value('adSpend'),
          channels: form.getAll('channels').map(String),
          healthScore: score ?? undefined,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setFirstName(value('name').split(' ')[0])
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="form reveal in">
        <div className="done">
          <div className="tick">✓</div>
          <h3>Thanks{firstName ? `, ${firstName}` : ''}!</h3>
          <p className="hint">Your audit request is in. I&apos;ll message you on WhatsApp within 48 hours.</p>
        </div>
      </div>
    )
  }

  const field = (name: string) => (invalid.includes(name) ? { borderColor: '#f87171' } : undefined)

  return (
    <form className="form reveal" onSubmit={submit} noValidate>
      <h3>Request your audit</h3>
      <p className="hint">Takes 30 seconds. I reply on WhatsApp.</p>
      <div className="two">
        <div className="field">
          <label htmlFor="f-name">NAME</label>
          <input id="f-name" name="name" autoComplete="name" placeholder="Your name" maxLength={120} style={field('name')} />
        </div>
        <div className="field">
          <label htmlFor="f-wa">WHATSAPP</label>
          <input id="f-wa" name="whatsapp" type="tel" autoComplete="tel" placeholder="+60 1X-XXX XXXX" maxLength={40} style={field('whatsapp')} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-site">WEBSITE</label>
        <input id="f-site" name="website" autoComplete="url" placeholder="yourbusiness.com" maxLength={300} style={field('website')} />
      </div>
      <div className="field">
        <label htmlFor="f-spend">MONTHLY AD SPEND</label>
        <select id="f-spend" name="adSpend" defaultValue={SPEND[0]}>
          {SPEND.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>WHERE DO YOU ADVERTISE?</label>
        <div className="pills">
          {CHANNELS.map((c, i) => (
            <label key={c}>
              <input type="checkbox" name="channels" value={c} defaultChecked={i === 0} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-glow" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Get my free audit →'}
      </button>
      {invalid.length > 0 && <p className="form-error">Please fill in your name, WhatsApp and website.</p>}
      {status === 'error' && <p className="form-error">Something went wrong. Please try again, or message me on WhatsApp.</p>}
      {(bookingUrl || whatsappUrl) && (
        <div className="alt">
          {bookingUrl && (
            <a href={bookingUrl} className="btn btn-line" target="_blank" rel="noopener noreferrer">
              📅 Book a 20-min call
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} className="btn btn-line" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp me
            </a>
          )}
        </div>
      )}
    </form>
  )
}
