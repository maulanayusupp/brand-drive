<script setup lang="ts">
import type { InputAction } from '~/game/input'

interface GameApi {
  start: () => void
  stop: () => void
  press: (a: InputAction) => void
  release: (a: InputAction) => void
  reset: () => void
}

const state = useGameState()
const { t } = useI18n()

const gameRef = ref<GameApi | null>(null)
const unsupported = ref(false)

const canDrive = computed(() => state.value.ready && !unsupported.value)
const loadingDrive = computed(() => state.value.loading && !unsupported.value)

const onUnsupported = () => (unsupported.value = true)
const onStart = () => gameRef.value?.start()
const onExit = () => gameRef.value?.stop()
const onReset = () => gameRef.value?.reset()
const onPress = (a: InputAction) => gameRef.value?.press(a)
const onRelease = (a: InputAction) => gameRef.value?.release(a)
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__stage">
      <ClientOnly>
        <GameCanvas ref="gameRef" @unsupported="onUnsupported" />
        <template #fallback>
          <div class="hero__fallback" aria-hidden="true" />
        </template>
      </ClientOnly>

      <div class="hero__vignette" aria-hidden="true" />

      <template v-if="!unsupported">
        <GameHud v-if="state.started" @exit="onExit" @reset="onReset" />
        <TouchControls v-if="state.started" @press="onPress" @release="onRelease" />
        <SectionPopup :section-id="state.started ? state.activeSectionId : null" />
      </template>
    </div>

    <Transition name="fade">
      <div v-if="!state.started" class="hero__copy">
        <div class="container hero__copyInner">
          <p class="eyebrow">{{ t('home.hero.eyebrow') }}</p>
          <h1 class="hero__title">{{ t('home.hero.title') }}</h1>
          <p class="hero__subtitle">{{ t('home.hero.subtitle') }}</p>

          <div class="hero__actions">
            <button
              v-if="!unsupported"
              class="hero__drive"
              type="button"
              :disabled="!canDrive"
              @click="onStart"
            >
              <span v-if="loadingDrive" class="spinner" aria-hidden="true" />
              <BaseIcon v-else name="bolt" :size="20" />
              {{ loadingDrive ? t('game.loadingWorld') + '…' : t('game.start') }}
            </button>
            <BaseButton to="/contact" variant="outline" size="lg">
              {{ t('common.getStarted') }}
            </BaseButton>
          </div>

          <p class="hero__note">
            <BaseIcon name="arrowRight" :size="16" />
            {{ unsupported ? t('game.fallback') : t('home.hero.note') }}
          </p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;

  &__stage {
    position: relative;
    width: 100%;
    height: 100svh;
    min-height: 600px;
    overflow: hidden;
  }

  &__fallback {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(60% 60% at 30% 20%, rgba(124, 92, 255, 0.35), transparent 60%),
      radial-gradient(50% 50% at 80% 70%, rgba(35, 229, 219, 0.25), transparent 60%),
      var(--color-bg);
  }

  &__vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      100deg,
      rgba(7, 10, 18, 0.85) 0%,
      rgba(7, 10, 18, 0.4) 40%,
      transparent 70%
    );
  }

  &__copy {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: z('canvas');
  }

  &__copyInner {
    pointer-events: auto;
    max-width: 42rem;
    padding-top: $header-height;
  }

  &__title {
    margin-top: 1rem;
  }

  &__subtitle {
    margin-top: 1.5rem;
    max-width: 34rem;
    font-size: clamp(1.05rem, 2vw, 1.3rem);
    line-height: 1.6;
    color: var(--color-text-muted);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }

  &__drive {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.95rem 1.9rem;
    font-family: var(--font-sans);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-accent-ink);
    background: var(--color-accent);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-glow);
    transition: transform var(--dur-fast) var(--ease-out);
    @include focus-ring;

    &:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.02);
    }

    &:disabled {
      opacity: 0.7;
      cursor: progress;
    }
  }

  &__note {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.75rem;
    color: var(--color-text-dim);
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }
}

.spinner {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  border: 2px solid rgba(10, 18, 0, 0.3);
  border-top-color: var(--color-accent-ink);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-med) var(--ease-out);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
