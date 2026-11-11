import { Expand } from 'lucide-react'
import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import { PageHeader } from '../components/SiteLayout'
import { useCollection } from '../lib/store'

export default function Gallery() {
  const { items, loading } = useCollection('gallery', { fallback: true })
  const photos = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <PageHeader title="Gallery" intro="Conferences, awards, collaborations and moments from the research journey." />
      <div className="page">
        {loading && <p className="text-sediment">Loading photos…</p>}
        {!loading && photos.length === 0 && <p className="text-sediment">No photos have been added yet.</p>}
        <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
          {photos.map((p, i) => (
            <li key={p.id} className="break-inside-avoid">
              <figure className="overflow-hidden rounded-2xl border border-rule bg-white">
                <button onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden" aria-label={`View larger: ${p.caption}`}>
                  <img src={p.image_url} alt={p.caption} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span aria-hidden className="absolute right-3 top-3 rounded-full bg-ink/60 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand size={16} />
                  </span>
                </button>
                {(p.caption || p.date) && (
                  <figcaption className="px-5 py-4">
                    <p className="text-[0.95rem] leading-snug">{p.caption}</p>
                    {p.date && <p className="mt-1 text-sm text-sediment">{p.date}</p>}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}
