import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { remove, save, uploadFile, useCollection } from '../lib/store'
import type { Photo } from '../lib/types'
import { AdminHeader, useConfirm, useToast } from './ui'

export default function GalleryAdmin() {
  const { items, loading } = useCollection('gallery')
  const photos = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const [busy, setBusy] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const confirm = useConfirm()

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    const list = [...files]
    let order = photos.length ? Math.max(...photos.map((p) => p.sort_order ?? 0)) : 0
    let done = 0
    for (const f of list) {
      setBusy(`Uploading ${done + 1} of ${list.length}…`)
      try {
        const url = await uploadFile(f, 'gallery')
        await save('gallery', { image_url: url, caption: '', sort_order: ++order, featured: false })
        done++
      } catch (e) {
        toast(`${f.name}: ${(e as Error).message}`, 'error')
      }
    }
    setBusy(null)
    if (fileRef.current) fileRef.current.value = ''
    if (done) toast(`${done} photo${done === 1 ? '' : 's'} added. Add captions below.`)
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
    if (!(await confirm.ask('Delete this photo from the gallery?'))) return
    await remove('gallery', p.id)
    toast('Photo deleted')
  }

  return (
    <>
      <AdminHeader title="Gallery" intro="Photos on the Gallery page. Starred photos also appear on the home page."
        action={
          <button className="btn-primary" onClick={() => fileRef.current?.click()} disabled={!!busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} {busy || 'Add photos'}
          </button>
        } />
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files) }}
        className="mb-6 rounded-xl border-2 border-dashed border-rule bg-white px-6 py-8 text-center text-sm text-sediment">
        Drag photos here, or <button className="link" onClick={() => fileRef.current?.click()}>choose files</button>. Large photos are resized automatically.
      </div>

      {loading && <p className="text-sediment">Loading…</p>}
      {!loading && photos.length === 0 && <p className="text-sediment">No photos yet. Add some from conferences, awards or fieldwork.</p>}
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {photos.map((p, i) => <PhotoCard key={p.id} p={p} first={i === 0} last={i === photos.length - 1} onMove={(d) => move(i, d)} onDelete={() => del(p)} />)}
      </ul>
      {confirm.node}
    </>
  )
}

function PhotoCard({ p, first, last, onMove, onDelete }: { p: Photo; first: boolean; last: boolean; onMove: (d: -1 | 1) => void; onDelete: () => void }) {
  const [caption, setCaption] = useState(p.caption)
  const [date, setDate] = useState(p.date || '')
  const toast = useToast()
  const dirty = caption !== p.caption || date !== (p.date || '')
  const commit = async () => {
    if (!dirty) return
    await save('gallery', { ...p, caption: caption.trim(), date: date.trim() || undefined })
    toast('Caption saved')
  }
  return (
    <li className="overflow-hidden rounded-xl border border-rule bg-white">
      <div className="relative aspect-[4/3] bg-silt">
        <img src={p.image_url} alt={p.caption} className="h-full w-full object-cover" />
        <button onClick={() => save('gallery', { ...p, featured: !p.featured })} aria-pressed={!!p.featured}
          className="absolute left-3 top-3 rounded-full bg-white/90 p-2 shadow" title={p.featured ? 'Shown on home page' : 'Show on home page'}>
          <Star size={16} className={p.featured ? 'fill-predicted text-predicted' : 'text-sediment'} />
          <span className="sr-only">{p.featured ? 'Remove from home page' : 'Show on home page'}</span>
        </button>
      </div>
      <div className="space-y-3 p-4">
        <textarea aria-label="Caption" rows={2} className="field text-sm" placeholder="Write a caption, e.g. Keynote at a hydrology conference" value={caption} onChange={(e) => setCaption(e.target.value)} onBlur={commit} />
        <input aria-label="Date or year" className="field text-sm" placeholder="Date or year (optional)" value={date} onChange={(e) => setDate(e.target.value)} onBlur={commit} />
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={first} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink disabled:opacity-30"><ArrowUp size={16} /><span className="sr-only">Move earlier</span></button>
          <button onClick={() => onMove(1)} disabled={last} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink disabled:opacity-30"><ArrowDown size={16} /><span className="sr-only">Move later</span></button>
          <button onClick={onDelete} className="ml-auto rounded p-2 text-sediment hover:bg-danger/5 hover:text-danger"><Trash2 size={16} /><span className="sr-only">Delete photo</span></button>
        </div>
      </div>
    </li>
  )
}
