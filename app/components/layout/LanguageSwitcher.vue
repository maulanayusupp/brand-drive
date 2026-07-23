<script setup lang="ts">
/** Switches locale while preserving the current route (via switchLocalePath). */
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const available = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).map((l) => ({
    code: l.code,
    name: l.name,
    path: switchLocalePath(l.code),
  })),
)
</script>

<template>
  <div class="lang" role="group" :aria-label="$t('common.language')">
    <NuxtLink
      v-for="l in available"
      :key="l.code"
      :to="l.path"
      class="lang__item"
      :class="{ 'lang__item--active': l.code === locale }"
      :aria-current="l.code === locale ? 'true' : undefined"
    >
      {{ l.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.lang {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem;
  gap: 0.15rem;
  border-radius: var(--radius-pill);
  @include glass(0.05);

  &__item {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    transition: all var(--dur-fast) var(--ease-out);
    @include focus-ring;

    &:hover {
      color: var(--color-text);
    }

    &--active {
      background: var(--color-accent);
      color: var(--color-accent-ink);
    }
  }
}
</style>
