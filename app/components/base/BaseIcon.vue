<script setup lang="ts">
/**
 * Inline SVG icon set. Line icons use stroke; brand/social icons are filled.
 * Markup is a static, trusted constant map — safe to render with v-html.
 */
interface Props {
  name: string
  size?: number | string
}
const props = withDefaults(defineProps<Props>(), { size: 24 })

const FILLED = new Set(['bolt', 'shield', 'pin', 'x', 'linkedin', 'github'])

const ICONS: Record<string, string> = {
  card: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/><path d="M6 15h4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  shield: '<path d="M12 2 20 5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z"/>',
  chart:
    '<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="7" width="3" height="11" rx="1"/><rect x="16" y="13" width="3" height="5" rx="1"/>',
  lock: '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  moon: '<path d="M20 14a8 8 0 1 1-10-10 6 6 0 0 0 10 10z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone:
    '<path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5" fill="var(--color-bg)"/>',
  external:
    '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  x: '<path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l8-9L3 3h6l4 5z"/>',
  linkedin:
    '<path d="M6 9v9H3V9zM4.5 3.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2zM9 9h3v1.3c.5-.9 1.6-1.6 3-1.6 2.5 0 4 1.6 4 4.7V18h-3v-4.2c0-1.3-.5-2.1-1.7-2.1-1 0-1.6.7-1.8 1.4-.1.2-.2.6-.2.9V18H9z"/>',
  github:
    '<path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.5 5 .3.3.7 1 .7 2v2.9c0 .3.2.6.7.5 3.9-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/>',
}

const isFilled = computed(() => FILLED.has(props.name))
const inner = computed(() => ICONS[props.name] ?? '')
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
