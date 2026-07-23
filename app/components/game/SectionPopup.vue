<script setup lang="ts">
interface Props {
  sectionId: string | null
}
const props = defineProps<Props>()
const { t } = useI18n()
const localePath = useLocalePath()

const content = computed(() => {
  if (!props.sectionId) return null
  const id = props.sectionId
  return {
    id,
    title: t(`sections.${id}.title`),
    tagline: t(`sections.${id}.tagline`),
    body: t(`sections.${id}.body`),
  }
})
</script>

<template>
  <Transition name="popup">
    <aside v-if="content" :key="content.id" class="popup" role="status">
      <p class="eyebrow">{{ t('game.nearby') }}</p>
      <h3 class="popup__title">{{ content.title }}</h3>
      <p class="popup__tagline">{{ content.tagline }}</p>
      <p class="popup__body">{{ content.body }}</p>
      <NuxtLink :to="localePath('/') + '#' + content.id" class="popup__link">
        {{ t('common.learnMore') }}
        <BaseIcon name="arrowRight" :size="16" />
      </NuxtLink>
    </aside>
  </Transition>
</template>

<style lang="scss" scoped>
.popup {
  position: absolute;
  z-index: z('hud');
  left: 50%;
  bottom: 2rem;
  transform: translateX(-50%);
  width: min(28rem, calc(100% - 2rem));
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  @include glass(0.08);
  box-shadow: var(--shadow-lg);

  // Keep clear of the on-screen touch pads on mobile.
  @media (hover: none) and (pointer: coarse) {
    bottom: auto;
    top: calc(#{$header-height} + 5.5rem);
  }

  &__title {
    margin-top: 0.5rem;
  }

  &__tagline {
    margin-top: 0.35rem;
    color: var(--color-accent);
    font-weight: 600;
  }

  &__body {
    margin-top: 0.6rem;
    color: var(--color-text-muted);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    font-weight: 600;
    color: var(--color-text);
    @include focus-ring;

    &:hover {
      color: var(--color-accent);
    }
  }
}

.popup-enter-active,
.popup-leave-active {
  transition:
    opacity var(--dur-med) var(--ease-out),
    transform var(--dur-med) var(--ease-out);
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
