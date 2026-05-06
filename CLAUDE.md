# Yolde

A blog article publishing platform.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

- **Dev server:** `npm start` (serves at http://localhost:4200)
- **Build:** `npm run build` (production by default, output in `dist/`)
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Format:** `npm run prettier:format` / `npm run prettier:check`
- **Tests:** `npm test` (Karma + Jasmine)
- **Generate component:** `npx ng generate component <path>`

## Architecture

Angular 21 application (zoneless, standalone components) with NgRx for state management. Backend API is hosted on Railway.

### Project Structure

- `src/app/core/` — Auth system (guards, interceptors, store, models) and layout components (nav, sidebar, footer, main)
- `src/app/features/` — Route-level feature components (home, article, article-editor, profile, signin, register, etc.)
- `src/app/shared/` — Reusable components (article-preview, pagination, loading-spinner, etc.), shared services (article, profile, tag), and model interfaces

### Key Patterns

- **Zoneless change detection** — uses `provideZonelessChangeDetection()`, no Zone.js
- **State management** — NgRx SignalStore for auth state (`authStore` with `signalStore`, provided in root); NgRx Store/Effects also configured
- **Lazy loading** — all feature routes use `loadComponent()` with dynamic imports
- **HTTP interceptors** — `baseUrlInterceptor` prepends API base URL; `tokenInterceptor` attaches auth tokens
- **Environment config** — `src/environments/environments.ts` (prod) and `environments.development.ts` (dev), swapped via file replacements in angular.json
- **Component naming** — components use short filenames without `.component` suffix (e.g., `home.ts`, `home.html`, `home.scss`)

### Conventions

- Component selector prefix: `app` (kebab-case for elements, camelCase for directives)
- Styles: SCSS
- Linting: ESLint with angular-eslint + Prettier integration
- Pre-commit: Husky + lint-staged (runs Prettier and ESLint on staged `.ts`, `.js`, `.html` files)
