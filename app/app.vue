<script setup lang="ts">
import { brandConfig } from '~/config/brand.config'

// i18n-driven <html lang/dir> + hreflang alternates.
const head = useLocaleHead()
const { t } = useI18n()

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
