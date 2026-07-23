// =============================================================================
// Marketing service sections. Each is both a feature card AND a drivable
// billboard in the 3D world. Text lives in i18n under `sections.<id>.*`.
// =============================================================================
import type { BrandSection } from '~/types'

export const sectionsConfig: readonly BrandSection[] = [
  { id: 'ads', icon: 'megaphone', accent: '#c6ff3d', world: { x: 0, z: -18 } },
  { id: 'social', icon: 'chat', accent: '#23e5db', world: { x: 22, z: -6 } },
  { id: 'seo', icon: 'search', accent: '#7c5cff', world: { x: 16, z: 20 } },
  { id: 'branding', icon: 'sparkle', accent: '#ff6b6b', world: { x: -16, z: 20 } },
  { id: 'analytics', icon: 'chart', accent: '#ffcf5c', world: { x: -22, z: -6 } },
] as const
