<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="layout">
    <a class="skip-link" href="#main">{{ t('common.skipToContent') }}</a>
    <AppHeader />
    <main id="main" class="layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  &__main {
    flex: 1;
  }
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  z-index: z('toast');
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-weight: 600;
  transition: top var(--dur-fast) var(--ease-out);

  &:focus {
    top: 1rem;
  }
}
</style>
