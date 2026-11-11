import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Photo } from '../lib/types'

export default function Lightbox({ photos, index, onChange, onClose }: { photos: Photo[]; index: number; onChange: (i: number) => void; onClose: () => void }) {
  const p = photos[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const touch = useRef<number | null>(null)
  const go = (d: number) => onChange((index + d + photos.length) % photos.length)

  useEffect(() => {
    closeRef.current?.focus()
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = ''
    }
  })

  if (!p) return null
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[80] flex flex-col bg-[#0A1C2A]/95 text-white backdrop-blur-sm"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
        touch.current = null
      }}>
      <div className="flex items-center justify-between px-5 py-4 text-sm text-white/70">
        <span className="tabular-nums">{index + 1} of {photos.length}</span>
        <button ref={closeRef} onClick={onClose} className="rounded-full p-2 hover:bg-white/10"><X size={22} /><span className="sr-only">Close</span></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img key={p.id} src={p.image_url} alt={p.caption} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
        {photos.length > 1 && (
          <>
            <button onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:block"><ChevronLeft size={24} /><span className="sr-only">Previous photo</span></button>
            <button onClick={() => go(1)} className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:block"><ChevronRight size={24} /><span className="sr-only">Next photo</span></button>
          </>
        )}
      </div>
      <div className="mx-auto w-full max-w-3xl px-5 py-5 text-center">
        <p className="text-[1.05rem]">{p.caption}</p>
        {p.date && <p className="mt-1 text-sm text-white/55">{p.date}</p>}
      </div>
    </div>
  )
}
