import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import { Link } from 'react-router-dom'
import Contours from '../components/Contours'
import Hydrograph from '../components/Hydrograph'
import PublicationItem from '../components/PublicationItem'
import { categoryIcon, interestIcon } from '../components/icons'
import { fmtDate } from '../lib/cite'
import { useCollection, useProfile } from '../lib/store'
import { POST_CATEGORY_LABEL } from '../lib/types'

function SectionHead({ title, intro, to, linkLabel }: { title: string; intro?: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span aria-hidden className="mb-4 block h-1 w-10 rounded-full bg-predicted" />
        <h2 className="text-3xl font-medium tracking-tight">{title}</h2>
        {intro && <p className="mt-2 max-w-prose text-sediment">{intro}</p>}
      </div>
      {to && (
        <Link to={to} className="group inline-flex items-center gap-1 text-[0.95rem] font-medium text-observed">
          {linkLabel} <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  const { profile } = useProfile()
  const pubs = useCollection('publications')
  const posts = useCollection('posts')
  const projects = useCollection('projects')
  const gallery = useCollection('gallery')
  const [lb, setLb] = useState<number | null>(null)
  const sortedPhotos = [...gallery.items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const shots = (sortedPhotos.filter((p) => p.featured).length ? sortedPhotos.filter((p) => p.featured) : sortedPhotos).slice(0, 4)

  const featured = [...pubs.items].filter((p) => p.featured).sort((a, b) => b.year - a.year).slice(0, 4)
  const selected = featured.length ? featured : [...pubs.items].sort((a, b) => b.year - a.year).slice(0, 4)
  const news = posts.items.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const ongoing = projects.items.filter((p) => p.status === 'ongoing').sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const parts = profile.name.split(/\s+/).filter(Boolean)
  const initials = (parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')

  return (
    <>
      <title>{`${profile.honorific} ${profile.name} | ${profile.title}`}</title>
      <meta name="description" content={profile.headline} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Contours />
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-observed/25 blur-3xl" />
        <div className="page relative pb-32 pt-16 sm:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_17rem] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-predicted" aria-hidden /> {profile.title}
              </p>
              <h1 className="mt-6 text-5xl font-medium leading-[1.02] tracking-[-0.03em] sm:text-7xl">
                {profile.honorific} {profile.name}
              </h1>
              <p className="mt-6 max-w-[38rem] text-xl leading-relaxed text-white/75">{profile.headline}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/publications" className="btn bg-predicted px-5 py-2.5 text-ink hover:bg-[#E8AC45]">Browse publications</Link>
                {profile.cv_url ? (
                  <a href={profile.cv_url} target="_blank" rel="noreferrer" className="btn border border-white/25 px-5 py-2.5 text-white hover:bg-white/10">Download CV</a>
                ) : (
                  <Link to="/contact" className="btn border border-white/25 px-5 py-2.5 text-white hover:bg-white/10">Get in touch</Link>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative mx-auto w-64">
                <div aria-hidden className="absolute -inset-3 rounded-[2rem] border border-white/15" />
                {profile.photo_url ? (
                  <img src={profile.photo_url} alt={`Portrait of ${profile.name}`} className="relative aspect-[4/5] w-full rounded-3xl object-cover" />
                ) : (
                  <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-observed to-ink-soft text-7xl font-medium tracking-tight text-white/90">
                    {initials}
                  </div>
                )}
                <p className="relative mt-5 text-center text-sm text-white/60">{profile.location}</p>
              </div>
            </div>
          </div>
          <Hydrograph dark className="mt-14 sm:mt-16" />
        </div>
      </section>

      {/* At a glance, overlapping the hero */}
      <section aria-label="At a glance" className="page relative z-10 -mt-16">
        <dl className="grid overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-24px_rgba(18,50,74,0.35)] ring-1 ring-rule sm:grid-cols-3">
          {profile.stats.map((s, i) => (
            <div key={s.label} className={`px-7 py-6 ${i ? 'border-t border-rule sm:border-l sm:border-t-0' : ''}`}>
              <dt className="text-sm text-sediment">{s.label}</dt>
              <dd className="mt-1 text-3xl font-medium tracking-tight text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Research themes */}
      <section className="page mt-24">
        <SectionHead title="Research themes" intro="Where hydrology meets machine learning." to="/about" linkLabel="Full biography" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.interests.map((x) => {
            const Icon = interestIcon(x)
            return (
              <li key={x} className="flex items-center gap-4 rounded-xl border border-rule bg-white px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-observed/10 text-observed"><Icon size={21} aria-hidden /></span>
                <span className="font-medium leading-snug">{x}</span>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Current research */}
      {ongoing.length > 0 && (
        <section className="page mt-24">
          <SectionHead title="Current research" intro="Questions being worked on now." to="/research" linkLabel="All research" />
          <div className={`grid gap-5 md:grid-cols-2 ${ongoing.length % 3 === 0 ? 'lg:grid-cols-3' : ''}`}>
            {ongoing.map((p) => (
              <article key={p.id} className="relative overflow-hidden rounded-2xl border border-rule bg-white p-7">
                <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-observed" />
                <p className="inline-flex items-center gap-2 text-sm text-observed"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-observed" aria-hidden /> Ongoing</p>
                <h3 className="mt-3 text-xl font-medium leading-snug">{p.title}</h3>
                <p className="mt-2 text-ink-soft">{p.summary}</p>
                {!!p.tags?.length && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => <li key={t} className="rounded-full bg-silt px-3 py-1 text-xs text-sediment">{t}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Selected publications */}
      <section className="mt-24 bg-white py-20">
        <div className="page">
          <SectionHead title="Selected publications" intro="A few representative papers." to="/publications" linkLabel={`All ${pubs.items.length} publications`} />
          <div className="border-b border-rule">
            {selected.map((p) => <PublicationItem key={p.id} p={p} highlight="Abba" />)}
          </div>
        </div>
      </section>

      {/* In pictures */}
      {shots.length > 0 && (
        <section className="page mt-24">
          <SectionHead title="In pictures" intro="Conferences, recognition and collaborations." to="/gallery" linkLabel="Open gallery" />
          <ul className="grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] md:grid-cols-4">
            {shots.map((p, i) => (
              <li key={p.id} className={i === 0 ? 'col-span-2 row-span-2' : i === 1 ? 'col-span-2' : ''}>
                <button onClick={() => setLb(i)} className="group relative block h-full w-full overflow-hidden rounded-2xl bg-ink" aria-label={`View larger: ${p.caption}`}>
                  <img src={p.image_url} alt={p.caption} loading="lazy" className="h-full w-full object-cover object-[50%_30%] transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-3 pt-10 text-left text-sm leading-snug text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{p.caption}</span>
                </button>
              </li>
            ))}
          </ul>
          {lb !== null && <Lightbox photos={shots} index={lb} onChange={setLb} onClose={() => setLb(null)} />}
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="page mt-24">
          <SectionHead title="Latest news" to="/news" linkLabel="All news" />
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((n) => {
              const Icon = categoryIcon[n.category]
              return (
                <Link key={n.id} to={`/news/${n.id}`} className="group flex flex-col rounded-2xl border border-rule bg-white p-6 transition-colors hover:border-observed/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-predicted/15 px-2.5 py-0.5 text-[#8A5A0B]"><Icon size={14} aria-hidden /> {POST_CATEGORY_LABEL[n.category]}</span>
                    <time dateTime={n.date} className="text-sediment">{fmtDate(n.date)}</time>
                  </div>
                  <h3 className="mt-5 text-lg font-medium leading-snug group-hover:text-observed">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[0.95rem] text-sediment">{n.body}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
