import { ArrowUpRight, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '../lib/store'
import Contours from './Contours'

const nav = [
  { to: '/about', label: 'About' },
  { to: '/research', label: 'Research' },
  { to: '/publications', label: 'Publications' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden>
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
      <path d="M5 21 L9.5 19.5 L13 12.5 L17 18 L21 9.5 L24.5 18.5 L27.5 16.5" fill="none" stroke="#F0B44C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SiteLayout() {
  const { profile } = useProfile()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [loc.pathname])
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8)
    f()
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className={`sticky top-0 z-40 bg-ink text-white transition-shadow ${scrolled ? 'shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]' : ''}`}>
        <div className="page flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 font-medium tracking-tight">
            <Mark />
            <span>{profile.honorific} {profile.name}</span>
          </Link>
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1 text-[0.95rem]">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to}
                    className={({ isActive }) => `rounded-full px-4 py-2 transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button className="-mr-2 p-2 md:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Main" className="border-t border-white/10 md:hidden">
            <ul className="page py-2">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className={({ isActive }) => `block py-3 text-lg ${isActive ? 'text-predicted' : 'text-white/80'}`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1 pb-24">
        <Outlet />
      </main>

      {loc.pathname !== '/contact' && (
        <section className="page mb-[-4rem] relative z-10">
          <div className="relative overflow-hidden rounded-3xl bg-observed px-8 py-12 text-white sm:px-14">
            <Contours opacity={0.12} />
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-medium tracking-tight">Working on water, climate or AI?</h2>
                <p className="mt-3 text-white/85">Open to research collaboration, student supervision, peer review and invited talks.</p>
              </div>
              <Link to="/contact" className="btn bg-white px-5 py-2.5 text-ink hover:bg-silt"><Mail size={17} aria-hidden /> Start a conversation</Link>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-ink pt-28 text-white">
        <div className="page grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 font-medium"><Mark /> {profile.honorific} {profile.name}</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{profile.affiliation}</p>
            <a className="mt-4 inline-block text-sm text-predicted hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <FooterCol title="Explore">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="text-white/70 hover:text-white">{n.label}</Link></li>)}
          </FooterCol>
          <FooterCol title="Research profiles">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a className="inline-flex items-center gap-1 text-white/70 hover:text-white" href={l.url} target="_blank" rel="noreferrer">{l.label} <ArrowUpRight size={13} aria-hidden /></a>
              </li>
            ))}
          </FooterCol>
        </div>
        <div className="border-t border-white/10">
          <div className="page flex justify-between py-5 text-xs text-white/50">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-medium text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="relative mb-14 overflow-hidden bg-ink text-white">
      <title>{title}</title>
      <Contours opacity={0.07} />
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-48 h-96 w-96 rounded-full bg-observed/25 blur-3xl" />
      <div className="page relative pb-14 pt-12 sm:pb-16 sm:pt-16">
        <span aria-hidden className="mb-5 block h-1 w-10 rounded-full bg-predicted" />
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-prose text-lg text-white/70">{intro}</p>}
        {children}
      </div>
    </header>
  )
}
