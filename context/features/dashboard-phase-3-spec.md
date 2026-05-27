# Dashboard UI Phase 3 Spec

## Overview

Phase 3 of 3 for the dashboard UI layout. Build the Kanban board shown in the screenshot at `/projects/:slug/board`. Display-only — no drag-and-drop, no create/edit. Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 3

- Header with `Board / <Project Name>` breadcrumb, stacked member avatars, view toggle, and `+ New issue` button
- Filter toolbar with search input and chips for Status, Assignee, Priority, Type, More filters
- 5 columns in order: Backlog, Todo, In Progress, In Review, Done — each with status dot, label, count, `+`, `⋯`, and `+ New issue` footer
- Issue cards show: type icon, key, title, label chips, priority pill, comment count, assignee avatar
- Add `isFavorite` and `isPinned` to the `Issue` type in `mock-data.ts` (currently only on `Project`)

## References

- @context/screenshots/dashboard-ui.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
