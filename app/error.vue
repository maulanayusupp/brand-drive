<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()

const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <NuxtLayout>
    <section class="page container error">
      <p class="eyebrow">{{ error.statusCode || 404 }}</p>
      <h1 class="error__title">{{ t('notFound.title') }}</h1>
      <p class="error__subtitle muted">{{ t('notFound.subtitle') }}</p>
      <BaseButton size="lg" icon="arrowRight" @click="goHome">
        {{ t('notFound.cta') }}
      </BaseButton>
    </section>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  min-height: 60vh;
  justify-content: center;

  &__title {
    max-width: 16ch;
  }

  &__subtitle {
    max-width: 44ch;
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }
}
</style>
