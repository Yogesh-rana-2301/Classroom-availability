# Folder and Component Structure

## Frontend

- `src/app`: providers, guards, layout
- `src/pages`: route-level pages
- `src/features`: feature modules (`auth`, `availability`, `bookings`, `admin`)
- `src/shared`: reusable UI primitives
- `src/services`: API/http concerns
- `src/constants`, `src/utils`, `src/types`: cross-feature utilities

Feature module contract:

- `api`: server calls
- `hooks`: data + side effects
- `components`: feature UI
- `index.js`: public exports

## Backend

- `src/config`: env and db client
- `src/middleware`: auth and role guards
- `src/common`: errors/logger/validators/response helpers
- `src/modules`: business modules
- `src/routes`: route aggregation
- `src/app`: app bootstrap helpers

Module contract:

- `*.routes.js`: HTTP paths and middleware
- `*.controller.js`: request/response mapping
- `*.service.js`: business logic and orchestration
- `*.repository.js`: database access
- `*.schemas.js`: input validation contracts

## Suggested Next Wiring

1. Route files should call controllers directly.
2. Controllers should validate using `*.schemas.js`.
3. Services should invoke repositories and audit service.
4. Booking conflict logic should include timetable and maintenance checks.
