// =============================================================================
// Service sections. Each is both a feature card AND a drivable billboard in the
// 3D world (placed in a ring around the central plaza). Text lives in i18n
// under `sections.<id>.*`. Accents are mirrored in SectionGrid's SCSS.
// =============================================================================
import type { BrandSection } from '~/types'

export const sectionsConfig: readonly BrandSection[] = [
  { id: 'webdev', icon: 'code', accent: '#c6ff3d', world: { x: 22, z: 0 } },
  { id: 'uiux', icon: 'layers', accent: '#23e5db', world: { x: 11, z: 19 } },
  { id: 'seo', icon: 'search', accent: '#7c5cff', world: { x: -11, z: 19 } },
  { id: 'automation', icon: 'gear', accent: '#ffcf5c', world: { x: -22, z: 0 } },
  { id: 'branding', icon: 'sparkle', accent: '#4ad3ff', world: { x: -11, z: -19 } },
  { id: 'analytics', icon: 'chart', accent: '#ff8a3d', world: { x: 11, z: -19 } },
] as const
