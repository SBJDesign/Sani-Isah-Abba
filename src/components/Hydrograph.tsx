import { useMemo } from 'react'

// Illustrative hydrograph: a synthetic wet-season river record and a model forecast that follows it.
function series(seed: number, n: number) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const out: number[] = []
  let base = 0.18
  for (let i = 0; i < n; i++) {
    const t = i / n
    const season = Math.exp(-Math.pow((t - 0.42) / 0.12, 2)) * 0.55 + Math.exp(-Math.pow((t - 0.78) / 0.05, 2)) * 0.3
    const storm = rand() > 0.93 ? rand() * 0.25 : 0
    base = base * 0.82 + (0.16 + season + storm) * 0.18
    out.push(base + storm * 0.6)
  }
  return out
}

export default function Hydrograph({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const obsC = dark ? '#5CC2D2' : '#1F7A8C'
  const predC = dark ? '#F0B44C' : '#D99A2B'
  const gridC = dark ? 'rgba(255,255,255,0.12)' : '#D5DEDD'
  const W = 1200
  const H = 260
  const { obs, pred, area } = useMemo(() => {
    const n = 180
    const o = series(7, n)
    const pr = o.map((v, i) => {
      const prev = o[Math.max(0, i - 2)]
      return prev * 0.35 + v * 0.6 + 0.012 * Math.sin(i / 3)
    })
    const max = Math.max(...o, ...pr) * 1.08
    const x = (i: number) => (i / (n - 1)) * W
    const y = (v: number) => H - (v / max) * H
    const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
    return { obs: path(o), pred: path(pr), area: path(o) + `L${W},${H}L0,${H}Z` }
  }, [])

  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-40 w-full sm:h-56" role="img"
        aria-label="Illustrative hydrograph showing observed river flow and a model forecast that closely follows it">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke={gridC} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={obsC} opacity={dark ? 0.12 : 0.08} />
        <path d={obs} pathLength={1} className="draw-line" fill="none" stroke={obsC} strokeWidth="2.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={pred} pathLength={1} className="draw-line delay" fill="none" stroke={predC} strokeWidth="2" strokeDasharray="1" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <figcaption className={`mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm ${dark ? 'text-white/60' : 'text-sediment'}`}>
        <span className="inline-flex items-center gap-2"><i className="inline-block h-0.5 w-6" style={{ background: obsC }} aria-hidden /> Observed river flow</span>
        <span className="inline-flex items-center gap-2"><i className="inline-block h-0.5 w-6" style={{ background: predC }} aria-hidden /> Machine-learning forecast</span>
        <span className="sm:ml-auto">Illustrative wet-season hydrograph</span>
      </figcaption>
    </figure>
  )
}
