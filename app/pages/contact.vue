<script setup lang="ts">
import { brandConfig } from '~/config/brand.config'

const { t } = useI18n()

usePageSeo(
  () => t('contact.meta.title'),
  () => t('contact.meta.description'),
)

const info = [
  { icon: 'mail', labelKey: 'contact.info.emailLabel', value: brandConfig.email, href: `mailto:${brandConfig.email}` },
  { icon: 'phone', labelKey: 'contact.info.phoneLabel', value: brandConfig.phone, href: `tel:${brandConfig.phone.replace(/\s/g, '')}` },
  { icon: 'pin', labelKey: 'contact.info.addressLabel', valueKey: 'contact.info.addressValue' },
]
</script>

<template>
  <div class="page">
    <PageHero
      :eyebrow="t('contact.hero.eyebrow')"
      :title="t('contact.hero.title')"
      :subtitle="t('contact.hero.subtitle')"
    />

    <section class="section container contact">
      <div class="contact__grid">
        <BaseCard class="contact__formCard">
          <ContactForm />
        </BaseCard>

        <aside class="contact__info">
          <h2 class="contact__infoTitle">{{ t('contact.info.title') }}</h2>
          <ul class="contact__list">
            <li v-for="row in info" :key="row.labelKey" class="contact__row">
              <span class="contact__rowIcon"><BaseIcon :name="row.icon" :size="20" /></span>
              <div>
                <span class="contact__rowLabel">{{ t(row.labelKey) }}</span>
                <a v-if="row.href" :href="row.href" class="contact__rowValue">{{ row.value }}</a>
                <span v-else class="contact__rowValue">{{ t(row.valueKey!) }}</span>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.contact {
  &__grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;

    @include respond-to('lg') {
      grid-template-columns: 1.4fr 1fr;
      align-items: start;
    }
  }

  &__infoTitle {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  &__rowIcon {
    display: grid;
    place-items: center;
    width: 2.6rem;
    height: 2.6rem;
    flex: none;
    border-radius: var(--radius-md);
    color: var(--color-accent);
    background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  }

  &__rowLabel {
    display: block;
    font-size: 0.8rem;
    color: var(--color-text-dim);
    margin-bottom: 0.2rem;
  }

  &__rowValue {
    color: var(--color-text);
    font-weight: 500;

    &:hover {
      color: var(--color-accent);
    }
  }
}
</style>
