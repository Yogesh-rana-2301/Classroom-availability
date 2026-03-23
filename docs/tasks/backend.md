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

- [ ] NAN 

## Done Criteria

- All MVP endpoints return stable validated responses.
- Auth/session handling is secure enough for deployment.
- Core booking lifecycle is production-safe and auditable.
