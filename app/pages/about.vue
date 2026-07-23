<script setup lang="ts">
const { t } = useI18n()

usePageSeo(
  () => t('about.meta.title'),
  () => t('about.meta.description'),
)

const values = [
  { icon: 'bolt', titleKey: 'about.values.reliabilityTitle', bodyKey: 'about.values.reliabilityBody' },
  { icon: 'globe', titleKey: 'about.values.transparencyTitle', bodyKey: 'about.values.transparencyBody' },
  { icon: 'shield', titleKey: 'about.values.securityTitle', bodyKey: 'about.values.securityBody' },
  { icon: 'check', titleKey: 'about.values.craftTitle', bodyKey: 'about.values.craftBody' },
]

const stats = [
  { value: '2024', labelKey: 'about.stats.founded' },
  { value: '50+', labelKey: 'about.stats.team' },
  { value: '12+', labelKey: 'about.stats.markets' },
  { value: '$8M+', labelKey: 'about.stats.processed' },
]
</script>

<template>
  <div class="page">
    <PageHero
      :eyebrow="t('about.hero.eyebrow')"
      :title="t('about.hero.title')"
      :subtitle="t('about.hero.subtitle')"
    />

    <section class="section container about__story">
      <SectionHeading :title="t('about.story.title')" />
      <div class="about__prose">
        <p>{{ t('about.story.body1') }}</p>
        <p>{{ t('about.story.body2') }}</p>
      </div>
    </section>

    <section class="section container">
      <SectionHeading :title="t('about.values.title')" align="center" />
      <div class="about__values">
        <BaseCard v-for="v in values" :key="v.titleKey">
          <span class="about__valueIcon"><BaseIcon :name="v.icon" :size="24" /></span>
          <h3 class="about__valueTitle">{{ t(v.titleKey) }}</h3>
          <p class="muted">{{ t(v.bodyKey) }}</p>
        </BaseCard>
      </div>
    </section>

    <section class="section container">
      <SectionHeading :title="t('about.stats.title')" align="center" />
      <div class="about__stats">
        <div v-for="s in stats" :key="s.labelKey" class="about__stat">
          <span class="about__statValue text-gradient">{{ s.value }}</span>
          <span class="muted">{{ t(s.labelKey) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.about {
  &__prose {
    display: grid;
    gap: 1.5rem;
    max-width: 60ch;
    margin-top: 1.5rem;
    font-size: 1.15rem;
    line-height: 1.7;
    color: var(--color-text-muted);
  }

  &__values {
    display: grid;
    gap: 1.25rem;
    margin-top: 2.5rem;
    grid-template-columns: 1fr;

    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond-to('lg') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__valueIcon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-md);
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 14%, transparent);
    margin-bottom: 1rem;
  }

  &__valueTitle {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2.5rem;

    @include respond-to('md') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
  }

  &__statValue {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 3rem);
    letter-spacing: -0.03em;
  }
}
</style>
