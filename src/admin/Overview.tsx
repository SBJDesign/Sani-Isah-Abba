import { Link } from 'react-router-dom'
import { fmtDate } from '../lib/cite'
import { useState } from 'react'
import { seedGallery, seedPosts, seedProfile, seedProjects, seedPublications } from '../lib/seed'
import { isDemo, save, saveProfile, useCollection } from '../lib/store'
import { AdminHeader } from './ui'

export default function Overview() {
  const pubs = useCollection('publications')
  const projects = useCollection('projects')
  const posts = useCollection('posts')
  const msgs = useCollection('messages')
  const photos = useCollection('gallery')
  const unread = msgs.items.filter((m) => !m.read)
  const thisYear = new Date().getFullYear()
  const [seeding, setSeeding] = useState(false)
  const empty = !isDemo && !pubs.loading && !projects.loading && !posts.loading && pubs.items.length + projects.items.length + posts.items.length === 0
  const loadStarter = async () => {
    setSeeding(true)
    try {
      await saveProfile(seedProfile)
      for (const p of seedPublications) await save('publications', p)
      for (const p of seedProjects) await save('projects', p)
      for (const p of seedPosts) await save('posts', p)
      for (const p of seedGallery) await save('gallery', p)
    } finally { setSeeding(false) }
  }

  const cards = [
    { to: '/admin/publications', label: 'Publications', value: pubs.items.length, note: `${pubs.items.filter((p) => p.year === thisYear).length} this year` },
    { to: '/admin/research', label: 'Research projects', value: projects.items.length, note: `${projects.items.filter((p) => p.status === 'ongoing').length} ongoing` },
    { to: '/admin/news', label: 'News items', value: posts.items.length, note: `${posts.items.filter((p) => !p.published).length} drafts` },
    { to: '/admin/gallery', label: 'Gallery photos', value: photos.items.length, note: `${photos.items.filter((p) => p.featured).length} on home page` },
    { to: '/admin/messages', label: 'Messages', value: msgs.items.length, note: `${unread.length} unread` },
  ]

  return (
    <>
      <AdminHeader title="Overview" intro="What's on the site, and what needs your attention." />
      {empty && (
        <div className="mb-8 rounded-lg border border-predicted/40 bg-predicted/10 p-6">
          <h2 className="font-medium">Your database is empty</h2>
          <p className="mt-1 text-sm text-ink-soft">Load the starter profile, publications, projects and news, then edit them to match.</p>
          <button className="btn-primary mt-4" onClick={loadStarter} disabled={seeding}>{seeding ? 'Loading…' : 'Load starter content'}</button>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-lg border border-rule bg-white p-5 hover:border-sediment">
            <div className="text-sm text-sediment">{c.label}</div>
            <div className="mt-1 text-3xl font-medium tabular-nums">{c.value}</div>
            <div className="mt-1 text-sm text-sediment">{c.note}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-rule bg-white p-6">
          <h2 className="font-medium">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/publications?new=1" className="btn-primary">Add a publication</Link>
            <Link to="/admin/news?new=1" className="btn-quiet">Post an update</Link>
            <Link to="/admin/research?new=1" className="btn-quiet">Add a project</Link>
            <Link to="/admin/gallery" className="btn-quiet">Add photos</Link>
            <Link to="/admin/profile" className="btn-quiet">Update CV</Link>
          </div>
        </section>
        <section className="rounded-lg border border-rule bg-white p-6">
          <h2 className="font-medium">Unread messages</h2>
          {unread.length === 0 ? (
            <p className="mt-3 text-sm text-sediment">No unread messages.</p>
          ) : (
            <ul className="mt-3 divide-y divide-rule">
              {unread.slice(0, 4).map((m) => (
                <li key={m.id} className="py-3">
                  <Link to="/admin/messages" className="block hover:text-observed">
                    <span className="font-medium">{m.name}</span>: {m.subject || m.body.slice(0, 60)}
                  </Link>
                  {m.created_at && <span className="text-xs text-sediment">{fmtDate(m.created_at.slice(0, 10))}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
