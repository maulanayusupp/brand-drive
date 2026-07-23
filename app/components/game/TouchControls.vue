<script setup lang="ts">
import type { InputAction } from '~/game/input'

const emit = defineEmits<{ press: [InputAction]; release: [InputAction] }>()
const { t } = useI18n()

const onDown = (action: InputAction, e: PointerEvent) => {
  e.preventDefault()
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  emit('press', action)
}
const onUp = (action: InputAction) => emit('release', action)
</script>

<template>
  <div class="touch" :aria-label="t('game.controls.hintMobile')">
    <div class="touch__pad touch__pad--steer">
      <button
        class="touch__btn"
        type="button"
        :aria-label="t('game.controls.steer')"
        @pointerdown="onDown('left', $event)"
        @pointerup="onUp('left')"
        @pointerleave="onUp('left')"
        @pointercancel="onUp('left')"
      >
        <BaseIcon name="arrowRight" :size="26" class="flip" />
      </button>
      <button
        class="touch__btn"
        type="button"
        :aria-label="t('game.controls.steer')"
        @pointerdown="onDown('right', $event)"
        @pointerup="onUp('right')"
        @pointerleave="onUp('right')"
        @pointercancel="onUp('right')"
      >
        <BaseIcon name="arrowRight" :size="26" />
      </button>
    </div>

    <div class="touch__pad touch__pad--drive">
      <button
        class="touch__btn touch__btn--brake"
        type="button"
        :aria-label="t('game.controls.brake')"
        @pointerdown="onDown('brake', $event)"
        @pointerup="onUp('brake')"
        @pointerleave="onUp('brake')"
        @pointercancel="onUp('brake')"
      >
        {{ t('game.controls.brake') }}
      </button>
      <button
        class="touch__btn touch__btn--reverse"
        type="button"
        :aria-label="t('game.controls.drive')"
        @pointerdown="onDown('backward', $event)"
        @pointerup="onUp('backward')"
        @pointerleave="onUp('backward')"
        @pointercancel="onUp('backward')"
      >
        <BaseIcon name="arrowRight" :size="24" class="down" />
      </button>
      <button
        class="touch__btn touch__btn--gas"
        type="button"
        :aria-label="t('game.controls.drive')"
        @pointerdown="onDown('forward', $event)"
        @pointerup="onUp('forward')"
        @pointerleave="onUp('forward')"
        @pointercancel="onUp('forward')"
      >
        <BaseIcon name="arrowRight" :size="30" class="up" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.touch {
  position: absolute;
  inset: auto 0 0 0;
  z-index: z('hud');
  display: none;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1.5rem;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
  pointer-events: none;

  // Show only on coarse pointers (touch), regardless of viewport size.
  @media (hover: none) and (pointer: coarse) {
    display: flex;
  }

  &__pad {
    display: flex;
    gap: 0.75rem;
    pointer-events: auto;

    &--drive {
      align-items: flex-end;
    }
  }

  &__btn {
    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border-radius: var(--radius-md);
    color: var(--color-text);
    @include glass(0.09);
    user-select: none;
    -webkit-user-select: none;
    transition: transform var(--dur-fast) var(--ease-out);

    &:active {
      transform: scale(0.92);
      color: var(--color-accent);
      border-color: var(--color-accent);
    }

    &--gas {
      width: 4.75rem;
      height: 4.75rem;
      color: var(--color-accent);
    }

    &--brake {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-danger);
    }
  }
}

.flip {
  transform: rotate(180deg);
}
.up {
  transform: rotate(-90deg);
}
.down {
  transform: rotate(90deg);
}
</style>
