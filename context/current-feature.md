# Current Feature

<!-- Feature Name -->

Migrate `yolde-app` unit tests from Karma + Jasmine to Vitest

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- Replace Karma + Jasmine with Vitest as the test runner in `yolde-app` (Angular 21 frontend).
- Use Angular 21's official `@angular/build:unit-test` builder so the runner integrates with the existing build pipeline (no separate karma config / `test.ts` bootstrap).
- Keep the existing testing scope strictly to **services, NgRx (signal) stores, guards, HTTP interceptors, and pure utilities** — no component / DOM tests. This already matches `coding-standards.md` and `ai-interaction.md`.
- Drop the auto-generated component `*.spec.ts` files (boilerplate `should create` only) so the suite reflects the actual scope.
- Update repo docs (`context/ai-interaction.md`, `context/coding-standards.md`, `CLAUDE.md`, `context/project-overview.md`) to reference Vitest instead of Karma + Jasmine.

## Notes

<!-- Any extra notes -->

- The `yolde-api` repo is unchanged and still uses Jest + Supertest.
- The Angular CLI schematic `ng g @schematics/angular:refactor-jasmine-vitest` auto-converts Jasmine syntax to Vitest where it differs (e.g. `spyOn` → `vi.spyOn`). The kept service specs are simple stubs and may not need any rewriting.
- Branch: `chore/vitest-migration`.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-05-06 — Drop redundant `provideZonelessChangeDetection()` call. Removed from `app.config.ts` and `app.spec.ts` since zoneless is the Angular 21 default. Updated `CLAUDE.md` and `context/coding-standards.md` to reflect the new default and warn against re-adding `provideZoneChangeDetection()`. Drive-by: fixed a pre-existing broken import in `home.spec.ts` that was preventing the test suite from compiling. Branch: `chore/zoneless-default-v21` (merged & deleted).
