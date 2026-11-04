'use client'

import { useEffect, useState } from 'react'

const QUESTIONS = [
  'Is the Meta Conversions API (server-side) running on your site?',
  'Do your Meta & TikTok Pixels fire through Google Tag Manager?',
  'Do you know which ad or page every WhatsApp lead came from?',
  'Do new WhatsApp inquiries get a reply within 5 minutes?',
  'Does your site rank on page 1 of Google for your main service?',
]

const VERDICTS: [number, string, string][] = [
  [100, 'Solid setup', 'Impressive. Next step: scaling with better creative and SEO.'],
  [80, 'Almost there', 'Strong setup. A few gaps are still costing you, so let’s close them.'],
  [40, 'Some big gaps', 'The basics are there, but leads are slipping through. Usually fixable in a week.'],
  [0, 'Leaking a lot', 'Most of your conversions are invisible to your ads. The audit will show the biggest fixes first.'],
]

/** Event the audit form listens for, so the request carries the visitor's score. */
export const HEALTH_SCORE_EVENT = 'health-score'

const CIRCUMFERENCE = 502

export function HealthCheck() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => QUESTIONS.map(() => null))
  const answered = answers.filter((a) => a !== null).length
  const score = answers.reduce<number>((sum, a) => sum + (a ? 20 : 0), 0)
  const [, title, text] = VERDICTS.find(([min]) => score >= min)!

  const answer = (i: number, value: boolean) =>
    setAnswers((prev) => prev.map((a, k) => (k === i ? value : a)))

  useEffect(() => {
    if (answered) window.dispatchEvent(new CustomEvent(HEALTH_SCORE_EVENT, { detail: score }))
  }, [answered, score])

  return (
    <div className="check reveal">
      <div className="qs">
        {QUESTIONS.map((q, i) => (
          <div className="qrow" key={q}>
            <span>{q}</span>
            <div className="yn" role="group" aria-label={q}>
              <button type="button" className={`yes${answers[i] === true ? ' on' : ''}`} aria-pressed={answers[i] === true} onClick={() => answer(i, true)}>
                Yes
              </button>
              <button type="button" className={`no${answers[i] === false ? ' on' : ''}`} aria-pressed={answers[i] === false} onClick={() => answer(i, false)}>
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="score" aria-live="polite">
        <div className="ring">
          <svg viewBox="0 0 180 180" aria-hidden="true">
            <defs>
              <linearGradient id="ringGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#34f5c5" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle className="bg" cx="90" cy="90" r="80" />
            <circle className="fg" cx="90" cy="90" r="80" style={{ strokeDashoffset: CIRCUMFERENCE - (CIRCUMFERENCE * score) / 100 }} />
          </svg>
          <div className="val">
            <div>
              {answered ? score : '–'}
              <small>/ 100</small>
            </div>
          </div>
        </div>
        <div className="verdict">
          {answered === 0 ? 'Answer the questions' : answered < QUESTIONS.length ? `${title} so far…` : title}
        </div>
        <p className="verdict-sub">{answered === 0 ? 'Your score updates as you go.' : text}</p>
        <a href="#audit" className="btn btn-glow">
          Get the free audit →
        </a>
      </div>
    </div>
  )
}
