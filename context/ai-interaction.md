# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the project spec
- Never delete files without clarification

## Workflow

This is the common workflow that we will use for every single feature/fix:

1. **Document** — Document the feature in `@context/current-feature.md`.
2. **Branch** — Create a new branch for the feature/fix.
3. **Implement** — Implement what's described in `@context/current-feature.md`. If the work spans both repos, change `yolde-api` first, then `yolde-app`.
4. **Unit test** — Add/update tests for any new or changed services, store logic, guards, interceptors (frontend) or controllers, services, DTOs, guards (backend). See the **Testing** section below.
5. **Verify** — Verify it works in the browser. Run the relevant test + build commands for each repo touched and fix any errors. See the **Verification** section below.
6. **Iterate** — Iterate and change things if needed.
7. **Commit** — Only after tests pass, builds pass, and everything works.
8. **Merge** — Merge to `main`.
9. **Delete branch** — Delete the branch after merge.
10. **Review** — Review AI-generated code periodically and on demand.
11. Mark as completed in `@context/current-feature.md` and add to history.

Do NOT commit without permission and until tests and builds pass. If either fails, fix the issues first.

## Testing

Yolde has two test setups — one per repo. Scope is intentionally narrow on both sides; don't add component-level UI tests for Angular templates.

### Frontend — `yolde-app` (Vitest)

Run via Angular's `@angular/build:unit-test` builder, so `npm test` (= `ng test`) is the entry point. No Karma, no separate Vitest config to maintain.

- **In scope:** Angular services (`src/app/**/*.service.ts`, `src/app/shared/services/**`), NgRx stores / signal stores (e.g. `core/auth/store`), guards, HTTP interceptors, and pure utility functions.
- **Out of scope:** Component templates and visual rendering. Don't write tests that mount components purely to assert on the DOM. Don't add `*.spec.ts` files for components — if `ng generate component` scaffolds one, delete it.

#### Conventions

- Co-locate tests next to the file under test: `article.service.ts` → `article.service.spec.ts`
- Use Vitest globals (`describe` / `it` / `expect` / `beforeEach`) — provided by `types: ["vitest/globals"]` in `tsconfig.spec.json`
- For mocks/spies use `vi` (`vi.fn()`, `vi.spyOn(...)`), not `jasmine` or `jest`
- Use `TestBed` to configure providers; mock `HttpClient` with `HttpTestingController` from `@angular/common/http/testing`
- Don't hit the real API — stub services or use `HttpTestingController.expectOne(...)`
- Keep tests fast and deterministic — no network, no real timers unless faked with `vi.useFakeTimers()`

### Backend — `yolde-api` (Jest + Supertest)

- **In scope:** NestJS services (`*.service.ts`), controllers (`*.controller.ts`), DTO validation, guards, middlewares, and helpers in `shared/`.
- **Out of scope:** Hitting a real Postgres in unit tests — mock the TypeORM repository.

#### Conventions

- Co-locate tests next to the file under test: `article.service.ts` → `article.service.spec.ts`
- Use Nest's `Test.createTestingModule(...)` to wire providers
- Mock the TypeORM repository via `getRepositoryToken(Entity)` so unit tests never touch Postgres
- For controller tests with HTTP behavior, use Supertest against the testing module
- e2e tests live under `test/` and use `test:e2e` — keep them rare and high-signal

## Verification

After implementing, run the relevant commands for whichever repo(s) you touched. **Don't commit until they pass.**

### `yolde-app` (Angular)

```bash
npm run lint          # angular-eslint
npm run prettier:check
npm test              # Vitest (via @angular/build:unit-test)
npm run build         # production build, fails on TS errors
```

For UI changes, also start `npm start` and click through the affected screens in the browser before reporting the task done.

### `yolde-api` (NestJS)

```bash
npm run lint          # eslint --fix
npm test              # jest
npm run build         # nest build
```

For backend changes that affect the schema, also run a fresh migration locally (`npm run db:create` then `npm run db:migrate`) and verify the SQL is what you expected before committing.

## Branching

Create a new branch for every feature/fix. Name branches:

- `feature/<short-name>` for new features
- `fix/<short-name>` for bug fixes
- `chore/<short-name>` for tooling, deps, refactors

Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`)
- Keep commits focused — one feature/fix per commit
- Never put "Generated with Claude" or co-author trailers in commit messages

## When Stuck

- If something isn't working after 2–3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear
- For Angular issues, check whether the problem is **zoneless-related** (no Zone.js) before going further — many community solutions assume Zone.js is present and won't apply here

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns in the codebase:
  - **Frontend:** standalone components, `loadComponent()` lazy routes, NgRx SignalStore for auth state, short component filenames (no `.component` suffix), `app` selector prefix, SCSS
  - **Backend:** one Nest module per domain (`article`, `comment`, `user`, `profile`, `tag`), `*.controller.ts` / `*.service.ts` / `*.entity.ts` / `dto/` layout, `class-validator` DTOs, TypeORM entities

## Code Review

Review AI-generated code periodically, especially for:

- **Security** — auth guards on protected routes (frontend) and controllers (backend), JWT handling, password hashing, DTO validation, no leaked `password` field in responses
- **Performance** — N+1 queries through eager TypeORM relations, missing pagination on feed endpoints, unnecessary re-renders, leaking subscriptions in Angular
- **Logic errors** — edge cases on slug collisions, empty `tagList`, deleted authors, unauth'd users
- **Patterns** — does it match the existing codebase, or does it invent a new style?
