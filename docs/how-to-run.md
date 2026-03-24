# How to Run the Project

This guide explains how to run the Classroom Availability project in development mode.

## Prerequisites

- Node.js 18+
- npm 9+
- Docker (recommended for PostgreSQL)

## 1. Start the Database

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:

- Database: `classroom_availability`
- User: `postgres`
- Password: `postgres`

## 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

The default `.env.example` values are already aligned with the Docker database.

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

## 4. Verify DB Compatibility + Run Push and Seed

From `backend`:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --exit-code
npm run prisma:push
npm run prisma:seed
```

Expected compatibility result:

- `No difference detected.`

Expected push result:

- `The database is already in sync with the Prisma schema.`

Expected seed result:

- `Seed complete.`
- Dev credentials:
  - `admin@pec.local / DevPass@123`
  - `faculty@pec.local / DevPass@123`
  - `student@pec.local / DevPass@123`

If the compatibility command fails with `P1001 Can't reach database server`, start the DB first from project root:

```bash
docker compose up -d postgres
```

If you want a full reset during development:

```bash
npm run dev:db:reset
```

## 5. Start Backend

From `backend`:

```bash
npm run dev
```

Backend API runs on: `http://localhost:4000`

## 6. Configure Frontend Environment

In a second terminal:

```bash
cd frontend
cp .env.example .env
```

Default value:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

## 7. Install and Start Frontend

From `frontend`:

```bash
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 8. Log In

The backend seed script creates initial users. If you need credentials, check:

- `backend/prisma/seed.js`

## Useful Commands

From `backend`:

```bash
npm run start            # Run backend without nodemon
npm run prisma:push      # Push schema directly (no migration files)
```

From `frontend`:

```bash
npm run build
npm run preview
```

## Stop Services

- Stop frontend/backend: `Ctrl + C` in each terminal.
- Stop PostgreSQL container (from project root):

```bash
docker compose down
```
