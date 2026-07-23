<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <section class="cta section">
    <div class="container">
      <div class="cta__panel">
        <div class="cta__glow" aria-hidden="true" />
        <h2 class="cta__title">{{ t('home.cta.title') }}</h2>
        <p class="cta__subtitle">{{ t('home.cta.subtitle') }}</p>
        <div class="cta__actions">
          <BaseButton to="/contact" size="lg" icon="arrowRight">
            {{ t('home.cta.primary') }}
          </BaseButton>
          <BaseButton to="/contact" variant="outline" size="lg">
            {{ t('home.cta.secondary') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta {
  &__panel {
    position: relative;
    overflow: hidden;
    padding: clamp(2.5rem, 8vw, 5rem);
    border-radius: var(--radius-lg);
    text-align: center;
    @include glass(0.05);
    box-shadow: var(--shadow-lg);
  }

  &__glow {
    position: absolute;
    inset: -50% 0 auto 0;
    height: 200%;
    background: radial-gradient(
      40% 40% at 50% 0%,
      rgba(198, 255, 61, 0.25),
      transparent 70%
    );
    pointer-events: none;
  }

  &__title {
    position: relative;
    max-width: 20ch;
    margin-inline: auto;
  }

  &__subtitle {
    position: relative;
    margin: 1.25rem auto 0;
    max-width: 46ch;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  &__actions {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
}
</style>
