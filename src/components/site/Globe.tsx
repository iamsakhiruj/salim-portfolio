'use client'

import { useEffect, useRef } from 'react'

type LatLon = { lat: number; lon: number }

const rad = (d: number) => (d * Math.PI) / 180

const CITIES = [
  { name: 'Kuala Lumpur', lat: rad(3.14), lon: rad(101.69), dx: -1, dy: -10 },
  { name: 'Manila', lat: rad(14.6), lon: rad(120.98), dx: 10, dy: -8 },
  { name: 'Jakarta', lat: rad(-6.2), lon: rad(106.85), dx: 10, dy: 18 },
]

// Two orbits of services: inner = tracking, outer = channels & growth
const ORBITS = [
  { rx: 1.14, ry: 0.36, rot: -0.1, speed: 0.3 },
  { rx: 1.44, ry: 0.56, rot: 0.14, speed: -0.2 },
]
const THIRD = (Math.PI * 2) / 3
const SATS = [
  { label: 'Google Tag Manager', c: '#60a5fa', o: 0, ph: 0 },
  { label: 'Meta Pixel', c: '#3b82f6', o: 0, ph: THIRD },
  { label: 'TikTok Pixel', c: '#f472b6', o: 0, ph: THIRD * 2 },
  { label: 'Conversions API', c: '#a78bfa', o: 1, ph: 0.5 },
  { label: 'WhatsApp API', c: '#22c55e', o: 1, ph: 0.5 + THIRD },
  { label: '#1 Organic Search', c: '#34f5c5', o: 1, ph: 0.5 + THIRD * 2 },
]

const slerp = (a: LatLon, b: LatLon, t: number): LatLon => {
  const va = [Math.cos(a.lat) * Math.cos(a.lon), Math.cos(a.lat) * Math.sin(a.lon), Math.sin(a.lat)]
  const vb = [Math.cos(b.lat) * Math.cos(b.lon), Math.cos(b.lat) * Math.sin(b.lon), Math.sin(b.lat)]
  const d = Math.acos(Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]))
  const s1 = Math.sin((1 - t) * d) / Math.sin(d)
  const s2 = Math.sin(t * d) / Math.sin(d)
  const v = va.map((c, i) => c * s1 + vb[i] * s2)
  return { lat: Math.asin(v[2]), lon: Math.atan2(v[1], v[0]) }
}

/** Dotted globe with KL, Manila and Jakarta linked, and the services orbiting it. Drag to rotate. */
export function Globe() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = matchMedia('(max-width: 560px)').matches

    const N = 1600
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts: LatLon[] = Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N
      const r = Math.sqrt(1 - y * y)
      const th = i * golden
      return { lat: Math.asin(y), lon: Math.atan2(Math.sin(th) * r, Math.cos(th) * r) }
    })

    let S = 0
    let R = 0
    let cx = 0
    let cy = 0
    let lon0 = rad(108)
    let tilt = rad(-12)
    let drag: { x: number; y: number; l: number; t: number } | null = null
    let pulses: { sx: number; sy: number; c: (typeof CITIES)[number]; col: string; t: number }[] = []
    let raf = 0
    const vel = reduce ? 0 : 0.0012

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      S = cv.clientWidth
      cv.width = S * dpr
      cv.height = S * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      R = S * 0.26
      cx = S / 2
      cy = S / 2
    }
    const project = (lat: number, lon: number, h = 1) => {
      const x = Math.cos(lat) * Math.sin(lon - lon0)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.cos(lon - lon0)
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
      return { x: cx + x * R * h, y: cy - y2 * R * h, z: z2 }
    }

    const frame = (time: number) => {
      if (!drag) lon0 += vel
      ctx.clearRect(0, 0, S, S)
      const t = time / 1000

      const g = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35)
      g.addColorStop(0, 'rgba(139,92,246,0)')
      g.addColorStop(0.55, 'rgba(139,92,246,.18)')
      g.addColorStop(1, 'rgba(34,211,238,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.35, 0, 7)
      ctx.fill()
      const core = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R)
      core.addColorStop(0, 'rgba(40,30,90,.55)')
      core.addColorStop(1, 'rgba(8,10,24,.9)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, 7)
      ctx.fill()

      // On small phones only the outer orbit is labelled, so the globe stays readable.
      const sats = mobile ? SATS.filter((s) => s.o === 1) : SATS
      const satPos = sats.map((s) => {
        const o = ORBITS[s.o]
        const a = t * o.speed + s.ph
        const ex = Math.cos(a) * R * o.rx
        const ey = Math.sin(a) * R * o.ry
        return {
          ...s,
          x: cx + ex * Math.cos(o.rot) - ey * Math.sin(o.rot),
          y: cy + ex * Math.sin(o.rot) + ey * Math.cos(o.rot),
          z: Math.sin(a),
        }
      })
      ctx.strokeStyle = 'rgba(255,255,255,.08)'
      ctx.lineWidth = 1
      ORBITS.forEach((o) => {
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * o.rx, R * o.ry, o.rot, 0, Math.PI * 2)
        ctx.stroke()
      })
      const drawSat = (s: (typeof satPos)[number]) => {
        ctx.globalAlpha = s.z < 0 ? 0.5 : 1
        ctx.font = `600 ${Math.max(10, S * 0.019)}px Inter, sans-serif`
        const w = ctx.measureText(s.label).width + 24
        const h = Math.max(22, S * 0.042)
        const x = Math.max(w / 2 + 2, Math.min(S - w / 2 - 2, s.x))
        ctx.fillStyle = 'rgba(10,12,28,.92)'
        ctx.strokeStyle = s.c
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.roundRect(x - w / 2, s.y - h / 2, w, h, h / 2)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = s.c
        ctx.beginPath()
        ctx.arc(x - w / 2 + 11, s.y, 3, 0, 7)
        ctx.fill()
        ctx.fillStyle = '#eef0fb'
        ctx.fillText(s.label, x - w / 2 + 18, s.y + h * 0.17)
        ctx.globalAlpha = 1
      }
      satPos.filter((s) => s.z < 0).forEach(drawSat)

      for (const p of pts) {
        const q = project(p.lat, p.lon)
        if (q.z < 0) continue
        ctx.fillStyle = `rgba(180,190,255,${0.12 + q.z * 0.55})`
        ctx.fillRect(q.x, q.y, 1.6, 1.6)
      }

      ;[
        [0, 1],
        [0, 2],
        [1, 2],
      ].forEach(([i, j], k) => {
        ctx.beginPath()
        let started = false
        for (let s = 0; s <= 40; s++) {
          const m = slerp(CITIES[i], CITIES[j], s / 40)
          const q = project(m.lat, m.lon, 1 + Math.sin((Math.PI * s) / 40) * 0.18)
          if (q.z < -0.1) {
            started = false
            continue
          }
          if (started) ctx.lineTo(q.x, q.y)
          else ctx.moveTo(q.x, q.y)
          started = true
        }
        ctx.strokeStyle = 'rgba(52,245,197,.55)'
        ctx.lineWidth = 1.4
        ctx.stroke()
        const f = (t * 0.4 + k / 3) % 1
        const m = slerp(CITIES[i], CITIES[j], f)
        const q = project(m.lat, m.lon, 1 + Math.sin(Math.PI * f) * 0.18)
        if (q.z > 0) {
          ctx.fillStyle = '#fff'
          ctx.shadowColor = '#34f5c5'
          ctx.shadowBlur = 12
          ctx.beginPath()
          ctx.arc(q.x, q.y, 2.6, 0, 7)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      if (!reduce && Math.random() < 0.03) {
        const s = satPos[Math.floor(Math.random() * satPos.length)]
        pulses.push({ sx: s.x, sy: s.y, c: CITIES[Math.floor(Math.random() * 3)], col: s.c, t: 0 })
      }
      pulses = pulses.filter((p) => (p.t += 0.018) < 1)
      for (const p of pulses) {
        const q = project(p.c.lat, p.c.lon)
        const back = Math.max(0, p.t - 0.2)
        ctx.strokeStyle = p.col
        ctx.globalAlpha = 1 - p.t
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.sx + (q.x - p.sx) * back, p.sy + (q.y - p.sy) * back)
        ctx.lineTo(p.sx + (q.x - p.sx) * p.t, p.sy + (q.y - p.sy) * p.t)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      CITIES.forEach((c, i) => {
        const q = project(c.lat, c.lon)
        if (q.z < 0) return
        const pr = (t * 1.2 + i * 0.33) % 1
        ctx.strokeStyle = `rgba(52,245,197,${1 - pr})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(q.x, q.y, 4 + pr * 16, 0, 7)
        ctx.stroke()
        ctx.fillStyle = '#34f5c5'
        ctx.shadowColor = '#34f5c5'
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.arc(q.x, q.y, 4, 0, 7)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.font = `500 ${Math.max(10, S * 0.02)}px "JetBrains Mono", monospace`
        ctx.fillStyle = 'rgba(238,240,251,.9)'
        const lx = c.dx < 0 ? q.x - ctx.measureText(c.name).width - 10 : q.x + c.dx
        ctx.fillText(c.name, lx, q.y + c.dy)
      })

      satPos.filter((s) => s.z >= 0).forEach(drawSat)
      raf = requestAnimationFrame(frame)
    }

    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, l: lon0, t: tilt }
      cv.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      lon0 = drag.l - (e.clientX - drag.x) * 0.006
      tilt = Math.max(-1, Math.min(1, drag.t + (e.clientY - drag.y) * 0.004))
    }
    const up = () => (drag = null)

    size()
    cv.addEventListener('pointerdown', down)
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerup', up)
    addEventListener('resize', size)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      cv.removeEventListener('pointerdown', down)
      cv.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerup', up)
      removeEventListener('resize', size)
    }
  }, [])

  return (
    <canvas
      id="globe"
      ref={ref}
      role="img"
      aria-label="Globe showing Kuala Lumpur, Manila and Jakarta connected, with tracking, WhatsApp and SEO services orbiting"
    />
  )
}
