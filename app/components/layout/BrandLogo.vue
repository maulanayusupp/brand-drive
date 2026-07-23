<script setup lang="ts">
import { brandConfig } from '~/config/brand.config'

interface Props {
  compact?: boolean
}
withDefaults(defineProps<Props>(), { compact: false })

const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <NuxtLink :to="localePath('/')" class="logo" :aria-label="brandConfig.name">
    <span class="logo__mark" :title="t('brand.logoAlt')">
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--color-accent)" />
            <stop offset="100%" stop-color="var(--color-cyan)" />
          </linearGradient>
        </defs>
        <ellipse
          cx="20"
          cy="20"
          rx="17"
          ry="8"
          fill="none"
          stroke="url(#logoGrad)"
          stroke-width="2.4"
          transform="rotate(-28 20 20)"
        />
        <circle cx="20" cy="20" r="5.5" fill="url(#logoGrad)" />
      </svg>
    </span>
    <span v-if="!compact" class="logo__word">{{ brandConfig.name }}</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  @include focus-ring;

  &__mark {
    display: grid;
    place-items: center;
    filter: drop-shadow(0 0 12px rgba(198, 255, 61, 0.35));
  }

  &__word {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.35rem;
    letter-spacing: -0.03em;
    color: var(--color-text);
  }
}
</style>
