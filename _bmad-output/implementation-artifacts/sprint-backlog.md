# Sprint 1 Backlog

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 1 |
| **Sprint Goal** | Establish project foundation and deliver core task capture functionality |
| **Start Date** | March 5, 2026 |
| **End Date** | March 19, 2026 |
| **Duration** | 2 weeks |
| **Story Points** | 29 |

## Sprint Goal Statement

> Deliver a working todo application where users can add tasks and see them in a list. The development environment is fully configured with frontend, backend, and database all communicating properly.

---

## Sprint Backlog

### Epic 1: Project Foundation

#### S1-001: Initialize Monorepo Structure
**Story Reference:** Epic 1, Story 1.1  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Done ✅

**As a** developer,  
**I want** a monorepo with frontend and backend workspaces configured,  
**So that** I can develop both applications in a unified codebase.

**Acceptance Criteria:**
- [x] Root `package.json` with npm workspaces configured
- [x] `frontend/` directory with `package.json`
- [x] `backend/` directory with `package.json`
- [x] `shared/` directory for shared types
- [x] `.gitignore` for Node.js, TypeScript, SQLite, env files
- [x] Running `npm install` from root installs all workspace dependencies

**Technical Notes:**
- Use npm workspaces (not yarn or pnpm)
- Structure: `frontend/`, `backend/`, `shared/`

---

#### S1-002: Configure Backend with Express & TypeScript
**Story Reference:** Epic 1, Story 1.2  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-001

**As a** developer,  
**I want** an Express server with TypeScript configured,  
**So that** I can build type-safe API endpoints.

**Acceptance Criteria:**
- [x] `backend/src/index.ts` entry point starting Express on port 3000
- [x] `backend/tsconfig.json` extending root config
- [x] TypeScript compilation with `tsx` for development
- [x] `npm run dev` in backend starts the server with hot reload
- [x] Visiting `http://localhost:3000/api/health` returns `{ "status": "ok" }`

**Technical Notes:**
- Use Express 4.x
- Use `ts-node-dev` for hot reload
- Health check endpoint required for production readiness

---

#### S1-003: Configure SQLite Database with Drizzle ORM
**Story Reference:** Epic 1, Story 1.3  
**Points:** 5  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-002

**As a** developer,  
**I want** SQLite database with Drizzle ORM configured,  
**So that** I can persist data with type-safe queries.

**Acceptance Criteria:**
- [x] `backend/src/db/schema.ts` with `todos` table (id, text, completed, createdAt)
- [x] `backend/src/db/index.ts` with database connection
- [x] `backend/data/` directory for SQLite database file
- [x] Drizzle config for migrations (`drizzle.config.ts`)
- [x] Running `npm run db:migrate` creates the `todos` table
- [x] Running `npm run db:studio` opens Drizzle Studio

**Technical Notes:**
- Use SQLite3 with better-sqlite3 driver
- UUID for id field, ISO timestamp for createdAt
- Database file at `backend/data/todos.db`

---

#### S1-004: Configure Frontend with React, Vite & TypeScript
**Story Reference:** Epic 1, Story 1.4  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-001

**As a** developer,  
**I want** a React SPA with Vite and TypeScript configured,  
**So that** I can build the user interface with fast HMR.

**Acceptance Criteria:**
- [x] `frontend/src/main.tsx` entry point
- [x] `frontend/src/App.tsx` with basic component
- [x] `frontend/vite.config.ts` with API proxy to port 3000
- [x] `frontend/tsconfig.json` extending root config
- [x] CSS Modules enabled (`*.module.css`)
- [x] Running `npm run dev` in frontend starts Vite on port 5173
- [x] API calls to `/api/*` are proxied to backend

**Technical Notes:**
- React 18.x with Vite 5.x
- Configure proxy for `/api` routes to `http://localhost:3000`

---

#### S1-005: Configure React Query & Global Styles
**Story Reference:** Epic 1, Story 1.5  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-004

**As a** developer,  
**I want** React Query configured with global CSS variables,  
**So that** I can manage server state and maintain consistent styling.

**Acceptance Criteria:**
- [x] `QueryClientProvider` wrapping the App
- [x] `frontend/src/styles/variables.css` with CSS custom properties
- [x] `frontend/src/styles/global.css` with CSS reset and base styles
- [x] Responsive container styles (600px max-width centered)
- [x] CSS variables are available in all components
- [x] The app displays correctly at mobile and desktop widths

**Technical Notes:**
- TanStack Query v5
- CSS variables per architecture spec (colors, spacing, typography)
- Mobile: 100% width with 16px padding; Desktop: 600px centered

---

#### S1-006: Configure Root Scripts & Shared Types
**Story Reference:** Epic 1, Story 1.6  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-002, S1-004

**As a** developer,  
**I want** root workspace scripts and shared types configured,  
**So that** I can run the full stack with single commands.

**Acceptance Criteria:**
- [x] `npm run dev` — starts both frontend and backend concurrently
- [x] `npm run build` — builds both frontend and backend
- [x] `npm run start` — runs production server
- [x] `tsconfig.base.json` exists with shared compiler options
- [x] `shared/types/todo.ts` has `Todo`, `CreateTodoRequest`, `UpdateTodoRequest` interfaces
- [x] Environment variables are configured (`.env.example` files)

**Technical Notes:**
- Use `concurrently` for running both servers
- Shared types importable from both frontend and backend

---

### Epic 2: Core Task Capture

#### S1-007: Implement Todo API Endpoints (GET & POST)
**Story Reference:** Epic 2, Story 2.1  
**Points:** 5  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-003, S1-006

**As a** developer,  
**I want** API endpoints to retrieve and create todos,  
**So that** the frontend can fetch and persist task data.

**Acceptance Criteria:**
- [x] `GET /api/todos` returns 200 with array of todos sorted by `createdAt` descending
- [x] `POST /api/todos` with `{ "text": "Buy milk" }` returns 201 with created todo
- [x] Created todo includes server-generated `id` (UUID) and `createdAt` (ISO timestamp)
- [x] Invalid input (empty text or > 500 chars) returns 400 with error details
- [x] Todo is persisted in database

**Technical Notes:**
- Use Drizzle ORM for queries
- UUID generation with `crypto.randomUUID()`
- Validation with Zod (Story S1-008)

---

#### S1-008: Implement Zod Validation Schemas
**Story Reference:** Epic 2, Story 2.2  
**Points:** 2  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-006

**As a** developer,  
**I want** Zod validation schemas for todo operations,  
**So that** input is validated consistently on both client and server.

**Acceptance Criteria:**
- [x] `createTodoSchema` requires `text` string, trims whitespace, enforces 1-500 chars
- [x] Invalid requests return 400 with structured error: `{ error: { code, message, details } }`
- [x] Schemas are importable in frontend for client-side validation
- [x] Schemas live in `shared/` directory

**Technical Notes:**
- Use Zod 3.x
- Share schemas between frontend and backend via `shared/schemas/`

---

#### S1-009: Implement TaskInput Component
**Story Reference:** Epic 2, Story 2.3  
**Points:** 2  
**Priority:** P0 - Critical  
**Status:** Done ✅  
**Dependencies:** S1-005

**As a** user,  
**I want** a text input field to add new tasks,  
**So that** I can capture tasks quickly.

**Acceptance Criteria:**
- [x] TaskInput is visible at the top of the page
- [x] Input field is auto-focused on page load
- [x] Pressing Enter or clicking Add button submits the task
- [x] Input field clears after successful submission
- [x] Empty or whitespace-only text is rejected with visual feedback
- [x] Input has minimum 48px height
- [x] Focus ring is visible (2px outline)
- [x] Touch target is minimum 44x44px
- [x] Input has accessible label for screen readers

**Technical Notes:**
- Use CSS Modules for styling
- ARIA label for accessibility
- Prevent form submission on empty input

---

---

## Sprint Burndown Tracking

| Day | Date | Points Remaining | Notes |
|-----|------|------------------|-------|
| 0 | Mar 5 | 0 | 🎉 Sprint Complete - All 29 points delivered! |
| 1 | Mar 6 | - | |
| 2 | Mar 7 | - | |
| 3 | Mar 10 | - | |
| 4 | Mar 11 | - | |
| 5 | Mar 12 | - | |
| 6 | Mar 13 | - | |
| 7 | Mar 14 | - | |
| 8 | Mar 17 | - | |
| 9 | Mar 18 | - | |
| 10 | Mar 19 | 0 | Sprint End |

---

## Story Dependency Graph

```
S1-001 (Monorepo)
    ├── S1-002 (Backend) ──┬── S1-003 (Database) ──┬── S1-007 (API)
    │                      │                       │
    │                      └── S1-006 (Scripts) ───┼── S1-008 (Zod)
    │                                              │
    └── S1-004 (Frontend) ─── S1-005 (Query/CSS) ──┴── S1-009 (TaskInput)
```

---

## Recommended Implementation Order

1. **S1-001** - Initialize Monorepo Structure (unblocks everything)
2. **S1-002** - Configure Backend with Express & TypeScript
3. **S1-004** - Configure Frontend with React, Vite & TypeScript *(can parallel with S1-002)*
4. **S1-003** - Configure SQLite Database with Drizzle ORM
5. **S1-006** - Configure Root Scripts & Shared Types
6. **S1-005** - Configure React Query & Global Styles
7. **S1-008** - Implement Zod Validation Schemas
8. **S1-007** - Implement Todo API Endpoints (GET & POST)
9. **S1-009** - Implement TaskInput Component

---

## Definition of Done

- [x] All acceptance criteria met
- [x] Code reviewed (if applicable)
- [x] Unit tests written and passing
- [x] No TypeScript errors
- [x] Accessibility requirements verified
- [x] Documentation updated (if applicable)

---

## Sprint Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Drizzle ORM learning curve | Medium | Medium | Use official docs and examples; Story 1.3 has buffer points |
| Workspace configuration issues | Low | Medium | Follow npm workspaces best practices |
| Proxy configuration for Vite | Low | Low | Well-documented in Vite docs |

---

## Notes

- Sprint focuses on foundational setup (Epic 1) plus initial capture functionality (Epic 2 partial)
- Stories S1-002 and S1-004 can be worked in parallel after S1-001
- All Epic 1 stories are P0 (Critical) as they unblock future development
- TaskInput (S1-009) delivers visible user value to demonstrate progress

