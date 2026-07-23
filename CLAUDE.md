# CLAUDE.md — Project guide for AI assistants & contributors

> Keep this file in sync with reality. **Any change to code rules, features,
> pages, or content MUST also update: this file, the compliance page(s), and
> BOTH i18n locales (`en` + `id`).** This is a hard project rule (see §Rules).

## What this is

**OrbitPay** (an editable **placeholder** brand — not a real company) is a
payments product/brand **landing site** whose hero is a **drivable 3D car**
that explores a world of brand "sections" — inspired by bruno-simon.com but for
a brand. Built for great UI/UX, SEO, and easy maintenance.

## Stack (verified versions)

| Concern        | Choice                                        |
| -------------- | --------------------------------------------- |
| Framework      | **Nuxt 4.5.0** (Vue 3.5, Nitro 2, Vite)       |
| Language       | TypeScript (strict)                           |
| i18n           | `@nuxtjs/i18n` 10.5.0 — EN + **ID (default)** |
| SEO            | `@nuxtjs/seo` 5.3.6 (sitemap, robots, schema) |
| Styling        | **SCSS only** (`sass` 1.101.6), no inline CSS |
| 3D             | `three` 0.185.1                               |
| Physics        | `@dimforge/rapier3d-compat` 0.19.3 (WASM)     |
| Favicons       | `favicons` 7.3.0 (build-time script)          |
| Node           | ≥ 20.11                                        |

## Commands

```bash
pnpm dev          # dev server
pnpm build        # production build (validated in CI/local)
pnpm preview      # run the built server
pnpm generate     # static generation
pnpm favicons     # regenerate favicons from assets/favicon-source.svg
```

## Directory map (Nuxt 4 `app/` srcDir)

```
app/
  app.vue                 # root: i18n <html> head + title template
  error.vue               # 404/500 page
  assets/scss/            # design system (see §Styling)
  components/
    base/                 # BaseIcon, BaseButton, BaseCard (generic primitives)
    common/               # SectionHeading, PageHero, LegalDocument
    layout/               # AppHeader, AppFooter, BrandLogo, LanguageSwitcher, ThemeToggle
    home/                 # HeroExperience (3D hero), StatsBand, SectionGrid, HowItWorks, CtaBand
    game/                 # GameCanvas.client, GameHud, TouchControls, SectionPopup
    contact/              # ContactForm
  composables/            # useGameState, useTheme, usePageSeo (helpers)
  config/                 # brand/sections/navigation config (structure, NOT text)
  game/                   # Three.js + Rapier engine (Experience, Car, World, input, textTexture)
  layouts/default.vue     # header + <slot> + footer + skip link
  pages/                  # index, about, compliance, contact, privacy, terms
  plugins/theme.client.ts # applies persisted theme
  services/               # content.service, contact.service (data access layer)
  types/                  # shared TS types
i18n/locales/{en,id}.json # ALL user-facing text
public/                   # generated favicons + manifest
scripts/generate-favicons.mjs
assets/favicon-source.svg # favicon source of truth
```

Components are auto-imported by **filename** (`pathPrefix: false`), so folder
names don't appear in tags: `<BaseIcon>`, `<AppHeader>`, etc.

## Architecture conventions

- **Config → Services → Composables/Components.** Components never import
  `config/*` directly; they go through `services/content.service.ts`. This lets
  the content source move to a CMS/API later without touching UI.
- **Structure vs. text.** `config/*` holds structure (ids, icons, colors, 3D
  positions, routes). All human-readable strings live in i18n by key.
- **Helpers = composables** (`usePageSeo`, `useTheme`, `useGameState`).
- **The 3D engine** is a plain-TS module graph under `app/game/`, imported
  **client-only** via `GameCanvas.client.vue` (never runs during SSR).

## Styling (SCSS, no inline CSS — hard rule)

- `_variables.scss` (build-time vars) + `_mixins.scss` (incl. `z()`,
  `respond-to`, `glass`, `focus-ring`) are **injected into every component**
  via `nuxt.config` → `vite.css.preprocessorOptions.scss.additionalData`
  (absolute path to `_shared.scss`). Use `$` vars and mixins freely in any
  `<style lang="scss" scoped>`.
- Runtime, themeable values are **CSS custom properties** in `_tokens.scss`
  (`var(--color-accent)`, etc.), with an opt-in light theme
  (`:root[data-theme='light']`).
- `main.scss` is the single global entry (tokens → reset → typography → base →
  utilities), referenced by `nuxt.config` `css`.
- **Never** use `style="..."` in templates. Dynamic accents use CSS custom
  properties set from parent SCSS (see `SectionGrid` `:nth-child`).

## i18n

- Locales in `i18n/locales/{en,id}.json`; **ID is the default** (no prefix),
  EN is under `/en/*` (`strategy: 'prefix_except_default'`).
- Keys mirror the page/section structure. **Keep EN and ID in lockstep** — same
  keys, no missing translations.
- Literal `@` in a string must be escaped as `{'@'}` (vue-i18n linked-message
  syntax) — see the email placeholder.

## SEO

- Per-page: `usePageSeo(titleGetter, descGetter)` (reactive to locale).
- Global title template + hreflang/`<html lang>` in `app.vue` via
  `useLocaleHead`.
- Sitemap/robots auto-generated by `@nuxtjs/seo`. Site URL comes from
  `NUXT_PUBLIC_SITE_URL` (see `.env.example`), defaulting to a placeholder.
- Dynamic OG **image** generation is disabled (`ogImage.enabled=false`) because
  it needs a native renderer we don't bundle; OG **meta tags** are still set.

## Rules (do not break)

1. **No inline CSS.** SCSS only, centralized as above.
2. **Multilingual parity.** Update EN + ID together for every text change.
3. **Sync on change.** Every code/rule/feature change updates this file, the
   compliance page(s), and both locales.
4. **Evidence over assumption.** Verify versions/APIs before relying on them.
5. **Commits.** Author = **Maulana Yusup Abdullah <maulanayusupp@gmail.com>**.
   **No AI/Claude co-author trailer.** Commit **and push** after each change.
6. **Brand is a placeholder.** Do not present OrbitPay as a real institution.

## Backlog

See [TODO.md](./TODO.md).
