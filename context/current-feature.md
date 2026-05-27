# Current Feature: Dashboard UI Phase 3

## Status

In Progress

## Goals

- Header with `Board / <Project Name>` breadcrumb, stacked member avatars, view toggle, and `+ New issue` button
- Filter toolbar with search input and chips for Status, Assignee, Priority, Type, More filters
- 5 columns in order: Backlog, Todo, In Progress, In Review, Done — each with status dot, label, count, `+`, `⋯`, and `+ New issue` footer
- Issue cards show: type icon, key, title, label chips, priority pill, comment count, assignee avatar
- Extend the `Issue` type in `src/lib/mock-data.ts` with `isFavorite` and `isPinned` (currently only on `Project`)

## Notes

- Phase 3 of 3 for the dashboard UI layout. Builds the Kanban board at `/projects/:slug/board` shown in the screenshot. Display-only — no drag-and-drop, no create/edit.
- Data sourced directly from `src/lib/mock-data.ts` until a real database is wired up.
- References:
  - @context/screenshots/dashboard-ui.png
  - @context/project-overview.md
  - @src/lib/mock-data.ts
  - @context/features/dashboard-phase-1-spec.md
  - @context/features/dashboard-phase-2-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- **Dashboard UI Phase 1** (2026-05-26): Set up Tailwind v4 (CSS-based, no `tailwind.config.js`), wired the `@spartan-ng/brain` hlm preset and `tw-animate-css`, added `@lucide/angular` for icons. Added lazy `/dashboard` route behind `authGuard` with a dark top bar (search input + "New issue" button, display-only), sidebar/main `h2` placeholders, and host-scoped dark mode. Wrapped the legacy global `*` reset in `@layer base` so Tailwind utilities stop being shadowed. Hid the marketing nav/footer on `/dashboard*` routes.
- **Dashboard UI Phase 2** (2026-05-26): Added the dashboard sidebar as a standalone component with expanded (~240px) and compact (~56px) modes, collapse state persisted to `localStorage`. Workspace header with collapse/expand toggle; project switcher (active project + list + "New project" placeholder + ⌘K search field); per-project nav routing to `/projects/:slug/{board,issues,members,settings}`; favorites section driven by `projects.isFavorite`; user avatar/email block at the bottom. Mobile uses a CDK Overlay drawer triggered from a hamburger in the top bar, with backdrop dismiss. Data sourced from `src/lib/mock-data.ts`.
