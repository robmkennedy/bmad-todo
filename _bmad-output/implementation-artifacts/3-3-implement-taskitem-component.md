# Story: Implement TaskItem Component

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 3-3 |
| **Epic** | Epic 3: Task Completion & Organization |
| **Sprint** | Sprint 2 |
| **Points** | 3 |
| **Priority** | P0 - Critical |
| **Status** | done |

## Story
**As a** user,  
**I want** each task displayed as a distinct interactive item,  
**So that** I can interact with individual tasks.

## Acceptance Criteria
- [x] AC-1: TaskItem displays todo text
- [x] AC-2: TaskItem shows checkbox for completion status
- [x] AC-3: Completed tasks show strikethrough text
- [x] AC-4: TaskItem supports keyboard navigation (tab, enter/space for toggle)
- [x] AC-5: TaskItem has hover/focus states

## Tasks/Subtasks
- [x] Task 1: Create TaskItem component
  - [x] 1.1: Create `frontend/src/components/TaskItem/TaskItem.tsx`
  - [x] 1.2: Create `frontend/src/components/TaskItem/TaskItem.module.css`
  - [x] 1.3: Create `frontend/src/components/TaskItem/index.ts` barrel export
  - [x] 1.4: Display todo text and checkbox
  - [x] 1.5: Style completed state with strikethrough
  - [x] 1.6: Add hover and focus states
  - [x] 1.7: Ensure keyboard accessibility
  - [x] 1.8: Write unit tests for TaskItem
- [x] Task 2: Integrate TaskItem into TodoList
  - [x] 2.1: Replace inline `<li>` with TaskItem component
  - [x] 2.2: Pass todo data and callbacks to TaskItem
  - [x] 2.3: Update TodoList tests

## Dev Notes

### Architecture Requirements
- TaskItem is a presentational component
- Receives todo data and onToggle callback as props
- Supports pending state from optimistic updates

### Existing Patterns
- Follow TaskInput component structure
- Use CSS modules for styling
- Accessibility patterns from TaskInput

### Technical Specifications
- Props: `todo: OptimisticTodo`, `onToggle?: (id: string) => void`
- Checkbox should be native `<input type="checkbox">`
- Label text associated with checkbox for accessibility

### Files to Reference
- `frontend/src/components/TaskInput/` - component structure
- `frontend/src/components/TodoList/TodoList.tsx` - integration point

## Dev Agent Record

### Implementation Plan
- Created TaskItem as presentational component with checkbox + text
- Supports completed state (strikethrough), pending state (opacity + indicator)
- Full keyboard accessibility with Enter/Space support
- Hover and focus-within states for visual feedback
- Integrated into TodoList, replacing inline <li> elements

### Debug Log
- No issues encountered

### Completion Notes
✅ S2-005 implementation complete:
- TaskItem component with 16 unit tests
- Native checkbox with accessible labels
- Strikethrough for completed todos
- Pending state indicator for optimistic updates
- All 68 frontend tests passing

## File List
| File | Action |
|------|--------|
| `frontend/src/components/TaskItem/TaskItem.tsx` | Created |
| `frontend/src/components/TaskItem/TaskItem.module.css` | Created |
| `frontend/src/components/TaskItem/index.ts` | Created |
| `frontend/src/components/TaskItem/__tests__/TaskItem.test.tsx` | Created |
| `frontend/src/components/TodoList/TodoList.tsx` | Modified |
| `frontend/src/components/TodoList/TodoList.module.css` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - TaskItem with 16 tests, TodoList integration |
| 2026-03-06 | Code review: APPROVED - clean implementation, no issues |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved

### Summary
Clean implementation following established patterns. TaskItem is well-tested (16 tests) covering rendering, interaction, and accessibility. Keyboard navigation works correctly. CSS is properly scoped.

### Issues Found
| Severity | Issue | Resolution |
|----------|-------|------------|
| LOW | aria-label vs label element | Accepted - aria-label provides accessibility |
| LOW | No outline on li focus | Accepted - checkbox has its own focus indicator |

No fixes required. All tests passing.


