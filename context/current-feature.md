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
- **Dashboard UI Phase 2** (2026-05-26): Added the dashboard sidebar as a standalone component with expanded (~240px) and compact (~56px) modes, collapse state persisted to `localStorage`. Workspace header with collapse/expand toggle; project switcher (active project + list + "New project" placeholder + ⌘K search field); per-project nav routing to `/projects/:slug/{board,issues,members,settings}`; favorites section driven by `projects.isFavorite`; user avatar/email block at the bottom. Mobile uses a CDK Overlay drawer triggered from a hamburger in the top bar, with backdrop dismiss. Data sourced from `src/lib/mock-data.ts`.
- **Dashboard UI Phase 3** (2026-05-27): Built the display-only Kanban board at `/projects/:slug/board`. Five status columns (Backlog → Done) sized to content with header icon in the status color, count badge, `+`/`⋯` controls, and `+ New issue` footer; columns flex equally to fill the main area. Issue cards render type icon, key, title, label chips, priority pill, estimate, comment count, pin/favorite indicators, and assignee avatar (hidden when unassigned); pinned issues sort to the top. Filter toolbar with search + Status/Assignee/Priority/Type/More chips (display-only). Dashboard header rewritten: `<Section> / <Project>` breadcrumb, board/list view toggle, overlapping member avatar stack, `New issue` button. Sidebar narrowed to ~208px. Extended `Issue` in `mock-data.ts` with `isFavorite`/`isPinned`, added cross-project sample issues, left ACME-183 unassigned to exercise the empty-state. Merged into `version2` (not `main`) per branch-scoping rule.
