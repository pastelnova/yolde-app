# Dashboard UI Phase 1 Spec

## Overview

Phase 1 of 3 for the dashboard UI layout. Use the screenshot referenced below for how it should look.

## Requirements for phase 1

- Tailwind v4 setup (CSS-based, no `tailwind.config.js`)
- spartan-ng init + base components (the Angular port of ShadCN — ShadCN itself is React)
- Lucide Angular for icons
- Dashboard route at `/dashboard`, lazy, behind `authGuard`
- Main dashboard layout and global styles
- Dark mode by default
- Top bar with search and new issue button (display only)
- Placeholder for sidebar and main area. Just add an `h2` with "Sidebar" and "Main" for now.

## References

- @context/screenshots/dashboard-ui.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md
