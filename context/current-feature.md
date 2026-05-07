# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-06 — Drop redundant `provideZonelessChangeDetection()` call. Removed from `app.config.ts` and `app.spec.ts` since zoneless is the Angular 21 default. Updated `CLAUDE.md` and `context/coding-standards.md` to reflect the new default and warn against re-adding `provideZoneChangeDetection()`. Drive-by: fixed a pre-existing broken import in `home.spec.ts` that was preventing the test suite from compiling. Branch: `chore/zoneless-default-v21` (merged & deleted).
- 2026-05-07 — Migrate `yolde-app` test runner from Karma + Jasmine to Vitest. Switched `angular.json` test target to `@angular/build:unit-test`, swapped deps (`vitest` + `jsdom` in, `karma*` + `jasmine-core` + `@types/jasmine` out), updated `tsconfig.spec.json` types to `vitest/globals`, and removed 21 auto-scaffolded component `*.spec.ts` files (boilerplate `should create` only — component DOM tests remain out of scope). Ran the official `refactor-jasmine-vitest` schematic (no test-code changes needed). Updated `CLAUDE.md`, `README.md`, `context/ai-interaction.md`, `context/coding-standards.md`, and `context/project-overview.md`. Followups (deferred): replace stub specs with real coverage and add specs for `auth.guard`, `api.interceptor`, `token.interceptor`, `auth.store`, `error.service`. Branch: `chore/vitest-migration` (merged & deleted).
