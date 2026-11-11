import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { seedGallery, seedPosts, seedProfile, seedProjects, seedPublications } from './seed'
import type { Collection, CollectionMap, Profile } from './types'

/**
 * Data layer.
 * - If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, everything is stored in Supabase
 *   (Postgres tables, Storage bucket "files", email/password auth).
 * - Otherwise the site runs in demo mode: data lives in this browser's localStorage,
 *   seeded with starter content, and the admin password is "admin123".
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null
export const isDemo = !supabase

/* ---------------- local (demo) backend ---------------- */

const LS = 'academic-hub:v1:'
const safe = {
  get<T>(k: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(LS + k)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(LS + k, JSON.stringify(v))
    } catch {
      throw new Error('This browser is out of storage space. Remove large files or connect Supabase.')
    }
  },
}
const seeds: { [K in Collection]: CollectionMap[K][] } = {
  publications: seedPublications,
  projects: seedProjects,
  posts: seedPosts,
  messages: [],
  gallery: seedGallery,
}
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

/* ---------------- change notification ---------------- */
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

/* ---------------- public API ---------------- */

export async function list<K extends Collection>(c: K): Promise<CollectionMap[K][]> {
  if (supabase) {
    const { data, error } = await supabase.from(c).select('*')
    if (error) throw error
    return data as CollectionMap[K][]
  }
  return safe.get(c, seeds[c])
}

export async function save<K extends Collection>(c: K, item: Partial<CollectionMap[K]>): Promise<CollectionMap[K]> {
  const now = new Date().toISOString()
  if (supabase) {
    const row = { ...item, id: item.id || uid(), created_at: item.created_at || now }
    const { data, error } = await supabase.from(c).upsert(row).select().single()
    if (error) throw error
    emit()
    return data as CollectionMap[K]
  }
  const all = safe.get(c, seeds[c]) as CollectionMap[K][]
  const row = { ...item, id: item.id || uid(), created_at: item.created_at || now } as CollectionMap[K]
  const i = all.findIndex((x) => x.id === row.id)
  if (i >= 0) all[i] = row
  else all.unshift(row)
  safe.set(c, all)
  emit()
  return row
}

export async function remove(c: Collection, id: string) {
  if (supabase) {
    const { error } = await supabase.from(c).delete().eq('id', id)
    if (error) throw error
  } else {
    safe.set(c, (safe.get(c, seeds[c]) as { id: string }[]).filter((x) => x.id !== id))
  }
  emit()
}

/** Public contact form. Works for anonymous visitors (RLS allows insert only). */
export async function sendMessage(m: { name: string; email: string; subject?: string; body: string }) {
  if (supabase) {
    const { error } = await supabase.from('messages').insert({ ...m, id: uid(), read: false })
    if (error) throw error
    return
  }
  await save('messages', { ...m, read: false })
}

export async function getProfile(): Promise<Profile> {
  if (supabase) {
    const { data, error } = await supabase.from('profile').select('data').eq('id', 1).maybeSingle()
    if (error) throw error
    return { ...seedProfile, ...((data?.data as Partial<Profile>) || {}) }
  }
  return { ...seedProfile, ...safe.get<Partial<Profile>>('profile', {}) }
}

export async function saveProfile(p: Profile) {
  if (supabase) {
    const { error } = await supabase.from('profile').upsert({ id: 1, data: p })
    if (error) throw error
  } else safe.set('profile', p)
  emit()
}

/** Upload a file (PDF, image). Returns a public URL. */
/** Shrinks large photos before upload so pages stay fast (max 1800px, JPEG). */
async function shrinkImage(file: File, max = 1800): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
    if (scale === 1 && file.size < 900_000) return file
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * scale)
    c.height = Math.round(bmp.height * scale)
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.84))
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

export async function uploadFile(original: File, folder = 'uploads'): Promise<string> {
  const file = await shrinkImage(original, isDemo ? 1200 : 1800)
  if (supabase) {
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, '_')}`
    const { error } = await supabase.storage.from('files').upload(path, file, { upsert: false })
    if (error) throw error
    return supabase.storage.from('files').getPublicUrl(path).data.publicUrl
  }
  if (file.size > 1.5 * 1024 * 1024)
    throw new Error('In demo mode files must be under 1.5 MB. Connect Supabase to upload larger PDFs.')
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = () => rej(new Error('Could not read the file.'))
    r.readAsDataURL(file)
  })
}

export function resetDemo() {
  ;['publications', 'projects', 'posts', 'messages', 'gallery', 'profile', 'session'].forEach((k) =>
    localStorage.removeItem(LS + k),
  )
  emit()
}

/* ---------------- auth ---------------- */

export async function signIn(email: string, password: string) {
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  } else {
    if (password !== 'admin123') throw new Error('Wrong password. In demo mode the password is admin123.')
    safe.set('session', { email })
  }
  emit()
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
  else localStorage.removeItem(LS + 'session')
  emit()
}

export function useSession() {
  const [state, setState] = useState<{ loading: boolean; email: string | null }>({ loading: true, email: null })
  useEffect(() => {
    const check = async () => {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        setState({ loading: false, email: data.session?.user.email ?? null })
      } else {
        setState({ loading: false, email: safe.get<{ email: string } | null>('session', null)?.email ?? null })
      }
    }
    check()
    listeners.add(check)
    const sub = supabase?.auth.onAuthStateChange(() => check())
    return () => {
      listeners.delete(check)
      sub?.data.subscription.unsubscribe()
    }
  }, [])
  return state
}

/* ---------------- hooks ---------------- */

/**
 * fallback: on public pages, show the starter content while a database table is still empty,
 * so the site never looks blank. The admin dashboard always shows the real database contents.
 */
export function useCollection<K extends Collection>(c: K, opts: { fallback?: boolean } = {}) {
  const [items, setItems] = useState<CollectionMap[K][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    try {
      const rows = await list(c)
      setItems(opts.fallback && rows.length === 0 ? seeds[c] : rows)
      setError(null)
    } catch (e) {
      if (opts.fallback) setItems(seeds[c])
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [c, opts.fallback])
  useEffect(() => {
    load()
    listeners.add(load)
    return () => void listeners.delete(load)
  }, [load])
  return { items, loading, error, reload: load }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(seedProfile)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const load = () =>
      getProfile()
        .then(setProfile)
        .catch(() => {})
        .finally(() => setLoading(false))
    load()
    listeners.add(load)
    return () => void listeners.delete(load)
  }, [])
  return { profile, loading }
}
