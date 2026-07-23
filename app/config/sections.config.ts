// =============================================================================
// Service sections. Each is both a feature card AND a drivable billboard in the
// 3D world (placed in a ring around the central plaza). Text lives in i18n
// under `sections.<id>.*`. Accents are mirrored in SectionGrid's SCSS.
// =============================================================================
import type { BrandSection } from '~/types'

export const sectionsConfig: readonly BrandSection[] = [
  { id: 'webdev', icon: 'code', accent: '#c6ff3d', world: { x: 22, z: 0 } },
  { id: 'uiux', icon: 'layers', accent: '#23e5db', world: { x: 13.7, z: 17.2 } },
  { id: 'seo', icon: 'search', accent: '#7c5cff', world: { x: -4.9, z: 21.4 } },
  { id: 'ecommerce', icon: 'cart', accent: '#ff6b6b', world: { x: -19.8, z: 9.5 } },
  { id: 'automation', icon: 'gear', accent: '#ffcf5c', world: { x: -19.8, z: -9.5 } },
  { id: 'branding', icon: 'sparkle', accent: '#4ad3ff', world: { x: -4.9, z: -21.4 } },
  { id: 'analytics', icon: 'chart', accent: '#ff8a3d', world: { x: 13.7, z: -17.2 } },
] as const
