# Story: Implement Delete Button

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 4-2 |
| **Epic** | Epic 4: Task Deletion |
| **Sprint** | Sprint 2 |
| **Points** | 3 |
| **Priority** | P1 - High |
| **Status** | done |

## Story
**As a** user,  
**I want** a delete button on each task,  
**So that** I can remove tasks I no longer need.

## Acceptance Criteria
- [x] AC-1: Each task shows a delete button
- [x] AC-2: Clicking delete removes the task with optimistic update
- [x] AC-3: On API failure, task is restored and error toast shown
- [x] AC-4: Delete button is accessible (keyboard, aria-label)
- [x] AC-5: DELETE /api/todos/:id is called

## Tasks/Subtasks
- [x] Task 1: Create `useDeleteTodo` mutation hook
  - [x] 1.1: Create `frontend/src/hooks/useDeleteTodo.ts`
  - [x] 1.2: Implement optimistic delete (remove from cache)
  - [x] 1.3: Implement rollback on error
  - [x] 1.4: Call DELETE /api/todos/:id
  - [x] 1.5: Export from hooks index
  - [x] 1.6: Write unit tests for useDeleteTodo
- [x] Task 2: Add delete button to TaskItem
  - [x] 2.1: Add delete button with × symbol
  - [x] 2.2: Style delete button (hover, focus states)
  - [x] 2.3: Add aria-label for accessibility
  - [x] 2.4: Update TaskItem tests
- [x] Task 3: Integrate into TodoList
  - [x] 3.1: Wire up onDelete callback to useDeleteTodo
  - [x] 3.2: Pass onDelete to TaskItem
  - [x] 3.3: Add error toast on failure

## Dev Notes

### Architecture Requirements
- Follow useToggleTodo optimistic update pattern
- Remove todo from cache immediately
- Restore on error

### Existing Patterns
- `useToggleTodo` hook pattern for optimistic mutations
- `TaskItem` component structure

### Technical Specifications
- Props: Add `onDelete?: (id: string) => void` to TaskItem
- Delete button shows on hover or always visible
- Mutation function: `(id: string) => DELETE /api/todos/:id`

### Files to Reference
- `frontend/src/hooks/useToggleTodo.ts` - optimistic update pattern
- `frontend/src/components/TaskItem/TaskItem.tsx` - add button here

## Dev Agent Record

### Implementation Plan
- Created `useDeleteTodo` hook following optimistic update pattern
- Added delete button to TaskItem with × symbol
- Delete button hidden by default, shows on hover/focus
- Styled with red hover state for destructive action affordance
- Integrated into TodoList with error toast on failure

### Debug Log
- No issues encountered

### Completion Notes
✅ S2-009 implementation complete:
- `useDeleteTodo` hook with 5 unit tests
- TaskItem delete button with 7 unit tests
- TodoList integration with 2 integration tests
- All 152 tests passing

## File List
| File | Action |
|------|--------|
| `frontend/src/hooks/useDeleteTodo.ts` | Created |
| `frontend/src/hooks/index.ts` | Modified |
| `frontend/src/hooks/__tests__/useDeleteTodo.test.tsx` | Created |
| `frontend/src/components/TaskItem/TaskItem.tsx` | Modified |
| `frontend/src/components/TaskItem/TaskItem.module.css` | Modified |
| `frontend/src/components/TaskItem/__tests__/TaskItem.test.tsx` | Modified |
| `frontend/src/components/TodoList/TodoList.tsx` | Modified |
| `frontend/src/components/TodoList/__tests__/TodoList.test.tsx` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - useDeleteTodo, TaskItem delete button, TodoList integration |
| 2026-03-06 | Code review: APPROVED - clean implementation, no issues |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved

### Summary
Clean implementation following established optimistic update patterns. useDeleteTodo mirrors useToggleTodo structure. Delete button properly styled with hover reveal, keyboard accessible, and good aria-labels.

### Issues Found
| Severity | Issue | Resolution |
|----------|-------|------------|
| LOW | Delete button keyboard nav | Accepted - works correctly with :focus |
| LOW | No delete confirmation | Accepted - optimistic rollback provides safety |

No fixes required. All 152 tests passing.


