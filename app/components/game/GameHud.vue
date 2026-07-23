<script setup lang="ts">
const emit = defineEmits<{ exit: []; reset: [] }>()
const state = useGameState()
const { t } = useI18n()
</script>

<template>
  <div class="hud">
    <div class="hud__cluster hud__cluster--left">
      <div class="hud__stat">
        <span class="hud__value">{{ state.speedKmh }}</span>
        <span class="hud__unit">{{ t('game.speed') }}</span>
      </div>
      <div class="hud__stat hud__stat--coins">
        <BaseIcon name="bolt" :size="16" />
        <span class="hud__value">{{ state.score }}</span>
        <span class="hud__unit">{{ t('game.score') }}</span>
      </div>
    </div>

    <div class="hud__cluster hud__cluster--right">
      <button class="hud__btn" type="button" @click="emit('reset')">
        {{ t('game.controls.title') }}
      </button>
      <button class="hud__btn hud__btn--exit" type="button" @click="emit('exit')">
        <BaseIcon name="close" :size="16" />
        {{ t('game.exit') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hud {
  position: absolute;
  inset: auto 0 0 0;
  z-index: z('hud');
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  pointer-events: none;

  @include respond-to('md') {
    inset: 0 0 auto 0;
    align-items: flex-start;
    padding: calc(#{$header-height} + 1.5rem) 1.5rem 0;
  }

  &__cluster {
    display: flex;
    gap: 0.6rem;
    pointer-events: auto;
  }

  &__stat {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    padding: 0.6rem 1rem;
    border-radius: var(--radius-md);
    @include glass(0.06);

    &--coins {
      align-items: center;
      color: var(--color-accent);
    }
  }

  &__value {
    font-family: var(--font-mono);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__unit {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-dim);
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 0.9rem;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    color: var(--color-text-muted);
    @include glass(0.06);
    transition: color var(--dur-fast) var(--ease-out);
    @include focus-ring;

    &:hover {
      color: var(--color-text);
    }

    &--exit:hover {
      color: var(--color-danger);
    }
  }
}
</style>
