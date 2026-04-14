# High-Fidelity Mockup Inventory

Date: 2026-03-31
Primary artifact: `docs/tasks/design-handoff/high-fidelity-mockups.html`
Styles: `docs/tasks/design-handoff/high-fidelity-mockups.css`

## Coverage Summary

All key pages and major states are represented as high-fidelity boards:

1. Login page
2. Dashboard page
3. Classrooms page
4. Room Availability page
5. Booking modal state set
6. My Bookings page
7. Admin Timetable page
8. Admin Maintenance page
9. Admin Audit Logs page
10. Not Found utility page

## State Coverage by Page

### Login

- Default form
- Session bootstrap/loading
- Auth error feedback

### Dashboard

- Default KPI/card summary
- Loading placeholders (represented in card shell)
- Empty guidance variant

### Classrooms

- Filtered results view
- Loading table skeleton
- Empty state with reset guidance

### Room Availability

- Timeline default with state legend
- Loading timeline skeleton
- Read-only variant note (student)
- Selectable available slot behavior

### Booking Modal

- Create-booking form state
- Validation/error state
- Success confirmation state

### My Bookings

- Results table
- Loading skeleton state
- Cancel success/error feedback

### Admin Timetable

- JSON editor default
- Import in progress
- Import success summary
- Validation/error output state

### Admin Maintenance

- Room list + toggle controls
- Loading table skeleton
- Toggle pending/optimistic state
- Rollback error and success feedback

### Admin Audit Logs

- Filter + dense log table
- Loading table skeleton
- Empty search result state
- Error feedback state

### Not Found

- Utility fallback state
- Recovery CTA actions

## Review Notes for Design/Engineering

- Visual hierarchy mirrors existing IA and page header system.
- Data-heavy pages preserve filter + table + pagination structure.
- Async behaviors align with implemented skeleton and status-message patterns.
- Accessibility affordances (clear feedback, non-color-only labels) are preserved in state annotations.

## How to Open

- Open `docs/tasks/design-handoff/high-fidelity-mockups.html` in browser.
- Keep CSS file in the same directory for full styling fidelity.
