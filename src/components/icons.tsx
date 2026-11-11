import { Award, BrainCircuit, Coins, Droplets, Layers, MapPinned, Mic, Network, Newspaper, Waves, type LucideIcon } from 'lucide-react'
import type { PostCategory } from '../lib/types'

/** Picks a fitting icon for a research interest from its wording. */
export function interestIcon(text: string): LucideIcon {
  const t = text.toLowerCase()
  if (/ground|aquifer|salin/.test(t)) return Layers
  if (/quality|pollut|oxygen|treatment|wastewater|desalin/.test(t)) return Droplets
  if (/flood|gis|map|remote/.test(t)) return MapPinned
  if (/metaheur|^optimi/.test(t)) return Network
  if (/learning|\bai\b|intelligen|neural|ensemble/.test(t)) return BrainCircuit
  return Waves
}

export const categoryIcon: Record<PostCategory, LucideIcon> = {
  news: Newspaper,
  award: Award,
  talk: Mic,
  grant: Coins,
  media: Newspaper,
}
