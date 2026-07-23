<script setup lang="ts">
interface Props {
  interactive?: boolean
}
withDefaults(defineProps<Props>(), { interactive: false })
</script>

<template>
  <div class="card" :class="{ 'card--interactive': interactive }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  padding: clamp(1.5rem, 3vw, 2rem);
  border-radius: var(--radius-lg);
  @include glass(0.05);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  // Accent is themeable via the --card-accent custom property, overridden by
  // parent SCSS (e.g. the feature grid) — no inline styles required.
  --card-accent: var(--color-accent);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: var(--card-accent);
    opacity: 0.9;
  }

  &--interactive {
    transition:
      transform var(--dur-med) var(--ease-out),
      border-color var(--dur-med) var(--ease-out),
      box-shadow var(--dur-med) var(--ease-out);

    &:hover {
      transform: translateY(-6px);
      border-color: var(--color-border-strong);
      box-shadow: var(--shadow-lg);
    }
  }
}
</style>
