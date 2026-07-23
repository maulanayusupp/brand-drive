// =============================================================================
// Content service — the single read API for structural site content.
// Components/composables call these instead of importing config directly, so
// content sourcing (config today, CMS/API tomorrow) can change in one place.
// =============================================================================
import { brandConfig, socialLinks } from '~/config/brand.config'
import {
  complianceItems,
  footerLegalNav,
  mainNav,
} from '~/config/navigation.config'
import { sectionsConfig } from '~/config/sections.config'
import { industriesConfig } from '~/config/industries.config'
import type {
  BrandSection,
  ComplianceItem,
  Industry,
  NavItem,
  SocialLink,
} from '~/types'

export const contentService = {
  getBrand() {
    return brandConfig
  },
  getMainNav(): readonly NavItem[] {
    return mainNav
  },
  getFooterLegalNav(): readonly NavItem[] {
    return footerLegalNav
  },
  getSections(): readonly BrandSection[] {
    return sectionsConfig
  },
  getSection(id: string): BrandSection | undefined {
    return sectionsConfig.find((s) => s.id === id)
  },
  getComplianceItems(): readonly ComplianceItem[] {
    return complianceItems
  },
  getIndustries(): readonly Industry[] {
    return industriesConfig
  },
  getSocialLinks(): readonly SocialLink[] {
    return socialLinks
  },
}
