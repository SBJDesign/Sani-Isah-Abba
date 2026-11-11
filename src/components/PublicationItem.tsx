import { Check, FileText } from 'lucide-react'
import { useState } from 'react'
import { apa, bibtex, doiUrl } from '../lib/cite'
import type { Publication } from '../lib/types'
import { PUB_TYPE_LABEL } from '../lib/types'

export default function PublicationItem({ p, showYear = true, highlight }: { p: Publication; showYear?: boolean; highlight?: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const [openAbs, setOpenAbs] = useState(false)
  const copy = async (kind: 'APA' | 'BibTeX') => {
    await navigator.clipboard?.writeText(kind === 'APA' ? apa(p) : bibtex(p)).catch(() => {})
    setCopied(kind)
    setTimeout(() => setCopied(null), 1800)
  }
  const doi = doiUrl(p.doi)
  const authors = highlight
    ? p.authors.split(new RegExp(`(${highlight})`, 'i')).map((s, i) => (i % 2 ? <span key={i} className="font-medium text-ink">{s}</span> : s))
    : p.authors

  return (
    <article className={`grid gap-x-8 border-t border-rule py-6 ${showYear ? 'sm:grid-cols-[4.5rem_1fr]' : ''}`}>
      {showYear && <div className="text-sm font-medium tabular-nums text-observed sm:pt-1">{p.year}</div>}
      <div>
        <h3 className="font-serif text-[1.15rem] leading-snug text-ink">
          {doi || p.url ? (
            <a href={doi || p.url} target="_blank" rel="noreferrer" className="hover:text-observed">{p.title}</a>
          ) : p.title}
        </h3>
        <p className="mt-1.5 text-[0.95rem] text-sediment">{authors}</p>
        <p className="mt-0.5 font-serif text-[0.95rem] italic text-ink-soft">
          {p.venue}
          {!showYear && <span className="not-italic text-sediment">, {p.year}</span>}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-sediment">{PUB_TYPE_LABEL[p.type]}</span>
          {doi && <a className="link" href={doi} target="_blank" rel="noreferrer">DOI</a>}
          {p.pdf_url && (
            <a className="link inline-flex items-center gap-1" href={p.pdf_url} target="_blank" rel="noreferrer" download={p.pdf_url.startsWith('data:') ? `${p.title.slice(0, 40)}.pdf` : undefined}>
              <FileText size={14} aria-hidden /> PDF
            </a>
          )}
          {p.abstract && (
            <button className="link" aria-expanded={openAbs} onClick={() => setOpenAbs(!openAbs)}>
              {openAbs ? 'Hide abstract' : 'Abstract'}
            </button>
          )}
          <button className="link" onClick={() => copy('APA')}>Copy citation</button>
          <button className="link" onClick={() => copy('BibTeX')}>BibTeX</button>
          <span role="status" className="inline-flex items-center gap-1 text-observed">
            {copied && (<><Check size={14} aria-hidden /> {copied} copied</>)}
          </span>
        </div>
        {openAbs && p.abstract && <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-ink-soft">{p.abstract}</p>}
      </div>
    </article>
  )
}
