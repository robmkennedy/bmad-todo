# Story: Implement Delete Animation

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 4-3 |
| **Epic** | Epic 4: Task Deletion |
| **Sprint** | Sprint 2 |
| **Points** | 2 |
| **Priority** | P2 - Medium |
| **Status** | done |

## Story
**As a** user,  
**I want** a smooth animation when deleting tasks,  
**So that** the deletion feels intentional and polished.

## Acceptance Criteria
- [x] AC-1: Deleted tasks fade/slide out before removal
- [x] AC-2: Animation is smooth (60fps)
- [x] AC-3: Animation respects prefers-reduced-motion

## Tasks/Subtasks
- [x] Task 1: Add CSS animation for task deletion (slideOut keyframes)
- [x] Task 2: Add isDeleting prop and deleting state to TaskItem
- [x] Task 3: Wire up animation timing with deletion (200ms delay)

## Dev Notes

### Technical Approach
- Added `deletingIds` Set state to TodoList to track items being deleted
- handleDelete triggers animation first, then deletes after 200ms
- slideOut animation: fade out + slide right
- Reduced motion: just dims opacity without animation

## Dev Agent Record

### Implementation
- Added `isDeleting` prop to TaskItem
- Added `deletingIds` state to TodoList
- handleDelete sets deleting state, waits 200ms, then calls mutation
- Added `slideOut` keyframes animation
- Added reduced-motion support for deleting state

### Files Modified
- `frontend/src/components/TaskItem/TaskItem.tsx`
- `frontend/src/components/TaskItem/TaskItem.module.css`
- `frontend/src/components/TodoList/TodoList.tsx`

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - delete animation with 200ms delay |
| 2026-03-06 | Code review: Fixed timer cleanup on unmount |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved (after fix)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| MEDIUM | Timer not cleaned up on unmount | Added useRef to track timers, cleanup in useEffect |
| LOW | Animation duration defined in two places | Accepted - minimal risk |

### Changes Made
- Added `deleteTimersRef` to track delete timers
- Added `useEffect` cleanup to clear all timers on unmount
- Timer is now stored in ref and removed after firing

### Test Results Post-Fix
- All 159 tests passing ✅


