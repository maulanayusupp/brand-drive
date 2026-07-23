// =============================================================================
// Shared domain types. Textual content is never stored here — only structure.
// Human-readable strings are resolved from i18n locale files by their key.
// =============================================================================

/** Top-level navigation entry. `i18nKey` resolves the label; `to` is a raw path
 *  that components localize with `localePath()`. */
export interface NavItem {
  id: string
  i18nKey: string
  to: string
}

/** A brand section that exists both as a marketing block and as a drivable
 *  billboard inside the 3D world. */
export interface BrandSection {
  id: string
  /** Icon name understood by <BaseIcon>. */
  icon: string
  /** Accent color (hex) used for the card and the 3D billboard glow. */
  accent: string
  /** Position + look of the billboard in the 3D world. */
  world: {
    x: number
    z: number
  }
}

/** A compliance / trust item shown on the compliance page and footer. */
export interface ComplianceItem {
  id: string
  icon: string
}

/** An industry we serve, shown in the homepage "Industries" block. */
export interface Industry {
  id: string
  icon: string
}

export interface SocialLink {
  id: string
  href: string
  icon: string
}

export interface ContactPayload {
  name: string
  email: string
  company?: string
  message: string
}

export interface ServiceResult<T = void> {
  ok: boolean
  data?: T
  error?: string
}

/** Reactive state surfaced by the 3D engine to the UI (HUD, overlays). */
export interface GameTelemetry {
  loading: boolean
  ready: boolean
  started: boolean
  speedKmh: number
  score: number
  activeSectionId: string | null
}
