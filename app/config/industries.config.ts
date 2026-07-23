// =============================================================================
// Industries we serve (homepage "Industries" block). Text lives in i18n under
// `home.industries.items.<id>.*`.
// =============================================================================
import type { Industry } from '~/types'

export const industriesConfig: readonly Industry[] = [
  { id: 'property', icon: 'building' },
  { id: 'automotive', icon: 'car' },
  { id: 'retail', icon: 'cart' },
  { id: 'services', icon: 'heart' },
  { id: 'education', icon: 'book' },
  { id: 'startup', icon: 'rocket' },
  { id: 'hospitality', icon: 'plane' },
  { id: 'logistics', icon: 'truck' },
] as const
