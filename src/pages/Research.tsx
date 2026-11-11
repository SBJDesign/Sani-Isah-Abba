import { PageHeader } from '../components/SiteLayout'
import { useCollection } from '../lib/store'
import type { Project } from '../lib/types'

function ProjectRow({ p }: { p: Project }) {
  const years = p.start_year ? `${p.start_year}–${p.end_year ?? (p.status === 'ongoing' ? 'present' : '')}` : p.end_year ? `Until ${p.end_year}` : ''
  return (
    <article className="relative grid gap-x-10 gap-y-4 overflow-hidden rounded-2xl border border-rule bg-white p-7 md:grid-cols-[1fr_14rem]">
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${p.status === 'ongoing' ? 'bg-observed' : 'bg-rule'}`} />
      <div>
        <h3 className="text-xl font-medium">{p.title}</h3>
        <p className="mt-2 max-w-prose text-ink-soft">{p.summary}</p>
        {p.body && (
          <div className="mt-4 max-w-prose space-y-3 text-[0.95rem] text-ink-soft">
            {p.body.split(/\n\s*\n/).map((x, i) => <p key={i}>{x}</p>)}
          </div>
        )}
      </div>
      <dl className="space-y-3 rounded-xl bg-silt p-4 text-sm md:self-start">
        {years && (<div><dt className="text-sediment">Period</dt><dd>{years}</dd></div>)}
        {p.funder && (<div><dt className="text-sediment">Funded by</dt><dd>{p.funder}</dd></div>)}
        {!!p.tags?.length && (<div><dt className="text-sediment">Topics</dt><dd>{p.tags.join(', ')}</dd></div>)}
      </dl>
    </article>
  )
}

export default function Research() {
  const { items, loading } = useCollection('projects')
  const sorted = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const ongoing = sorted.filter((p) => p.status === 'ongoing')
  const done = sorted.filter((p) => p.status === 'completed')
  return (
    <>
      <PageHeader title="Research" intro="Data-driven tools for understanding and forecasting water: how much there is, where it goes, and how clean it is." />
      <div className="page">
        {loading ? <p className="text-sediment">Loading research…</p> : (
          <>
            <section>
              <h2 className="mb-5 inline-flex items-center gap-2 text-lg font-medium"><span className="h-2 w-2 animate-pulse rounded-full bg-observed" aria-hidden />Ongoing</h2>
              <div className="space-y-5">{ongoing.map((p) => <ProjectRow key={p.id} p={p} />)}</div>
            </section>
            {done.length > 0 && (
              <section className="mt-16">
                <h2 className="mb-5 text-lg font-medium text-sediment">Completed</h2>
                <div className="space-y-5">{done.map((p) => <ProjectRow key={p.id} p={p} />)}</div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
