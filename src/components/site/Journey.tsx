'use client'

import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    label: 'SIGNAL',
    title: 'It starts with the right ad, in the right market.',
    body: 'I plan and manage RM40,000 a month across Meta, Google, TikTok and LinkedIn. Budget moves every month toward whatever is driving the lowest cost per lead.',
    stat: ['RM480k', 'managed per year'],
  },
  {
    label: 'CAPTURE',
    title: "The click gets counted, even when the browser won't.",
    body: 'iOS and browser privacy hide conversions from ad platforms. I built server-side tracking on the Meta Conversions API so the ads keep learning from real results.',
    stat: ['CAPI', 'server-side, deduplicated'],
  },
  {
    label: 'CONVERSATION',
    title: 'The inquiry lands in WhatsApp and gets routed in seconds.',
    body: 'My omnichannel lead hub pulls messages from 17 Facebook Pages and the WhatsApp Cloud API into one place, assigns an agent and records which page and campaign the lead came from.',
    stat: ['50–200', 'inquiries a day'],
  },
  {
    label: 'INSIGHT',
    title: 'An AI analyst writes the weekly report.',
    body: 'A Graph API pipeline collects metrics from every Page and Instagram account on a schedule. An AI agent turns them into a weekly analysis, which replaced hours of manual reporting.',
    stat: ['17', 'Pages + Instagram, automated'],
  },
  {
    label: 'GROWTH',
    title: 'Then search brings the next patient in for free.',
    body: 'Technical SEO and E-E-A-T medical content across a 9-site portfolio, written with clinical staff, took priority treatment keywords to #1 on Google.',
    stat: ['10,000+', 'organic visitors a month'],
  },
]

const label = (i: number) => `0${i + 1} / ${STEPS[i].label}`

const usePrefersReducedMotion = () => {
  const [reduce, setReduce] = useState(false)
  useEffect(() => setReduce(matchMedia('(prefers-reduced-motion: reduce)').matches), [])
  return reduce
}

/* ---------- Scenes ---------- */

const BUDGETS = [
  [38, 30, 20, 12],
  [44, 28, 18, 10],
  [35, 34, 22, 9],
  [40, 26, 26, 8],
]
const CHANNELS = [
  ['Meta', 'linear-gradient(90deg,#3b82f6,#22d3ee)'],
  ['Google', 'linear-gradient(90deg,#34f5c5,#22d3ee)'],
  ['TikTok', 'linear-gradient(90deg,#f472b6,#8b5cf6)'],
  ['LinkedIn', 'linear-gradient(90deg,#8b5cf6,#6366f1)'],
]

function BudgetScene() {
  const reduce = usePrefersReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((n) => n + 1), 2200)
    return () => clearInterval(id)
  }, [reduce])
  const split = BUDGETS[i % BUDGETS.length]
  return (
    <div className="budget">
      <div className="total">
        <b>RM40k</b>
        <small>PER MONTH · REALLOCATED MONTHLY</small>
      </div>
      {CHANNELS.map(([name, bg], k) => (
        <div className="ch-row" key={name}>
          <span>{name}</span>
          <div className="ch-bar">
            <div style={{ background: bg, width: `${split[k] * 2.1}%` }} />
          </div>
        </div>
      ))}
      <div className="note">illustrative split · optimized to cost per lead</div>
    </div>
  )
}

function SignalScene() {
  return (
    <div className="signals">
      <svg viewBox="0 0 480 300" role="img" aria-label="Browser pixel signals get blocked; server-side Conversions API signals reach Meta Ads">
        <defs>
          <linearGradient id="sg" x1="0" x2="1">
            <stop offset="0" stopColor="#34f5c5" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect className="node" x="0" y="40" width="130" height="56" rx="14" />
        <text x="18" y="73">Browser pixel</text>
        <rect className="node" x="0" y="204" width="130" height="56" rx="14" />
        <text x="18" y="237">Server (CAPI)</text>
        <rect className="node" x="350" y="122" width="130" height="56" rx="14" style={{ stroke: '#34f5c5' }} />
        <text x="380" y="155" style={{ fill: '#eef0fb' }}>Meta Ads</text>
        <path className="sig-browser" d="M130 68 C240 68 250 150 350 150" />
        <path className="sig-server" d="M130 232 C240 232 250 150 350 150" />
        <text className="x-mark" x="214" y="92">✕</text>
        <text className="x-mark" x="256" y="118">✕</text>
        <text x="160" y="30">blocked by iOS / ad blockers</text>
        <text x="170" y="290" style={{ fill: '#34f5c5' }}>recovered server-side</text>
      </svg>
    </div>
  )
}

const CHAT: [string, string][] = [
  ['in', 'Hi! How much is a hair transplant for around 2,500 grafts?'],
  ['sys', 'Lead #4821 · source: KL page · Meta ad'],
  ['sys', 'Assigned → Agent 2'],
  ['out', 'Hi! Happy to help. Can you send a photo of the area for a free assessment?'],
  ['in', 'Sure, sending now 👍'],
]

function ChatScene({ active }: { active: boolean }) {
  const reduce = usePrefersReducedMotion()
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active) return
    if (reduce) return setShown(CHAT.length)
    setShown(0)
    const timers = CHAT.map((_, i) => setTimeout(() => setShown(i + 1), i * 900))
    return () => timers.forEach(clearTimeout)
  }, [active, reduce])
  return (
    <div className="phone">
      <div className="screen">
        <div className="chat-head">
          <span className="av" />
          <div>
            Clinic · KL<small>● online</small>
          </div>
        </div>
        <div className="msgs">
          {CHAT.slice(0, shown).map(([cls, text]) => (
            <div key={text} className={`msg ${cls}`}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const REPORT = `## Weekly performance — all pages

▸ Inquiries up on the KL and Manila pages;
  Jakarta flat. Shift budget toward the
  two growing markets.

▸ Top creative: patient-story video.
  Lowest cost per lead this week.

▸ Action: refresh the 3 oldest ads,
  test a WhatsApp-first CTA in Jakarta.`

function ReportScene({ active }: { active: boolean }) {
  const reduce = usePrefersReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    if (reduce) return setN(REPORT.length)
    setN(0)
    const id = setInterval(() => setN((c) => (c >= REPORT.length ? c : c + 2)), 22)
    return () => clearInterval(id)
  }, [active, reduce])
  return (
    <div className="report">
      <div className="report-head">
        <span className="ai-orb" />
        ai-analyst · weekly_report.md
      </div>
      <div className="report-body">
        {REPORT.slice(0, n)}
        {n < REPORT.length && <span className="caret" />}
      </div>
    </div>
  )
}

function GrowthScene() {
  return (
    <div className="growth">
      <div className="rank">
        <span>#1</span>on Google
      </div>
      <svg viewBox="0 0 480 220" role="img" aria-label="Organic traffic growing to over 10,000 visitors a month">
        <defs>
          <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" stopOpacity=".35" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="rgba(255,255,255,.06)">
          <line x1="0" y1="50" x2="480" y2="50" />
          <line x1="0" y1="110" x2="480" y2="110" />
          <line x1="0" y1="170" x2="480" y2="170" />
        </g>
        <path d="M0 205 C70 200 110 190 160 178 S250 150 300 120 S380 70 480 30 V220 H0Z" fill="url(#ga)" />
        <path className="gl" d="M0 205 C70 200 110 190 160 178 S250 150 300 120 S380 70 480 30" fill="none" stroke="#a78bfa" strokeWidth="3" />
        <circle cx="480" cy="30" r="6" fill="#34f5c5" />
        <text x="380" y="62" style={{ font: '600 13px var(--mono)', fill: '#eef0fb' }}>
          10,000+/mo
        </text>
      </svg>
      <div className="sites">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <div className="sites-label">
        <span>9 clinic websites</span>
        <span>MY · PH · ID</span>
      </div>
    </div>
  )
}

function Scene({ index, active }: { index: number; active: boolean }) {
  switch (index) {
    case 0:
      return <BudgetScene />
    case 1:
      return <SignalScene />
    case 2:
      return <ChatScene active={active} />
    case 3:
      return <ReportScene active={active} />
    default:
      return <GrowthScene />
  }
}

/* ---------- Journey ---------- */

export function Journey() {
  const [current, setCurrent] = useState(0)
  const stepsRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = stepsRef.current
    if (!box) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number((e.target as HTMLElement).dataset.scene))
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    box.querySelectorAll('.step').forEach((s) => io.observe(s))

    const rail = () => {
      const r = box.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (innerHeight * 0.5 - r.top) / r.height))
      if (fillRef.current) fillRef.current.style.height = `${p * 100}%`
      if (pulseRef.current) pulseRef.current.style.top = `${p * 100}%`
    }
    rail()
    addEventListener('scroll', rail, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', rail)
    }
  }, [])

  return (
    <div className="journey">
      <div className="steps" ref={stepsRef}>
        <div className="rail">
          <div className="fill" ref={fillRef} />
          <div className="pulse" ref={pulseRef} />
        </div>
        {STEPS.map((step, i) => (
          <article key={step.label} className={`step${current === i ? ' active' : ''}`} data-scene={i}>
            <div className="no">{label(i)}</div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <div className="stat">
              <b>{step.stat[0]}</b>
              <span>{step.stat[1]}</span>
            </div>
            <div className="mini">
              <div className="scene on">
                <Scene index={i} active={current === i} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="stage" aria-hidden="true">
        <div className="stage-bar">
          <span>{label(current)}</span>
          <span className="dots">
            {STEPS.map((s, i) => (
              <i key={s.label} className={i <= current ? 'on' : ''} />
            ))}
          </span>
        </div>
        {STEPS.map((s, i) => (
          <div key={s.label} className={`scene${current === i ? ' on' : ''}`}>
            <Scene index={i} active={current === i} />
          </div>
        ))}
      </div>
    </div>
  )
}
