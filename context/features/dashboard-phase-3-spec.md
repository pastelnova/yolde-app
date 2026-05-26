# Dashboard UI Phase 3 Spec

## Overview

Phase 3 of 3 for the dashboard UI layout. The main area at `/dashboard` is a workspace overview — not the Kanban board (that lives at `/projects/:slug/board` later). Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 3

- 4 stats cards at the top (not in screenshot): total issues, total projects, favorite issues, favorite projects
- Recent projects row (sorted by max `updatedAt` of their issues)
- Pinned issues section
- 10 most recently updated issues
- Add `isFavorite` and `isPinned` to the `Issue` type in `mock-data.ts` (currently only on `Project`)

## References

- @context/screenshots/dashboard-ui.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
