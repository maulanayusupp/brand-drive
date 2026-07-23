<script setup lang="ts">
import { brandConfig } from '~/config/brand.config'
import { contentService } from '~/services/content.service'

const localePath = useLocalePath()
const { t } = useI18n()

const sections = contentService.getSections()
const legalNav = contentService.getFooterLegalNav()
const socials = contentService.getSocialLinks()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container--wide">
      <div class="footer__brand">
        <BrandLogo />
        <p class="footer__tagline">{{ t('footer.tagline') }}</p>
        <div class="footer__socials">
          <a
            v-for="s in socials"
            :key="s.id"
            :href="s.href"
            class="footer__social"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.id"
          >
            <BaseIcon :name="s.icon" :size="18" />
          </a>
        </div>
      </div>

      <nav class="footer__col" :aria-label="t('footer.product')">
        <h4 class="footer__heading">{{ t('footer.product') }}</h4>
        <NuxtLink
          v-for="sec in sections"
          :key="sec.id"
          :to="localePath('/') + '#' + sec.id"
          class="footer__link"
        >
          {{ t(`sections.${sec.id}.title`) }}
        </NuxtLink>
      </nav>

      <nav class="footer__col" :aria-label="t('footer.company')">
        <h4 class="footer__heading">{{ t('footer.company') }}</h4>
        <NuxtLink :to="localePath('/about')" class="footer__link">
          {{ t('nav.about') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/contact')" class="footer__link">
          {{ t('nav.contact') }}
        </NuxtLink>
      </nav>

      <nav class="footer__col" :aria-label="t('footer.legal')">
        <h4 class="footer__heading">{{ t('footer.legal') }}</h4>
        <NuxtLink
          v-for="item in legalNav"
          :key="item.id"
          :to="localePath(item.to)"
          class="footer__link"
        >
          {{ t(item.i18nKey) }}
        </NuxtLink>
      </nav>
    </div>

    <div class="footer__bottom container--wide">
      <p class="footer__disclaimer">{{ t('footer.disclaimer') }}</p>
      <p class="footer__copy">
        © {{ year }} {{ brandConfig.name }}. {{ t('footer.rights') }}
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background: linear-gradient(180deg, transparent, rgba(124, 92, 255, 0.05));
  padding-block: clamp(3rem, 8vh, 5rem) 2rem;

  &__inner {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;

    @include respond-to('sm') {
      grid-template-columns: 1fr 1fr;
    }
    @include respond-to('lg') {
      grid-template-columns: 2fr 1fr 1fr 1fr;
    }
  }

  &__brand {
    max-width: 22rem;
  }

  &__tagline {
    margin-top: 1rem;
    color: var(--color-text-muted);
    line-height: 1.6;
  }

  &__socials {
    display: flex;
    gap: 0.6rem;
    margin-top: 1.25rem;
  }

  &__social {
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    @include glass(0.05);
    transition: all var(--dur-fast) var(--ease-out);
    @include focus-ring;

    &:hover {
      color: var(--color-accent);
      transform: translateY(-2px);
    }
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__heading {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-dim);
    margin-bottom: 0.25rem;
  }

  &__link {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    width: fit-content;
    @include focus-ring;

    &:hover {
      color: var(--color-accent);
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    color: var(--color-text-dim);
    font-size: 0.85rem;

    @include respond-to('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__disclaimer {
    max-width: 46rem;
  }
}
</style>
