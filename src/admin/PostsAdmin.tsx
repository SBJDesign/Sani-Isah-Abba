import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fmtDate } from '../lib/cite'
import { remove, save, useCollection } from '../lib/store'
import { POST_CATEGORY_LABEL, type Post, type PostCategory } from '../lib/types'
import { AdminHeader, Drawer, Field, useConfirm, useToast } from './ui'

const blank = (): Partial<Post> => ({ title: '', body: '', category: 'news', date: new Date().toISOString().slice(0, 10), published: true })

export default function PostsAdmin() {
  const { items, loading } = useCollection('posts')
  const [edit, setEdit] = useState<Partial<Post> | null>(null)
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const confirm = useConfirm()
  useEffect(() => {
    if (params.get('new')) { setEdit(blank()); setParams({}, { replace: true }) }
  }, [params, setParams])
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))

  const del = async (p: Post) => {
    if (!(await confirm.ask(`Delete "${p.title}"?`))) return
    await remove('posts', p.id)
    toast('Update deleted')
  }

  return (
    <>
      <AdminHeader title="News and updates" intro="New papers, awards, talks, grants and media mentions. Drafts stay hidden until you publish them."
        action={<button className="btn-primary" onClick={() => setEdit(blank())}><Plus size={16} /> Post an update</button>} />
      <ul className="divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-white">
        {loading && <li className="p-6 text-sediment">Loading…</li>}
        {!loading && sorted.length === 0 && <li className="p-6 text-sediment">Nothing posted yet. Share your latest paper or award.</li>}
        {sorted.map((p) => (
          <li key={p.id} className="flex items-start gap-4 p-5">
            <div className="w-28 shrink-0 text-sm">
              <div className="text-sediment">{fmtDate(p.date)}</div>
              <div className="text-predicted">{POST_CATEGORY_LABEL[p.category]}</div>
            </div>
            <div className="min-w-0 flex-1">
              <button onClick={() => setEdit(p)} className="text-left font-medium hover:text-observed">{p.title}</button>
              {!p.published && <span className="ml-2 rounded bg-silt px-2 py-0.5 text-xs text-sediment">Draft</span>}
            </div>
            <button onClick={() => setEdit(p)} className="rounded p-2 text-sediment hover:bg-silt hover:text-ink"><Pencil size={16} /><span className="sr-only">Edit</span></button>
            <button onClick={() => del(p)} className="rounded p-2 text-sediment hover:bg-danger/5 hover:text-danger"><Trash2 size={16} /><span className="sr-only">Delete</span></button>
          </li>
        ))}
      </ul>
      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
      {confirm.node}
    </>
  )
}

function Editor({ initial, onClose }: { initial: Partial<Post>; onClose: () => void }) {
  const [p, setP] = useState(initial)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }))
  const submit = async (published: boolean) => {
    if (!p.title?.trim() || !p.body?.trim() || !p.date) return setErr('A title, date and text are required.')
    if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(p.date)) return setErr('Write the date as 2025-10-15, 2025-10 or 2025.')
    setBusy(true)
    try {
      await save('posts', { ...p, published })
      toast(published ? 'Published' : 'Saved as draft')
      onClose()
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }
  return (
    <Drawer open title={initial.id ? 'Edit update' : 'Post an update'} onClose={onClose}
      footer={<><button className="btn-quiet" onClick={() => submit(false)} disabled={busy}>Save as draft</button><button className="btn-primary" onClick={() => submit(true)} disabled={busy}>{busy ? 'Saving…' : 'Publish'}</button></>}>
      <Field label="Headline" id="t"><input id="t" className="field" value={p.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date" id="d" hint="Full date (2025-10-15), month (2025-10) or year (2025)."><input id="d" className="field" placeholder="2025-10-15" value={p.date} onChange={(e) => set('date', e.target.value.trim())} /></Field>
        <Field label="Category" id="c">
          <select id="c" className="field" value={p.category} onChange={(e) => set('category', e.target.value as PostCategory)}>
            {Object.entries(POST_CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Text" id="b" hint="Leave a blank line between paragraphs."><textarea id="b" rows={9} className="field" value={p.body} onChange={(e) => set('body', e.target.value)} /></Field>
      <Field label="Link" id="l" hint="Optional: the paper, event page or press article."><input id="l" className="field" value={p.link || ''} onChange={(e) => set('link', e.target.value)} /></Field>
      {err && <p className="text-sm text-danger" role="alert">{err}</p>}
    </Drawer>
  )
}
