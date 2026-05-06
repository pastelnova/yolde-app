# Coding Standards

You are an expert in Angular, SCSS, and TypeScript, focusing on scalable web development.

## Key Principles

- Provide clear, precise Angular and TypeScript examples.
- Apply immutability and pure functions where applicable.
- Favor component composition for modularity.
- Use meaningful variable names (e.g. `isActive`, `hasPermission`).
- Use kebab-case for file names (e.g. `article-preview.ts`).
- Prefer named exports for components, services, and utilities.

## TypeScript

- Strict mode enabled — `tsconfig.json` already has `strict: true`. Don't loosen it.
- No `any` — use proper typing or `unknown` and narrow at the boundary.
- Define interfaces for all component inputs, service responses, and shared models (see `src/app/shared/models/` and `src/app/core/auth/models/`).
- Use type inference where obvious, explicit return types on public service methods.
- Organize files: imports, type definitions, implementation.
- Use template strings for multi-line literals and interpolation.
- Use optional chaining (`?.`) and nullish coalescing (`??`).

## Angular

- **Standalone components only** — no `NgModule`. Imports go on the component itself.
- **Zoneless change detection** — zoneless is the Angular 21 default and the app has no Zone.js. Don't add `provideZoneChangeDetection()` and don't reach for `NgZone`, `zone.js` patches, or community fixes that assume Zone.js is present.
- **Signals first** — prefer `signal()`, `computed()`, and `effect()` for component state. Reach for RxJS only when you genuinely need a stream (HTTP, debounced inputs, route params).
- **`inject()` over constructor DI** — use `inject(Service)` inside components, directives, services, and guards. Don't add constructor parameters for DI.
- **Lazy loading** — every feature route uses `loadComponent()` with a dynamic `import()`. Don't eagerly import feature components in `app.routes.ts`.
- **Component filenames** — short, no `.component` suffix: `home.ts` / `home.html` / `home.scss`. Selector prefix is `app` (kebab-case for elements, camelCase for directives).
- **Templates** — use the new control flow (`@if`, `@for`, `@switch`) over `*ngIf` / `*ngFor` / `*ngSwitch`. `@for` requires `track`.
- **Async data** — use the `async` pipe in templates; never manually subscribe in component code unless you also handle teardown with `takeUntilDestroyed()`.
- **Accessibility** — semantic HTML and ARIA labels on interactive elements.
- **Images** — use `NgOptimizedImage` for raster images that have a known size.
- **Deferrable views** — use `@defer` for non-critical, below-the-fold content.

## File Naming Conventions

Match the existing project layout — no `.component` suffix on filenames:

- `*.ts` — components (e.g. `article.ts`)
- `*.html` — component template
- `*.scss` — component styles
- `*.service.ts` — services (in `shared/services/` or feature folder)
- `*.directive.ts` — directives
- `*.pipe.ts` — pipes
- `*.guard.ts` — route guards (in `core/auth/guards/`)
- `*.interceptor.ts` — HTTP interceptors (in `core/auth/interceptors/`)
- `*.store.ts` — NgRx SignalStores (e.g. `auth.store.ts`)
- `*.spec.ts` — tests, co-located next to the file under test
- All files use kebab-case.

## File Organization

- `src/app/core/` — auth (guards, interceptors, store, models) and app-level layout (nav, sidebar, footer, main)
- `src/app/features/<feature>/` — route-level screens, lazy-loaded
- `src/app/shared/` — reusable components, services, and models used across features
- `src/environments/` — environment files swapped via `angular.json` file replacements

## Code Style

- Single quotes for string literals.
- 2-space indentation.
- No trailing whitespace.
- `const` for immutable bindings; `let` only when reassignment is needed.
- Template strings for interpolation, not `+` concatenation.
- Run `npm run prettier:format` before committing — Prettier is the source of truth for formatting.

## Import Order

1. Angular core and common modules (`@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`)
2. RxJS (`rxjs`, `rxjs/operators`)
3. Other Angular and third-party modules (`@ngrx/signals`, `@ngrx/store`, `@ngrx/effects`)
4. App `core/` imports
5. App `shared/` imports
6. Environment imports (`src/environments/...`)
7. Relative path imports (`./`, `../`)

## State Management

- **Auth** lives in an NgRx **SignalStore** (`core/auth/store/auth.store.ts`), provided in root.
- **Article / profile** state lives in the classic **NgRx Store + Effects**.
- Don't introduce a third state library (no Akita, no NGXS, no plain `BehaviorSubject` services for shared state).
- Keep state minimal — derive what you can with `computed()` or selectors.
- Effects handle async work; reducers stay pure.

## HTTP & API

- Use Angular's `HttpClient` — never `fetch` directly.
- The `baseUrlInterceptor` prepends the API base URL from `src/environments/environments*.ts` — write requests with relative paths (`/articles`), not absolute URLs.
- The `tokenInterceptor` attaches the JWT — don't manually attach `Authorization` headers in services.
- Type all API responses with an interface from `src/app/shared/models/`.

## Styling (SCSS)

- SCSS for all component styles — no Tailwind, no CSS-in-JS.
- Component styles are scoped by Angular's view encapsulation — don't reach into other components with global selectors.
- Mobile-first responsive styles.
- No inline `style="..."` attributes in templates; use class bindings instead.

## Error Handling and Validation

- Handle errors in services and surface user-friendly messages in components.
- Use Angular Reactive Forms (`FormGroup`, `FormControl`, `Validators`) for forms; add custom validators when the built-ins don't cover the case.
- Display API errors next to the relevant field or as a toast — never leave a failed action silent.

## Testing

- **Karma + Jasmine** — `npm test`.
- **Scope:** services, NgRx stores / signal stores, guards, HTTP interceptors, and pure utilities.
- **Out of scope:** component templates and visual rendering. Don't mount components purely to assert on the DOM.
- Co-locate tests: `home.ts` → `home.spec.ts`.
- Use `TestBed` to configure providers; mock `HttpClient` with `HttpTestingController` from `@angular/common/http/testing`.
- Never hit the real API — stub services or use `HttpTestingController.expectOne(...)`.
- Tests must be deterministic — no network, no real timers (use `fakeAsync` / `tick` if needed).
- Follow the **Arrange-Act-Assert** pattern.

## Performance

- Always provide `track` on `@for` blocks (the compiler will error otherwise — don't suppress it).
- Use **pure pipes** for derived display values; avoid heavy logic in templates.
- Don't manipulate the DOM directly — use bindings, structural directives, and `Renderer2` if absolutely necessary.
- Defer non-essential views with `@defer`.
- Use `signal()` + `computed()` to reduce unnecessary recomputation.
- Use `NgOptimizedImage` for known-size images.
- Focus on Web Vitals: **LCP**, **INP**, **CLS**.

## Security

- Rely on Angular's built-in template sanitization — **don't use `[innerHTML]`** with user-supplied content. If you must render user HTML, sanitize it explicitly through `DomSanitizer`.
- Don't bypass sanitization (`bypassSecurityTrust*`) without a comment explaining why it's safe.
- Never log JWTs or passwords.
- Auth guards (`authGuard`) protect editor / profile / profile-editor routes — don't add new authenticated routes without one.

## Linting & Formatting

- ESLint + angular-eslint + Prettier integration.
- `npm run lint` / `npm run lint:fix` and `npm run prettier:check` / `npm run prettier:format`.
- Husky + lint-staged runs Prettier and ESLint on staged `.ts`, `.js`, `.html` files pre-commit — don't bypass with `--no-verify`.

## Code Quality

- No commented-out code.
- No unused imports or variables — ESLint will flag them.
- Keep functions under ~50 lines; split when responsibilities grow.
- Reuse `shared/` components and services before adding new ones.

## Reference

- [Angular docs](https://angular.dev/) — components, signals, control flow, `inject`, deferrable views.
- [NgRx docs](https://ngrx.io/) — SignalStore, Store, Effects.
- Project context: `@context/project-overview.md`, `@context/ai-interaction.md`, `@context/current-feature.md`.
