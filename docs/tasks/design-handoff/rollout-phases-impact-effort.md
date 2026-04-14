# Rollout Prioritization: Impact/Effort and Implementation Phases

Date: 2026-03-31
Related inputs:

- `docs/tasks/design-handoff/token-component-implementation-map.md`
- `docs/tasks/design-handoff/component-specs.md`
- `docs/tasks/design-handoff/high-fidelity-mockups.md`

## Scoring Model

- Impact: 1 (low) to 5 (very high)
- Effort: 1 (small) to 5 (large)
- Priority score: Impact / Effort

Priority guidance:

- > = 1.5: Fast-track
- 1.0 to 1.49: Schedule in current/next phase
- < 1.0: Defer unless prerequisite

## Prioritized Work Items

| ID  | Work Item                                    | Impact | Effort | Score | Priority      | Dependencies |
| --- | -------------------------------------------- | -----: | -----: | ----: | ------------- | ------------ |
| P1  | Token consolidation in global styles         |      5 |      2 |  2.50 | Fast-track    | None         |
| P2  | Shared table + skeleton consistency          |      5 |      3 |  1.67 | Fast-track    | P1           |
| P3  | Modal and keyboard/focus integrity hardening |      5 |      3 |  1.67 | Fast-track    | P1           |
| P4  | Booking flow component alignment             |      5 |      4 |  1.25 | Current cycle | P1, P3       |
| P5  | Admin maintenance/audit state clarity        |      4 |      3 |  1.33 | Current cycle | P1, P2       |
| P6  | Auth and form-feedback consistency sweep     |      4 |      2 |  2.00 | Fast-track    | P1           |
| P7  | Breakpoint implementation parity with spec   |      4 |      4 |  1.00 | Current cycle | P1           |
| P8  | Motion token naming/policy alignment         |      3 |      2 |  1.50 | Fast-track    | P1           |
| P9  | Documentation and QA gate consolidation      |      3 |      2 |  1.50 | Fast-track    | P1-P8        |

## Implementation Phases

### Phase 0: Stabilization Baseline (0.5 sprint)

Goals:

- Lock current build/lint baseline.
- Confirm visual and accessibility regressions are not introduced during rollout.

Scope:

- Snapshot current behavior on key routes.
- Establish verification checklist per PR.

Exit criteria:

- `npm run build` and `npm run lint:styles` green.
- Baseline screenshots or route notes captured for key pages.

### Phase 1: Foundation and Fast-Track Wins (1 sprint)

Primary items: P1, P6, P8

Scope:

- Normalize semantic token use in global styles.
- Sweep form and feedback consistency across auth/booking/admin forms.
- Align motion token naming and reduced-motion policy usage.

Target files (primary):

- `frontend/src/styles.css`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/features/auth/components/LoginForm.jsx`
- `frontend/src/features/bookings/components/BookingForm.jsx`
- `frontend/src/shared/feedback/FormErrorSummary.jsx`
- `frontend/src/shared/feedback/FieldError.jsx`

Exit criteria:

- Token usage is consistent for core colors, borders, and motion properties.
- Form feedback pattern is uniform and accessible across key forms.

### Phase 2: Data Surface and Interaction Core (1 sprint)

Primary items: P2, P3, P5

Scope:

- Standardize table + skeleton behavior across data-heavy pages.
- Validate modal lifecycle/focus integrity and interaction edge cases.
- Improve maintenance and audit async state feedback consistency.

Target files (primary):

- `frontend/src/shared/table/DataTable.jsx`
- `frontend/src/shared/components/LoadingSkeleton.jsx`
- `frontend/src/shared/modal/BaseModal.jsx`
- `frontend/src/pages/ClassroomsPage.jsx`
- `frontend/src/pages/MyBookingsPage.jsx`
- `frontend/src/pages/AdminMaintenancePage.jsx`
- `frontend/src/pages/AdminAuditLogsPage.jsx`

Exit criteria:

- Data pages share a uniform loading/empty/sort behavior model.
- Modal interactions pass keyboard-only flow checks.

### Phase 3: Booking and Responsive Completion (1 sprint)

Primary items: P4, P7

Scope:

- Complete booking workflow parity with specs/mocks.
- Implement tablet-specific responsive behavior where still missing.

Target files (primary):

- `frontend/src/features/availability/components/AvailabilityGrid.jsx`
- `frontend/src/features/bookings/components/BookingForm.jsx`
- `frontend/src/pages/RoomAvailabilityPage.jsx`
- `frontend/src/styles.css`

Exit criteria:

- Booking flow states are fully aligned (default, validation, success, read-only).
- Mobile/tablet/desktop behavior matches responsive handoff doc.

### Phase 4: Hardening and Release Gate (0.5 sprint)

Primary items: P9

Scope:

- Final regression pass across role-based journeys.
- Consolidate docs and quality gates for handoff completion.

Exit criteria:

- All design-to-code handoff items complete.
- QA gate checklist published and accepted.

## Suggested Sprint Allocation

- Sprint A: Phase 0 + Phase 1
- Sprint B: Phase 2
- Sprint C: Phase 3 + Phase 4

## Risk and Mitigation

1. Risk: Token renaming causes visual regressions.

- Mitigation: keep semantic aliases and migrate incrementally by area.

2. Risk: Interaction updates break keyboard flows.

- Mitigation: include keyboard walkthrough in every PR touching nav/modal/forms.

3. Risk: Responsive updates create table overflow regressions.

- Mitigation: verify at mobile/tablet/desktop widths on all data-heavy pages.

## Definition of Done for Rollout Plan Task

- Impact/effort scoring exists for major work items.
- Work items are grouped into phased delivery with dependencies.
- Each phase has explicit scope, target files, and exit criteria.
- Sprint-level sequencing is defined for execution planning.
