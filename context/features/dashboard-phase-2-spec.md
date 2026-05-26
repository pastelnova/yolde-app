# Dashboard UI Phase 2 Spec

## Overview

Phase 2 of 3 for the dashboard UI layout. Use the screenshot referenced below for how it should look. Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 2

- Collapsible sidebar (expanded ~240px, collapsed ~56px), persisted to `localStorage`
- Workspace header with collapse toggle
- Project switcher (active project + list of all projects)
- Per-project nav: Board, Issues, Members, Settings → `/projects/:slug/<section>`
- Favorite projects section (`projects` where `isFavorite === true`)
- User avatar area at the bottom (`currentUser` from mock-data)
- Sidebar is always an overlay drawer on mobile (CDK Overlay), opened from a hamburger in the top bar

## References

- @context/screenshots/dashboard-ui.png
- @context/screenshots/dashboard-ui-collapsed.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-3-spec.md
