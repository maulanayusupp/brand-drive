<script setup lang="ts">
import { brandConfig } from '~/config/brand.config'

// i18n-driven <html lang/dir> + hreflang alternates.
const head = useLocaleHead()
const { t } = useI18n()

// Site-wide social share defaults (WhatsApp / Instagram / Twitter use these).
// og:title & og:description are set per page by usePageSeo; the image + card
// type are inherited from here. Absolute URLs are required by scrapers.
const config = useRuntimeConfig()
const ogImage = `${config.public.siteUrl}/og-image.png`
useSeoMeta({
  ogType: 'website',
  ogSiteName: brandConfig.name,
  ogImage,
  ogImageSecureUrl: ogImage,
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${brandConfig.name} — ${t('brand.tagline')}`,
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
})

useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
  titleTemplate: (title) =>
    title ? `${title} · ${brandConfig.name}` : `${brandConfig.name} — ${t('brand.tagline')}`,
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
