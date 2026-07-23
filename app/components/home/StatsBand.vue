<script setup lang="ts">
const { t } = useI18n()

// Honest commitments, not fabricated metrics — no over-claiming.
const stats = [
  { value: '100%', labelKey: 'home.stats.ownership' },
  { value: 'Fixed', labelKey: 'home.stats.pricing' },
  { value: '1:1', labelKey: 'home.stats.comms' },
  { value: 'Fast', labelKey: 'home.stats.delivery' },
]
</script>

<template>
  <section class="stats section" :aria-label="t('home.stats.title')">
    <div class="container stats__inner">
      <div v-for="s in stats" :key="s.labelKey" class="stats__item">
        <span class="stats__value text-gradient">{{ s.value }}</span>
        <span class="stats__label muted">{{ t(s.labelKey) }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.stats {
  &__inner {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding-block: clamp(2rem, 5vw, 3rem);
    border-radius: var(--radius-lg);
    @include glass(0.04);

    @include respond-to('md') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
  }

  &__value {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 3rem);
    letter-spacing: -0.03em;
  }

  &__label {
    font-size: 0.9rem;
  }
}
</style>
