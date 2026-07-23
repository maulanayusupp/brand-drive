<script setup lang="ts">
const { t } = useI18n()

const steps = [
  { n: '01', titleKey: 'home.how.step1Title', bodyKey: 'home.how.step1Body' },
  { n: '02', titleKey: 'home.how.step2Title', bodyKey: 'home.how.step2Body' },
  { n: '03', titleKey: 'home.how.step3Title', bodyKey: 'home.how.step3Body' },
]
</script>

<template>
  <section class="how section">
    <div class="container">
      <SectionHeading
        :eyebrow="t('home.how.eyebrow')"
        :title="t('home.how.title')"
        align="center"
      />
      <ol class="how__grid">
        <li v-for="step in steps" :key="step.n" class="how__step">
          <span class="how__num">{{ step.n }}</span>
          <h3 class="how__title">{{ t(step.titleKey) }}</h3>
          <p class="how__body muted">{{ t(step.bodyKey) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how {
  &__grid {
    display: grid;
    gap: 1.5rem;
    margin-top: clamp(2.5rem, 6vw, 4rem);
    grid-template-columns: 1fr;
    counter-reset: step;

    @include respond-to('md') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__step {
    position: relative;
    padding: 2rem 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);

    &::after {
      content: '';
      position: absolute;
      left: 1.5rem;
      right: 1.5rem;
      bottom: 0;
      height: 2px;
      background: var(--gradient-hot);
      transform: scaleX(0.2);
      transform-origin: left;
      opacity: 0.6;
    }
  }

  &__num {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--color-accent);
    letter-spacing: 0.1em;
  }

  &__title {
    margin-top: 1rem;
    font-size: 1.4rem;
  }

  &__body {
    margin-top: 0.75rem;
    line-height: 1.6;
  }
}
</style>
