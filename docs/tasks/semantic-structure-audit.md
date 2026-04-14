# Semantic Structure Audit (Headings and Landmarks)

Date: 2026-03-31
Scope: Frontend route pages under `frontend/src/pages`

## Verification Criteria

- Each page exposes exactly one primary heading (`h1`) as page title.
- Subsections use descending heading levels without skipping levels.
- Landmark structure is present and meaningful:
  - app-level `main`
  - page-level `header`/`nav` where applicable
  - sidebar `aside` and navigation landmarks for authenticated shell

## Findings by Page

- Login (`LoginPage.jsx`): Pass
  - Single `h1` page title is present in both render branches.
  - Page is rendered within app-level `main` landmark.

- Dashboard (`DashboardPage.jsx`): Pass
  - `PageHeader` provides a single `h1`.
  - No heading level skips.

- Classrooms (`ClassroomsPage.jsx`): Pass
  - `PageHeader` `h1` plus section `h2` headings (`Filter Rooms`, `Results`).
  - No heading level skips.

- Room Availability (`RoomAvailabilityPage.jsx`): Pass after fix
  - `PageHeader` `h1` plus section `h2` headings.
  - Fixed heading jump from `h4` to `h3` in booking confirmation state.

- My Bookings (`MyBookingsPage.jsx`): Pass
  - `PageHeader` `h1` plus section `h2` headings.

- Admin Timetable (`AdminTimetablePage.jsx`): Pass
  - `PageHeader` `h1` plus section `h2` headings.

- Admin Maintenance (`AdminMaintenancePage.jsx`): Pass
  - `PageHeader` `h1` plus section `h2` headings.

- Admin Audit Logs (`AdminAuditLogsPage.jsx`): Pass
  - `PageHeader` `h1` plus section `h2` headings.

- Not Found (`NotFoundPage.jsx`): Pass
  - Single `h1` page heading (`404`) is present.

## Landmark Verification Summary

- Authenticated shell (`App.jsx`) provides:
  - top-level `main`
  - top `header`
  - top shortcut `nav`
  - sidebar `aside` with role-based `nav`
  - mobile navigation as modal `dialog` landmark context
- Guest shell renders route content inside `main`.

## Result

Semantic heading hierarchy and landmark usage are verified across key pages, with one heading-level correction applied in Room Availability.
