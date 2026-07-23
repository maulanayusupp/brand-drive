// =============================================================================
// Brand sections. Each one is both a marketing feature card AND a drivable
// billboard in the 3D world. Text lives in i18n under `sections.<id>.*`.
// =============================================================================
import type { BrandSection } from '~/types'

export const sectionsConfig: readonly BrandSection[] = [
  { id: 'payments', icon: 'card', accent: '#c6ff3d', world: { x: 0, z: -18 } },
  { id: 'payouts', icon: 'bolt', accent: '#23e5db', world: { x: 22, z: -6 } },
  { id: 'global', icon: 'globe', accent: '#7c5cff', world: { x: 16, z: 20 } },
  { id: 'security', icon: 'shield', accent: '#ff6b6b', world: { x: -16, z: 20 } },
  { id: 'insights', icon: 'chart', accent: '#ffcf5c', world: { x: -22, z: -6 } },
] as const
