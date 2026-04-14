# Token and Component Update Implementation Map

Date: 2026-03-31
Related docs:

- `docs/tasks/design-handoff/design-tokens.md`
- `docs/tasks/design-handoff/token-governance.md`
- `docs/tasks/design-handoff/component-specs.md`
- `docs/tasks/design-handoff/high-fidelity-mockups.md`

## Objective

Translate token and component design decisions into frontend implementation tasks with clear target files, validation criteria, and rollout order.

## Workstream A: Token Adoption Tasks

### A1. Global semantic token consolidation

- Goal: ensure `frontend/src/styles.css` consumes semantic tokens consistently and avoid drift from token spec names.
- Target files:
  - `frontend/src/styles.css`
- Task actions:
  - Normalize color, border, spacing, radius, and motion declarations to semantic token names.
  - Keep only minimal component-local exceptions.
- Validation:
  - No regressions in build and stylelint.
  - Contrast checks remain AA-compliant on key flows.

### A2. Motion token alignment

- Goal: align implemented motion variables with token governance naming and usage policy.
- Target files:
  - `frontend/src/styles.css`
  - `docs/tasks/design-handoff/design-tokens.md`
- Task actions:
  - Ensure durations/easing used by interactions map to approved token set.
  - Keep reduced-motion overrides for all animated/transitional surfaces.
- Validation:
  - Motion behavior present in standard mode and disabled in reduced-motion mode.

### A3. Responsive token and breakpoint alignment

- Goal: match responsive behavior implementation with documented breakpoint spec.
- Target files:
  - `frontend/src/styles.css`
  - `docs/tasks/design-handoff/responsive-breakpoints-layout-behavior.md`
- Task actions:
  - Expand current media queries to explicit mobile/tablet/desktop layering where missing.
- Validation:
  - Filters, tables, timeline, and nav behaviors match documented per-page breakpoint behavior.

## Workstream B: Shared Component Update Tasks

### B1. Shared Button contract hardening

- Component: `Button`
- Source file: `frontend/src/shared/components/Button.jsx`
- Task actions:
  - Ensure variant set is explicit and future-safe (`primary`, `secondary`, optional future additions).
  - Confirm style hooks remain token-driven in CSS.
- Validation:
  - Buttons render correct visual and interaction states across all pages.

### B2. Shared input consistency

- Component: `TextInput`
- Source file: `frontend/src/shared/forms/TextInput.jsx`
- Task actions:
  - Confirm invalid/disabled/read-only handling remains consistent in all forms.
  - Keep input focus and error states aligned with accessibility guidance.
- Validation:
  - Form controls pass keyboard and screen-reader expectations in login, booking, and admin forms.

### B3. Data table behavior standardization

- Component: `DataTable`
- Source file: `frontend/src/shared/table/DataTable.jsx`
- Task actions:
  - Preserve sortable behavior, aria-sort semantics, and empty-state copy standards.
  - Keep loading-state shell integration at page level with `TableSkeleton`.
- Validation:
  - Sorting and empty states are consistent across classrooms, bookings, maintenance, and audit pages.

### B4. Modal behavior and lifecycle consistency

- Component: `BaseModal`
- Source file: `frontend/src/shared/modal/BaseModal.jsx`
- Task actions:
  - Preserve focus trap, Escape handling, and focus restoration.
  - Keep overlay/backdrop behavior consistent with motion settings.
- Validation:
  - Booking modal interaction passes keyboard-only flow checks.

### B5. Loading skeleton pattern consistency

- Components: `TextSkeleton`, `TableSkeleton`, `TimelineSkeleton`
- Source file: `frontend/src/shared/components/LoadingSkeleton.jsx`
- Task actions:
  - Keep all data-heavy pages on skeleton + status pattern.
  - Prevent fallback to plain text-only loading in new pages.
- Validation:
  - Async views show stable structure during loading and clear status messaging.

## Workstream C: Feature Component Mapping

### C1. Booking flow components

- Components:
  - `BookingForm`
  - `AvailabilityGrid`
- Target files:
  - `frontend/src/features/bookings/components/BookingForm.jsx`
  - `frontend/src/features/availability/components/AvailabilityGrid.jsx`
  - `frontend/src/pages/RoomAvailabilityPage.jsx`
- Task actions:
  - Ensure booking slot selection, validation, and confirmation states align with component specs and mockups.
- Validation:
  - Faculty/admin create-booking flow works across default, validation-error, and success states.

### C2. Admin operation components

- Components:
  - `MaintenanceSwitch`
  - Audit/maintenance table integrations
- Target files:
  - `frontend/src/features/admin/maintenance/MaintenanceSwitch.jsx`
  - `frontend/src/pages/AdminMaintenancePage.jsx`
  - `frontend/src/pages/AdminAuditLogsPage.jsx`
- Task actions:
  - Keep optimistic update feedback and pending toggle behavior explicit.
- Validation:
  - Admin state transitions are visible and reversible on failure.

### C3. Auth and form feedback components

- Components:
  - `FormErrorSummary`
  - `FieldError`
- Target files:
  - `frontend/src/shared/feedback/FormErrorSummary.jsx`
  - `frontend/src/shared/feedback/FieldError.jsx`
  - `frontend/src/pages/LoginPage.jsx`
  - `frontend/src/features/auth/components/LoginForm.jsx`
- Task actions:
  - Keep global and field-level error pattern consistent and accessible.
- Validation:
  - Login and booking forms surface actionable errors with correct aria wiring.

## Route-Level Implementation Checklist

### Key route pages and required component/token coverage

1. `frontend/src/pages/LoginPage.jsx`

- Components: `TextInput`, `FormErrorSummary`, `FieldError`, `TextSkeleton`, `Button`
- Token focus: status, input, action, focus ring, motion/reduced-motion

2. `frontend/src/pages/ClassroomsPage.jsx`

- Components: `PageHeader`, `DataTable`, `TableSkeleton`, `Button`, `TextInput`
- Token focus: table surfaces, filters, pagination, empty-state text

3. `frontend/src/pages/RoomAvailabilityPage.jsx`

- Components: `PageHeader`, `AvailabilityGrid`, `BookingForm`, `BaseModal`, `TimelineSkeleton`
- Token focus: availability status colors, selected/hover states, modal elevation/motion

4. `frontend/src/pages/MyBookingsPage.jsx`

- Components: `PageHeader`, `BookingTable` (via `DataTable`), `TableSkeleton`, status feedback
- Token focus: status message hierarchy, table/pagination consistency

5. `frontend/src/pages/AdminTimetablePage.jsx`

- Components: `PageHeader`, `TimetableUploader`, form feedback, status messaging
- Token focus: status/info/error surfaces and form shell consistency

6. `frontend/src/pages/AdminMaintenancePage.jsx`

- Components: `PageHeader`, `DataTable`, `MaintenanceSwitch`, `TableSkeleton`
- Token focus: toggle pending/disabled cues, data-surface consistency

7. `frontend/src/pages/AdminAuditLogsPage.jsx`

- Components: `PageHeader`, `AuditTable` (via `DataTable`), `TableSkeleton`, filters
- Token focus: dense-data readability and metadata cell styling

## Validation Matrix

After each mapped batch, run:

1. `npm run lint:styles`
2. `npm run build`
3. Keyboard and focus pass on affected pages
4. Contrast spot-check for touched status/interactive colors

## Suggested Delivery Sequence

1. Foundation: A1 + A2 + B1/B2/B3
2. Interaction core: B4 + B5
3. Flow integrity: C1 + C2 + C3
4. Route-level verification and regression checks

## Done Criteria for This Mapping Task

- Every token and component concern maps to explicit frontend files and tasks.
- Key route pages include required component/token coverage notes.
- Validation and rollout sequence are defined for implementation planning.
