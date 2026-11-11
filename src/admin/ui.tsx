import { Loader2, Upload, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { uploadFile } from '../lib/store'

/* ---------- toast ---------- */
const ToastCtx = createContext<(msg: string, kind?: 'ok' | 'error') => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null)
  const timer = useRef<number>(0)
  const show = useCallback((msg: string, kind: 'ok' | 'error' = 'ok') => {
    setT({ msg, kind })
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setT(null), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
        {t && (
          <div className={`rounded-md px-4 py-2.5 text-sm text-white shadow-lg ${t.kind === 'error' ? 'bg-danger' : 'bg-ink'}`}>{t.msg}</div>
        )}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- drawer ---------- */
export function Drawer({ open, title, onClose, children, footer }: { open: boolean; title: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-rule px-6 py-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-sediment hover:text-ink"><X size={20} /><span className="sr-only">Close</span></button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex items-center justify-end gap-3 border-t border-rule bg-silt px-6 py-4">{footer}</div>
      </div>
    </div>
  )
}

/* ---------- fields ---------- */
export function Field({ label, hint, children, id }: { label: string; hint?: string; children: ReactNode; id?: string }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}

export function TagsInput({ value, onChange, id }: { value: string[]; onChange: (v: string[]) => void; id?: string }) {
  const [text, setText] = useState(value.join(', '))
  useEffect(() => setText(value.join(', ')), [value])
  return (
    <input id={id} className="field" value={text} onChange={(e) => setText(e.target.value)}
      onBlur={() => onChange(text.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="Separate with commas" />
  )
}

export function FileInput({ value, onChange, accept = 'application/pdf', folder, id }: { value?: string; onChange: (url: string) => void; accept?: string; folder: string; id?: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true)
    setErr('')
    try {
      onChange(await uploadFile(f, folder))
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ''
    }
  }
  const isData = value?.startsWith('data:')
  return (
    <div>
      <div className="flex gap-2">
        <input id={id} className="field" placeholder="Paste a link, or upload a file" value={isData ? 'Uploaded file (stored in this browser)' : value || ''}
          readOnly={isData} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="btn-quiet shrink-0" onClick={() => ref.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Upload
        </button>
        {value && <button type="button" className="btn-quiet shrink-0" onClick={() => onChange('')}>Remove</button>}
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      {err && <p className="mt-1 text-sm text-danger" role="alert">{err}</p>}
    </div>
  )
}

/* ---------- confirm ---------- */
export function useConfirm() {
  const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null)
  const ask = (text: string) => new Promise<boolean>((resolve) => setState({ text, resolve }))
  const node = state && (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/40" />
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <p className="text-ink">{state.text}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-quiet" autoFocus onClick={() => { state.resolve(false); setState(null) }}>Cancel</button>
          <button className="btn-danger" onClick={() => { state.resolve(true); setState(null) }}>Delete</button>
        </div>
      </div>
    </div>
  )
  return { ask, node }
}

export function AdminHeader({ title, intro, action }: { title: string; intro?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <title>{`${title} | Admin`}</title>
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        {intro && <p className="mt-1 text-sediment">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
