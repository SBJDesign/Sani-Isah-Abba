import { useMemo } from 'react'

/** Decorative topographic contour lines, like a watershed map. Purely visual. */
export default function Contours({ className = '', opacity = 0.09, color = '#FFFFFF' }: { className?: string; opacity?: number; color?: string }) {
  const paths = useMemo(() => {
    const W = 1440
    const out: string[] = []
    for (let k = 0; k < 18; k++) {
      const y0 = 30 + k * 34
      const a1 = 18 + (k % 5) * 6
      const a2 = 10 + ((k * 7) % 4) * 5
      let d = ''
      for (let x = 0; x <= W; x += 24) {
        const y = y0 + Math.sin(x / 210 + k * 0.45) * a1 + Math.sin(x / 83 + k) * a2 * 0.4 + Math.cos(x / 400 - k * 0.3) * 22
        d += `${x ? 'L' : 'M'}${x},${y.toFixed(1)}`
      }
      out.push(d)
    }
    return out
  }, [])
  return (
    <svg aria-hidden viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeOpacity={i % 4 === 0 ? opacity * 1.8 : opacity} strokeWidth={i % 4 === 0 ? 1.2 : 0.8} />
      ))}
    </svg>
  )
}
