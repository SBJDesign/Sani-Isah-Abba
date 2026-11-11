import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import PublicationItem from '../components/PublicationItem'
import { PageHeader } from '../components/SiteLayout'
import { useCollection } from '../lib/store'
import { PUB_TYPE_LABEL, type PubType } from '../lib/types'

export default function Publications() {
  const { items, loading } = useCollection('publications')
  const [q, setQ] = useState('')
  const [type, setType] = useState<PubType | 'all'>('all')
  const [year, setYear] = useState<string>('all')

  const years = useMemo(() => [...new Set(items.map((p) => p.year))].sort((a, b) => b - a), [items])
  const perYear = useMemo(() => {
    if (!years.length) return [] as [number, number][]
    const out: [number, number][] = []
    for (let y = years[years.length - 1]; y <= years[0]; y++) out.push([y, items.filter((p) => p.year === y).length])
    return out
  }, [items, years])
  const maxPer = Math.max(1, ...perYear.map(([, n]) => n))
  const types = useMemo(() => [...new Set(items.map((p) => p.type))], [items])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return items
      .filter((p) => type === 'all' || p.type === type)
      .filter((p) => year === 'all' || String(p.year) === year)
      .filter((p) => !needle || [p.title, p.authors, p.venue, p.abstract, ...(p.keywords || [])].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
  }, [items, q, type, year])

  const grouped = useMemo(() => {
    const g = new Map<number, typeof filtered>()
    filtered.forEach((p) => g.set(p.year, [...(g.get(p.year) || []), p]))
    return [...g.entries()]
  }, [filtered])

  return (
    <>
      <PageHeader title="Publications"
        intro="Journal articles, conference papers and chapters. Each entry links to the publisher's version, with a citation you can copy in APA or BibTeX.">
        {perYear.length > 1 && (
          <figure className="mt-10 max-w-md">
            <div className="flex h-24 items-end gap-1.5" role="img" aria-label={`Publications per year from ${perYear[0][0]} to ${perYear[perYear.length - 1][0]}`}>
              {perYear.map(([y, n]) => (
                <button key={y} type="button" onClick={() => setYear(year === String(y) ? 'all' : String(y))} title={`${y}: ${n}`}
                  className="group flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[0.7rem] tabular-nums text-white/0 group-hover:text-white/80">{n}</span>
                  <span className={`w-full rounded-t-[3px] transition-colors ${year === String(y) ? 'bg-predicted' : 'bg-white/25 group-hover:bg-white/45'}`} style={{ height: `${Math.max(6, (n / maxPer) * 72)}px` }} />
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs tabular-nums text-white/50"><span>{perYear[0][0]}</span><figcaption>Publications per year. Select a bar to filter.</figcaption><span>{perYear[perYear.length - 1][0]}</span></div>
          </figure>
        )}
      </PageHeader>
      <div className="page">
        <div className="sticky top-16 z-10 -mx-5 rounded-b-xl border-b border-rule bg-silt/95 px-5 py-4 backdrop-blur sm:mx-0 sm:px-0">
          <div className="grid gap-3 sm:grid-cols-[1fr_12rem_9rem]">
            <label className="relative">
              <span className="sr-only">Search publications</span>
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sediment" aria-hidden />
              <input className="field pl-10" type="search" placeholder="Search by title, author, journal or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <label>
              <span className="sr-only">Type</span>
              <select className="field" value={type} onChange={(e) => setType(e.target.value as PubType | 'all')}>
                <option value="all">All types</option>
                {types.map((t) => <option key={t} value={t}>{PUB_TYPE_LABEL[t]}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Year</span>
              <select className="field" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="all">All years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-3 text-sm text-sediment" role="status">
            {loading ? 'Loading…' : `Showing ${filtered.length} of ${items.length} publications`}
          </p>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-16">
            <p className="text-lg">No publications match these filters.</p>
            <button className="link mt-2" onClick={() => { setQ(''); setType('all'); setYear('all') }}>Clear filters</button>
          </div>
        )}

        {grouped.map(([y, list]) => (
          <section key={y} aria-labelledby={`y${y}`} className="mt-10">
            <h2 id={`y${y}`} className="flex items-baseline gap-3 text-3xl font-medium tabular-nums tracking-tight text-ink">{y}<span className="text-sm font-normal text-sediment">{list.length} {list.length === 1 ? 'paper' : 'papers'}</span></h2>
            <div className="mt-3 rounded-2xl border border-rule bg-white px-6 [&>article:first-child]:border-t-0">
              {list.map((p) => <PublicationItem key={p.id} p={p} showYear={false} highlight="Abba" />)}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
