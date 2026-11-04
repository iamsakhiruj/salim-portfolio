'use client'

import { useEffect, useState } from 'react'

export function FloatingWhatsApp({ href }: { href: string }) {
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setNudge(true), 6000)
    const hide = setTimeout(() => setNudge(false), 11000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div className="float">
      <span className={`tip${nudge ? ' show' : ''}`}>Chat on WhatsApp 👋</span>
      <a href={href} className="wa" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 6.9L3 29l6.5-2c1.9 1 4.1 1.6 6.5 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.3c-2.1 0-4.1-.6-5.8-1.7l-.4-.3-3.9 1.2 1.2-3.7-.3-.4a10.3 10.3 0 0 1-1.7-5.6C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.3 16 26.3Zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z" />
        </svg>
      </a>
    </div>
  )
}
