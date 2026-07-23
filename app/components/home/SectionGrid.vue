<script setup lang="ts">
import { contentService } from '~/services/content.service'

const { t } = useI18n()
const sections = contentService.getSections()
</script>

<template>
  <section id="platform" class="platform section">
    <div class="container">
      <SectionHeading
        :eyebrow="t('home.sectionsIntro.eyebrow')"
        :title="t('home.sectionsIntro.title')"
        :subtitle="t('home.sectionsIntro.subtitle')"
        align="center"
      />

      <div class="platform__grid">
        <BaseCard
          v-for="s in sections"
          :id="s.id"
          :key="s.id"
          interactive
          class="feature"
        >
          <span class="feature__icon">
            <BaseIcon :name="s.icon" :size="26" />
          </span>
          <h3 class="feature__title">{{ t(`sections.${s.id}.title`) }}</h3>
          <p class="feature__tag">{{ t(`sections.${s.id}.tagline`) }}</p>
          <p class="feature__body muted">{{ t(`sections.${s.id}.body`) }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.platform {
  &__grid {
    display: grid;
    gap: 1.25rem;
    margin-top: clamp(2.5rem, 6vw, 4rem);
    grid-template-columns: 1fr;

    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond-to('lg') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  // Per-card accent — matches the 3D billboard colors, set here (not inline).
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
    --card-accent: #ff6b6b;
  }
  :deep(.card):nth-child(5) {
    --card-accent: #ffcf5c;
  }
}

.feature {
  scroll-margin-top: calc(#{$header-height} + 2rem);

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
    font-size: 1.4rem;
  }

  &__tag {
    margin-top: 0.4rem;
    color: var(--card-accent);
    font-weight: 600;
  }

  &__body {
    margin-top: 0.75rem;
    line-height: 1.6;
  }
}
</style>
