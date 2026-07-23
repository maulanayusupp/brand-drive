<script setup lang="ts">
import type { Experience } from '~/game/Experience'
import type { InputAction } from '~/game/input'
import type { SectionSpec } from '~/game/World'
import { contentService } from '~/services/content.service'
import type { GameTelemetry } from '~/types'

const emit = defineEmits<{ unsupported: []; ready: [] }>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const state = useGameState()
const { t } = useI18n()

let experience: Experience | null = null

const patch = (partial: Partial<GameTelemetry>) => {
  state.value = { ...state.value, ...partial }
}

onMounted(async () => {
  await nextTick()
  const canvas = canvasEl.value
  if (!canvas) return

  // Reset per-visit state. useState is global and survives route changes, so
  // without this a return visit would show a stale "ready"/"started" before the
  // freshly-created engine has actually initialized.
  patch({
    loading: true,
    ready: false,
    started: false,
    speedKmh: 0,
    score: 0,
    activeSectionId: null,
  })

  // WebGL capability check — degrade gracefully if unavailable.
  const gl =
    canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (!gl) {
    patch({ loading: false, ready: false })
    emit('unsupported')
    return
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const sections: SectionSpec[] = contentService.getSections().map((s) => ({
    id: s.id,
    accent: s.accent,
    icon: s.icon,
    x: s.world.x,
    z: s.world.z,
    title: t(`sections.${s.id}.title`),
    subtitle: t(`sections.${s.id}.tagline`),
  }))

  try {
    const { Experience } = await import('~/game/Experience')
    experience = new Experience({ canvas, sections, reducedMotion, onTelemetry: patch })
    await experience.init()
    emit('ready')
  } catch (err) {
    // Never fail silently to a blank canvas — surface the error and degrade to
    // the gradient fallback so the page still looks intentional.
    console.error('[GameCanvas] 3D engine failed to start:', err)
    experience?.dispose()
    experience = null
    patch({ loading: false, ready: false })
    emit('unsupported')
  }
})

onBeforeUnmount(() => {
  experience?.dispose()
  experience = null
})

defineExpose({
  start: () => experience?.start(),
  stop: () => experience?.stop(),
  press: (action: InputAction) => experience?.press(action),
  release: (action: InputAction) => experience?.release(action),
  reset: () => experience?.resetCar(),
})
</script>

<template>
  <canvas ref="canvasEl" class="game-canvas" />
</template>

<style lang="scss" scoped>
.game-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}
</style>
