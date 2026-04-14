# Responsive Breakpoints and Layout Behavior by Page Type

Date: 2026-03-31
Applies To: Frontend routes and shared layout in `frontend/src`

## Breakpoint Model

Use these canonical viewport ranges for responsive behavior:

- Mobile: 0px to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above

Optional large-desktop enhancement tier:

- Wide Desktop: 1280px and above

## Global Layout Behavior

### App Shell (authenticated pages)

- Mobile:
  - Top bar remains visible.
  - Sidebar is hidden.
  - Mobile navigation drawer is used.
  - Content uses single-column flow.
- Tablet:
  - Top bar remains visible.
  - Sidebar is visible in compact width.
  - Content uses single-column page stack with comfortable spacing.
- Desktop:
  - Top bar + persistent sidebar.
  - Two-column app frame (navigation + content).

### Guest Shell (login/unauthenticated)

- Mobile: reduced page padding and full-width form container.
- Tablet: centered card with moderate max-width.
- Desktop: centered card with full spacing rhythm.

## Page Type Behaviors

### 1) Overview Pages (Dashboard)

Examples:

- `DashboardPage`

Behavior:

- Mobile: single-column action layout; header actions wrap below title.
- Tablet: single-column with wider content region; header actions stay inline if space allows.
- Desktop: action remains right-aligned in page header.

### 2) Data-Heavy Listing Pages

Examples:

- `ClassroomsPage`
- `MyBookingsPage`
- `AdminMaintenancePage`
- `AdminAuditLogsPage`

Behavior:

- Mobile:
  - Filters stack into one column.
  - Pagination actions stack vertically.
  - Data tables allow horizontal scroll within container.
- Tablet:
  - Filters use 2-column grid where practical.
  - Pagination remains horizontal when space permits.
  - Tables remain scrollable for dense columns.
- Desktop:
  - Filters use multi-column auto-fit grids.
  - Pagination remains single-row with summary + controls.
  - Full table widths are favored before wrapping metadata.

### 3) Availability and Booking Workflow Pages

Examples:

- `RoomAvailabilityPage`

Behavior:

- Mobile:
  - Availability controls stack vertically.
  - Timeline grid collapses to one-column row cards.
  - Booking modal uses near-full width and reduced inner spacing.
- Tablet:
  - Controls align in two-column layout where possible.
  - Timeline preserves scan order with readable spacing.
  - Booking modal stays centered with medium width.
- Desktop:
  - Controls align in a single row.
  - Timeline uses full three-column grid (time, status, details).
  - Booking modal uses large dialog width for form clarity.

### 4) Form-First Admin Pages

Examples:

- `AdminTimetablePage`

Behavior:

- Mobile:
  - Upload actions stack vertically.
  - Large text input stretches full width.
- Tablet:
  - Upload actions can align horizontally if room allows.
  - Result summary stays in single column.
- Desktop:
  - Action row is horizontal with clear primary/secondary grouping.
  - Summary and uploader remain vertically ordered for readability.

### 5) Utility Pages

Examples:

- `LoginPage`
- `NotFoundPage`

Behavior:

- Mobile: compact spacing and full-width content card.
- Tablet: centered card with increased breathing room.
- Desktop: centered card at comfortable reading width.

## Header, Navigation, and Action Placement Rules

- Primary page action remains in header action slot at all breakpoints.
- On mobile, header actions may wrap below title and meta content.
- Breadcrumbs stay visible and wrap naturally; they do not truncate essential hierarchy labels.

## Responsive Interaction Rules

- Touch target minimum: 44x44 CSS pixels on mobile and tablet.
- Keyboard interaction parity is required at all breakpoints.
- Focus indicators remain visible and must not be clipped by overflow containers.

## Implementation Mapping

Current implementation references:

- App shell and responsive nav behavior in `frontend/src/App.jsx`
- Responsive styles and page class rules in `frontend/src/styles.css`

Required alignment tasks for full breakpoint adoption:

1. Expand responsive CSS from current single mobile cutoff to explicit mobile/tablet/desktop ranges.
2. Add tablet media query rules for filter grids, pagination alignment, and availability controls.
3. Keep desktop behavior as baseline and layer mobile/tablet overrides progressively.

## Acceptance Criteria

- Every page type listed above has explicit behavior at mobile, tablet, and desktop.
- No key workflow becomes inaccessible due to overflow, clipping, or hidden actions.
- Navigation, forms, tables, and booking flow preserve usability across all ranges.
