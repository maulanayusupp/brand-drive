// =============================================================================
// Site navigation & compliance registry (structure only; labels via i18n).
// =============================================================================
import type { ComplianceItem, NavItem } from '~/types'

export const mainNav: readonly NavItem[] = [
  { id: 'home', i18nKey: 'nav.home', to: '/' },
  { id: 'about', i18nKey: 'nav.about', to: '/about' },
  { id: 'compliance', i18nKey: 'nav.compliance', to: '/compliance' },
  { id: 'contact', i18nKey: 'nav.contact', to: '/contact' },
] as const

export const footerLegalNav: readonly NavItem[] = [
  { id: 'privacy', i18nKey: 'nav.privacy', to: '/privacy' },
  { id: 'terms', i18nKey: 'nav.terms', to: '/terms' },
  { id: 'compliance', i18nKey: 'nav.compliance', to: '/compliance' },
] as const

export const complianceItems: readonly ComplianceItem[] = [
  { id: 'pcidss', icon: 'card' },
  { id: 'iso27001', icon: 'shield' },
  { id: 'gdpr', icon: 'globe' },
  { id: 'aml', icon: 'lock' },
  { id: 'soc2', icon: 'check' },
  { id: 'uptime', icon: 'bolt' },
] as const
