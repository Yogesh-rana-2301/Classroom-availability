# Component Specs: States, Spacing, Behavior, and Edge Cases

Date: 2026-03-31
Scope: Shared UI primitives and high-impact feature components in frontend

## Spec Conventions

- Spacing values reference current implementation in `frontend/src/styles.css`.
- Semantic token intent follows `docs/tasks/design-handoff/design-tokens.md`.
- All interactive components must support keyboard focus visibility.
- Loading and feedback patterns must remain consistent with async status blocks and skeletons.

## 1) Button (`Button`)

Source: `frontend/src/shared/components/Button.jsx`

### Props

- `variant`: `primary` | `secondary` (defaults to `primary`; invalid values fallback to `primary`)
- `className`: optional
- Native button props: `type`, `disabled`, `onClick`, etc.

### States

- Default
- Hover
- Focus-visible
- Disabled

### Spacing and Sizing

- Vertical/horizontal padding: `0.58rem 0.95rem` for `ca-button`
- Radius: `8px`

### Behavior

- `primary`: filled action button
- `secondary`: outlined neutral action button
- Disabled suppresses hover lift and shadow

### Accessibility

- Must keep visible focus ring via global focus-visible styles
- Native button semantics preserved

### Edge Cases

- Unknown `variant` values should render as `primary`
- Long labels should wrap minimally; keep labels concise in usage

## 2) TextInput (`TextInput`)

Source: `frontend/src/shared/forms/TextInput.jsx`

### Props

- Pass-through native input props
- `className`: optional

### States

- Default
- Focus-visible
- Invalid (`form-input-invalid`)
- Disabled/read-only

### Spacing and Sizing

- Padding: `0.55rem 0.65rem`
- Radius: `8px`
- Border: `1px` strong border token

### Behavior

- Composes class list as `ca-input` + custom className
- Used for text, email, password, number, date, time, file, and search

### Accessibility

- Usage must include labels via parent form components
- Invalid state must be paired with `aria-invalid` and `aria-describedby`

### Edge Cases

- File input styling may differ by browser
- Invalid class should not remove base input classes

## 3) Page Header (`PageHeader`)

Source: `frontend/src/shared/components/PageHeader.jsx`

### Props

- `title` (required)
- `description` (optional)
- `breadcrumbs` (optional array)
- `meta` (optional node)
- `actions` (optional node)

### States

- Full header: breadcrumb + title + description + meta + actions
- Minimal header: title only

### Spacing and Sizing

- Header bottom padding: `0.85rem`
- Header bottom margin: `1rem`
- Breadcrumb gap: `0.35rem`

### Behavior

- Renders a single page-level `h1`
- Last breadcrumb item uses `aria-current="page"`
- Action slot right-aligned

### Accessibility

- Breadcrumb nav uses `aria-label="Breadcrumb"`
- Heading hierarchy starts at `h1` and page sections continue at `h2`

### Edge Cases

- Empty breadcrumbs array omits nav region cleanly
- Non-link current crumb renders as text span

## 4) Data Table (`DataTable`)

Source: `frontend/src/shared/table/DataTable.jsx`

### Props

- `columns`: array with `key`, `label`, optional `sortable`, optional `sortAccessor`
- `rows`: array of row objects
- `className`: optional
- `emptyMessage`: optional

### States

- Default with rows
- Sorted ascending
- Sorted descending
- Empty state

### Spacing and Sizing

- Cell padding: `0.7rem`
- Header background: subtle surface
- Empty-state padding: `1.3rem 0.8rem`

### Behavior

- Initial sort defaults to first sortable column ascending
- Sorting toggles asc/desc on repeated click
- Non-sortable columns render static text header
- Sort icon indicates current state (`↑`, `↓`, `↕`)

### Accessibility

- Uses semantic table markup
- Sortable headers expose `aria-sort`
- Sort controls are keyboard-accessible buttons

### Edge Cases

- Mixed value types sort as string/number fallback
- Rows without `id` use index key fallback
- Empty data renders friendly instructional message

## 5) Base Modal (`BaseModal`)

Source: `frontend/src/shared/modal/BaseModal.jsx`

### Props

- `title`
- `children`
- `onClose`
- `width`: `md` | `lg` (class-based)

### States

- Open default
- Closing via backdrop click
- Closing via Escape key

### Spacing and Sizing

- Modal padding: `1rem`
- Radius: `12px`
- Width: `min(94vw, 620px)` (`md`) and `min(94vw, 760px)` (`lg`)

### Behavior

- Traps focus within dialog while open
- Restores previously focused element on close
- Escape closes modal
- Backdrop click closes modal

### Accessibility

- `role="dialog"`, `aria-modal="true"`, labeled by `aria-label`
- Focuses first interactive element on open
- Keyboard tab loop maintained

### Edge Cases

- If no focusable elements exist, dialog container receives focus
- Multiple rapid opens/closes must not lose focus restoration target

## 6) Loading Skeletons (`TextSkeleton`, `TableSkeleton`, `TimelineSkeleton`)

Source: `frontend/src/shared/components/LoadingSkeleton.jsx`

### Props

- `TextSkeleton`: `lines`, `label`
- `TableSkeleton`: `rows`, `columns`, `label`
- `TimelineSkeleton`: `rows`, `label`

### States

- Default shimmer
- Reduced-motion fallback (no animation)

### Spacing and Sizing

- Text line height: `0.85rem`
- Table cell height: `0.85rem`
- Timeline row columns: `160px 120px 1fr` (desktop)

### Behavior

- Announces loading region with `role="status"` and `aria-live="polite"`
- Visual placeholders are `aria-hidden`

### Accessibility

- Reduced-motion mode disables shimmer animation
- Loading labels should be context-specific in page usage

### Edge Cases

- Very small containers may compress skeleton layout; keep parent min-width practical

## 7) Form Error Summary (`FormErrorSummary`)

Source: `frontend/src/shared/feedback/FormErrorSummary.jsx`

### Props

- `errors` object
- `title` optional

### States

- Hidden when no messages
- Visible alert with list of errors

### Spacing and Sizing

- Padding: `0.6rem 0.7rem`
- Margin bottom: `0.75rem`

### Behavior

- Collects and renders truthy error values as list items

### Accessibility

- Uses `role="alert"` to announce blocking validation summary

### Edge Cases

- Duplicate messages may appear if upstream validators duplicate text

## 8) Field Error (`FieldError`)

Source: `frontend/src/shared/feedback/FieldError.jsx`

### Props

- `id`
- `message`

### States

- Hidden with empty message
- Inline visible error message

### Spacing and Sizing

- Font size: `0.82rem`

### Behavior

- Renders one field-level alert line

### Accessibility

- Should be referenced by field `aria-describedby`
- Uses `role="alert"`

### Edge Cases

- Missing `id` still renders text but loses explicit `aria-describedby` targeting

## 9) Booking Form (`BookingForm`)

Source: `frontend/src/features/bookings/components/BookingForm.jsx`

### Props

- `onSubmit`
- `initialValues`
- `isLoading`
- `submitLabel`
- `lockRoomAndDate`
- `hideLockedFields`

### States

- Default create state
- Validation error state
- Loading/submit state
- Locked room/date state
- Modal compact state (locked fields hidden)

### Spacing and Sizing

- Form grid gap: `0.6rem`
- Field min width behavior via responsive grid auto-fit

### Behavior

- Syncs selected slot and date from `initialValues` via effect
- Runs schema validation before submit
- Trims string payload fields before validation

### Accessibility

- Field labels and helper text included
- Invalid fields use `aria-invalid`
- Errors mapped through summary and field-level messages

### Edge Cases

- Time comparison edge: end time equal/earlier than start must be blocked upstream page logic
- Hidden locked fields should still preserve internal payload values

## 10) Availability Grid (`AvailabilityGrid`)

Source: `frontend/src/features/availability/components/AvailabilityGrid.jsx`

### Props

- `slots`
- `onSelectSlot`
- `selectedSlot`

### States

- Available
- Booked
- Unavailable
- Maintenance
- Selectable row
- Selected row

### Spacing and Sizing

- Desktop row columns: `180px 140px 1fr`
- Mobile collapses to single-column rows

### Behavior

- Builds canonical hourly timeline from 08:00 to 21:00
- Normalizes upstream slot schema variants (`startTime`, `start`, `from`, etc.)
- Applies conflict-priority logic for overlapping slots
- Supports click and keyboard selection (`Enter`, `Space`) for available rows

### Accessibility

- Uses table-like roles and column/cell semantics
- Selectable rows are keyboard-focusable with descriptive `aria-label`

### Edge Cases

- Invalid time strings are ignored in normalization
- Overlapping slot priority may hide lower-priority details

## 11) Maintenance Switch (`MaintenanceSwitch`)

Source: `frontend/src/features/admin/maintenance/MaintenanceSwitch.jsx`

### Props

- `value`
- `onChange`
- `disabled`
- `isLoading`

### States

- Checked (maintenance)
- Unchecked (active)
- Saving
- Disabled

### Spacing and Sizing

- Inline row gap: `0.4rem`

### Behavior

- Emits boolean via checkbox `onChange`
- Displays transient `Saving...` text while mutation is pending

### Accessibility

- Uses native checkbox semantics
- Label wraps control for larger click target

### Edge Cases

- If parent optimistic update fails, parent must rollback value and show error

## 12) Status and Async Feedback Patterns

Source: `frontend/src/styles.css`, page-level usage

### Shared Blocks

- `status-info`: in-progress async operation
- `status-success`: successful operation
- `status-error`: blocking/server or action failure

### Behavior

- Place status block above data region for immediate visibility
- Pair loading status with skeletons on data-heavy pages
- Keep result container mounted when possible to reduce layout shift

### Edge Cases

- Concurrent async actions on a page should use scoped status copy to avoid ambiguity

## Acceptance Criteria for Component Spec Completion

- Every reusable component has documented props, states, spacing, behavior, and edge cases.
- Feature-critical components for booking, availability, and admin flows are included.
- Accessibility requirements are explicit for interactive and feedback components.
- Spec is implementation-aligned with current code and styles.
