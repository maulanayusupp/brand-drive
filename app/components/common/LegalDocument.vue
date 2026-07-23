<script setup lang="ts">
/** Renders a legal document (privacy/terms) from i18n keys under `ns`. */
interface Props {
  ns: string
  sectionCount?: number
}
const props = withDefaults(defineProps<Props>(), { sectionCount: 5 })
const { t } = useI18n()

const sections = computed(() =>
  Array.from({ length: props.sectionCount }, (_, i) => ({
    titleKey: `${props.ns}.s${i + 1}Title`,
    bodyKey: `${props.ns}.s${i + 1}Body`,
  })),
)
</script>

<template>
  <div class="page">
    <PageHero :eyebrow="t(`${ns}.updated`)" :title="t(`${ns}.title`)" />

    <section class="section container legal">
      <p class="legal__intro">{{ t(`${ns}.intro`) }}</p>
      <div v-for="(s, i) in sections" :key="i" class="legal__section">
        <h2 class="legal__title">{{ t(s.titleKey) }}</h2>
        <p class="muted">{{ t(s.bodyKey) }}</p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.legal {
  max-width: 68ch;

  &__intro {
    padding: 1.25rem 1.5rem;
    border-left: 3px solid var(--color-accent);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
  }

  &__section {
    margin-top: 2.5rem;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  &__section p {
    line-height: 1.7;
  }
}
</style>
