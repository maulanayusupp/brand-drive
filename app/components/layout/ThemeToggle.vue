<script setup lang="ts">
const { theme, toggle } = useTheme()
const { t } = useI18n()
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="t('common.theme')"
    :title="t('common.theme')"
    @click="toggle"
  >
    <BaseIcon :name="theme === 'dark' ? 'moon' : 'sun'" :size="18" />
  </button>
</template>

<style lang="scss" scoped>
.theme-toggle {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  @include glass(0.05);
  transition: color var(--dur-fast) var(--ease-out);
  @include focus-ring;

  &:hover {
    color: var(--color-accent);
  }
}
</style>
