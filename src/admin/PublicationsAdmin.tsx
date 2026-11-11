import { FileText, Loader2, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { lookupDoi } from '../lib/cite'
import { remove, save, useCollection } from '../lib/store'
import { PUB_TYPE_LABEL, type Publication, type PubType } from '../lib/types'
import { AdminHeader, Drawer, Field, FileInput, TagsInput, useConfirm, useToast } from './ui'

const blank = (): Partial<Publication> => ({ title: '', authors: '', venue: '', year: new Date().getFullYear(), type: 'journal', keywords: [], featured: false })

export default function PublicationsAdmin() {
  const { items, loading, error } = useCollection('publications')
  const [params, setParams] = useSearchParams()
  const [edit, setEdit] = useState<Partial<Publication> | null>(null)
  const [bulk, setBulk] = useState(false)
  const [q, setQ] = useState('')
  const toast = useToast()
  const confirm = useConfirm()

  useEffect(() => {
    if (params.get('new')) {
      setEdit(blank())
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const rows = useMemo(() => {
    const n = q.toLowerCase()
    return [...items]
      .filter((p) => !n || `${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase().includes(n))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
  }, [items, q])

  const del = async (p: Publication) => {
    if (!(await confirm.ask(`Delete "${p.title}"? This removes it from the website.`))) return
    try {
      await remove('publications', p.id)
      toast('Publication deleted')
    } catch (e) {
      toast((e as Error).message, 'error')
    }
  }

  const toggleFeatured = async (p: Publication) => {
    await save('publications', { ...p, featured: !p.featured })
    toast(p.featured ? 'Removed from home page' : 'Shown on home page')
  }

  return (
    <>
      <AdminHeader title="Publications" intro={`${items.length} on the website. Starred items appear under "Selected publications" on the home page.`}
        action={
          <div className="flex gap-3">
            <button className="btn-quiet" onClick={() => setBulk(true)}>Import from DOIs</button>
            <button className="btn-primary" onClick={() => setEdit(blank())}><Plus size={16} /> Add publication</button>
          </div>
        } />

      <label className="relative mb-4 block max-w-md">
        <span className="sr-only">Search</span>
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-sediment" />
        <input className="field pl-9" placeholder="Search publications" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>

      {error && <p className="mb-4 text-danger">Couldn't load publications: {error}</p>}
      <div className="overflow-hidden rounded-lg border border-rule bg-white">
        <table className="w-full text-left text-[0.95rem]">
          <thead className="border-b border-rule bg-silt text-sm text-sediment">
            <tr><th className="w-10 px-4 py-3"><span className="sr-only">Featured</span></th><th className="px-4 py-3 font-medium">Title</th><th className="hidden px-4 py-3 font-medium md:table-cell">Year</th><th className="hidden px-4 py-3 font-medium lg:table-cell">Type</th><th className="w-28 px-4 py-3"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {loading && <tr><td colSpan={5} className="px-4 py-8 text-sediment">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-sediment">No publications yet. Add one, or import a list of DOIs.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="align-top hover:bg-silt/60">
                <td className="px-4 py-3">
                  <button onClick={() => toggleFeatured(p)} aria-pressed={!!p.featured} title={p.featured ? 'Shown on home page' : 'Show on home page'}>
                    <Star size={17} className={p.featured ? 'fill-predicted text-predicted' : 'text-rule hover:text-sediment'} />
                    <span className="sr-only">{p.featured ? 'Remove from home page' : 'Show on home page'}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setEdit(p)} className="text-left font-serif leading-snug hover:text-observed">{p.title}</button>
                  <div className="mt-0.5 line-clamp-1 text-sm text-sediment">{p.venue}</div>
                  {p.pdf_url && <span className="mt-1 inline-flex items-center gap-1 text-xs text-observed"><FileText size={12} /> PDF attached</span>}
                </td>
                <td className="hidden px-4 py-3 tabular-nums md:table-cell">{p.year}</td>
                <td className="hidden px-4 py-3 text-sm text-sediment lg:table-cell">{PUB_TYPE_LABEL[p.type]}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEdit(p)} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink"><Pencil size={16} /><span className="sr-only">Edit</span></button>
                    <button onClick={() => del(p)} className="rounded p-2 text-sediment hover:bg-danger/5 hover:text-danger"><Trash2 size={16} /><span className="sr-only">Delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
      {bulk && <BulkImport onClose={() => setBulk(false)} existing={items} />}
      {confirm.node}
    </>
  )
}

function Editor({ initial, onClose }: { initial: Partial<Publication>; onClose: () => void }) {
  const [p, setP] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [doiBusy, setDoiBusy] = useState(false)
  const [err, setErr] = useState('')
  const toast = useToast()
  const set = <K extends keyof Publication>(k: K, v: Publication[K]) => setP((x) => ({ ...x, [k]: v }))

  const fill = async () => {
    if (!p.doi) return
    setDoiBusy(true)
    setErr('')
    try {
      const m = await lookupDoi(p.doi)
      setP((x) => ({ ...x, ...Object.fromEntries(Object.entries(m).filter(([, v]) => v)) }))
      toast('Details filled in from the DOI')
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setDoiBusy(false)
    }
  }

  const submit = async () => {
    if (!p.title?.trim() || !p.authors?.trim() || !p.venue?.trim() || !p.year) {
      setErr('Title, authors, journal or venue, and year are required.')
      return
    }
    setBusy(true)
    try {
      await save('publications', p)
      toast(initial.id ? 'Publication saved' : 'Publication added')
      onClose()
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Drawer open title={initial.id ? 'Edit publication' : 'Add publication'} onClose={onClose}
      footer={<><button className="btn-quiet" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={submit} disabled={busy}>{busy ? 'Saving…' : initial.id ? 'Save changes' : 'Add publication'}</button></>}>
      <Field label="DOI" id="doi" hint="Paste a DOI and choose Fill in to pull the title, authors and journal automatically.">
        <div className="flex gap-2">
          <input id="doi" className="field" placeholder="10.1000/xyz123" value={p.doi || ''} onChange={(e) => set('doi', e.target.value)} />
          <button type="button" className="btn-quiet shrink-0" onClick={fill} disabled={!p.doi || doiBusy}>{doiBusy && <Loader2 size={16} className="animate-spin" />} Fill in</button>
        </div>
      </Field>
      <Field label="Title" id="title"><textarea id="title" rows={2} className="field font-serif" value={p.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Authors" id="authors" hint="In publication order, separated by commas."><input id="authors" className="field" value={p.authors} onChange={(e) => set('authors', e.target.value)} /></Field>
      <Field label="Journal or venue" id="venue" hint="Include volume, issue and pages if you like."><input id="venue" className="field" value={p.venue} onChange={(e) => set('venue', e.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Year" id="year"><input id="year" type="number" className="field" value={p.year ?? ''} onChange={(e) => set('year', Number(e.target.value))} /></Field>
        <Field label="Type" id="type">
          <select id="type" className="field" value={p.type} onChange={(e) => set('type', e.target.value as PubType)}>
            {Object.entries(PUB_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Full-text PDF" id="pdf" hint="Only upload PDFs you have the right to share, such as accepted manuscripts or open-access versions.">
        <FileInput id="pdf" folder="publications" value={p.pdf_url} onChange={(v) => set('pdf_url', v)} />
      </Field>
      <Field label="Link to article" id="url" hint="Used when there's no DOI."><input id="url" className="field" value={p.url || ''} onChange={(e) => set('url', e.target.value)} /></Field>
      <Field label="Abstract" id="abs"><textarea id="abs" rows={5} className="field" value={p.abstract || ''} onChange={(e) => set('abstract', e.target.value)} /></Field>
      <Field label="Keywords" id="kw"><TagsInput id="kw" value={p.keywords || []} onChange={(v) => set('keywords', v)} /></Field>
      <label className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4 accent-observed" checked={!!p.featured} onChange={(e) => set('featured', e.target.checked)} />
        Show on the home page under Selected publications
      </label>
      {err && <p className="text-sm text-danger" role="alert">{err}</p>}
    </Drawer>
  )
}

function BulkImport({ onClose, existing }: { onClose: () => void; existing: Publication[] }) {
  const [text, setText] = useState('')
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const run = async () => {
    const dois = [...new Set(text.split(/[\s,;]+/).map((s) => s.trim()).filter((s) => s.includes('10.')))]
    const have = new Set(existing.map((p) => (p.doi || '').toLowerCase()))
    setBusy(true)
    setLog([])
    let added = 0
    for (const d of dois) {
      const clean = d.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
      if (have.has(clean.toLowerCase())) {
        setLog((l) => [...l, `Skipped ${clean}: already on the site`])
        continue
      }
      try {
        const m = await lookupDoi(clean)
        await save('publications', { keywords: [], featured: false, ...m } as Publication)
        added++
        setLog((l) => [...l, `Added: ${m.title}`])
      } catch {
        setLog((l) => [...l, `Couldn't find ${clean}`])
      }
    }
    setBusy(false)
    toast(`${added} publication${added === 1 ? '' : 's'} imported`)
  }
  return (
    <Drawer open title="Import from DOIs" onClose={onClose}
      footer={<><button className="btn-quiet" onClick={onClose}>Close</button><button className="btn-primary" onClick={run} disabled={busy || !text.trim()}>{busy ? 'Importing…' : 'Import'}</button></>}>
      <Field label="DOIs" id="dois" hint="One per line. Details are fetched from Crossref. DOIs already on the site are skipped.">
        <textarea id="dois" rows={10} className="field font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={'10.1000/xyz123\n10.1000/abc456'} />
      </Field>
      {log.length > 0 && <ul className="space-y-1 rounded-md bg-silt p-4 text-sm">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>}
    </Drawer>
  )
}
