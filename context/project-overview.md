## Yolde Project Specifications

## Problem (Core Idea)

Small dev teams overpay for issue tracking they barely use:

- Tasks scattered across Notion, Slack, and sticky notes
- Bugs filed in DMs and lost
- GitHub Issues has no real board, no priorities, no roadmap
- Trello has no structure, no estimates, no sprints
- Linear and Jira are heavy and expensive for a 3-person team
- No single place to see "what is everyone doing right now"

**Yolde gives small dev teams ONE fast, opinionated, real-time Kanban board** for issues, sprints, and team context — without the Jira tax.

## Users

- **Indie dev / solo founder**:
  Personal board to organize work-in-progress across side projects.

- **Early-stage startup (2-5 devs)**:
  Replaces Trello + Notion tasks with one real-time board the whole team lives in.

- **OSS maintainer**:
  Public-readable board so contributors can see roadmap and grab issues.

- **Designer-dev pair**:
  Shared Kanban with handoff comments, attachments, and status.

## Features

Here is a list of features for Yolde.

A. **Issues / Issue Types**

Issues are the core unit. Each belongs to exactly one project. Users can create custom types later, but we start with system types that cannot be deleted:

- bug
- feature
- task
- chore
- spike _(pro)_

URLs look like `/projects/:slug/board` and `/projects/:slug/issues/:issueSlug`. Issues open in a slide-over drawer — fast access without leaving the board.

B. **Projects (workspaces)**

A project is the multi-tenant unit. Each project has its own members, issues, labels, and settings.

- Slug-based URL (`/projects/acme-app/board`)
- An issue belongs to exactly one project
- Move issue between projects _(pro)_
- Project switcher in the sidebar

Some examples:

- Web App (features, bugs, chores)
- Marketing Site (tasks, chores)
- Internal Tooling (spikes, features)

C. **Board (Kanban)**

The headline view:

- Drag-and-drop across status columns
- Real-time updates between members (WebSocket / SSE)
- Optimistic reordering — the card moves instantly, rolls back on error
- Filter by assignee, label, priority, or type
- Inline create at the top of any column

D. **Comments**

- Markdown comments on issues
- @mentions _(pro)_
- Threaded replies _(pro)_

E. **Members & Roles**

| Role       | Read | Comment | Move issues | Manage members | Manage billing |
| ---------- | ---- | ------- | ----------- | -------------- | -------------- |
| **Owner**  | yes  | yes     | yes         | yes            | yes            |
| **Admin**  | yes  | yes     | yes         | yes            | no             |
| **Editor** | yes  | yes     | yes         | no             | no             |
| **Viewer** | yes  | yes     | no          | no             | no             |

Invite by email; invite links expire after 7 days.

F. **Authentication**

- Email / password (already wired up in `yolde-api`)
- JWT-based, `Authorization: Token <jwt>`
- GitHub OAuth _(pro, later)_

G. **Other Features**

- Issue favorites (star)
- Pin issue to top of column
- Recently viewed issues
- Markdown editor for descriptions and comments
- Keyboard shortcuts (J/K navigate, C create, E edit, / search, Cmd+K palette)
- Dark mode (default)
- Import issues from CSV
- Export project as JSON or CSV _(pro)_
- Activity log per issue _(pro)_

H. **AI Features (Pro only)**

- AI auto-label suggestions
- AI issue summary
- AI duplicate detection (semantic similarity)
- AI standup generator ("what did this team ship yesterday")

## Data

This is a rough mockup of the data model. Bold entities are **new**; the rest extend or rename what already exists in `yolde-api`.

**USER** (extends current `UserEntity`)

- id, username, email, bio, image, password (bcrypt)
- isPro (for paid users)
- stripeCustomerId (for payments)
- stripeSubscriptionId (for subscription management)
- _fields for issues authored, issues assigned, projects, comments_

**PROJECT** _(new)_

- id
- slug (used in URLs, unique)
- name
- description
- color (accent for sidebar / cards)
- isFavorite
- createdAt, updatedAt
- _fields for owner (User), members (via ProjectMember), issues, labels_

**PROJECTMEMBER** _(new join table)_

- projectId
- userId
- role (owner | admin | editor | viewer)
- joinedAt

**ISSUE** (rename of current `ArticleEntity`)

- id
- slug (unique per project)
- title
- description (Markdown)
- status (backlog | todo | in_progress | in_review | done)
- priority (urgent | high | medium | low)
- order (int, board position within column)
- isPinned
- estimate (story points, optional)
- dueDate (optional)
- viewCount
- createdAt, updatedAt
- _fields for reporter (User, required), assignee (User, nullable), project (Project, required), issueType, labels (via IssueLabel), comments_

**ISSUETYPE**

- id
- name (bug | feature | task | chore | spike)
- icon (Lucide icon name)
- color (hex)
- isSystem (system types cannot be deleted)
- _fields for project (null for system types), issues_

**LABEL** (rename of current `TagEntity`)

- id
- name
- color
- _fields for project, issues (via IssueLabel)_

**ISSUELABEL** _(join table)_

- issueId
- labelId

**COMMENT** (already exists, FK retargeted)

- id
- body (Markdown)
- parentId (for threaded replies, nullable, _pro_)
- createdAt, updatedAt
- _fields for issue (was article), author (User)_

**ACTIVITY** _(new, pro)_

- id
- type (created | status_changed | assigned | commented | label_added | label_removed)
- payload (jsonb — before/after values)
- createdAt
- _fields for issue, actor (User)_

## Tech Stack

Reuse the existing `yolde-app` (Angular) and `yolde-api` (NestJS) repos. No framework swaps.

### Frontend (`yolde-app`)

| Layer               | Technology                                                        |
| ------------------- | ----------------------------------------------------------------- |
| Framework           | Angular 21 — standalone components, **zoneless** change detection |
| State (global)      | `@ngrx/signals` (`signalStore`) — `WorkspaceStore`, `BoardStore`  |
| State (HTTP reads)  | `httpResource()` with signal-driven URLs                          |
| State (HTTP writes) | `HttpClient` + RxJS, with `tap` into the relevant store           |
| Forms               | Reactive Forms                                                    |
| Drag-and-drop       | `@angular/cdk/drag-drop`                                          |
| Overlay / drawer    | `@angular/cdk/overlay`                                            |
| Virtual scroll      | `@angular/cdk/scrolling`                                          |
| Icons               | Lucide Angular                                                    |
| Styling             | SCSS, optionally Tailwind v4                                      |
| Markdown            | `ngx-markdown` (description + comments)                           |
| Realtime            | Server-Sent Events → `toSignal()` for board patches               |
| Routing             | Lazy routes via `loadComponent`, route guards via `authGuard`     |

#### Signal stores

```
core/
  auth/store/        → existing authStore (current user, JWT)
  workspace/store/   → activeProject, members, role
features/
  board/store/       → issues grouped by status, optimistic moves
  editor/store/      → draft issue, autosave, dirty tracking
```

### Backend (`yolde-api`)

| Layer        | Technology                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Framework    | NestJS 10                                                                 |
| ORM          | TypeORM 0.3                                                               |
| Database     | PostgreSQL (Railway) -> later Neon PostgreSQL                             |
| Auth         | JWT (jsonwebtoken) + bcryptjs -> later Next-Auth v5 (email + GitHub OAth) |
| Validation   | class-validator + class-transformer                                       |
| Realtime     | NestJS Gateway (SSE first, WebSocket later)                               |
| File storage | Cloudflare R2 _(pro, for attachments)_                                    |

> IMPORTANT: never enable `synchronize: true`. All schema changes go through TypeORM migrations run in dev, then in prod.

### Payments

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Payments | Stripe (subscriptions)                          |
| Webhooks | Dedicated NestJS controller, signature-verified |

### AI _(Pro)_

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Model     | OpenAI `gpt-4o-mini`                                              |
| Usage     | Auto-label, issue summary, duplicate detection, standup generator |
| Streaming | SSE → signal-driven streaming text in the UI                      |

### Hosting

| Layer    | Where                                   |
| -------- | --------------------------------------- |
| Frontend | Vercel                                  |
| API      | Railway (already deployed)              |
| Database | Railway Postgres -> later Neon Postgres |

## Monetization

Freemium with a single Pro tier.

### Free

- 1 project
- 3 members per project
- 100 issues total
- System issue types only
- Email/password auth
- No AI features
- No export
- No activity log

### Pro — $9/month or $80/year

- Unlimited projects
- Unlimited members
- Unlimited issues
- Custom issue types
- AI features (auto-label, summary, duplicates, standup)
- @mentions + threaded comments
- Activity log per issue
- Export project (JSON / CSV)
- File attachments on issues (R2)
- Priority support

> Setup the foundation for Pro users, but during development all users have full Pro access.

## UI/UX

### General

- Modern, minimal, developer-focused
- Dark mode by default, light mode optional
- Clean typography, generous whitespace, monospace accents
- Subtle borders and shadows
- Reference: Linear, Height, Plane
- Syntax highlighting in code blocks (Shiki)
- Keyboard-first navigation

### Screenshots

Refer to the screenshots below as a base for the dashboard UI.
It is not have to be exact. Use it as a reference.

- @context/screenshots/dashboard-ui.png
- @context/screenshots/dashboard-ui-collapsed.png
- @context/screenshots/dashboard-ui-drawer.png

### Layout

- **Sidebar** (collapsible): project switcher at top, nav (Board, Issues, Members, Settings), then favorites
- **Main area**: Kanban board, columns color-coded by status, cards show priority dot + label chips + assignee avatar
- **Issue detail**: opens in a slide-over drawer (CDK Overlay) — never a full-page navigation, keeps the board behind it
- **Command palette**: `Cmd+K` global, fuzzy-jumps to any issue, project, or member

### Status Colors & Icons

- Backlog Color: #6b7280 (gray)
- Backlog Icon: Inbox
- Todo Color: #3b82f6 (blue)
- Todo Icon: Circle
- In Progress Color: #f97316 (orange)
- In Progress Icon: PlayCircle
- In Review Color: #8b5cf6 (purple)
- In Review Icon: GitPullRequest
- Done Color: #10b981 (emerald)
- Done Icon: CheckCircle2

### Priority Colors & Icons

- Urgent Color: #ef4444 (red)
- Urgent Icon: AlertOctagon
- High Color: #f97316 (orange)
- High Icon: ArrowUp
- Medium Color: #eab308 (yellow)
- Medium Icon: Equal
- Low Color: #64748b (slate)
- Low Icon: ArrowDown

### Issue Type Colors & Icons

- Bug Color: #ef4444 (red)
- Bug Icon: Bug
- Feature Color: #3b82f6 (blue)
- Feature Icon: Sparkles
- Task Color: #10b981 (emerald)
- Task Icon: CheckSquare
- Chore Color: #6b7280 (gray)
- Chore Icon: Wrench
- Spike Color: #8b5cf6 (purple)
- Spike Icon: FlaskConical

> Icons reference [Lucide](https://lucide.dev) via `lucide-angular`.

### Responsive

- Desktop-first
- Board becomes a vertical stack of columns on mobile (swipeable)
- Sidebar becomes a bottom sheet on mobile
- Drawer becomes a full-screen modal on mobile

### Micro-interactions

- Smooth drag-and-drop with ghost card and drop placeholder
- Optimistic status updates — card flips column instantly, rolls back on API error
- Skeleton loaders for board columns while issues load
- Toast notifications for save, assign, move, and copy-link actions
- Autosave indicator in the editor ("Saved 2s ago") driven by `effect()`
- Smooth sidebar collapse animation
- Keyboard hints inline on hover (e.g. "E to edit")
