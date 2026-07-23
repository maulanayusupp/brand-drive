<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'start' | 'center'
}
withDefaults(defineProps<Props>(), { align: 'start' })
</script>

<template>
  <div class="heading" :class="`heading--${align}`">
    <p v-if="eyebrow" class="eyebrow heading__eyebrow">{{ eyebrow }}</p>
    <h2 class="heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="heading__subtitle muted">{{ subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
.heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 46rem;

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }

  &__eyebrow {
    margin-bottom: 0.25rem;
  }

  &__subtitle {
    font-size: 1.1rem;
    line-height: 1.6;
  }
}
</style>
