import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { remove, save, useCollection } from '../lib/store'
import type { Project } from '../lib/types'
import { AdminHeader, Drawer, Field, TagsInput, useConfirm, useToast } from './ui'

export default function ProjectsAdmin() {
  const { items, loading } = useCollection('projects')
  const [edit, setEdit] = useState<Partial<Project> | null>(null)
  const [params, setParams] = useSearchParams()
  const toast = useToast()
  const confirm = useConfirm()
  const sorted = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const blank = (): Partial<Project> => ({ title: '', summary: '', status: 'ongoing', tags: [], sort_order: items.length + 1 })

  useEffect(() => {
    if (params.get('new')) { setEdit(blank()); setParams({}, { replace: true }) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const del = async (p: Project) => {
    if (!(await confirm.ask(`Delete "${p.title}"?`))) return
    await remove('projects', p.id)
    toast('Project deleted')
  }

  return (
    <>
      <AdminHeader title="Research" intro="Projects shown on the Research page. Ongoing projects also appear on the home page."
        action={<button className="btn-primary" onClick={() => setEdit(blank())}><Plus size={16} /> Add project</button>} />
      <ul className="divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-white">
        {loading && <li className="p-6 text-sediment">Loading…</li>}
        {!loading && sorted.length === 0 && <li className="p-6 text-sediment">No projects yet. Add your first research project.</li>}
        {sorted.map((p) => (
          <li key={p.id} className="flex items-start gap-4 p-5">
            <span className={`mt-1 rounded px-2 py-0.5 text-xs ${p.status === 'ongoing' ? 'bg-observed/10 text-observed' : 'bg-silt text-sediment'}`}>{p.status === 'ongoing' ? 'Ongoing' : 'Completed'}</span>
            <div className="min-w-0 flex-1">
              <button onClick={() => setEdit(p)} className="text-left font-medium hover:text-observed">{p.title}</button>
              <p className="mt-1 line-clamp-2 text-sm text-sediment">{p.summary}</p>
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

function Editor({ initial, onClose }: { initial: Partial<Project>; onClose: () => void }) {
  const [p, setP] = useState(initial)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((x) => ({ ...x, [k]: v }))
  const num = (v: string) => (v ? Number(v) : undefined)
  const submit = async () => {
    if (!p.title?.trim() || !p.summary?.trim()) return setErr('A title and a short summary are required.')
    setBusy(true)
    try {
      await save('projects', p)
      toast(initial.id ? 'Project saved' : 'Project added')
      onClose()
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }
  return (
    <Drawer open title={initial.id ? 'Edit project' : 'Add project'} onClose={onClose}
      footer={<><button className="btn-quiet" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy} onClick={submit}>{busy ? 'Saving…' : initial.id ? 'Save changes' : 'Add project'}</button></>}>
      <Field label="Title" id="t"><input id="t" className="field" value={p.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Summary" id="s" hint="One or two sentences. Shown everywhere the project appears."><textarea id="s" rows={3} className="field" value={p.summary} onChange={(e) => set('summary', e.target.value)} /></Field>
      <Field label="Full description" id="b" hint="Optional. Leave a blank line between paragraphs."><textarea id="b" rows={6} className="field" value={p.body || ''} onChange={(e) => set('body', e.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Status" id="st">
          <select id="st" className="field" value={p.status} onChange={(e) => set('status', e.target.value as Project['status'])}>
            <option value="ongoing">Ongoing</option><option value="completed">Completed</option>
          </select>
        </Field>
        <Field label="Start year" id="sy"><input id="sy" type="number" className="field" value={p.start_year ?? ''} onChange={(e) => set('start_year', num(e.target.value))} /></Field>
        <Field label="End year" id="ey"><input id="ey" type="number" className="field" value={p.end_year ?? ''} onChange={(e) => set('end_year', num(e.target.value))} /></Field>
      </div>
      <Field label="Funder" id="f"><input id="f" className="field" value={p.funder || ''} onChange={(e) => set('funder', e.target.value)} /></Field>
      <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
        <Field label="Topics" id="tg"><TagsInput id="tg" value={p.tags || []} onChange={(v) => set('tags', v)} /></Field>
        <Field label="Position" id="o" hint="Lower comes first."><input id="o" type="number" className="field" value={p.sort_order ?? ''} onChange={(e) => set('sort_order', num(e.target.value))} /></Field>
      </div>
      {err && <p className="text-sm text-danger" role="alert">{err}</p>}
    </Drawer>
  )
}
