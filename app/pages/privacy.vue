<script setup lang="ts">
const { t } = useI18n()

usePageSeo(
  () => t('privacy.meta.title'),
  () => t('privacy.meta.description'),
)
</script>

<template>
  <LegalDocument ns="privacy" />
</template>
