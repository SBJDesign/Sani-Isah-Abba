import { Mail, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { remove, save, useCollection } from '../lib/store'
import type { Message } from '../lib/types'
import { AdminHeader, useConfirm, useToast } from './ui'

export default function MessagesAdmin() {
  const { items, loading } = useCollection('messages')
  const [sel, setSel] = useState<Message | null>(null)
  const toast = useToast()
  const confirm = useConfirm()
  const sorted = [...items].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))

  const open = async (m: Message) => {
    setSel(m)
    if (!m.read) await save('messages', { ...m, read: true })
  }
  const del = async (m: Message) => {
    if (!(await confirm.ask(`Delete the message from ${m.name}?`))) return
    await remove('messages', m.id)
    setSel(null)
    toast('Message deleted')
  }

  return (
    <>
      <AdminHeader title="Messages" intro="Sent through the Contact page." />
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <ul className="divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-white">
          {loading && <li className="p-5 text-sediment">Loading…</li>}
          {!loading && sorted.length === 0 && <li className="p-5 text-sediment">No messages yet. They'll appear here when someone uses the contact form.</li>}
          {sorted.map((m) => (
            <li key={m.id}>
              <button onClick={() => open(m)} className={`block w-full p-4 text-left hover:bg-silt ${sel?.id === m.id ? 'bg-silt' : ''}`}>
                <div className="flex items-center gap-2">
                  {!m.read && <span className="h-2 w-2 rounded-full bg-predicted" aria-label="Unread" />}
                  <span className={m.read ? '' : 'font-medium'}>{m.name}</span>
                  <span className="ml-auto text-xs text-sediment">{m.created_at?.slice(0, 10)}</span>
                </div>
                <div className="mt-0.5 line-clamp-1 text-sm text-sediment">{m.subject || m.body}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-rule bg-white p-6">
          {!sel ? <p className="text-sediment">Select a message to read it.</p> : (
            <>
              <h2 className="text-xl font-medium">{sel.subject || 'No subject'}</h2>
              <p className="mt-1 text-sm text-sediment">From {sel.name} &lt;{sel.email}&gt;, {sel.created_at?.slice(0, 16).replace('T', ' ')}</p>
              <div className="mt-6 whitespace-pre-wrap leading-relaxed">{sel.body}</div>
              <div className="mt-8 flex gap-3">
                <a className="btn-primary" href={`mailto:${sel.email}?subject=${encodeURIComponent('Re: ' + (sel.subject || ''))}`}><Mail size={16} /> Reply by email</a>
                <button className="btn-danger" onClick={() => del(sel)}><Trash2 size={16} /> Delete</button>
              </div>
            </>
          )}
        </div>
      </div>
      {confirm.node}
    </>
  )
}
