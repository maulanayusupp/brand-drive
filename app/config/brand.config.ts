// =============================================================================
// Brand configuration (non-textual). Swap these values to rebrand the site.
// NOTE: "Brand Drive" is an editable PLACEHOLDER brand, not a real company.
// If a logo is provided later, derive the accent colors from it here.
// =============================================================================
import type { SocialLink } from '~/types'

export const brandConfig = {
  /** Display name of the brand. */
  name: 'Brand Drive',
  /** Short one-word mark used in the logo lockup. */
  shortName: 'Brand',
  /** Founding/registration year, shown in the footer. */
  since: 2024,
  /** Primary accent (mirrors --color-accent in SCSS tokens). */
  accent: '#c6ff3d',
  accentAlt: '#7c5cff',
  /** Contact endpoints (overridable via runtimeConfig / env). */
  email: 'hello@branddrive.example',
  supportEmail: 'support@branddrive.example',
  phone: '+65 3000 0000',
  addressKey: 'contact.info.addressValue',
} as const

export const socialLinks: readonly SocialLink[] = [
  { id: 'x', href: 'https://x.com', icon: 'x' },
  { id: 'linkedin', href: 'https://linkedin.com', icon: 'linkedin' },
  { id: 'github', href: 'https://github.com', icon: 'github' },
] as const
