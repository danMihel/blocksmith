import {
  ChartLine,
  Gauge,
  Globe,
  Heart,
  Layers,
  Lock,
  MousePointerClick,
  Palette,
  Puzzle,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from '@lucide/vue'
import type { Component } from 'vue'

/**
 * Curated icon set available to page content (feature lists, cards…).
 * Documents store the icon *name*, so the set stays serializable and versionable.
 */
export const CONTENT_ICONS = {
  zap: Zap,
  shield: Shield,
  sparkles: Sparkles,
  layers: Layers,
  gauge: Gauge,
  globe: Globe,
  heart: Heart,
  rocket: Rocket,
  lock: Lock,
  chart: ChartLine,
  puzzle: Puzzle,
  users: Users,
  palette: Palette,
  pointer: MousePointerClick,
} as const satisfies Record<string, Component>

export type ContentIconName = keyof typeof CONTENT_ICONS

export const CONTENT_ICON_NAMES = Object.keys(CONTENT_ICONS) as [
  ContentIconName,
  ...ContentIconName[],
]
