<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
}
defineProps<Props>()
</script>

<template>
  <section class="page-hero">
    <div class="container">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero__subtitle muted">{{ subtitle }}</p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.page-hero {
  position: relative;
  padding-block: clamp(2rem, 6vh, 4rem) clamp(2rem, 5vh, 3rem);

  &__title {
    margin-top: 1rem;
    max-width: 18ch;
  }

  &__subtitle {
    margin-top: 1.25rem;
    max-width: 52ch;
    font-size: 1.15rem;
    line-height: 1.6;
  }
}
</style>
