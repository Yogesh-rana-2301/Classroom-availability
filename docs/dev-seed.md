# Dev Seed Quickstart

## 1) Backend env

Copy `backend/.env.example` to `backend/.env` and verify:

- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/classroom_availability`

## 2) Create schema and seed data

From `backend`:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

Or reset and reseed from scratch:

```bash
npm run dev:db:reset
```

## 3) Dev login accounts

- `admin@pec.local` / `DevPass@123`
- `faculty@pec.local` / `DevPass@123`
- `student@pec.local` / `DevPass@123`

## 4) Vertical slice test

1. Login with faculty or admin.
2. Call `POST /api/v1/bookings` with a free room/date/time slot.
3. Verify booking is created.
4. Verify `AuditLog` has `BOOKING_CREATED`.
