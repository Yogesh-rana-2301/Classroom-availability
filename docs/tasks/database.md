# Database Tasks

## Completed

- [x] Prisma schema created for `User`, `Classroom`, `TimetableSlot`, `Booking`, `AuditLog`
- [x] Role and booking status enums created
- [x] Core indexes added for booking and audit queries
- [x] Booking uniqueness constraint added on room/date/time slot tuple
- [x] Prisma seed script added with known dev users
- [x] Sample classrooms and timetable slots included in seed

## In Progress

- [~] Verify local DB availability and run full push + seed workflow

## To Do

- [ ] Add migration history (use `prisma migrate dev`)
- [ ] Decide canonical timezone policy for `date` and slot comparisons
- [ ] Add DB constraints for valid time slot values where possible
- [ ] Add soft-delete or history strategy for timetable updates
- [ ] Add seed cleanup strategy for repeated local runs
- [ ] Add backup/restore instructions for staging/production
- [ ] Add data retention policy for audit logs

## Blocked

- [!] Local `prisma db push` and seed execution is blocked when Docker Desktop is paused.

## Done Criteria

- Schema migrated and reproducible in local/staging/prod.
- Seed and reset commands run reliably on fresh machines.
- Data model supports all MVP flows without manual DB edits.
