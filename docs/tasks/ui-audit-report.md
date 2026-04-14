# UI Audit Report (Primary Pages)

Date: 2026-03-30
Scope: Login, Dashboard, Classrooms, Room Availability, My Bookings, Admin Timetable, Admin Maintenance, Admin Audit Logs

## Rubric

Scoring scale: 1 (poor) to 5 (excellent)

- Clarity: Is the page purpose and state immediately understandable?
- Hierarchy: Is visual structure guiding attention to the most important actions?
- Usability: Are primary tasks efficient, predictable, and low-friction?
- Accessibility: Is the page keyboard/screen-reader/contrast friendly?
- Responsiveness: Does layout adapt well to smaller viewports?

## Scorecard

| Page              | Clarity | Hierarchy | Usability | Accessibility | Responsiveness | Notes                                                                                                                     |
| ----------------- | ------: | --------: | --------: | ------------: | -------------: | ------------------------------------------------------------------------------------------------------------------------- |
| Login             |       4 |         3 |         4 |             4 |              3 | Clean, understandable flow; minimal visual guidance and no dedicated mobile spacing strategy.                             |
| Dashboard         |       2 |         2 |         1 |             3 |              3 | Placeholder content; no actionable information architecture yet.                                                          |
| Classrooms        |       4 |         3 |         4 |             3 |              3 | Functional filter/table workflow; dense controls and weak table semantics for advanced assistive use.                     |
| Room Availability |       4 |         3 |         4 |             3 |              4 | Booking flow works; timeline is usable but row density and state affordances can be clearer.                              |
| My Bookings       |       4 |         3 |         4 |             3 |              3 | Solid task completion path; table-heavy presentation lacks stronger status prominence.                                    |
| Admin Timetable   |       3 |         3 |         3 |             3 |              4 | Good utility surface; JSON-first interaction is efficient for technical users but high-friction for non-technical admins. |
| Admin Maintenance |       4 |         3 |         4 |             3 |              3 | Practical list-and-toggle interaction; can improve scanning and state discoverability.                                    |
| Admin Audit Logs  |       3 |         3 |         3 |             3 |              3 | Useful filter model; metadata readability and table density reduce scan speed.                                            |

Overall average score: 3.3 / 5

## Findings By Rubric Dimension

### Clarity

- Strong: Most pages open with a clear title and one-line purpose statement.
- Gap: Dashboard currently does not expose role-specific summaries or quick actions, reducing orientation value.

### Hierarchy

- Strong: Consistent page shell with heading, context paragraph, controls, then data.
- Gap: Primary actions often share visual weight with secondary actions; there is limited typographic or spatial emphasis for critical tasks.

### Usability

- Strong: Filtering, pagination, and CRUD-adjacent flows are predictable across pages.
- Gap: Many workflows remain table-centric with limited progressive disclosure, making dense screens harder to parse quickly.

### Accessibility

- Strong: Labels exist for most inputs, alert/status roles are present for feedback, and availability rows include keyboard Enter/Space interaction.
- Gap: No explicit skip link or landmark strategy, limited visible focus customization, and mixed table patterns (native + div role table) may create inconsistent assistive behavior.

### Responsiveness

- Strong: Mobile breakpoint rules exist for paginations/toolbars and the availability grid collapses to one column.
- Gap: Data density remains high in table-driven views and page containers rely on fixed max-width patterns that can still feel cramped at intermediate widths.

## Top 10 Pain Points (Prioritized)

1. High: Dashboard does not provide actionable role-based content, creating a dead-end first screen.
2. High: Navigation labels are functional but not grouped by task context (student/faculty/admin), increasing cognitive load.
3. High: Table-heavy pages rely on horizontal scanning without stronger row grouping or sticky context.
4. Medium: Filter controls and table actions often have equal visual weight; primary intent is not always obvious.
5. Medium: Audit metadata cell readability is low for long JSON values.
6. Medium: Timetable import experience assumes JSON literacy and lacks a guided mode.
7. Medium: Feedback states exist but are visually subtle; success and error emphasis can be improved.
8. Medium: Mobile adaptations stack controls, but complex data views still require heavy scrolling and scanning.
9. Medium: Focus treatment is mostly browser default; stronger visible focus style is needed for consistent keyboard affordance.
10. Low: Visual identity is minimal and utilitarian, reducing perceived polish and trust.

## Top 10 Pain Points With Severity + Screenshot Evidence

Screenshot capture status: Blocked in this session because the automated capture terminal command was skipped.

| #   | Pain Point                                                                           | Severity | Page                                   | Screenshot Target                                                                                                           |
| --- | ------------------------------------------------------------------------------------ | -------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Dashboard lacks role-based actions and key metrics; users land on a low-value state. | High     | Dashboard                              | `docs/tasks/ux-screenshots/02-dashboard-empty.png`                                                                          |
| 2   | Navigation is role-filtered but not task-grouped, increasing wayfinding effort.      | High     | Global shell                           | `docs/tasks/ux-screenshots/03-classrooms-dense-filters.png`                                                                 |
| 3   | Data tables dominate workflows, producing high horizontal scan load.                 | High     | Classrooms                             | `docs/tasks/ux-screenshots/03-classrooms-dense-filters.png`                                                                 |
| 4   | Filter toolbar and primary actions share similar emphasis, reducing action clarity.  | Medium   | Classrooms                             | `docs/tasks/ux-screenshots/03-classrooms-dense-filters.png`                                                                 |
| 5   | Availability timeline rows are dense and status distinctions rely heavily on color.  | Medium   | Room Availability                      | `docs/tasks/ux-screenshots/04-room-availability-grid-density.png`                                                           |
| 6   | Booking management remains table-centric with weak status prioritization cues.       | Medium   | My Bookings                            | `docs/tasks/ux-screenshots/05-my-bookings-table.png`                                                                        |
| 7   | Timetable import is JSON-first and high-friction for non-technical admins.           | Medium   | Admin Timetable                        | `docs/tasks/ux-screenshots/06-admin-timetable-json-first.png`                                                               |
| 8   | Maintenance controls require row-by-row scanning with limited contextual grouping.   | Medium   | Admin Maintenance                      | `docs/tasks/ux-screenshots/07-admin-maintenance-scan-load.png`                                                              |
| 9   | Audit metadata readability is low for long JSON payloads in table cells.             | Medium   | Admin Audit Logs                       | `docs/tasks/ux-screenshots/08-admin-audit-table-density.png`                                                                |
| 10  | Mobile layouts stack controls but still create dense, scroll-heavy data interaction. | Low      | Classrooms + Admin Audit Logs (mobile) | `docs/tasks/ux-screenshots/09-classrooms-mobile-density.png`, `docs/tasks/ux-screenshots/10-admin-audit-mobile-density.png` |

To generate these screenshot files, run the command sequence documented in `docs/tasks/ux-screenshots/README.md`.

## Evidence References

- Login layout and error handling: `frontend/src/pages/LoginPage.jsx`
- Login form labeling and validation summary: `frontend/src/features/auth/components/LoginForm.jsx`
- Dashboard placeholder content: `frontend/src/pages/DashboardPage.jsx`
- Classrooms filters/table/pagination: `frontend/src/pages/ClassroomsPage.jsx`
- Room timeline and booking flow: `frontend/src/pages/RoomAvailabilityPage.jsx`
- My bookings task flow: `frontend/src/pages/MyBookingsPage.jsx`
- Admin timetable import UX: `frontend/src/pages/AdminTimetablePage.jsx`, `frontend/src/features/admin/timetable/TimetableUploader.jsx`
- Admin maintenance control surface: `frontend/src/pages/AdminMaintenancePage.jsx`, `frontend/src/features/admin/maintenance/MaintenanceSwitch.jsx`
- Admin audit logs table: `frontend/src/pages/AdminAuditLogsPage.jsx`, `frontend/src/features/admin/audit/AuditTable.jsx`
- Global navigation and shell: `frontend/src/App.jsx`
- Global responsive and visual rules: `frontend/src/styles.css`

## Recommended Next Actions

1. Implement a role-aware dashboard with top 3 tasks, status cards, and direct actions.
2. Introduce a tokenized visual hierarchy system (type scale, spacing scale, emphasis tiers).
3. Redesign table-heavy pages with better scanning patterns (sticky headers, grouped filters, compact/comfortable density modes).
4. Add accessibility pass for focus styles, landmarks, skip links, and table semantics consistency.
5. Add responsive patterns for medium widths (768-1024) to reduce crowded control wrapping.
