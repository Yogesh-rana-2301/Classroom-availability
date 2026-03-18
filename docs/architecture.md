# Classroom Availability Architecture (MVP)

## 1) Frontend Structure

- Framework: React + Vite
- Routing: React Router with protected and role-based routes
- Folders:
  - `src/app` for providers and router
  - `src/pages` for route-level pages
  - `src/features` for domain-specific UI logic
  - `src/services` for API client

## 2) Backend Structure

- Pattern: Modular monolith (single Express app)
- Modules:
  - auth
  - classrooms
  - bookings
  - admin
- Layers inside modules:
  - routes -> controllers/services (to be added) -> data access (Prisma)

## 3) Data Flow

1. Client sends authenticated request with JWT access token.
2. Middleware validates token and role.
3. Route invokes module logic.
4. Booking flow checks conflict against timetable, maintenance, existing bookings.
5. Write booking and audit log; return normalized response.

## 4) API Routes

- Auth:
  - POST `/api/v1/auth/login`
  - POST `/api/v1/auth/refresh`
  - POST `/api/v1/auth/logout`
  - GET `/api/v1/auth/me`
- Classrooms:
  - GET `/api/v1/classrooms`
  - GET `/api/v1/classrooms/:id`
  - GET `/api/v1/classrooms/:id/availability`
- Bookings:
  - POST `/api/v1/bookings`
  - GET `/api/v1/bookings/my`
  - GET `/api/v1/bookings/:id`
  - PATCH `/api/v1/bookings/:id/cancel`
- Admin:
  - POST `/api/v1/admin/timetable/import`
  - GET `/api/v1/admin/timetable`
  - PATCH `/api/v1/admin/classrooms/:id/maintenance`
  - GET `/api/v1/admin/bookings`
  - GET `/api/v1/admin/audit-logs`

## 5) Authentication Flow

1. Login validates credentials and returns short-lived access token.
2. Refresh endpoint rotates refresh token and returns new access token.
3. Protected routes require bearer access token.
4. Role guard checks Admin/Faculty/Student permissions.
5. Logout invalidates refresh token.

## 6) Deployment Overview

- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: Managed PostgreSQL
- Local DB via `docker-compose.yml`
- CI/CD pipeline should run lint, tests, and migrations before deploy.
