import { BookOpen, ExternalLink, FlaskConical, Images, Inbox, LayoutGrid, LogOut, Megaphone, Menu, UserRound } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { isDemo, signIn, signOut, useCollection, useSession } from '../lib/store'
import { ToastProvider } from './ui'

function Login() {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    setErr('')
    try {
      await signIn(String(f.get('email')), String(f.get('password')))
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <title>Sign in | Admin</title>
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-rule bg-white p-8">
        <h1 className="text-2xl font-medium tracking-tight">Sign in to manage the site</h1>
        <p className="mt-1 text-sm text-sediment">Add publications, research and news.</p>
        {isDemo && (
          <p className="mt-4 rounded-md bg-predicted/10 px-3 py-2 text-sm text-ink">
            Demo mode: use any email and the password <strong>admin123</strong>. Changes are saved in this browser only.
          </p>
        )}
        <div className="mt-6 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="field" autoComplete="username" defaultValue={isDemo ? 'admin@example.com' : ''} /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="field" autoComplete="current-password" /></div>
        </div>
        {err && <p className="mt-4 text-sm text-danger" role="alert">{err}</p>}
        <button className="btn-primary mt-6 w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="mt-4 block text-center text-sm text-sediment hover:text-ink">Back to the website</Link>
      </form>
    </div>
  )
}

export default function AdminLayout() {
  const { loading, email } = useSession()
  const [open, setOpen] = useState(false)
  const msgs = useCollection('messages')
  const unread = msgs.items.filter((m) => !m.read).length

  if (loading) return <div className="p-10 text-sediment">Loading…</div>
  if (!email) return <Login />

  const links = [
    { to: '/admin', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/admin/publications', label: 'Publications', icon: BookOpen },
    { to: '/admin/research', label: 'Research', icon: FlaskConical },
    { to: '/admin/news', label: 'News and updates', icon: Megaphone },
    { to: '/admin/gallery', label: 'Gallery', icon: Images },
    { to: '/admin/messages', label: 'Messages', icon: Inbox, badge: unread },
    { to: '/admin/profile', label: 'Profile and CV', icon: UserRound },
  ]

  const nav = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link to="/admin" className="font-medium">Site admin</Link>
        <p className="truncate text-xs text-white/60">{email}</p>
      </div>
      <ul className="flex-1 space-y-0.5 px-3">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-[0.95rem] ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
              <l.icon size={18} aria-hidden /> <span className="flex-1">{l.label}</span>
              {!!l.badge && <span className="rounded-full bg-predicted px-2 text-xs font-medium text-ink">{l.badge}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:text-white"><ExternalLink size={16} /> View website</Link>
        <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:text-white"><LogOut size={16} /> Sign out</button>
      </div>
    </nav>
  )

  return (
    <ToastProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[15.5rem_1fr]">
        <aside className="sticky top-0 hidden h-screen bg-ink text-white lg:block">{nav}</aside>
        <div className="flex items-center justify-between bg-ink px-4 py-3 text-white lg:hidden">
          <span className="font-medium">Site admin</span>
          <button onClick={() => setOpen(true)} className="p-1"><Menu size={22} /><span className="sr-only">Open menu</span></button>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <aside className="relative h-full w-64 bg-ink text-white">{nav}</aside>
          </div>
        )}
        <div className="min-w-0">
          {isDemo && (
            <div className="border-b border-predicted/30 bg-predicted/10 px-6 py-2 text-sm">
              Demo mode: edits are saved in this browser only. Connect Supabase (see README) so changes go live for every visitor.
            </div>
          )}
          <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10"><Outlet /></main>
        </div>
      </div>
    </ToastProvider>
  )
}
