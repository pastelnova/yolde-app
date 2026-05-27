# Coding Standards

Standards apply to both `yolde-app` (Angular SPA) and `yolde-api` (NestJS) unless noted.

## Principles

- Provide clear, precise examples; favor composition over inheritance.
- Apply immutability and pure functions where applicable.
- Use meaningful names (`isActive`, `hasPermission`, `assignedIssues`).
- Prefer named exports for components, services, utilities — no default exports.
- Small, focused units. Keep functions under ~50 lines where reasonable.
- No commented-out code. No unused imports or variables.

## TypeScript

- Strict mode enabled. `strict: true` in both repos.
- No `any`. Use `unknown` at boundaries, then narrow.
- Define interfaces for props, API responses, DTOs, and data models.
- Use type inference where obvious, explicit types where helpful (function return types, exported APIs).
- Organize file contents top-to-bottom: imports → type/interface declarations → implementation.
- Use optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks.
- Template strings over concatenation; single quotes for plain strings.
- `const` by default; `let` only when reassignment is required. No `var`.

## Angular (`yolde-app`)

### Components

- **Standalone components only.** No `NgModule` for new code.
- **Zoneless change detection** is on. Do not write code that assumes Zone.js scheduling (no `setTimeout` to force a tick, no `NgZone.run`).
- Component selector: `app-` prefix, kebab-case element (`app-issue-card`). Enforced by ESLint.
- Directive selector: `app` prefix, camelCase attribute (`[appCan]`). Enforced by ESLint.
- Component styles: SCSS, scoped (Angular default).
- Use `ChangeDetectionStrategy.OnPush` by default.
- Inputs/outputs: prefer the new signal-based API (`input()`, `model()`, `output()`).

### State

- **Signals first.** Use `signal()`, `computed()`, `linkedSignal()`, `effect()` for component- and service-local state.
- **Global state**: `@ngrx/signals` (`signalStore`). Examples: `AuthStore`, `WorkspaceStore`, `BoardStore`.
- Classic `@ngrx/store` + `@ngrx/effects` are wired up but currently unused — don't introduce reducers unless there's a clear reason `signalStore` can't cover it.
- Pagination, filters, and other "query state" live on the **service** as signals, not duplicated in components. Components inject the service and bind to its signals directly.

### HTTP

Two patterns, chosen by intent:

- **Reads** → `httpResource<T>(() => urlOrUndefined, { parse? })`. The URL is a signal expression; return `undefined` to disable the fetch. Components read `.value()`, `.status()`, `.isLoading()`, `.error()`.
- **Writes / one-shot reads** → `HttpClient` + RxJS `Observable`, with `tap` to update the relevant store.

URLs in services are **relative** (`/issues`, `/projects/:slug`). The `baseUrlInterceptor` prefixes the host. Never hardcode `https://yolde-api...`.

### Dependency injection

- Use the `inject()` function inside class fields, not constructor parameters:

  ```ts
  export class IssueService {
    private http = inject(HttpClient);
    private auth = inject(AuthStore);
  }
  ```

- One responsibility per service. Singleton scope (`providedIn: 'root'`) unless there's a reason to scope it narrower.

### Templates

- Use the new control flow: `@if`, `@for`, `@switch`, `@defer`. No `*ngIf` / `*ngFor` in new code.
- `@for` always has a `track` expression — by ID where possible.
- Use the `async` pipe for observables in templates. Do not manually subscribe in components.
- `@defer` non-critical views (below-the-fold sections, heavy charts).
- Semantic HTML (`button`, `nav`, `main`, `section`) — never a clickable `div`.
- ARIA labels on icon-only buttons; `sr-only` text where needed.
- Use `NgOptimizedImage` for any non-trivial image (avatars, cover images).

### Routing

- All routes lazy via `loadComponent` in `app.routes.ts`.
- Protected routes use `canActivate: [authGuard]`. Workspace-scoped routes use `canActivate: [workspaceGuard]` (resolves active project from the URL).
- Route params are read as signals via `toSignal(route.paramMap)` or `injectParams`.

### Forms

- Reactive Forms only (`FormGroup`, `FormControl`). No template-driven forms.
- Validators co-located with the form; reuse via factory functions, not classes.
- Display validation messages from a shared `<app-form-error>` component, not inline.

## NestJS (`yolde-api`)

- Thin controllers, fat services. Controllers handle HTTP concerns; business logic lives in services.
- DTOs always validated with `class-validator` + `class-transformer`. Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`.
- One module per feature folder (`issue/`, `project/`, `comment/`).
- Guards for authz (`AuthGuard`, `RoleGuard`); never check roles inline in a controller.
- Use TypeORM entities with explicit column types where the default is ambiguous (`@Column({ type: 'jsonb' })`).
- **Never enable `synchronize: true`.** All schema changes go through migrations (`npm run db:create`, `npm run db:migrate`).
- Repositories: prefer the entity manager / repository directly in services. Custom repository classes only when justified.

## Styling — Tailwind v4

**CRITICAL: We use Tailwind CSS v4. Configuration is CSS-based, not JS.**

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` (those are v3).
- All theme configuration lives in `src/styles.scss` (or `src/app/styles/theme.css`) using the `@theme` directive.
- Use CSS custom properties for design tokens.

Example:

```css
@import 'tailwindcss';

@theme {
  --color-surface: oklch(98% 0 0);
  --color-surface-dark: oklch(15% 0 240);
  --color-status-backlog: #6b7280;
  --color-status-todo: #3b82f6;
  --color-status-in-progress: #f97316;
  --color-status-in-review: #8b5cf6;
  --color-status-done: #10b981;
}
```

### v3 → v4 pitfalls (do not write)

| ❌ v3 | ✅ v4 |
|---|---|
| `bg-opacity-50`, `text-opacity-50` | `bg-black/50`, `text-white/80` |
| `shadow-sm` (where small was meant) | `shadow-xs` |
| `rounded-sm` (where small was meant) | `rounded-xs` |
| `outline-none` | `outline-hidden` |
| `flex-grow`, `flex-shrink` | `grow`, `shrink` |
| `transform scale-95` | `scale-95` (no `transform` prefix) |
| `!font-bold` | `font-bold!` |
| `[--my-var:red]` | `(--my-var:red)` |
| `border` (bare, no color) | `border border-zinc-200` |
| `ring` (bare, no width/color) | `ring-2 ring-blue-500` |
| `overflow-ellipsis` | `text-ellipsis` |

### Tailwind usage rules

- Use the project's theme tokens (`bg-status-todo`, `text-muted`) over raw colors where defined.
- Dark mode variants included where the contrast differs (`dark:bg-surface-dark`).
- Use `gap-*` with flex/grid over `space-*` / `divide-*` where practical.
- No dynamic class name construction via string interpolation (Tailwind can't see them). Use full class names in conditional branches.
- Mobile-first: `sm:`, `md:`, `lg:` add styles, never undo mobile styles.
- No inline styles unless the value is genuinely dynamic (e.g. `[style.background-color]="label.color"`).

## Component primitives — spartan-ng

- Reach for spartan-ng (`@spartan-ng/ui-*`) for dialogs, popovers, menus, command palette, toasts, tooltips.
- Copy/customize the styled wrappers (`ui-*-helm`); don't import unstyled brain components directly into features.
- For drag-and-drop, overlay, scrolling, focus-trap → use Angular CDK, not spartan-ng.
- Icons via `lucide-angular`. Always tree-shake by importing icons by name.

## File & Naming Conventions

### Files

| Type | Suffix | Example |
|---|---|---|
| Component | `.ts` / `.html` / `.scss` (no suffix on type name) | `issue-card.ts` |
| Service | `.service.ts` | `issue.service.ts` |
| Store | `.store.ts` | `board.store.ts` |
| Directive | `.directive.ts` | `can.directive.ts` |
| Pipe | `.pipe.ts` | `time-ago.pipe.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Interceptor | `.interceptor.ts` | `token.interceptor.ts` |
| Interface | `.interface.ts` | `issue.interface.ts` |
| Test | `.spec.ts` | `issue-card.spec.ts` |

All filenames in **kebab-case**. (The current project drops the `.component` suffix; keep that convention.)

### Symbols

- Components / Classes / Types / Interfaces: `PascalCase`. No `I` prefix on interfaces.
- Functions / variables / signals: `camelCase`.
- Constants: `SCREAMING_SNAKE_CASE`.

### Folder layout (Angular)

- `src/app/core/` — cross-cutting infrastructure (`auth/`, `layout/`).
- `src/app/features/` — one folder per route-level screen (`board`, `issue`, `issue-editor`, `projects-list`, etc.).
- `src/app/shared/` — `components/`, `services/`, `models/`, `directives/`, `pipes/`.

### Folder layout (NestJS)

- `src/<feature>/` — `*.controller.ts`, `*.service.ts`, `*.module.ts`, `*.entity.ts`, `dto/`, `types/`.
- `src/shared/` — pipes, filters, decorators, guards used across features.
- `src/migrations/` — TypeORM migrations only.

## Import Order

1. Angular core and common (`@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`)
2. RxJS (`rxjs`, `rxjs/operators`)
3. Other third-party (`@ngrx/signals`, `lucide-angular`, `@spartan-ng/...`)
4. Application core (`@core/...`)
5. Shared (`@shared/...`)
6. Environment (`environments/...`)
7. Relative path imports (`./...`, `../...`)

## Error Handling

- Services throw typed errors; the shared `ErrorService` (or a global error interceptor) converts them into user-facing toasts.
- HTTP errors: handle in the writing service (`tap`/`catchError`), don't push generic try/catch into components.
- `httpResource` errors are read via `.error()` and rendered inline (skeleton → error state → retry button).
- Backend: throw `HttpException` subclasses (`BadRequestException`, `NotFoundException`). Never return `{ ok: false, ... }` payloads — use status codes.

## Forms & Validation

- Frontend: Reactive Forms with validators. Custom validators are pure functions.
- Backend: DTOs with `class-validator` decorators; reject unknown fields.
- Validate at the boundary (controller layer); trust internal callers.

## Testing

- Frontend: Karma + Jasmine (existing setup).
- Backend: Jest (existing setup).
- Follow **Arrange-Act-Assert**:

  ```ts
  it('marks issue as done when status changes', () => {
    // arrange
    const store = TestBed.inject(BoardStore);
    // act
    store.setStatus(1, 'done');
    // assert
    expect(store.issueById(1)().status).toBe('done');
  });
  ```

- One behavior per test. Test public API, not implementation details.
- Mock at the HTTP boundary (`HttpTestingController`), not at the service-method level, where possible.

## Performance

- `@for` always uses `track` (by ID).
- Signals for state — avoid `BehaviorSubject` for new code.
- Pure pipes for expensive computations the template uses repeatedly.
- `@defer` heavy / below-the-fold blocks.
- `NgOptimizedImage` for raster images.
- Virtual scroll (`@angular/cdk/scrolling`) for any list expected to exceed ~100 rows.
- Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Security

- Never use `innerHTML`. Render user content via the Angular template + Markdown pipe (which sanitizes).
- Use Angular's built-in sanitization; never bypass it (`bypassSecurityTrustHtml`) without a `<SECURITY_REVIEW>`-quality justification.
- Backend: parameterized queries only (TypeORM does this by default — don't construct raw SQL strings).
- Validate all inbound data with DTOs; reject extra fields.
- JWT secrets and DB credentials from env vars only; never committed.
- CORS: explicit allowed origins, no `*`.

## Accessibility

- Every interactive element has visible focus (`focus-visible:` Tailwind utilities).
- Buttons get `cursor-pointer` and a real `<button>` element.
- Icon-only buttons include `aria-label` or `sr-only` text.
- Form inputs have associated `<label>` elements (or `aria-labelledby`).
- Color contrast meets WCAG AA — never rely on opacity alone for text.
- Keyboard-navigable: every flow that works with the mouse must work with the keyboard.

## Database & Migrations (`yolde-api`)

- TypeORM migrations only. Never `synchronize: true`. Never `db:drop` in shared environments.
- Generate migrations from entity diffs: `npm run db:create -- src/migrations/<name>`.
- Always review the generated SQL before committing — TypeORM occasionally emits destructive `DROP COLUMN` statements for renames.
- Seeds live under `src/seeds/` and run via `npm run db:seed`.

## Tooling

- **Prettier**: 120 print width, single quotes, trailing commas, 2-space tabs, semicolons. Config in repo root.
- **ESLint**: enforced selectors, no unused vars, Angular template a11y rules. Run `npm run lint`.
- **Husky + lint-staged**: prettier + ESLint on staged `.ts` / `.js` / `.html` on commit. Don't `--no-verify`.
- Commit messages: short imperative subject ("Add board drag-drop", "Fix optimistic rollback"). No conventional-commit prefix required.
