---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md']
workflowType: 'architecture'
project_name: 'bmad-todo'
user_name: 'Rob'
date: '2026-03-04'
---

# Architecture Document

## BMad Todo Application

**Version:** 1.0  
**Date:** March 4, 2026  
**Author:** Winston (Architect)  
**Status:** Approved  
**PRD Reference:** prd.md v1.0

---

## 1. Executive Summary

This document defines the technical architecture for BMad Todo — a single-user task management application prioritizing simplicity, reliability, and developer ergonomics. The architecture employs a modern, minimal stack that satisfies all PRD requirements while remaining easy to understand, deploy, and extend.

### 1.1 Architecture Philosophy

- **Minimal moving parts** — Fewer technologies mean fewer failure modes
- **Convention over configuration** — Leverage framework defaults where sensible
- **Monorepo simplicity** — Single repository with clear frontend/backend separation
- **Production-ready from day one** — No throwaway prototyping; every component is deployable

---

## 2. Technology Stack

### 2.1 Stack Overview

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Frontend | React | 18.x | Mature ecosystem, excellent DX, optimistic updates |
| Frontend Build | Vite | 5.x | Fast builds, simple config, native ESM |
| Frontend Language | TypeScript | 5.x | Type safety, better IDE support, self-documenting |
| Styling | CSS Modules | — | Scoped styles, no runtime cost, native CSS |
| Backend | Node.js + Express | 20.x LTS / 4.x | Simple, well-understood, excellent TypeScript support |
| Backend Language | TypeScript | 5.x | Shared types between frontend/backend |
| Database | SQLite | 3.x | Zero-config, file-based, perfect for single-user |
| ORM | Drizzle ORM | Latest | Type-safe, lightweight, excellent DX |
| Validation | Zod | 3.x | Runtime validation with TypeScript inference |
| HTTP Client | Fetch API + React Query | 5.x | Native fetch, excellent caching/state management |

### 2.2 Technology Decisions

#### Frontend: React + Vite + TypeScript

**Decision:** Use React 18 with Vite as the build tool and TypeScript for type safety.

**Rationale:**
- React's component model is well-suited to the simple UI requirements
- Vite provides fast HMR and simple configuration
- TypeScript catches errors early and enables shared type definitions with the backend
- React Query handles server state, caching, and optimistic updates elegantly

**Alternatives Considered:**
- **Vue 3:** Equally capable, but React has broader ecosystem support
- **Next.js:** Overkill for a simple SPA without SSR requirements
- **Plain JavaScript:** Loses type safety benefits for minimal gain

#### Backend: Node.js + Express + TypeScript

**Decision:** Use Express on Node.js with TypeScript for the REST API.

**Rationale:**
- Express is minimal, flexible, and universally understood
- Shares TypeScript types with frontend (monorepo advantage)
- Node.js 20 LTS provides excellent performance and stability
- Easy to deploy to any hosting provider

**Alternatives Considered:**
- **Fastify:** Faster but adds complexity for this scale
- **Hono:** Promising but less mature ecosystem
- **NestJS:** Too much ceremony for a simple CRUD API

#### Database: SQLite + Drizzle ORM

**Decision:** Use SQLite as the database with Drizzle ORM for type-safe queries.

**Rationale:**
- SQLite is zero-configuration and perfect for single-user applications
- File-based storage simplifies deployment and backup
- Drizzle provides type-safe queries with minimal overhead
- Easy migration path to PostgreSQL if needed later

**Alternatives Considered:**
- **PostgreSQL:** Unnecessary infrastructure for single-user MVP
- **JSON file:** Lacks query capabilities and ACID guarantees
- **Prisma:** Heavier than needed; Drizzle is lighter and faster

#### Styling: CSS Modules

**Decision:** Use CSS Modules for component-scoped styling.

**Rationale:**
- Scoped styles prevent CSS conflicts and naming collisions
- Zero runtime overhead — styles compiled at build time
- Native CSS syntax — no learning curve for new developers
- Vite has built-in CSS Modules support
- Easy to understand and debug in browser dev tools

**Alternatives Considered:**
- **Tailwind CSS:** Fast but adds utility class learning curve
- **Styled Components:** Runtime CSS-in-JS overhead
- **Vanilla CSS:** Global scope leads to naming conflicts

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Vite)                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │  Components │  │ React Query │  │  Zod Validation │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Node.js Server                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Express Application                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Routes    │  │ Controllers │  │  Zod Validation │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              Drizzle ORM (Type-safe)                │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    SQLite Database                         │  │
│  │                    (todos.db file)                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Project Structure

```
bmad-todo/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TodoList/
│   │   │   │   ├── TodoList.tsx
│   │   │   │   └── TodoList.module.css
│   │   │   ├── TodoItem/
│   │   │   │   ├── TodoItem.tsx
│   │   │   │   └── TodoItem.module.css
│   │   │   ├── TodoInput/
│   │   │   │   ├── TodoInput.tsx
│   │   │   │   └── TodoInput.module.css
│   │   │   └── ui/              # Generic UI components
│   │   │       ├── Button/
│   │   │       │   ├── Button.tsx
│   │   │       │   └── Button.module.css
│   │   │       ├── Checkbox/
│   │   │       │   ├── Checkbox.tsx
│   │   │       │   └── Checkbox.module.css
│   │   │       ├── Input/
│   │   │       │   ├── Input.tsx
│   │   │       │   └── Input.module.css
│   │   │       └── Spinner/
│   │   │           ├── Spinner.tsx
│   │   │           └── Spinner.module.css
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useTodos.ts      # React Query hooks for todos
│   │   ├── api/                 # API client functions
│   │   │   └── todos.ts
│   │   ├── types/               # TypeScript types (shared)
│   │   │   └── todo.ts
│   │   ├── styles/              # Global styles
│   │   │   ├── global.css       # CSS reset, variables, base styles
│   │   │   └── variables.css    # CSS custom properties (colors, spacing)
│   │   ├── App.tsx
│   │   ├── App.module.css
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── routes/              # Express route definitions
│   │   │   └── todos.ts
│   │   ├── controllers/         # Request handlers
│   │   │   └── todos.ts
│   │   ├── db/                  # Database configuration
│   │   │   ├── schema.ts        # Drizzle schema
│   │   │   ├── index.ts         # DB connection
│   │   │   └── migrations/      # SQL migrations
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── todo.ts
│   │   ├── validation/          # Zod schemas
│   │   │   └── todo.ts
│   │   └── index.ts             # Server entry point
│   ├── data/                    # SQLite database files
│   │   └── .gitkeep
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                      # Shared types (optional)
│   └── types/
│       └── todo.ts
│
├── package.json                 # Root workspace config
├── tsconfig.base.json           # Shared TS config
└── README.md
```

---

## 4. Data Architecture

### 4.1 Database Schema

```sql
-- SQLite Schema
CREATE TABLE todos (
    id TEXT PRIMARY KEY,           -- UUID v4
    text TEXT NOT NULL,            -- Task description (max 500 chars)
    completed INTEGER DEFAULT 0,   -- Boolean: 0 = false, 1 = true
    created_at TEXT NOT NULL       -- ISO 8601 timestamp
);

-- Index for default sort order
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

### 4.2 Drizzle Schema Definition

```typescript
// backend/src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').notNull(),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

### 4.3 TypeScript Types (Shared)

```typescript
// shared/types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}
```

---

## 5. API Design

### 5.1 RESTful Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/todos` | List all todos | — | 200: Todo[] |
| POST | `/api/todos` | Create a todo | CreateTodoRequest | 201: Todo |
| PATCH | `/api/todos/:id` | Update a todo | UpdateTodoRequest | 200: Todo |
| DELETE | `/api/todos/:id` | Delete a todo | — | 204: No Content |

### 5.2 Validation Schemas (Zod)

```typescript
// backend/src/validation/todo.ts
import { z } from 'zod';

export const createTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be 500 characters or less'),
});

export const updateTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be 500 characters or less')
    .optional(),
  completed: z.boolean().optional(),
});

export const todoIdSchema = z.object({
  id: z.string().uuid('Invalid todo ID'),
});
```

### 5.3 Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Validation errors
  };
}
```

**Standard Error Codes:**

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request body failed validation |
| 404 | NOT_FOUND | Todo with given ID does not exist |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## 6. Frontend Architecture

### 6.1 Component Hierarchy

```
App
├── Header (optional - app title)
├── TodoInput
│   └── Input field + Add button
├── TodoList
│   ├── LoadingState
│   ├── ErrorState
│   ├── EmptyState
│   └── TodoItem[]
│       ├── Checkbox (toggle complete)
│       ├── Text display
│       └── Delete button
└── Footer (optional - todo count)
```

### 6.2 State Management Strategy

**Server State (React Query):**
- All todo data is server state
- React Query handles fetching, caching, and synchronization
- Optimistic updates for immediate UI feedback

**Local State (React useState):**
- Form input values
- UI state (e.g., loading indicators during mutations)

### 6.3 React Query Configuration

```typescript
// frontend/src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as todosApi from '../api/todos';

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.fetchTodos,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.createTodo,
    onMutate: async (newTodo) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], (old: Todo[]) => [
        { ...newTodo, id: 'temp-id', completed: false, createdAt: new Date().toISOString() },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

### 6.4 CSS Modules Usage

**Folder structure convention:** Each component lives in its own folder with:
- `ComponentName.tsx` — Component implementation
- `ComponentName.module.css` — Scoped styles

**Example folder structure:**

```
components/
├── TodoItem/
│   ├── TodoItem.tsx
│   └── TodoItem.module.css
├── TodoList/
│   ├── TodoList.tsx
│   └── TodoList.module.css
└── TodoInput/
    ├── TodoInput.tsx
    └── TodoInput.module.css
```

**Example Component:**

```tsx
// frontend/src/components/TodoItem/TodoItem.tsx
import styles from './TodoItem.module.css';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={styles.item}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles.checkbox}
      />
      <span className={todo.completed ? styles.textCompleted : styles.text}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} className={styles.deleteButton}>
        Delete
      </button>
    </div>
  );
}
```

**Example CSS Module:**

```css
/* frontend/src/components/TodoItem/TodoItem.module.css */
.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.text {
  flex: 1;
  color: var(--color-text);
}

.textCompleted {
  flex: 1;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.deleteButton {
  padding: 0.25rem 0.5rem;
  color: var(--color-danger);
  background: transparent;
  border: none;
  cursor: pointer;
}

.deleteButton:hover {
  background: var(--color-danger-bg);
  border-radius: 4px;
}
```

**Import paths (direct file references):**

```typescript
// Direct imports to component files
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoList } from './components/TodoList/TodoList';
import { TodoInput } from './components/TodoInput/TodoInput';
import { Button } from './components/ui/Button/Button';
import { Input } from './components/ui/Input/Input';
import { Checkbox } from './components/ui/Checkbox/Checkbox';
import { Spinner } from './components/ui/Spinner/Spinner';
```

**Global CSS Variables:**

```css
/* frontend/src/styles/variables.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-text: #1f2937;
  --color-text-muted: #9ca3af;
  --color-border: #e5e7eb;
  --color-background: #ffffff;
  --color-danger: #ef4444;
  --color-danger-bg: #fee2e2;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Layout */
  --max-width: 640px;
  --border-radius: 6px;
}
```

---

## 7. Security Considerations

### 7.1 Input Validation

- **Client-side:** Zod schemas validate before API calls (UX feedback)
- **Server-side:** Zod schemas validate all incoming requests (security)
- **Database:** SQLite parameterized queries prevent SQL injection

### 7.2 XSS Prevention

- React's JSX automatically escapes rendered content
- No `dangerouslySetInnerHTML` usage
- Content-Security-Policy headers recommended for production

### 7.3 Security Headers (Production)

```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';

app.use(helmet());
```

### 7.4 CORS Configuration

```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
```

### 7.5 Future Authentication Path

The architecture supports adding authentication without major refactoring:

1. Add user table with standard auth fields
2. Add `user_id` foreign key to todos table
3. Implement JWT or session-based auth middleware
4. Add auth context to frontend with protected routes

---

## 8. Deployment Architecture

### 8.1 Development Environment

```
┌──────────────────────────────────────────────────────────────┐
│                    Developer Machine                          │
│                                                               │
│   ┌─────────────────┐          ┌─────────────────────────┐   │
│   │  Vite Dev Server│          │    Express Dev Server   │   │
│   │   (port 5173)   │◀────────▶│      (port 3000)        │   │
│   │                 │  Proxy   │                         │   │
│   └─────────────────┘          └───────────┬─────────────┘   │
│                                            │                  │
│                                            ▼                  │
│                                ┌─────────────────────────┐   │
│                                │  SQLite (todos.db)      │   │
│                                └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Production Deployment Options

**Option A: Single Server (Recommended for v1.0)**

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Server                        │
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │              Node.js (Express)                      │    │
│   │   • Serves static frontend build                    │    │
│   │   • Handles API requests                            │    │
│   │   • SQLite database in /data                        │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
│   Hosting: Railway, Render, Fly.io, DigitalOcean App Platform│
└─────────────────────────────────────────────────────────────┘
```

**Option B: Separate Frontend/Backend**

```
┌─────────────────────┐        ┌─────────────────────────────┐
│   Static Hosting    │        │       API Server            │
│   (Vercel/Netlify)  │◀──────▶│    (Railway/Render)         │
│   • Frontend build  │  API   │    • Express + SQLite       │
└─────────────────────┘        └─────────────────────────────┘
```

### 8.3 Environment Variables

```bash
# backend/.env
NODE_ENV=development|production
PORT=3000
DATABASE_PATH=./data/todos.db
FRONTEND_URL=http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:3000/api
```

---

## 9. Development Workflow

### 9.1 Scripts

```json
// Root package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "cd backend && npm run start",
    "db:migrate": "cd backend && npm run db:migrate",
    "db:studio": "cd backend && npm run db:studio",
    "test": "npm run test:frontend && npm run test:backend",
    "lint": "npm run lint:frontend && npm run lint:backend"
  }
}
```

### 9.2 Database Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

---

## 10. Performance Considerations

### 10.1 Frontend Performance

| Technique | Implementation |
|-----------|----------------|
| Code splitting | Vite automatic chunking |
| Optimistic updates | React Query mutation handlers |
| Scoped CSS | CSS Modules with build-time compilation |
| Efficient renders | React 18 automatic batching |

### 10.2 Backend Performance

| Technique | Implementation |
|-----------|----------------|
| Connection pooling | Drizzle built-in connection management |
| Indexed queries | Index on `created_at` for sort |
| Minimal middleware | Only essential Express middleware |

### 10.3 Target Metrics (from PRD)

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial page load | < 2s | Vite build optimization, gzip |
| API response time | < 200ms | SQLite local reads, no N+1 |
| UI feedback | Immediate | Optimistic updates |

---

## 11. Testing Strategy

### 11.1 Testing Pyramid

```
        ╱╲
       ╱  ╲         E2E Tests (Playwright)
      ╱────╲        • Critical user flows
     ╱      ╲       
    ╱────────╲      Integration Tests
   ╱          ╲     • API endpoints with real DB
  ╱────────────╲    
 ╱              ╲   Unit Tests (Vitest)
╱────────────────╲  • Validation schemas
                    • Utility functions
                    • React components
```

### 11.2 Testing Tools

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit (Frontend) | Vitest + React Testing Library | Components, hooks |
| Unit (Backend) | Vitest | Validation, utilities |
| Integration | Vitest + Supertest | API endpoints |
| E2E | Playwright | Critical user paths |

### 11.3 Test File Conventions

```
frontend/src/components/__tests__/TodoItem.test.tsx
backend/src/routes/__tests__/todos.test.ts
e2e/tests/todo-crud.spec.ts
```

---

## 12. Monitoring & Observability (Production)

### 12.1 Logging

```typescript
// backend/src/middleware/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});
```

### 12.2 Health Check Endpoint

```typescript
// GET /api/health
app.get('/api/health', async (req, res) => {
  try {
    // Verify database connection
    await db.select().from(todos).limit(1);
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: 'Database unavailable' });
  }
});
```

---

## 13. Extensibility Considerations

### 13.1 Future Authentication

The architecture supports adding authentication with minimal changes:

1. Add `users` table to schema
2. Add `user_id` column to `todos` table
3. Create auth middleware for protected routes
4. Add auth context provider in React
5. Update React Query hooks to pass auth headers

### 13.2 Future Database Migration (PostgreSQL)

Drizzle ORM supports PostgreSQL with minimal schema changes:

1. Update Drizzle config to use PostgreSQL driver
2. Migrate SQLite data to PostgreSQL
3. Update connection string in environment variables

### 13.3 API Versioning

If needed, version the API by updating routes:

```typescript
// Current
app.use('/api/todos', todosRouter);

// Versioned
app.use('/api/v1/todos', todosRouter);
app.use('/api/v2/todos', todosV2Router);
```

---

## 14. Technical Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SQLite concurrent writes | Data corruption | Low (single-user) | WAL mode, single server deployment |
| SQLite file loss | Data loss | Low | Regular backups, persistent storage |
| Bundle size growth | Slow load times | Medium | Vite tree-shaking, dependency audits |
| Breaking changes in deps | Build failures | Low | Lock dependency versions, Renovate bot |

---

## 15. Decision Log

| Date | Decision | Rationale | Alternatives Rejected |
|------|----------|-----------|----------------------|
| 2026-03-04 | SQLite over PostgreSQL | Zero-config, perfect for single-user MVP | PostgreSQL (unnecessary infrastructure) |
| 2026-03-04 | Drizzle over Prisma | Lighter, faster, excellent TypeScript DX | Prisma (heavier), raw SQL (no types) |
| 2026-03-04 | React Query over Redux | Server state focus, built-in caching | Redux (overkill), Zustand (less caching) |
| 2026-03-04 | CSS Modules over Tailwind | Native CSS syntax, scoped styles, zero runtime | Tailwind (utility learning curve), Styled Components (runtime cost) |
| 2026-03-04 | Express over Fastify | Simpler, universal understanding | Fastify (marginal perf gains not needed) |

---

## 16. Acceptance Criteria (Architecture)

| Criterion | Verification |
|-----------|--------------|
| Full CRUD operations work | Integration tests pass |
| Data persists across restarts | E2E test with server restart |
| Optimistic updates function | Frontend tests verify immediate UI update |
| Error states display correctly | Manual testing with network failures |
| Responsive on mobile/desktop | Visual testing at breakpoints |
| Build completes < 30 seconds | CI pipeline timing |
| Cold start < 5 seconds | Production deployment verification |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0-draft | March 4, 2026 | Winston (Architect) | Initial architecture based on PRD v1.0 |
| 1.0 | March 4, 2026 | Winston (Architect) | Approved by Rob |
