<script setup lang="ts">
const { t } = useI18n()

usePageSeo(
  () => t('brand.tagline'),
  () => t('home.hero.subtitle'),
)
</script>

<template>
  <div class="home">
    <HeroExperience />
    <div class="home__content">
      <StatsBand />
      <SectionGrid />
      <IndustriesGrid />
      <HowItWorks />
      <CtaBand />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home__content {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 4vw, 3rem);
  padding-block: clamp(3rem, 8vh, 6rem);
}
</style>
