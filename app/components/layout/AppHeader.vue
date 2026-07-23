<script setup lang="ts">
import { contentService } from '~/services/content.service'

const nav = contentService.getMainNav()
const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const menuOpen = ref(false)
const closeMenu = () => (menuOpen.value = false)

const isActive = (to: string) => {
  const target = localePath(to)
  return to === '/' ? route.path === target : route.path.startsWith(target)
}

// Close the mobile menu on route change.
watch(() => route.fullPath, closeMenu)
</script>

<template>
  <header class="header">
    <div class="header__inner container--wide">
      <BrandLogo />

      <nav class="header__nav" :aria-label="t('common.menu')">
        <NuxtLink
          v-for="item in nav"
          :key="item.id"
          :to="localePath(item.to)"
          class="header__link"
          :class="{ 'header__link--active': isActive(item.to) }"
        >
          {{ t(item.i18nKey) }}
        </NuxtLink>
      </nav>

      <div class="header__actions">
        <LanguageSwitcher />
        <ThemeToggle />
        <BaseButton to="/contact" size="sm" class="header__cta">
          {{ t('common.getStarted') }}
        </BaseButton>
        <button
          class="header__burger"
          type="button"
          :aria-expanded="menuOpen"
          :aria-label="menuOpen ? t('common.close') : t('common.menu')"
          @click="menuOpen = !menuOpen"
        >
          <BaseIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <div v-if="menuOpen" class="drawer">
        <NuxtLink
          v-for="item in nav"
          :key="item.id"
          :to="localePath(item.to)"
          class="drawer__link"
          @click="closeMenu"
        >
          {{ t(item.i18nKey) }}
        </NuxtLink>
        <BaseButton to="/contact" size="lg" block @click="closeMenu">
          {{ t('common.getStarted') }}
        </BaseButton>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: z('header');

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $header-height;
    margin-top: 0.75rem;
    padding-block: 0.5rem;
    border-radius: var(--radius-pill);
    @include glass(0.04);
    box-shadow: var(--shadow-md);
  }

  &__nav {
    display: none;
    gap: 0.35rem;

    @include respond-to('lg') {
      display: flex;
    }
  }

  &__link {
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-text-muted);
    border-radius: var(--radius-pill);
    transition: all var(--dur-fast) var(--ease-out);
    @include focus-ring;

    &:hover {
      color: var(--color-text);
      background: var(--color-surface);
    }

    &--active {
      color: var(--color-accent);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  &__cta {
    display: none;

    @include respond-to('sm') {
      display: inline-flex;
    }
  }

  &__burger {
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: var(--radius-pill);
    color: var(--color-text);
    @include glass(0.05);
    @include focus-ring;

    @include respond-to('lg') {
      display: none;
    }
  }
}

.drawer {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  @include glass(0.06);
  box-shadow: var(--shadow-lg);

  @include respond-to('lg') {
    display: none;
  }

  &__link {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text);
    border-radius: var(--radius-md);

    &:hover {
      background: var(--color-surface);
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    opacity var(--dur-med) var(--ease-out),
    transform var(--dur-med) var(--ease-out);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
