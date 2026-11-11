import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isDemo, resetDemo, saveProfile, useProfile } from '../lib/store'
import type { Profile } from '../lib/types'
import { AdminHeader, Field, FileInput, useToast } from './ui'

type Row = Record<string, string | undefined>

function RowList<T extends Row>({ rows, cols, onChange, addLabel }: { rows: T[]; cols: { key: keyof T; label: string; width?: string }[]; onChange: (r: T[]) => void; addLabel: string }) {
  const upd = (i: number, k: keyof T, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)))
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-2">
          {cols.map((c) => (
            <input key={String(c.key)} aria-label={c.label} placeholder={c.label} className={`field ${c.width || 'flex-1'}`} value={r[c.key] || ''} onChange={(e) => upd(i, c.key, e.target.value)} />
          ))}
          <button type="button" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="rounded p-2 text-sediment hover:text-danger"><X size={18} /><span className="sr-only">Remove row</span></button>
        </div>
      ))}
      <button type="button" className="link inline-flex items-center gap-1 text-sm" onClick={() => onChange([...rows, Object.fromEntries(cols.map((c) => [c.key, ''])) as T])}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  )
}

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-rule py-8 lg:grid-cols-[16rem_1fr]">
      <div><h2 className="font-medium">{title}</h2>{intro && <p className="mt-1 text-sm text-sediment">{intro}</p>}</div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}

export default function ProfileAdmin() {
  const { profile, loading } = useProfile()
  const [p, setP] = useState<Profile>(profile)
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const toast = useToast()
  useEffect(() => { if (!dirty) setP(profile) }, [profile, dirty])
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => { setP((x) => ({ ...x, [k]: v })); setDirty(true) }

  const submit = async () => {
    if (!p.name.trim()) return toast('Name is required', 'error')
    setBusy(true)
    try {
      await saveProfile(p)
      setDirty(false)
      toast('Profile saved')
    } catch (e) { toast((e as Error).message, 'error') } finally { setBusy(false) }
  }

  if (loading) return <p className="text-sediment">Loading…</p>

  return (
    <>
      <AdminHeader title="Profile and CV" intro="Your name, biography, photo, CV and links, as shown across the website."
        action={<button className="btn-primary" onClick={submit} disabled={busy || !dirty}>{busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>} />

      <Section title="Identity">
        <div className="grid gap-5 sm:grid-cols-[8rem_1fr]">
          <Field label="Title" id="h"><input id="h" className="field" value={p.honorific} onChange={(e) => set('honorific', e.target.value)} placeholder="Dr." /></Field>
          <Field label="Full name" id="n"><input id="n" className="field" value={p.name} onChange={(e) => set('name', e.target.value)} /></Field>
        </div>
        <Field label="Role line" id="r" hint="Shown above your name on the home page."><input id="r" className="field" value={p.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Affiliation" id="a"><input id="a" className="field" value={p.affiliation} onChange={(e) => set('affiliation', e.target.value)} /></Field>
        <Field label="Location" id="l"><input id="l" className="field" value={p.location} onChange={(e) => set('location', e.target.value)} /></Field>
        <Field label="Public email" id="e"><input id="e" type="email" className="field" value={p.email} onChange={(e) => set('email', e.target.value)} /></Field>
      </Section>

      <Section title="Introduction" intro="The headline is the first thing visitors read. Keep it to one or two sentences.">
        <Field label="Headline" id="hl"><textarea id="hl" rows={3} className="field" value={p.headline} onChange={(e) => set('headline', e.target.value)} /></Field>
        <Field label="Biography" id="bio" hint="Shown on the About page. Leave a blank line between paragraphs."><textarea id="bio" rows={10} className="field" value={p.bio} onChange={(e) => set('bio', e.target.value)} /></Field>
      </Section>

      <Section title="Photo and CV">
        <Field label="Portrait photo" id="ph" hint="A square or portrait JPG or PNG works best.">
          <FileInput id="ph" folder="profile" accept="image/*" value={p.photo_url} onChange={(v) => set('photo_url', v)} />
        </Field>
        {p.photo_url && <img src={p.photo_url} alt="" className="h-32 w-28 rounded-md object-cover" />}
        <Field label="CV (PDF)" id="cv" hint="Adds a Download CV button to the home and About pages.">
          <FileInput id="cv" folder="profile" value={p.cv_url} onChange={(v) => set('cv_url', v)} />
        </Field>
      </Section>

      <Section title="At a glance" intro="Three short facts shown on the home page.">
        <RowList rows={p.stats} onChange={(v) => set('stats', v as Profile['stats'])} addLabel="Add a fact"
          cols={[{ key: 'value', label: 'Value, e.g. 180+', width: 'w-44' }, { key: 'label', label: 'Label, e.g. Publications' }]} />
      </Section>

      <Section title="Research interests" intro="One per line.">
        <textarea rows={6} className="field" aria-label="Research interests" value={p.interests.join('\n')} onChange={(e) => set('interests', e.target.value.split('\n'))}
          onBlur={() => set('interests', p.interests.map((s) => s.trim()).filter(Boolean))} />
      </Section>

      <Section title="Appointments">
        <RowList rows={p.appointments} onChange={(v) => set('appointments', v as Profile['appointments'])} addLabel="Add an appointment"
          cols={[{ key: 'role', label: 'Role' }, { key: 'institution', label: 'Institution' }, { key: 'period', label: 'Period', width: 'w-32' }]} />
      </Section>

      <Section title="Education">
        <RowList rows={p.education} onChange={(v) => set('education', v as Profile['education'])} addLabel="Add a degree"
          cols={[{ key: 'degree', label: 'Degree', width: 'w-32' }, { key: 'institution', label: 'Institution' }, { key: 'year', label: 'Year', width: 'w-24' }]} />
      </Section>

      <Section title="More about you" intro="Extra lists on the About page, such as honours, patents, editorial roles, teaching and memberships. One item per line.">
        {(p.sections || []).map((sec, i) => (
          <div key={i} className="rounded-lg border border-rule bg-silt/60 p-4">
            <div className="flex gap-2">
              <input aria-label="Section title" className="field font-medium" placeholder="Section title, e.g. Honours and awards" value={sec.title}
                onChange={(e) => set('sections', (p.sections || []).map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
              <button type="button" className="rounded p-2 text-sediment hover:text-danger" onClick={() => set('sections', (p.sections || []).filter((_, j) => j !== i))}><X size={18} /><span className="sr-only">Remove section</span></button>
            </div>
            <textarea aria-label={`${sec.title || 'Section'} items`} rows={Math.min(10, Math.max(3, sec.items.length + 1))} className="field mt-2 text-sm" value={sec.items.join('\n')}
              onChange={(e) => set('sections', (p.sections || []).map((x, j) => (j === i ? { ...x, items: e.target.value.split('\n') } : x)))}
              onBlur={() => set('sections', (p.sections || []).map((x) => ({ ...x, items: x.items.map((l) => l.trim()).filter(Boolean) })))} />
          </div>
        ))}
        <button type="button" className="link inline-flex items-center gap-1 text-sm" onClick={() => set('sections', [...(p.sections || []), { title: '', items: [] }])}>
          <Plus size={14} /> Add a section
        </button>
      </Section>

      <Section title="Research profiles" intro="ORCID, Google Scholar, ResearchGate, Scopus, LinkedIn and so on.">
        <RowList rows={p.links} onChange={(v) => set('links', v as Profile['links'])} addLabel="Add a link"
          cols={[{ key: 'label', label: 'Name', width: 'w-44' }, { key: 'url', label: 'https://' }]} />
      </Section>

      <div className="flex justify-end border-t border-rule pt-6">
        <button className="btn-primary" onClick={submit} disabled={busy || !dirty}>{busy ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
      </div>

      {isDemo && (
        <div className="mt-12 rounded-lg border border-rule bg-white p-6">
          <h2 className="font-medium">Reset demo content</h2>
          <p className="mt-1 text-sm text-sediment">Restores the starter content and signs you out. Only affects this browser.</p>
          <button className="btn-danger mt-4" onClick={() => { resetDemo(); location.reload() }}>Reset demo</button>
        </div>
      )}
    </>
  )
}
