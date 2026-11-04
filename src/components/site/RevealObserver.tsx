'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const parseCount = (text: string) => {
  const m = text.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  return m ? { pre: m[1], to: Number(m[2].replace(/,/g, '')), suf: m[3] } : null
}

const countUp = (el: HTMLElement, reduce: boolean) => {
  const parsed = parseCount(el.dataset.count ?? el.textContent ?? '')
  if (!parsed || reduce) return
  const { pre, to, suf } = parsed
  const t0 = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - t0) / 1500, 1)
    const e = 1 - Math.pow(1 - p, 3)
    el.textContent = pre + Math.round(to * e).toLocaleString() + suf
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Fades in every `.reveal` element as it scrolls into view and counts up `[data-count]` numbers inside it. */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('in')
          el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => countUp(n, reduce))
          io.unobserve(el)
        }),
      { threshold: 0.15 },
    )
    document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 90}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])

  return null
}
