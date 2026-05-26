# Current Feature

## Status

Not Started

## Goals

<!-- Bullet points of what success looks like -->

## Notes

<!-- Additional context, constraints, or details from spec -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Dashboard UI Phase 1** (2026-05-26): Set up Tailwind v4 (CSS-based, no `tailwind.config.js`), wired the `@spartan-ng/brain` hlm preset and `tw-animate-css`, added `@lucide/angular` for icons. Added lazy `/dashboard` route behind `authGuard` with a dark top bar (search input + "New issue" button, display-only), sidebar/main `h2` placeholders, and host-scoped dark mode. Wrapped the legacy global `*` reset in `@layer base` so Tailwind utilities stop being shadowed. Hid the marketing nav/footer on `/dashboard*` routes.
