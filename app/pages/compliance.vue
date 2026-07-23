<script setup lang="ts">
import { contentService } from '~/services/content.service'

const { t } = useI18n()
const items = contentService.getComplianceItems()

usePageSeo(
  () => t('compliance.meta.title'),
  () => t('compliance.meta.description'),
)
</script>

<template>
  <div class="page">
    <PageHero
      :eyebrow="t('compliance.hero.eyebrow')"
      :title="t('compliance.hero.title')"
      :subtitle="t('compliance.hero.subtitle')"
    />

    <section class="section container">
      <SectionHeading :title="t('compliance.intro.title')" :subtitle="t('compliance.intro.body')" />

      <div class="compliance__grid">
        <BaseCard v-for="item in items" :key="item.id" interactive class="compliance__card">
          <span class="compliance__icon"><BaseIcon :name="item.icon" :size="24" /></span>
          <h3 class="compliance__title">{{ t(`compliance.items.${item.id}.title`) }}</h3>
          <p class="muted">{{ t(`compliance.items.${item.id}.desc`) }}</p>
        </BaseCard>
      </div>
    </section>

    <section class="section container">
      <div class="compliance__disclaimer">
        <span class="compliance__disclaimerIcon"><BaseIcon name="shield" :size="22" /></span>
        <div>
          <h3 class="compliance__disclaimerTitle">{{ t('compliance.disclaimer.title') }}</h3>
          <p class="muted">{{ t('compliance.disclaimer.body') }}</p>
          <p class="compliance__updated">
            {{ t('compliance.disclaimer.updated') }}: {{ t('privacy.updated') }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.compliance {
  &__grid {
    display: grid;
    gap: 1.25rem;
    margin-top: 2.5rem;
    grid-template-columns: 1fr;

    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond-to('lg') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-md);
    color: var(--color-cyan);
    background: color-mix(in srgb, var(--color-cyan) 14%, transparent);
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  &__disclaimer {
    display: flex;
    gap: 1.25rem;
    padding: clamp(1.5rem, 4vw, 2.5rem);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    background: color-mix(in srgb, var(--color-warning) 6%, transparent);
  }

  &__disclaimerIcon {
    flex: none;
    color: var(--color-warning);
  }

  &__disclaimerTitle {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  &__updated {
    margin-top: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-dim);
  }
}
</style>
