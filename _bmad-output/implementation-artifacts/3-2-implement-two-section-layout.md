# Story: Implement Two-Section Layout

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 3-2 |
| **Epic** | Epic 3: Task Completion & Organization |
| **Sprint** | Sprint 2 |
| **Points** | 5 |
| **Priority** | P1 - High |
| **Status** | done |

## Story
**As a** user,  
**I want** incomplete and completed tasks in separate sections,  
**So that** I can focus on what needs to be done.

## Acceptance Criteria
- [x] AC-1: Incomplete tasks appear in "To Do" section
- [x] AC-2: Completed tasks appear in "Done" section
- [x] AC-3: Each section has a heading
- [x] AC-4: Empty sections show appropriate message
- [x] AC-5: Completed section is collapsible

## Tasks/Subtasks
- [x] Task 1: Create section layout in TodoList
  - [x] 1.1: Split todos into incomplete and completed arrays
  - [x] 1.2: Render "To Do" section with incomplete tasks
  - [x] 1.3: Render "Done" section with completed tasks
  - [x] 1.4: Add section headings with task counts
  - [x] 1.5: Style sections appropriately
- [x] Task 2: Handle empty states
  - [x] 2.1: Show "No tasks to do" when incomplete section empty
  - [x] 2.2: Show "No completed tasks" when done section empty
- [x] Task 3: Make Done section collapsible
  - [x] 3.1: Add collapse/expand toggle button
  - [x] 3.2: Persist collapse state (local state is fine)
  - [x] 3.3: Add aria attributes for accessibility
- [x] Task 4: Update tests
  - [x] 4.1: Test section rendering
  - [x] 4.2: Test empty states
  - [x] 4.3: Test collapse functionality

## Dev Notes

### Architecture Requirements
- Keep TodoList as container component
- Consider extracting TaskSection as subcomponent if needed
- Sorting within each section (newest first)

### Existing Patterns
- TodoList already handles sorting
- TaskItem component for individual items

### Technical Specifications
- Section headings: "To Do (X)" and "Done (X)"
- Collapse icon: ▼ (expanded) / ▶ (collapsed)
- Only Done section is collapsible

### Files to Reference
- `frontend/src/components/TodoList/TodoList.tsx` - main component
- `frontend/src/components/TodoList/TodoList.module.css` - styles

## Dev Agent Record

### Implementation Plan
- Split todos into incomplete and completed arrays
- Created "To Do" and "Done" sections with headings showing counts
- Each section has aria-labelledby for accessibility
- Done section has collapsible toggle with aria-expanded
- Added empty state messages for each section
- Added sortByNewest helper function for cleaner code

### Debug Log
- Fixed existing tests to account for two lists instead of one
- Fixed typo in test: "Oldest" → "Older"

### Completion Notes
✅ S2-004 implementation complete:
- Two-section layout with "To Do" and "Done"
- Section headings with task counts
- Collapsible Done section with ▼/▶ icons
- Empty state messages
- 7 new tests + updated 2 existing tests
- All 159 tests passing

## File List
| File | Action |
|------|--------|
| `frontend/src/components/TodoList/TodoList.tsx` | Modified |
| `frontend/src/components/TodoList/TodoList.module.css` | Modified |
| `frontend/src/components/TodoList/__tests__/TodoList.test.tsx` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - two-section layout with collapsible Done |
| 2026-03-06 | Code review: Fixed invalid HTML (h2 nested in button) |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved (after fix)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| MEDIUM | h2 nested inside button (invalid HTML) | Moved h2 outside, separate collapse button with aria-label |
| LOW | Filtering/sorting on every render | Accepted - premature optimization |
| LOW | Inconsistent heading structure | Fixed with M1 |

### Changes Made
- Restructured Done section header: `<div>` with `<h2>` + separate `<button>`
- Added `sectionHeader` CSS class for flex layout
- Added `collapseButton` styles
- Collapse button now has descriptive aria-label: "Collapse/Expand completed tasks"
- Updated tests to use new aria-label selector

### Test Results Post-Fix
- Frontend: 97 tests passing ✅
- Total: 159 tests passing ✅






