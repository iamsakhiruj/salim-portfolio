'use client'

import { useEffect, useRef, useState } from 'react'

type QA = { question: string; answer: string }

/** Scripted "Ask my AI analyst": picks a pre-written answer and types it out. No API calls. */
export function AskAi({ items }: { items: QA[] }) {
  const [active, setActive] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive((a) => a ?? 0)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (active === null) return
    const answer = items[active].answer
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setTyped(answer)
    let n = 0
    setTyped('')
    const id = setInterval(() => {
      n += 3
      setTyped(answer.slice(0, n))
      if (n >= answer.length) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [active, items])

  return (
    <>
      <div className="ask-log" ref={logRef} aria-live="polite">
        {active !== null && (
          <>
            <div className="q">{items[active].question}</div>
            <div className="a">{typed}</div>
          </>
        )}
      </div>
      <div className="chips">
        {items.map((qa, i) => (
          <button key={qa.question} type="button" className={`chip${active === i ? ' on' : ''}`} onClick={() => setActive(i)}>
            {qa.question}
          </button>
        ))}
      </div>
    </>
  )
}
