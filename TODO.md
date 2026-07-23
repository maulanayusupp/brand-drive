# TODO — Roadmap & next features

Add new ideas here. When you ship one, move it to **Done** with a date and
update `CLAUDE.md` + both locales + compliance pages as needed.

## High priority

- [ ] **Real contact endpoint.** Replace the simulated `contact.service.submit`
      with a Nuxt server route (`server/api/contact.post.ts`) + email/CRM.
- [ ] **Self-hosted fonts.** Add `@nuxt/fonts` to self-host Space Grotesk /
      JetBrains Mono (removes the Google Fonts network request, improves privacy
      + offline). Currently loaded via `<link>` with a system fallback.
- [ ] **Dynamic OG images.** Install `@takumi-rs/core` (or add a
      `components/OgImage/Default.satori.vue`) and re-enable `ogImage`.

## 3D experience

- [ ] Upgrade the arcade car to a **raycast vehicle** (Rapier
      `DynamicRayCastVehicleController`) with real suspension + wheel friction.
- [ ] Engine/tyre **sound** (Web Audio), muted by default with a toggle.
- [ ] **Mobile performance** pass: lower shadow map, DPR clamp, optional
      "lite" mode toggle; instrument with stats.
- [ ] Nicer assets: replace box car with a **glTF model**; add environment
      props, skybox / HDRI-lite gradient.
- [ ] Minimap / section radar; checkpoint or lap mode for engagement.

## Content & pages

- [ ] **Pricing** page and **Docs/Developers** page.
- [ ] **Blog / changelog** (content module or MDC).
- [ ] Expand compliance with region-specific detail once real status is known.
- [ ] Customer logos / testimonials section (social proof for conversion).

## i18n & a11y

- [ ] Add more locales (e.g. `zh`, `ms`) — keep all keys in lockstep.
- [ ] Locale-aware **number/currency** formatting for stats.
- [ ] Full **prefers-reduced-motion** static hero fallback (skip 3D entirely).
- [ ] Automated a11y audit (axe) + keyboard-nav review of the HUD/menu.

## Platform / quality

- [ ] **PWA** (installable) via `@vite-pwa/nuxt` using the generated manifest.
- [ ] **Analytics** + consent banner (privacy-friendly).
- [ ] Unit/component tests (Vitest) + Playwright e2e for nav & form.
- [ ] CI: typecheck (`pnpm typecheck`), build, lint on PRs.
- [ ] CMS integration behind `content.service` (contract already isolates it).

## Done

- [x] 2026-07-23 — Pivoted theme from payments to a **digital marketing agency**
      ("we drive your brand's growth"): services billboards, industries block,
      trust page, marketing copy in EN/ID.
- [x] 2026-07-23 — Initial site: Nuxt 4 + 3D drivable-car hero, 6 pages,
      EN/ID i18n, SCSS design system, SEO (sitemap/robots), generated favicons.
