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
