# Story: Implement DELETE /api/todos/:id Endpoint

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 4-1 |
| **Epic** | Epic 4: Task Deletion |
| **Sprint** | Sprint 2 |
| **Points** | 2 |
| **Priority** | P0 - Critical |
| **Status** | done |

## Story
**As a** developer,  
**I want** an API endpoint to delete todos,  
**So that** users can remove unwanted tasks.

## Acceptance Criteria
- [x] AC-1: `DELETE /api/todos/:id` returns 204 No Content
- [x] AC-2: Todo is removed from database
- [x] AC-3: Non-existent todo ID returns 404 with error details

## Tasks/Subtasks
- [x] Task 1: Implement DELETE route in backend
  - [x] 1.1: Add `DELETE /api/todos/:id` route in `backend/src/routes/todos.ts`
  - [x] 1.2: Validate path parameter with `todoIdSchema`
  - [x] 1.3: Delete todo from database using Drizzle ORM
  - [x] 1.4: Return 204 No Content on success
  - [x] 1.5: Return 404 if todo doesn't exist
  - [x] 1.6: Write integration tests for DELETE endpoint

## Dev Notes

### Architecture Requirements
- Use Drizzle ORM `delete` operation with `where()` clause
- Use `returning()` to check if deletion occurred (returns empty array if no match)
- Return 204 No Content (no response body)

### Existing Patterns
- Follow PATCH endpoint pattern for 404 handling
- Use `todoIdSchema` for path parameter validation (already exists)
- Error response format: `{ error: { code, message } }`

### Technical Specifications
- Route: `DELETE /api/todos/:id`
- Response 204: No body
- Response 404: `{ error: { code: "NOT_FOUND", message: "Todo not found" } }`

### Files to Reference
- `backend/src/routes/todos.ts` - existing PATCH route pattern
- `backend/src/__tests__/routes/todos.test.ts` - test patterns

## Dev Agent Record

### Implementation Plan
- Added DELETE route following PATCH endpoint pattern
- Used `delete().returning()` for atomic delete + existence check
- Returns 204 No Content on success (empty body)
- Returns 404 with structured error for non-existent todos

### Debug Log
- No issues encountered

### Completion Notes
✅ S2-008 implementation complete:
- DELETE endpoint returns 204 on success
- Atomic delete + existence check via `returning()`
- 5 integration tests added, all passing
- Verified deletion doesn't affect other todos

## File List
| File | Action |
|------|--------|
| `backend/src/routes/todos.ts` | Modified |
| `backend/src/__tests__/routes/todos.test.ts` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - DELETE endpoint with 5 integration tests |
| 2026-03-06 | Code review: APPROVED - no HIGH issues, clean implementation |

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved

### Summary
Code follows established patterns from PATCH endpoint. Uses `returning()` for atomic delete + existence check. Tests are comprehensive with 5 cases covering success, 404, validation, and isolation.

### Issues Found
| Severity | Issue | Resolution |
|----------|-------|------------|
| MEDIUM | Zod error includes `details` for path param | Accepted - consistent with other endpoints |
| LOW | Full row returned when only existence needed | Accepted - negligible performance impact |

No fixes required.



