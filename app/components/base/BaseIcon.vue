<script setup lang="ts">
/**
 * Inline SVG icon. Icon markup lives in the shared `iconPaths` module (also used
 * by the 3D billboard texture). Line icons use stroke; `filledIcons` are filled.
 */
import { filledIcons, iconPaths } from '~/utils/iconPaths'

interface Props {
  name: string
  size?: number | string
}
const props = withDefaults(defineProps<Props>(), { size: 24 })

const isFilled = computed(() => filledIcons.has(props.name))
const inner = computed(() => iconPaths[props.name] ?? '')
</script>

<template>
  <svg
    class="icon"
    :class="{ 'icon--filled': isFilled }"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    v-html="inner"
  />
</template>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;

  &--filled {
    fill: currentColor;
    stroke: none;
  }
}
</style>
