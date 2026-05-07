# ✍️ Yolde — Project Overview

> **Write. Share. Discover.**
> A blog article publishing platform where developers and creators share long-form writing, follow each other, and build a reading feed they actually care about.

---

## 📌 The Problem

Most "publishing" today is fragmented and noisy:

| Where it lives        | What it costs you                                     |
| --------------------- | ----------------------------------------------------- |
| Personal Medium posts | Paywalls, algorithm-driven feeds                      |
| Dev.to / Hashnode     | Good, but tied to a single brand and editor           |
| Random Markdown blogs | No comments, no profiles, no community                |
| Twitter / LinkedIn    | Short-form, throwaway, no archive                     |
| Self-hosted blogs     | Heavy to maintain, no built-in discovery              |

**Result:** writers re-publish across platforms, readers can't follow people they like, and there's no single, simple home for article + author + conversation.

**Yolde** is a focused, opinionated publishing app — **articles, tags, profiles, favorites, and comments** — built on a clean Angular + NestJS stack so the codebase stays simple to read, extend, and teach.

---

## 👥 Target Users

| Persona                       | Core Need                                                  |
| ----------------------------- | ---------------------------------------------------------- |
| ✍️ Writer / Blogger           | A clean editor and a reliable place to publish articles    |
| 📚 Reader                     | A personalized feed with tag filters and favoriting        |
| 🧑‍💻 Developer                  | A reference full-stack app to learn Angular + NestJS from  |
| 🎓 Course Student / Educator  | A real, runnable codebase for teaching modern Angular      |

---

## ✨ Core Features

### A) Articles

The core unit of Yolde. Every article has:

| Field            | Description                                  |
| ---------------- | -------------------------------------------- |
| `title`          | Article headline                             |
| `slug`           | URL-friendly identifier (auto-generated)     |
| `description`    | Short summary shown in feeds and previews    |
| `body`           | Long-form content (Markdown)                 |
| `tagList`        | Free-form tags for discovery                 |
| `author`         | The user who wrote it                        |
| `favoritesCount` | How many readers have favorited it           |
| `createdAt` / `updatedAt` | Timestamps                          |

### B) Feeds

Two main reading surfaces:

- **Global feed** — every published article, newest first
- **Personal feed** — articles from authors the user follows _(planned)_
- **Tag-filtered feed** — click a tag, get the matching articles

### C) Comments

Threaded-but-flat comments under each article. Cascade-delete with the parent article.

### D) Profiles

Each user has a public profile with:

- Username, bio, avatar image
- Their published articles
- Their favorited articles
- Edit-your-own-profile flow

### E) Authentication

- **Email + password** (bcrypt-hashed at the entity level)
- **JWT** issued on signin / register, attached via HTTP interceptor
- Auth-guarded routes for editor, profile, and profile-editor screens

### F) Additional Features

- ⭐ Favorite / unfavorite articles
- 🏷️ Tag list on the home page
- 📝 Markdown article editor (create + edit)
- 📄 Pagination on feeds
- 🔄 Loading states and error UI

### G) Future / Stretch

| Feature             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| 👥 Follow authors   | Personal feed driven by who you follow                 |
| 🔔 Notifications    | New comments, new articles from followed authors       |
| 🔍 Search           | Full-text search across articles and authors           |
| 🤖 AI helpers       | Title suggestions, tag suggestions, summary generation |
| 📤 Export           | Download your articles as Markdown / JSON              |

---

## 🗄️ Data Model

> Backed by TypeORM entities in `yolde-api`. This is the current shape — it will evolve.

```ts
// users
UserEntity {
  id: number              // PK
  email: string
  username: string
  bio: string             // default ''
  image: string           // avatar URL, default ''
  password: string        // bcrypt-hashed, select: false
  articles: ArticleEntity[]      // OneToMany
  favorites: ArticleEntity[]     // ManyToMany (join table)
}

// articles
ArticleEntity {
  id: number              // PK
  slug: string            // URL-friendly
  title: string
  description: string     // default ''
  body: string            // default ''
  tagList: string[]       // simple-array column
  favoritesCount: number  // default 0
  createdAt: Date
  updatedAt: Date         // bumped via @BeforeUpdate
  author: UserEntity      // ManyToOne, eager
  comments: CommentEntity[]      // OneToMany
}

// comments
CommentEntity {
  id: number              // PK
  body: string
  createdAt: Date
  updatedAt: Date
  article: ArticleEntity  // ManyToOne, onDelete CASCADE
  author: UserEntity      // ManyToOne, eager
}
```

---

## 🧱 Tech Stack

### Frontend — `yolde-app`

| Category              | Choice                                          | Notes                                          |
| --------------------- | ----------------------------------------------- | ---------------------------------------------- |
| Framework             | [Angular 21](https://angular.dev/)              | Standalone components, **zoneless** CD         |
| Language              | TypeScript (strict)                             |                                                |
| State management      | [NgRx SignalStore](https://ngrx.io/) + Store/Effects | `authStore` for session, classic store wired in |
| Routing               | Angular Router                                  | All feature routes use `loadComponent()`       |
| HTTP                  | `HttpClient` + interceptors                     | `baseUrlInterceptor`, `tokenInterceptor`       |
| Styling               | SCSS                                            |                                                |
| Tooling               | ESLint + Prettier + Husky + lint-staged         | Pre-commit format & lint                       |
| Tests                 | Vitest                                          | Run via `@angular/build:unit-test`; services / utilities only |

### Backend — `yolde-api`

| Category    | Choice                                         | Notes                            |
| ----------- | ---------------------------------------------- | -------------------------------- |
| Framework   | [NestJS 10](https://nestjs.com/)               | Modular, decorator-based         |
| Language    | TypeScript                                     |                                  |
| Database    | PostgreSQL via [TypeORM](https://typeorm.io/)  | Migrations + seeds               |
| Auth        | JWT (`jsonwebtoken`) + `bcryptjs`              | Hashed in `@BeforeInsert`        |
| Validation  | `class-validator` + `class-transformer`        | DTO-driven                       |
| Slugs       | `slugify`                                      | Article URL slugs                |
| Hosting     | [Railway](https://railway.app/)                | Postgres + Node service          |
| Tests       | Jest + Supertest                               |                                  |

---

## 🔌 API Architecture

```
┌──────────────┐        ┌──────────────────┐        ┌────────────────┐
│ Angular App  │◄──────►│  NestJS API      │◄──────►│  PostgreSQL    │
│ (yolde-app)  │  HTTP  │  (yolde-api)     │ TypeORM│  (Railway)     │
└──────────────┘        │                  │        └────────────────┘
                        │  /user           │
                        │  /article        │
                        │  /article/:slug  │
                        │  /comment        │
                        │  /profile        │
                        │  /tag            │
                        └──────────────────┘
```

The Angular app talks to the API through a `baseUrlInterceptor` that prepends the base URL from `src/environments/environments*.ts`, and a `tokenInterceptor` that attaches the JWT on authenticated requests.

---

## 🔐 Auth Flow

```
User
 │
 ▼
Register / Signin form
 │
 ▼
POST /users (or /users/login)  ──► NestJS validates ──► bcrypt + JWT
 │
 ▼
JWT stored client-side
 │
 ▼
authStore (NgRx SignalStore) — current user state
 │
 ▼
tokenInterceptor attaches JWT on every API call
 │
 ▼
authGuard protects /article/new, /article/:slug/edit, /profile/...
```

---

## 🎨 UI / UX

**Design philosophy:** clean, content-first, reader-friendly. Long-form articles deserve typography and whitespace, not chrome.

### Layout

- **Top nav** — logo, feed link, "New Article", profile / signin
- **Home** — global feed + popular tags sidebar
- **Article page** — title, body, tags, comments thread, favorite button
- **Editor** — title / description / body / tag-list inputs
- **Profile** — author info + tabs for "My Articles" and "Favorited Articles"

### Responsive

- Mobile-first feed and article reading
- Sidebar (tags) collapses below the feed on small screens

---

## 🗂️ Repository Layout

```
yolde/
├── yolde-app/                  # Angular 21 frontend
│   ├── src/app/
│   │   ├── core/               # Auth (guards, interceptors, store, models), layout
│   │   ├── features/           # Route-level screens
│   │   │   ├── home/
│   │   │   ├── article/
│   │   │   ├── article-editor/
│   │   │   ├── comments/
│   │   │   ├── feed/
│   │   │   ├── intro/
│   │   │   ├── profile/
│   │   │   ├── profile-editor/
│   │   │   ├── register/
│   │   │   └── signin/
│   │   └── shared/             # Reusable components, services, models
│   ├── context/                # AI / docs context (this folder)
│   └── CLAUDE.md
│
└── yolde-api/                  # NestJS 10 backend
    └── src/
        ├── article/            # controller, service, entity, dto
        ├── comment/
        ├── user/               # + decorators, guards, middlewares
        ├── profile/
        ├── tag/
        ├── shared/
        ├── migrations/
        └── seeds/
```

---

## 🛠️ Development Workflow

### Running locally

```bash
# Frontend
cd yolde-app
npm start                 # http://localhost:4200

# Backend
cd yolde-api
npm start                 # nodemon

# DB ops (yolde-api)
npm run db:create         # generate migration
npm run db:migrate        # run migrations
npm run db:seed           # seed data
```

### Conventions

- **Component file naming** — short, no `.component` suffix (e.g. `home.ts`, `home.html`, `home.scss`)
- **Selectors** — `app` prefix, kebab-case for elements
- **Lazy loading** — every feature route uses `loadComponent()` with a dynamic import
- **State** — auth lives in an NgRx SignalStore provided in root; article/profile state lives in the classic NgRx Store
- **Pre-commit** — Husky + lint-staged runs Prettier and ESLint on staged `.ts`, `.js`, `.html`

---

## 🧭 Roadmap

### Phase 1 — Core MVP _(in progress)_

- [x] Auth (register, signin, JWT, guards, interceptors)
- [x] Articles CRUD (create, read, update, delete)
- [x] Comments on articles
- [x] Profiles (view, edit)
- [x] Tags + tag-filtered feed
- [x] Favorite / unfavorite articles
- [ ] Polished loading / error states across all feeds

### Phase 2 — Community

- [ ] Follow / unfollow authors
- [ ] Personal feed (followed authors only)
- [ ] Notifications (new comments, new articles from follows)
- [ ] Full-text search (articles + authors)

### Phase 3 — Quality of life & AI

- [ ] AI title / tag / summary suggestions in the editor
- [ ] Markdown preview side-by-side in the editor
- [ ] Export your articles (Markdown / JSON)
- [ ] Public RSS feed per author

---

## 📌 Status

🟢 **Active development** — core publishing loop (auth + articles + comments + profiles) is functional. Polish and community features are next.

---

_Yolde — Write. Share. Discover._
