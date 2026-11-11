import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/SiteLayout'
import { sendMessage, useProfile } from '../lib/store'

export default function Contact() {
  const { profile } = useProfile()
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('website')) return // honeypot
    setState('sending')
    try {
      await sendMessage({
        name: String(f.get('name')),
        email: String(f.get('email')),
        subject: String(f.get('subject') || ''),
        body: String(f.get('body')),
      })
      setState('sent')
    } catch (e) {
      setErr((e as Error).message)
      setState('error')
    }
  }

  return (
    <>
      <PageHeader title="Contact" intro="For research collaboration, student supervision, peer review, talks or media requests." />
      <div className="page grid gap-8 lg:grid-cols-[1fr_20rem]">
        {state === 'sent' ? (
          <div className="rounded-2xl border border-observed/30 bg-white p-9">
            <h2 className="text-xl font-medium">Message sent</h2>
            <p className="mt-2 text-ink-soft">Thank you. Your message has been delivered, and you'll get a reply at the email address you gave.</p>
            <Link to="/" className="link mt-4 inline-block">Back to home</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 rounded-2xl border border-rule bg-white p-7 sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" required className="field" autoComplete="name" /></div>
              <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="field" autoComplete="email" /></div>
            </div>
            <div><label className="label" htmlFor="subject">Subject</label><input id="subject" name="subject" className="field" /></div>
            <div><label className="label" htmlFor="body">Message</label><textarea id="body" name="body" required rows={7} className="field" /></div>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {state === 'error' && <p className="text-sm text-danger" role="alert">The message wasn't sent: {err}</p>}
            <button className="btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
        <aside className="space-y-6 self-start rounded-2xl bg-ink p-7 text-[0.95rem] text-white [&_.link]:text-predicted [&_.text-ink-soft]:text-white/80 [&_.text-sediment]:text-white/60">
          <div><h2 className="font-medium">Email</h2><a className="link" href={`mailto:${profile.email}`}>{profile.email}</a></div>
          <div><h2 className="font-medium">Affiliation</h2><p className="text-ink-soft">{profile.affiliation}</p><p className="text-sediment">{profile.location}</p></div>
        </aside>
      </div>
    </>
  )
}
