# Testing & QA Tasks

## Completed

- [x] Basic runtime smoke checks executed for backend startup
- [x] Static diagnostics check reports no file errors after recent wiring
- [x] MVP regression checklist defined
- [x] API test suite scaffolding for MVP regression execution

## In Progress

- [ ] Expand MVP API scaffold with maintenance/timetable and rate-limit cases

## MVP Regression Checklist

Run this checklist before each MVP release candidate.

### Environment & Seed

- [ ] Backend starts without runtime errors.
- [ ] Frontend loads and can reach backend API.
- [ ] Seed data is present (admin, faculty, student users).

### Authentication & Access Control

- [ ] Valid login works for each role (admin, faculty, student).
- [ ] Invalid login returns expected error message.
- [ ] Unauthenticated access to protected APIs returns `401`.
- [ ] Role-restricted endpoints deny unauthorized roles with `403`.

### Booking Core Flows

- [ ] User can create a booking in an available room/time slot.
- [ ] Duplicate/overlapping booking request is rejected.
- [ ] User can view own bookings in My Bookings page.
- [ ] Booking cancellation (if enabled in MVP) works and updates availability.

### Conflict Rules

- [ ] Booking requests conflicting with timetable are rejected.
- [ ] Booking requests conflicting with maintenance windows are rejected.
- [ ] Conflict responses return clear and consistent error payloads.

### Admin Flows

- [ ] Admin can view audit logs page without errors.
- [ ] Admin can manage maintenance entries (create/update/delete as supported).
- [ ] Admin timetable operations work for expected CRUD scope.

### Validation & Error Paths

- [ ] Required-field validation failures return `400` with field details.
- [ ] Invalid path params/query/body types return `400`.
- [ ] Non-existent resource requests return `404` where expected.

### Frontend Smoke

- [ ] Login page renders and submits successfully.
- [ ] Room Availability page loads and displays data.
- [ ] My Bookings page loads current user bookings.
- [ ] Admin pages load only for admin users.

### Non-Functional Sanity

- [ ] Request logging and request IDs are present in backend logs.
- [ ] Rate limits on auth endpoints behave as expected.
- [ ] No new console errors in browser during core flows.

### Regression Sign-off

- [ ] All checklist items pass.
- [ ] Any failures are linked to tracked issues.
- [ ] Release decision recorded (`GO` / `NO-GO`) with date and owner.

## To Do

- [ ] Add unit tests for auth service (valid/invalid login)
- [ ] Add unit tests for booking conflict service overlap logic
- [ ] Add integration tests for booking creation happy and conflict paths
- [ ] Add integration tests for maintenance and timetable conflict cases
- [ ] Add API tests for validation failures (400 paths)
- [ ] Add auth middleware tests for missing/invalid tokens
- [ ] Add seed validation test to confirm dev users are present
- [ ] Add frontend smoke tests for login and bookings pages

## Done Criteria

- Core API behavior is covered by automated tests.
- Role permissions are verified by test and manual checklist.
- Booking conflict edge cases are regression protected.
