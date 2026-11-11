import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/SiteLayout'
import { fmtDate } from '../lib/cite'
import { useCollection } from '../lib/store'
import { POST_CATEGORY_LABEL } from '../lib/types'
import { categoryIcon } from '../components/icons'

export default function News() {
  const { items, loading } = useCollection('posts', { fallback: true })
  const posts = items.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader title="News" intro="New papers, awards, talks and grants." />
      <div className="page">
        {loading && <p className="text-sediment">Loading news…</p>}
        {!loading && posts.length === 0 && <p className="text-sediment">No news has been posted yet.</p>}
        <ol className="grid gap-5 md:grid-cols-2">
          {posts.map((n) => {
            const Icon = categoryIcon[n.category]
            return (
              <li key={n.id}>
                <Link to={`/news/${n.id}`} className="group flex h-full gap-5 rounded-2xl border border-rule bg-white p-6 transition-colors hover:border-observed/50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-predicted/15 text-[#8A5A0B]"><Icon size={20} aria-hidden /></span>
                  <div>
                    <p className="text-sm text-sediment"><time dateTime={n.date}>{fmtDate(n.date)}</time>, {POST_CATEGORY_LABEL[n.category]}</p>
                    <h2 className="mt-1 text-lg font-medium leading-snug group-hover:text-observed">{n.title}</h2>
                    <p className="mt-2 line-clamp-2 text-[0.95rem] text-sediment">{n.body}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </>
  )
}

export function NewsPost() {
  const { id } = useParams()
  const { items, loading } = useCollection('posts', { fallback: true })
  const n = items.find((p) => p.id === id && p.published)
  if (loading) return <div className="page py-20 text-sediment">Loading…</div>
  if (!n)
    return (
      <div className="page py-20">
        <h1 className="text-3xl font-medium">This news item isn't available</h1>
        <p className="mt-3 text-sediment">It may have been removed or unpublished.</p>
        <Link to="/news" className="link mt-4 inline-block">See all news</Link>
      </div>
    )
  return (
    <article className="page max-w-[46rem] pt-14 sm:pt-20">
      <title>{n.title}</title>
      <Link to="/news" className="link text-sm">All news</Link>
      <p className="mt-8 text-sm text-sediment">
        <time dateTime={n.date}>{fmtDate(n.date)}</time>, <span className="text-predicted">{POST_CATEGORY_LABEL[n.category]}</span>
      </p>
      <h1 className="mt-2 text-4xl font-medium leading-tight tracking-tight">{n.title}</h1>
      <div className="mt-8 space-y-5 font-serif text-[1.125rem] leading-[1.75] text-ink-soft">
        {n.body.split(/\n\s*\n/).map((x, i) => <p key={i}>{x}</p>)}
      </div>
      {n.link && <a href={n.link} target="_blank" rel="noreferrer" className="btn-quiet mt-8">Read more at the source</a>}
    </article>
  )
}
