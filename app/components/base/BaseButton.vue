<script setup lang="ts">
/** Polymorphic button: renders <NuxtLink> for `to`, <a> for `href`, else <button>. */
interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  type?: 'button' | 'submit'
  block?: boolean
  icon?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const localePath = useLocalePath()

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const bindings = computed(() => {
  if (props.to) return { to: localePath(props.to) }
  if (props.href)
    return { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component
    :is="tag"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
    v-bind="bindings"
  >
    <span class="btn__label"><slot /></span>
    <BaseIcon v-if="icon" :name="icon" :size="size === 'lg' ? 22 : 18" />
  </component>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: -0.01em;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);
  white-space: nowrap;
  @include focus-ring;

  &:active {
    transform: translateY(1px) scale(0.99);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  &--md {
    padding: 0.7rem 1.4rem;
    font-size: 0.95rem;
  }
  &--lg {
    padding: 0.95rem 1.9rem;
    font-size: 1.05rem;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--primary {
    background: var(--color-accent);
    color: var(--color-accent-ink);
    box-shadow: var(--shadow-glow);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 55px rgba(198, 255, 61, 0.5);
    }
  }

  &--outline {
    border-color: var(--color-border-strong);
    color: var(--color-text);

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
  }

  &--ghost {
    color: var(--color-text-muted);

    &:hover {
      color: var(--color-text);
      background: var(--color-surface);
    }
  }
}
</style>
