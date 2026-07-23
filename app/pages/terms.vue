<script setup lang="ts">
const { t } = useI18n()

usePageSeo(
  () => t('terms.meta.title'),
  () => t('terms.meta.description'),
)
</script>

<template>
  <LegalDocument ns="terms" />
</template>
