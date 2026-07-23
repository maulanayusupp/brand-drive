<script setup lang="ts">
import { contentService } from '~/services/content.service'

const { t } = useI18n()
const industries = contentService.getIndustries()
</script>

<template>
  <section id="industries" class="industries section">
    <div class="container">
      <SectionHeading
        :eyebrow="t('home.industries.eyebrow')"
        :title="t('home.industries.title')"
        :subtitle="t('home.industries.subtitle')"
        align="center"
      />

      <div class="industries__grid">
        <BaseCard
          v-for="ind in industries"
          :key="ind.id"
          interactive
          class="industry"
        >
          <span class="industry__icon"><BaseIcon :name="ind.icon" :size="26" /></span>
          <h3 class="industry__title">{{ t(`home.industries.items.${ind.id}.title`) }}</h3>
          <p class="muted">{{ t(`home.industries.items.${ind.id}.desc`) }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.industries {
  &__grid {
    display: grid;
    gap: 1.25rem;
    margin-top: clamp(2.5rem, 6vw, 4rem);
    grid-template-columns: 1fr;

    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond-to('lg') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  :deep(.card):nth-child(1) {
    --card-accent: #c6ff3d;
  }
  :deep(.card):nth-child(2) {
    --card-accent: #23e5db;
  }
  :deep(.card):nth-child(3) {
    --card-accent: #7c5cff;
  }
  :deep(.card):nth-child(4) {
    --card-accent: #ffcf5c;
  }
}

.industry {
  &__icon {
    display: grid;
    place-items: center;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: var(--radius-md);
    color: var(--card-accent);
    background: color-mix(in srgb, var(--card-accent) 14%, transparent);
    margin-bottom: 1.25rem;
  }

  &__title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
}
</style>
