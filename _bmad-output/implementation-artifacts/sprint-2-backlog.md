# Sprint 2 Backlog

## Sprint Overview

| Field | Value |
|-------|-------|
| **Sprint Number** | 2 |
| **Sprint Goal** | Deliver complete task management: list display, completion toggling, deletion, and polished UI states |
| **Start Date** | March 19, 2026 |
| **End Date** | April 2, 2026 |
| **Duration** | 2 weeks |
| **Story Points** | 34 |

## Sprint Goal Statement

> Deliver a fully functional todo application where users can view their task list, toggle completion status with smooth animations, delete tasks, and experience polished UI feedback for loading, error, and empty states.

---

## Sprint Backlog

### Epic 2: Core Task Capture (Continued)

#### S2-001: Implement TodoList & useTodos Hook
**Story Reference:** Epic 2, Story 2.4  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Backlog

**As a** user,  
**I want** to see my tasks in a list,  
**So that** I know what I've captured.

**Acceptance Criteria:**
- [ ] Tasks are displayed in a list when page loads
- [ ] Tasks are sorted newest first (by createdAt descending)
- [ ] `useTodos` hook uses React Query for data fetching
- [ ] Hook returns `{ data, isLoading, isError, refetch }`
- [ ] React Query manages caching and refetching

**Technical Notes:**
- Use TanStack Query v5 `useQuery` hook
- Query key: `['todos']`
- Fetch from `/api/todos`
- Configure staleTime and refetch behavior as needed

---

#### S2-002: Implement Optimistic Add with Rollback
**Story Reference:** Epic 2, Story 2.5  
**Points:** 5  
**Priority:** P0 - Critical  
**Status:** Backlog  
**Dependencies:** S2-001

**As a** user,  
**I want** new tasks to appear instantly,  
**So that** I feel confident my task was captured.

**Acceptance Criteria:**
- [ ] Task appears in list immediately (< 100ms) after pressing Enter
- [ ] API request is sent in the background
- [ ] No loading spinner shown during add operation
- [ ] If API request fails, optimistic task is removed from list
- [ ] Error indication is shown on failure

**Technical Notes:**
- Use React Query `useMutation` with `onMutate` for optimistic update
- Generate temporary client-side ID for optimistic entry
- Use `onError` + `context` for rollback
- Replace temp ID with server ID on success

---

### Epic 3: Task Completion & Organization

#### S2-003: Implement PATCH /api/todos/:id Endpoint
**Story Reference:** Epic 3, Story 3.1  
**Points:** 3  
**Priority:** P0 - Critical  
**Status:** Backlog

**As a** developer,  
**I want** an API endpoint to update todo completion status,  
**So that** the frontend can toggle tasks.

**Acceptance Criteria:**
- [ ] `PATCH /api/todos/:id` with `{ "completed": true }` returns 200 with updated todo
- [ ] `PATCH /api/todos/:id` with `{ "text": "new text" }` updates the text
- [ ] Non-existent todo ID returns 404 with error details
- [ ] `updateTodoSchema` validates `completed` as optional boolean
- [ ] `updateTodoSchema` validates `text` as optional string (1-500 chars, trimmed)

**Technical Notes:**
- Add `updateTodoSchema` to shared schemas
- Partial update — only provided fields are modified
- Return full updated todo object

---

#### S2-004: Implement Two-Section Layout (Active/Completed)
**Story Reference:** Epic 3, Story 3.2  
**Points:** 5  
**Priority:** P0 - Critical  
**Status:** Backlog  
**Dependencies:** S2-001

**As a** user,  
**I want** to see my tasks organized into Active and Completed sections,  
**So that** I can focus on what's left to do.

**Acceptance Criteria:**
- [ ] Active tasks appear in top section with header "Tasks"
- [ ] Completed tasks appear in bottom section with header "Completed"
- [ ] Completed section is hidden when no completed tasks exist
- [ ] Active section shows empty state message when only completed tasks exist
- [ ] TaskSection component wraps each section
- [ ] SectionHeader component displays section titles

**Technical Notes:**
- Filter todos by `completed` status in component
- Use CSS Modules for section styling
- Headers should be semantic `<h2>` elements

---

#### S2-005: Implement TaskItem Component
**Story Reference:** Epic 3, Story 3.3  
**Points:** 3  
**Priority:** P1 - High  
**Status:** Backlog  
**Dependencies:** S2-004

**As a** user,  
**I want** each task to show its text and completion status,  
**So that** I can see and interact with individual tasks.

**Acceptance Criteria:**
- [ ] Incomplete task shows unchecked checkbox, full-contrast text
- [ ] Completed task shows checked checkbox, strikethrough text, muted styling
- [ ] Checkbox has accessible label: "Mark [task text] as complete/incomplete"
- [ ] Touch target is minimum 44x44px
- [ ] Focus ring is visible on keyboard focus
- [ ] Supports keyboard interaction (Space/Enter to toggle)

**Technical Notes:**
- Use native `<input type="checkbox">` with custom styling
- ARIA label dynamically generated based on task state
- CSS Modules with `:focus-visible` for focus ring

---

#### S2-006: Implement Toggle Completion with Optimistic Update
**Story Reference:** Epic 3, Story 3.4  
**Points:** 5  
**Priority:** P0 - Critical  
**Status:** Backlog  
**Dependencies:** S2-003, S2-005

**As a** user,  
**I want** to toggle task completion with immediate feedback,  
**So that** I can track my progress fluidly.

**Acceptance Criteria:**
- [ ] Clicking checkbox immediately moves task to opposite section
- [ ] Visual styling changes instantly to completed/incomplete state
- [ ] API request sent in background
- [ ] On API failure, task reverts to previous state
- [ ] Error indication shown on failure

**Technical Notes:**
- Use `useMutation` with optimistic updates
- Invalidate `['todos']` query on success
- Rollback on error using previous state from `onMutate`

---

#### S2-007: Implement Task Animations
**Story Reference:** Epic 3, Story 3.5  
**Points:** 3  
**Priority:** P2 - Medium  
**Status:** Backlog  
**Dependencies:** S2-005, S2-006

**As a** user,  
**I want** smooth animations when tasks change state,  
**So that** the interface feels polished and responsive.

**Acceptance Criteria:**
- [ ] New task animates in with 200ms ease-out (opacity + translateY)
- [ ] Task completion styling transitions in 150ms ease-in-out
- [ ] Section move animates in 200ms ease-in-out
- [ ] Animations disabled when `prefers-reduced-motion: reduce`
- [ ] All timing uses CSS variables (`--animation-appear`, etc.)

**Technical Notes:**
- Use CSS animations/transitions, not JS
- Define CSS variables for timing in `variables.css`
- Use `@media (prefers-reduced-motion: reduce)` to disable

---

### Epic 4: Task Deletion

#### S2-008: Implement DELETE /api/todos/:id Endpoint
**Story Reference:** Epic 4, Story 4.1  
**Points:** 2  
**Priority:** P0 - Critical  
**Status:** Backlog

**As a** developer,  
**I want** an API endpoint to delete todos,  
**So that** users can remove unwanted tasks.

**Acceptance Criteria:**
- [ ] `DELETE /api/todos/:id` returns 204 No Content
- [ ] Todo is removed from database
- [ ] Non-existent todo ID returns 404 with error details

**Technical Notes:**
- Use Drizzle ORM `delete` operation
- Verify record exists before deleting (for 404)

---

#### S2-009: Implement Delete Button on TaskItem
**Story Reference:** Epic 4, Story 4.2  
**Points:** 3  
**Priority:** P1 - High  
**Status:** Backlog  
**Dependencies:** S2-005, S2-008

**As a** user,  
**I want** a delete button on each task,  
**So that** I can remove tasks I no longer need.

**Acceptance Criteria:**
- [ ] Delete button is visible on each task (active or completed)
- [ ] Clicking delete removes task immediately (optimistic)
- [ ] API request sent in background
- [ ] On API failure, task reappears in original position
- [ ] Error indication shown on failure
- [ ] Delete button has accessible label: "Delete task: [task text]"
- [ ] Touch target is minimum 44x44px
- [ ] Keyboard accessible (Enter/Space to activate)

**Technical Notes:**
- Use `useMutation` with optimistic updates for delete
- Button styled with trash/X icon
- Rollback logic stores previous todos state

---

#### S2-010: Implement Delete Animation
**Story Reference:** Epic 4, Story 4.3  
**Points:** 2  
**Priority:** P2 - Medium  
**Status:** Backlog  
**Dependencies:** S2-009

**As a** user,  
**I want** a smooth animation when tasks are deleted,  
**So that** the removal feels intentional and polished.

**Acceptance Criteria:**
- [ ] Deleted task animates out with 200ms ease-in-out (opacity + translateX slide right)
- [ ] Task disappears instantly when `prefers-reduced-motion: reduce`

**Technical Notes:**
- CSS animation triggered before removal from DOM
- May need brief delay before actual removal to allow animation
- Use CSS variable `--animation-delete`

---

## Sprint Burndown Tracking

| Day | Date | Points Remaining | Notes |
|-----|------|------------------|-------|
| 0 | Mar 19 | 34 | Sprint Start |
| 1 | Mar 20 | - | |
| 2 | Mar 21 | - | |
| 3 | Mar 24 | - | |
| 4 | Mar 25 | - | |
| 5 | Mar 26 | - | |
| 6 | Mar 27 | - | |
| 7 | Mar 28 | - | |
| 8 | Mar 31 | - | |
| 9 | Apr 1 | - | |
| 10 | Apr 2 | 0 | Sprint End |

---

## Story Dependency Graph

```
Epic 2 (continued):
S2-001 (useTodos) ──── S2-002 (Optimistic Add)
    │
    └────────────────── S2-004 (Two-Section Layout)
                             │
                             └── S2-005 (TaskItem)
                                     │
                                     ├── S2-006 (Toggle Completion) ←── S2-003 (PATCH API)
                                     │         │
                                     │         └── S2-007 (Animations)
                                     │
                                     └── S2-009 (Delete Button) ←── S2-008 (DELETE API)
                                               │
                                               └── S2-010 (Delete Animation)
```

---

## Recommended Implementation Order

1. **S2-001** - Implement TodoList & useTodos Hook (foundation for all UI)
2. **S2-003** - Implement PATCH /api/todos/:id Endpoint (API first)
3. **S2-008** - Implement DELETE /api/todos/:id Endpoint *(can parallel with S2-003)*
4. **S2-002** - Implement Optimistic Add with Rollback
5. **S2-004** - Implement Two-Section Layout (Active/Completed)
6. **S2-005** - Implement TaskItem Component
7. **S2-006** - Implement Toggle Completion with Optimistic Update
8. **S2-009** - Implement Delete Button on TaskItem
9. **S2-007** - Implement Task Animations
10. **S2-010** - Implement Delete Animation

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code reviewed (if applicable)
- [ ] Unit tests written and passing
- [ ] No TypeScript errors
- [ ] Accessibility requirements verified
- [ ] Documentation updated (if applicable)

---

## Sprint Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Optimistic update complexity | Medium | Medium | Follow TanStack Query patterns from docs; test rollback thoroughly |
| Animation timing polish | Low | Medium | Use CSS transitions; can adjust timing in CSS variables |
| Section layout edge cases | Low | Low | Test with 0, 1, many tasks in each section |

---

## Notes

- Sprint 2 completes Epic 2 and delivers full Epic 3 (Completion) + Epic 4 (Deletion)
- Stories S2-003 and S2-008 (backend APIs) can be worked in parallel
- Animations (S2-007, S2-010) are lower priority — can be deferred if needed
- All P0 stories must complete; P2 can slip to Sprint 3 if necessary
- Epic 5 (UI States) and Epic 6 (Dark Mode) will follow in Sprint 3

---

## Remaining Backlog Summary

**Deferred to Sprint 3:**
- Epic 5: UI States & Feedback (Stories 5.1-5.3) — 7 points estimated
- Epic 6: Dark Mode & Theme Support (Stories 6.1-6.4) — 10 points estimated
- Epic 7: Production Readiness (Stories 7.1-7.4) — 12 points estimated

**Total Remaining After Sprint 2:** ~29 points (1 sprint)

