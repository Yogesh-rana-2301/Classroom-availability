# Backend Tasks

## Completed

- [x] Express app scaffolded with modular route mounting
- [x] Auth, classrooms, bookings, and admin route modules created
- [x] Controllers/services/repositories scaffolded by module
- [x] Request validation middleware added (`validateRequest`)
- [x] Async error wrapper middleware added (`asyncHandler`)
- [x] Routes wired to controllers for auth, classrooms, bookings, admin
- [x] Login service implemented with bcrypt password verification
- [x] JWT access + refresh token generation implemented
- [x] Refresh token cookie handling implemented in auth controller
- [x] Booking create flow wired to conflict service
- [x] Booking conflict checks include timetable, maintenance, and overlap
- [x] Booking create + audit log write implemented transactionally
- [x] Centralized error handler improved for status/statusCode
- [x] Harden refresh token strategy (rotation/revocation table)
- [x] Add proper auth session persistence for refresh tokens (DB-backed)
- [x] Add logout token revocation logic
- [x] Add role/permission constants shared across modules
- [x] Add consistent DTO/response formatter per module
- [x] Add pagination/filtering on list endpoints
- [x] Add endpoint-level authorization checks for booking read/cancel
- [x] Add admin timetable import parser (JSON validation + transactional upsert)
- [x] Add global request ID and structured logging
- [x] Add rate limiting for auth endpoints
- [x] Add API contract docs (request/response examples)


## In Progress
   

## To Do

Incentivisation Phase Tasks
 [P0 | Day 0-30] Add recurring booking API for weekly/term one-click repeat booking

 [P0 | Day 0-30] Add smart alternatives API returning top 3 room suggestions by capacity, building proximity, facilities, and closest time

 [P0 | Day 0-30] Add emergency fast-book API path (2-click flow support with defaults)

 [P0 | Day 0-30] Add book-again API from booking history

 [P0 | Day 0-30] Add usual-room presets CRUD API

 [P0 | Day 0-30] Add feature-flag targeting for pilot department rollout

 [P0 | Day 0-30] Add analytics events for time-to-book and completion funnel

 [P1 | Day 31-60] Add timetable auto-sync ingestion API (not only manual import)

 [P1 | Day 31-60] Add exception-edit APIs for auto-synced timetable

 [P1 | Day 31-60] Add auto-notification event pipeline for student room-change alerts

 [P1 | Day 31-60] Add personal time-saved service (hours saved, conflicts avoided, suggestions accepted)

 [P1 | Day 31-60] Add fallback reserve-queue with admin-assisted auto-allocation

 [P1 | Day 31-60] Add auto-approval rules engine for low-risk requests

 [P1 | Day 31-60] Add experiment assignment and exposure endpoints for A/B tests

 [P2 | Day 61-90] Add ERP integration connector and reconciliation jobs

 [P2 | Day 61-90] Add LMS integration connector and reconciliation jobs

 [P2 | Day 61-90] Add Google Calendar integration and sync conflict handling

 [P2 | Day 61-90] Add incentive logic: faculty priority access, reliability badge, instant confirmation eligibility

 [P2 | Day 61-90] Add referral-credit and first-3-bookings-assisted backend workflows

 [P2 | Day 61-90] Add department adoption and utilization leaderboard APIs

## Done Criteria

- All MVP endpoints return stable validated responses.
- Auth/session handling is secure enough for deployment.
- Core booking lifecycle is production-safe and auditable.
