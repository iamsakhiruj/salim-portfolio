'use client'

import { useEffect, useRef } from 'react'

/** Fixed starfield with parallax on scroll, plus a soft glow that follows the cursor. */
export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: { x: number; y: number; z: number; t: number }[] = []
    let W = 0
    let H = 0
    let raf = 0

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 2)
      W = innerWidth
      H = innerHeight
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.round((W * H) / 3500) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        t: Math.random() * 6,
      }))
    }
    const draw = (time: number) => {
      ctx.clearRect(0, 0, W, H)
      for (const s of stars) {
        const y = (((s.y - scrollY * s.z * 0.15) % H) + H) % H
        const a = 0.25 + s.z * 0.55 * (0.6 + 0.4 * Math.sin(time / 900 + s.t))
        ctx.fillStyle = `rgba(220,225,255,${a})`
        ctx.fillRect(s.x, y, s.z * 1.6 + 0.3, s.z * 1.6 + 0.3)
      }
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    const onMove = (e: PointerEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.left = `${e.clientX}px`
      glowRef.current.style.top = `${e.clientY}px`
    }

    size()
    raf = requestAnimationFrame(draw)
    addEventListener('resize', size)
    addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', size)
      removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <>
      <canvas id="stars" ref={canvasRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
    </>
  )
}
