# Database Tasks

## Completed

- [x] Prisma schema created for `User`, `Classroom`, `TimetableSlot`, `Booking`, `AuditLog`
- [x] Role and booking status enums created
- [x] Core indexes added for booking and audit queries
- [x] Booking uniqueness constraint added on room/date/time slot tuple
- [x] Prisma seed script added with known dev users
- [x] Sample classrooms and timetable slots included in seed
- [x] Verify local DB availability and run full push + seed workflow
- [x] Add migration history (use `prisma migrate dev`)
- [x] Decide canonical timezone policy for `date` and slot comparisons
- [x] Add DB constraints for valid time slot values where possible
- [x] Add soft-delete or history strategy for timetable updates
- [x] Add seed cleanup strategy for repeated local runs
- [x] Add backup/restore instructions for staging/production
- [x] Add data retention policy for audit logs

## In Progress

## To Do

Incentivisation Phase Tasks
[P0 | Day 0-30] Add recurring booking schema (series, recurrence rules, exceptions)

[P0 | Day 0-30] Add booking template schema for usual-room presets

[P0 | Day 0-30] Add indexing strategy for smart suggestion ranking (capacity, facilities, building, time)

[P0 | Day 0-30] Add booking event telemetry tables for time-to-book funnel metrics

[P0 | Day 0-30] Add feature-flag cohort tables for pilot and experiment targeting

[P1 | Day 31-60] Add timetable sync staging/canonical tables for automated imports

[P1 | Day 31-60] Add sync error and reconciliation ledger tables

[P1 | Day 31-60] Add notification delivery ledger for 99% delivery tracking

[P1 | Day 31-60] Add policy/automation rules tables for low-risk auto-approval

[P1 | Day 31-60] Add fallback reserve-queue and assignment state tables

[P1 | Day 31-60] Add personal time-saved aggregate tables/materialized views

[P1 | Day 31-60] Add experiment assignment/exposure tables for A/B analysis

[P2 | Day 61-90] Add external mapping tables for ERP/LMS/Google Calendar identifiers

[P2 | Day 61-90] Add incentive eligibility tables (priority access, reliability badge, instant confirmation)

[P2 | Day 61-90] Add referral credit ledger tables

[P2 | Day 61-90] Add department adoption and utilization aggregate views

[P2 | Day 61-90] Add monthly summary datasets for time-saved emails and recognition reports

## Blocked

- [!] Local `prisma db push` and seed execution is blocked when Docker Desktop is paused.

## Done Criteria

- Canonical policy: date-only fields are `YYYY-MM-DD`, normalized to UTC day boundaries; `startTime`/`endTime` are timezone-less `HH:mm` wall-clock slots.

- Schema migrated and reproducible in local/staging/prod.
- Seed and reset commands run reliably on fresh machines.
- Data model supports all MVP flows without manual DB edits.
