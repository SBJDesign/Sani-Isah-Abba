import type { Publication } from './types'

export const doiUrl = (doi?: string) => (doi ? `https://doi.org/${doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}` : undefined)

export function apa(p: Publication) {
  const doi = doiUrl(p.doi)
  return `${p.authors} (${p.year}). ${p.title}. ${p.venue}.${doi ? ' ' + doi : ''}`
}

export function bibtex(p: Publication) {
  const first = (p.authors.split(',')[0] || 'author').trim().split(/\s+/).pop()?.replace(/\W/g, '') || 'author'
  const word = p.title.split(/\s+/).find((w) => w.length > 3)?.replace(/\W/g, '').toLowerCase() || 'paper'
  const kind = p.type === 'conference' ? 'inproceedings' : p.type === 'chapter' ? 'incollection' : p.type === 'book' ? 'book' : 'article'
  const venueKey = p.type === 'conference' || p.type === 'chapter' ? 'booktitle' : 'journal'
  const fields = [
    `  title = {${p.title}}`,
    `  author = {${p.authors.split(/,\s*/).join(' and ')}}`,
    `  ${venueKey} = {${p.venue}}`,
    `  year = {${p.year}}`,
    p.doi ? `  doi = {${p.doi}}` : '',
  ].filter(Boolean)
  return `@${kind}{${first.toLowerCase()}${p.year}${word},\n${fields.join(',\n')}\n}`
}

/** Look up metadata for a DOI from Crossref (public, no key needed). */
export async function lookupDoi(doi: string): Promise<Partial<Publication>> {
  const clean = doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
  const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(clean)}`)
  if (!r.ok) throw new Error('No record found for that DOI. Check it and try again.')
  const m = (await r.json()).message
  const authors = (m.author || [])
    .map((a: { given?: string; family?: string }) => {
      const initials = (a.given || '').split(/[\s-]+/).filter(Boolean).map((g) => g[0] + '.').join(' ')
      return [initials, a.family].filter(Boolean).join(' ')
    })
    .join(', ')
  const year = m.issued?.['date-parts']?.[0]?.[0] || m.published?.['date-parts']?.[0]?.[0]
  const venueParts = [m['container-title']?.[0], m.volume && (m.issue ? `${m.volume}(${m.issue})` : m.volume), m.page || m['article-number']]
  const t = m.type as string
  return {
    doi: clean,
    title: (m.title?.[0] || '').replace(/<[^>]+>/g, ''),
    authors,
    year: year ? Number(year) : undefined,
    venue: venueParts.filter(Boolean).join(', '),
    type: t === 'proceedings-article' ? 'conference' : t === 'book-chapter' ? 'chapter' : t === 'book' ? 'book' : t === 'posted-content' ? 'preprint' : 'journal',
    abstract: m.abstract ? m.abstract.replace(/<[^>]+>/g, '').trim() : undefined,
    url: m.URL,
  }
}

/** Formats YYYY-MM-DD, YYYY-MM or YYYY (also full ISO timestamps). */
export const fmtDate = (d: string) => {
  if (/^\d{4}$/.test(d)) return d
  if (/^\d{4}-\d{2}$/.test(d)) return new Date(d + '-01T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  return new Date(d + (d.length === 10 ? 'T00:00:00' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
