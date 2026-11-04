import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

import { Background } from '@/components/site/Background'
import { FloatingWhatsApp } from '@/components/site/FloatingWhatsApp'
import { RevealObserver } from '@/components/site/RevealObserver'
import { getProfile, linkedinURL, siteURL, whatsappURL } from '@/lib/payload'
import './styles.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-jakarta' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  return {
    metadataBase: new URL(siteURL),
    title: { default: `${profile.name} — ${profile.headline}`, template: `%s | ${profile.name}` },
    description: profile.tagline ?? profile.summary ?? undefined,
    openGraph: { type: 'website', siteName: profile.name },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()
  const wa = whatsappURL(profile.whatsapp)
  const linkedin = linkedinURL(profile.linkedin)

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <Background />
        <nav className="top" aria-label="Main">
          <Link href="/" className="brand">
            <span className="orb" />
            salim.
          </Link>
          <div className="links">
            <Link href="/#services">Services</Link>
            <Link href="/#check">Health check</Link>
            <Link href="/case-studies">Work</Link>
            <Link href="/blog">Writing</Link>
            <Link href="/resume">About</Link>
          </div>
          <Link href="/#audit" className="btn btn-glow">
            Free audit
          </Link>
        </nav>
        <main>{children}</main>
        <footer>
          <div className="wrap">
            <span>
              © {new Date().getFullYear()} {profile.name}
              {profile.location && ` · ${profile.location}`}
            </span>
            <span className="site-footer-links">
              {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
              {linkedin && (
                <a href={linkedin} rel="me noopener noreferrer" target="_blank">
                  LinkedIn
                </a>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              )}
            </span>
          </div>
        </footer>
        {wa && <FloatingWhatsApp href={wa} />}
        <RevealObserver />
      </body>
    </html>
  )
}
