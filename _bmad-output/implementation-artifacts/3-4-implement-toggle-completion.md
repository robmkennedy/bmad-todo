# Story: Implement Toggle Completion

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 3-4 |
| **Epic** | Epic 3: Task Completion & Organization |
| **Sprint** | Sprint 2 |
| **Points** | 5 |
| **Priority** | P0 - Critical |
| **Status** | done |

## Story
**As a** user,  
**I want** to toggle task completion by clicking the checkbox,  
**So that** I can mark tasks as done or undone.

## Acceptance Criteria
- [x] AC-1: Clicking checkbox toggles completion state
- [x] AC-2: Toggle uses optimistic update (instant UI feedback)
- [x] AC-3: On API failure, state reverts and error toast shown
- [x] AC-4: Checkbox is disabled during pending state
- [x] AC-5: PATCH /api/todos/:id is called with { completed: !current }

## Tasks/Subtasks
- [x] Task 1: Create `useToggleTodo` mutation hook
  - [x] 1.1: Create `frontend/src/hooks/useToggleTodo.ts`
  - [x] 1.2: Implement optimistic toggle in cache
  - [x] 1.3: Implement rollback on error
  - [x] 1.4: Call PATCH /api/todos/:id with completed value
  - [x] 1.5: Export from hooks index
  - [x] 1.6: Write unit tests for useToggleTodo
- [x] Task 2: Integrate into TodoList
  - [x] 2.1: Replace placeholder handleToggle with useToggleTodo
  - [x] 2.2: Wire up error toast on failure
  - [x] 2.3: Update TodoList tests

## Dev Notes

### Architecture Requirements
- Follow useAddTodo optimistic update pattern
- Toggle finds todo in cache and flips completed status
- Use PATCH endpoint implemented in S2-003

### Existing Patterns
- `useAddTodo` hook pattern for optimistic mutations
- `todosQueryKey` for cache operations
- `useToast` for error notifications

### Technical Specifications
- Mutation function: `(id: string) => PATCH /api/todos/:id { completed: !current }`
- Need current completed state from cache to determine new value
- Mark todo as pending during mutation

### Files to Reference
- `frontend/src/hooks/useAddTodo.ts` - optimistic update pattern
- `frontend/src/components/TodoList/TodoList.tsx` - integration point

## Dev Agent Record

### Implementation Plan
- Created `useToggleTodo` hook following `useAddTodo` optimistic update pattern
- Hook finds todo in cache and flips completed + marks as pending
- Rolls back on error and calls onError callback
- Integrated into TodoList, wired up to TaskItem's onToggle
- Updated test utilities with `createAppWrapper` for components needing ToastProvider

### Debug Log
- Fixed test that checked optimistic state after cache invalidation (added delay to PATCH mock)
- Updated TodoList tests to use `createAppWrapper` instead of `createQueryWrapper`

### Completion Notes
✅ S2-006 implementation complete:
- `useToggleTodo` hook with 6 unit tests
- TodoList integration with error toast
- All 136 tests passing

## File List
| File | Action |
|------|--------|
| `frontend/src/hooks/useToggleTodo.ts` | Created |
| `frontend/src/hooks/index.ts` | Modified |
| `frontend/src/hooks/__tests__/useToggleTodo.test.tsx` | Created |
| `frontend/src/components/TodoList/TodoList.tsx` | Modified |
| `frontend/src/components/TodoList/__tests__/TodoList.test.tsx` | Modified |
| `frontend/src/test/test-utils.tsx` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - useToggleTodo with 6 tests, TodoList integration |
| 2026-03-06 | Code review: Added 2 integration tests, fixed test-utils to include ToastContainer |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| MEDIUM | Missing toggle integration tests | Added 2 tests: PATCH API call, error toast display |
| - | ToastContainer not in test wrapper | Fixed createAppWrapper to include ToastContainer |
| LOW | toggleMutation recreated each render | Accepted - React Query handles internally |
| LOW | Sort runs every render | Accepted - premature optimization for small lists |

### Test Results Post-Fix
- Frontend: 76 tests passing ✅ (2 new tests added)
- Total: 138 tests passing ✅


