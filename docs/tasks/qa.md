# Testing & QA Tasks

## Completed

- [x] Basic runtime smoke checks executed for backend startup
- [x] Static diagnostics check reports no file errors after recent wiring

## In Progress

- [~] Define MVP regression checklist

## To Do

- [ ] Add unit tests for auth service (valid/invalid login)
- [ ] Add unit tests for booking conflict service overlap logic
- [ ] Add integration tests for booking creation happy and conflict paths
- [ ] Add integration tests for maintenance and timetable conflict cases
- [ ] Add API tests for validation failures (400 paths)
- [ ] Add auth middleware tests for missing/invalid tokens
- [ ] Add seed validation test to confirm dev users are present
- [ ] Add frontend smoke tests for login and bookings pages
- [ ] Add manual QA checklist for role-based behavior

## Done Criteria

- Core API behavior is covered by automated tests.
- Role permissions are verified by test and manual checklist.
- Booking conflict edge cases are regression protected.
