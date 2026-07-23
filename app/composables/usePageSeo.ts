// =============================================================================
// Localized per-page SEO helper. Accepts refs/getters so title & description
// stay reactive to the active locale. Centralizes brand suffix and OG/Twitter.
// =============================================================================
import { brandConfig } from '~/config/brand.config'

type Source = MaybeRefOrGetter<string>

export const usePageSeo = (title: Source, description: Source) => {
  const fullTitle = () => `${toValue(title)} · ${brandConfig.name}`

  useSeoMeta({
    title: () => toValue(title),
    ogTitle: fullTitle,
    twitterTitle: fullTitle,
    description: () => toValue(description),
    ogDescription: () => toValue(description),
    twitterDescription: () => toValue(description),
    ogType: 'website',
    ogSiteName: brandConfig.name,
    twitterCard: 'summary_large_image',
  })
}
