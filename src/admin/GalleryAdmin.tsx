import { ArrowDown, ArrowUp, Check, ExternalLink, ImagePlus, Loader2, Star, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { seedGallery } from '../lib/seed'
import { remove, save, uploadFile, useCollection } from '../lib/store'
import type { Photo } from '../lib/types'
import { AdminHeader, useConfirm, useToast } from './ui'

type Pending = {
  key: string
  file: File
  preview: string
  caption: string
  date: string
  featured: boolean
  status: 'ready' | 'uploading' | 'done' | 'error'
  error?: string
}

export default function GalleryAdmin() {
  const { items, loading } = useCollection('gallery')
  const photos = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const [pending, setPending] = useState<Pending[]>([])
  const [uploading, setUploading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const confirm = useConfirm()

  // Free preview memory when leaving the page
  useEffect(() => () => pending.forEach((p) => URL.revokeObjectURL(p.preview)), []) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (files: FileList | null) => {
    if (!files?.length) return
    const imgs = [...files].filter((f) => f.type.startsWith('image/'))
    if (imgs.length < files.length) toast('Only image files can be added to the gallery', 'error')
    setPending((p) => [
      ...p.filter((x) => x.status !== 'done'),
      ...imgs.map((file) => ({
        key: `${file.name}-${file.size}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        caption: '',
        date: '',
        featured: false,
        status: 'ready' as const,
      })),
    ])
    if (fileRef.current) fileRef.current.value = ''
  }

  const update = (key: string, patch: Partial<Pending>) => setPending((p) => p.map((x) => (x.key === key ? { ...x, ...patch } : x)))
  const drop = (key: string) =>
    setPending((p) => {
      const it = p.find((x) => x.key === key)
      if (it) URL.revokeObjectURL(it.preview)
      return p.filter((x) => x.key !== key)
    })

  const uploadAll = async () => {
    const queue = pending.filter((p) => p.status === 'ready' || p.status === 'error')
    if (!queue.length) return
    setUploading(true)
    let order = photos.length ? Math.max(...photos.map((p) => p.sort_order ?? 0)) : 0
    let ok = 0
    for (const it of queue) {
      update(it.key, { status: 'uploading', error: undefined })
      try {
        const url = await uploadFile(it.file, 'gallery')
        await save('gallery', { image_url: url, caption: it.caption.trim(), date: it.date.trim() || undefined, featured: it.featured, sort_order: ++order })
        update(it.key, { status: 'done' })
        ok++
      } catch (e) {
        update(it.key, { status: 'error', error: (e as Error).message })
      }
    }
    setUploading(false)
    if (ok) toast(`${ok} photo${ok === 1 ? '' : 's'} uploaded and now live on the website`)
    if (ok < queue.length) toast(`${queue.length - ok} photo${queue.length - ok === 1 ? '' : 's'} failed. Check the error and try again.`, 'error')
  }

  const missingStarter = seedGallery.filter((s) => !items.some((i) => i.id === s.id))
  const addStarter = async () => {
    setSeeding(true)
    try {
      const base = photos.length ? Math.max(...photos.map((p) => p.sort_order ?? 0)) : 0
      for (const [i, s] of missingStarter.entries()) await save('gallery', { ...s, sort_order: base + i + 1 })
      toast(`${missingStarter.length} starter photos added`)
    } catch (e) {
      toast((e as Error).message, 'error')
    } finally {
      setSeeding(false)
    }
  }

  const move = async (i: number, d: -1 | 1) => {
    const a = photos[i]
    const b = photos[i + d]
    if (!a || !b) return
    const ao = a.sort_order ?? i
    const bo = b.sort_order ?? i + d
    await save('gallery', { ...a, sort_order: bo === ao ? ao + d : bo })
    await save('gallery', { ...b, sort_order: ao })
  }

  const del = async (p: Photo) => {
    if (!(await confirm.ask('Delete this photo from the gallery? It will disappear from the website.'))) return
    await remove('gallery', p.id)
    toast('Photo deleted')
  }

  const ready = pending.filter((p) => p.status === 'ready' || p.status === 'error').length
  const allDone = pending.length > 0 && pending.every((p) => p.status === 'done')

  return (
    <>
      <AdminHeader title="Gallery" intro="Photos on the Gallery page. Starred photos also appear on the home page."
        action={
          <div className="flex gap-3">
            <Link to="/gallery" target="_blank" className="btn-quiet"><ExternalLink size={16} /> View gallery</Link>
            <button className="btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}><ImagePlus size={16} /> Choose photos</button>
          </div>
        } />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => pick(e.target.files)} />

      {!loading && missingStarter.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-predicted/40 bg-predicted/10 px-5 py-4">
          <p className="text-sm text-ink">
            {missingStarter.length} starter photo{missingStarter.length === 1 ? ' is' : 's are'} not in your gallery yet (conferences, award, portrait).
          </p>
          <button className="btn-quiet" onClick={addStarter} disabled={seeding}>
            {seeding ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} {seeding ? 'Adding…' : 'Add starter photos'}
          </button>
        </div>
      )}

      {/* Step 1: choose */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files) }}
        className="mb-6 rounded-xl border-2 border-dashed border-rule bg-white px-6 py-8 text-center text-sm text-sediment">
        Drag photos here, or <button className="link" onClick={() => fileRef.current?.click()}>choose files</button>. You can add captions before uploading.
      </div>

      {/* Step 2: review and upload */}
      {pending.length > 0 && (
        <section className="mb-10 rounded-2xl border border-observed/40 bg-white p-5 sm:p-6" aria-label="Photos ready to upload">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-medium">{allDone ? 'Upload complete' : 'Ready to upload'}</h2>
              <p className="text-sm text-sediment">
                {allDone ? 'These photos are now live on the Gallery page.' : 'Add a caption and year to each photo, then upload.'}
              </p>
            </div>
            {allDone ? (
              <div className="flex gap-3">
                <Link to="/gallery" target="_blank" className="btn-quiet"><ExternalLink size={16} /> See them on the website</Link>
                <button className="btn-quiet" onClick={() => setPending([])}>Done</button>
              </div>
            ) : (
              <button className="btn-primary" onClick={uploadAll} disabled={uploading || ready === 0}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading…' : `Upload ${ready} photo${ready === 1 ? '' : 's'}`}
              </button>
            )}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pending.map((p) => (
              <li key={p.key} className="overflow-hidden rounded-xl border border-rule">
                <div className="relative aspect-[4/3] bg-silt">
                  <img src={p.preview} alt="" className="h-full w-full object-cover" />
                  {p.status === 'ready' && (
                    <button onClick={() => drop(p.key)} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow" title="Remove from upload">
                      <X size={16} /><span className="sr-only">Remove from upload</span>
                    </button>
                  )}
                  <StatusBadge status={p.status} />
                </div>
                <div className="space-y-2 p-3">
                  <input aria-label="Caption" className="field text-sm" placeholder="Caption, e.g. Keynote at a hydrology conference" value={p.caption}
                    disabled={p.status === 'uploading' || p.status === 'done'} onChange={(e) => update(p.key, { caption: e.target.value })} />
                  <div className="flex gap-2">
                    <input aria-label="Date or year" className="field text-sm" placeholder="Year (optional)" value={p.date}
                      disabled={p.status === 'uploading' || p.status === 'done'} onChange={(e) => update(p.key, { date: e.target.value })} />
                    <label className="flex shrink-0 items-center gap-1.5 rounded-md border border-rule px-2 text-xs text-sediment" title="Also show on the home page">
                      <input type="checkbox" className="accent-observed" checked={p.featured} disabled={p.status === 'uploading' || p.status === 'done'}
                        onChange={(e) => update(p.key, { featured: e.target.checked })} /> Home
                    </label>
                  </div>
                  {p.error && <p className="text-xs text-danger" role="alert">{p.error}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Step 3: manage what's live */}
      <h2 className="mb-4 text-lg font-medium">On the website <span className="text-sediment">({photos.length})</span></h2>
      {loading && <p className="text-sediment">Loading…</p>}
      {!loading && photos.length === 0 && <p className="text-sediment">No photos yet. Choose some above, or add the starter photos.</p>}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {photos.map((p, i) => <PhotoCard key={p.id} p={p} first={i === 0} last={i === photos.length - 1} onMove={(d) => move(i, d)} onDelete={() => del(p)} />)}
      </ul>
      {confirm.node}
    </>
  )
}

function StatusBadge({ status }: { status: Pending['status'] }) {
  if (status === 'ready') return null
  const map = {
    uploading: { cls: 'bg-ink text-white', icon: <Loader2 size={14} className="animate-spin" />, text: 'Uploading…' },
    done: { cls: 'bg-observed text-white', icon: <Check size={14} />, text: 'Uploaded' },
    error: { cls: 'bg-danger text-white', icon: <X size={14} />, text: 'Failed' },
  }[status]
  return <span className={`absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow ${map.cls}`}>{map.icon} {map.text}</span>
}

function PhotoCard({ p, first, last, onMove, onDelete }: { p: Photo; first: boolean; last: boolean; onMove: (d: -1 | 1) => void; onDelete: () => void }) {
  const [caption, setCaption] = useState(p.caption)
  const [date, setDate] = useState(p.date || '')
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const toast = useToast()
  useEffect(() => { setCaption(p.caption); setDate(p.date || '') }, [p.caption, p.date])
  const dirty = caption !== p.caption || date !== (p.date || '')

  const commit = async () => {
    setState('saving')
    try {
      await save('gallery', { ...p, caption: caption.trim(), date: date.trim() || undefined })
      setState('saved')
      setTimeout(() => setState('idle'), 2500)
    } catch (e) {
      setState('idle')
      toast((e as Error).message, 'error')
    }
  }

  return (
    <li className="overflow-hidden rounded-xl border border-rule bg-white">
      <div className="relative aspect-[4/3] bg-silt">
        <img src={p.image_url} alt={p.caption} className="h-full w-full object-cover" />
        <button onClick={() => save('gallery', { ...p, featured: !p.featured })} aria-pressed={!!p.featured}
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-xs shadow" title={p.featured ? 'Shown on home page' : 'Show on home page'}>
          <Star size={14} className={p.featured ? 'fill-predicted text-predicted' : 'text-sediment'} /> {p.featured ? 'On home page' : 'Add to home'}
        </button>
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs text-observed shadow"><Check size={13} /> Live</span>
      </div>
      <div className="space-y-3 p-4">
        <textarea aria-label="Caption" rows={2} className="field text-sm" placeholder="Write a caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <input aria-label="Date or year" className="field text-sm" placeholder="Date or year (optional)" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={first} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink disabled:opacity-30" title="Move earlier"><ArrowUp size={16} /><span className="sr-only">Move earlier</span></button>
          <button onClick={() => onMove(1)} disabled={last} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink disabled:opacity-30" title="Move later"><ArrowDown size={16} /><span className="sr-only">Move later</span></button>
          <button onClick={onDelete} className="rounded p-2 text-sediment hover:bg-danger/5 hover:text-danger" title="Delete photo"><Trash2 size={16} /><span className="sr-only">Delete photo</span></button>
          <div className="ml-auto">
            {state === 'saved' && !dirty ? (
              <span className="inline-flex items-center gap-1 text-sm text-observed"><Check size={15} /> Saved</span>
            ) : (
              <button className="btn-primary px-3 py-1.5 text-sm" onClick={commit} disabled={!dirty || state === 'saving'}>
                {state === 'saving' ? 'Saving…' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}
