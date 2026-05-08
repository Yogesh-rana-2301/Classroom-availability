# Deployment Runbook (Staging and Production)

This document is the step-by-step guide to deploy the Classroom Availability application safely.

Use it for:

- first deployment
- regular releases
- hotfix releases

## 1. Deployment Overview

The application has 3 deployable parts:

- Frontend (Vite React app, static files)
- Backend (Node.js Express API)
- PostgreSQL database

Recommended public URLs:

- Frontend: https://app.yourdomain.com
- Backend API: https://api.yourdomain.com

### 1.1 Best Platform Choice If You Will Use github.io

If your frontend must be on a GitHub Pages domain, the best practical setup is:

- Frontend: GitHub Pages (github.io)
- Backend API: Render Web Service (or Railway/Fly.io equivalent)
- Database: Managed PostgreSQL (Neon or Render Postgres)

Why this is the best fit:

- GitHub Pages is static-only, so it is ideal for this Vite frontend.
- Backend and PostgreSQL need server/runtime support, which github.io does not provide.
- Render + managed Postgres gives simple setup, HTTPS, logs, health checks, and auto deploy from GitHub.

Recommended URL shape for this project:

- Frontend: https://<github-username>.github.io/<repo-name>/
- Backend API: https://<your-backend-service>.onrender.com/api/v1

## 2. Prerequisites

Complete these before deployment day.

### 2.1 Access and Accounts

- Git repository read access
- Server access for backend host (VM/container/platform)
- Database admin access for initial setup
- DNS access to configure frontend/backend domains
- TLS certificates (or managed HTTPS from hosting provider)

### 2.2 Required Tooling

- Node.js 18+
- npm 9+
- PostgreSQL 16+ (or managed equivalent)
- Prisma CLI available through project dependencies

### 2.3 Production Permissions and Security Baseline

- Create a dedicated database user for the app (do not use a superuser for runtime)
- Restrict database ingress to backend host/network only
- Enforce HTTPS for frontend and backend
- Store secrets in environment variables or a secret manager
- Do not commit .env files

## 3. Pre-Deployment Checklist

Run all checks from a clean local branch before release.

### 3.1 Validate Backend Build and API Tests

From backend:

```bash
npm ci
npm run test:api:mvp
```

Expected result:

- tests complete without failures

### 3.2 Validate Frontend Build

From frontend:

```bash
npm ci
npm run build
```

Expected result:

- build succeeds and generates dist output

### 3.3 Validate Database Schema State

From backend:

```bash
npx prisma validate
```

Expected result:

- Prisma schema is valid

## 4. Environment Variables

## 4.1 Backend Required Variables

Set these in your backend runtime environment:

```env
NODE_ENV=production
PORT=4000
FRONTEND_ORIGIN=https://app.yourdomain.com

DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>

JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
AUTH_MAX_REFRESH_SESSIONS=5
```

Rules:

- FRONTEND_ORIGIN must exactly match deployed frontend origin
- Use long random JWT secrets (at least 32 bytes)
- Use separate secrets per environment (staging and production)

## 4.2 Frontend Required Variables

Set during frontend build:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

Rule:

- VITE_API_URL must point to backend API base path ending in /api/v1

## 4.3 Cross-Origin Auth Requirement (Important for github.io)

When frontend and backend are on different sites (for example github.io and onrender.com), cookie behavior is stricter.

Current code sets refresh cookie as `sameSite: "lax"`. That often breaks refresh-token flows for cross-site XHR requests.

For cross-site deployment, use:

- `sameSite: "none"`
- `secure: true`

Also ensure:

- backend `FRONTEND_ORIGIN` equals your github.io origin exactly (for example `https://<github-username>.github.io`)
- frontend API client uses `withCredentials: true` (already present)

## 5. Database Provisioning and Migration

## 5.1 Create Database

Create the target database and runtime user in PostgreSQL.

## 5.2 Run Migrations (Production-Safe)

From backend in deployment environment:

```bash
npm ci
npx prisma migrate deploy
```

Do not use prisma db push in production.

## 5.3 Seed Data Policy

Important:

- Do not run npm run prisma:seed in production.
- Current seed script is destructive for existing data because it performs cleanup first.

Use seed only in local development or disposable environments.

## 6. Backend Deployment Steps

Run on backend host:

```bash
cd backend
npm ci --omit=dev
npx prisma migrate deploy
npm run start
```

Production recommendation:

- run backend with a process manager (systemd, PM2, container orchestrator)
- configure automatic restart on crash
- configure structured log collection

### 6.1 Backend Health Check

After start, verify:

```bash
curl -i https://api.yourdomain.com/api/v1/health
```

Expected:

- HTTP 200
- response contains status ok

## 7. Frontend Deployment Steps

On frontend build environment:

```bash
cd frontend
npm ci
npm run build
```

Deploy generated frontend/dist contents to static hosting (Nginx, CDN, Vercel, Netlify, S3+CloudFront, etc.).

### 7.1 GitHub Pages Deployment (github.io)

If you are deploying to GitHub Pages:

1. Ensure frontend build uses correct base path.
2. Build and publish `frontend/dist` to GitHub Pages.
3. Configure GitHub Pages source to GitHub Actions.

For Vite project pages, build with repository base path:

```bash
cd frontend
npm ci
npm run build -- --base=/<repo-name>/
```

If your repository is a user/organization site repository (`<username>.github.io`), base can remain `/`.

Set frontend build variable before deploy:

```env
VITE_API_URL=https://<your-backend-service>.onrender.com/api/v1
```

### 7.2 Frontend Availability Check

- Open https://app.yourdomain.com
- Confirm login page loads without console errors

## 8. Reverse Proxy and Network Checks

If using Nginx/Caddy/ingress:

- Route frontend domain to static frontend
- Route backend domain to Node API service
- Forward client IP headers correctly
- Enable HTTPS redirect
- Set reasonable request body limits and timeouts

Verify CORS:

- backend FRONTEND_ORIGIN equals frontend URL exactly
- browser calls to backend include credentials successfully

If using github.io frontend + hosted backend:

- no reverse proxy is required for frontend hosting
- backend must allow CORS for github.io origin
- backend must serve HTTPS (required for secure cookies)

## 8.1 Platform Setup Steps (Recommended Stack)

### A) Deploy Database (Neon or Render Postgres)

1. Create a PostgreSQL instance.
2. Create app database and runtime user.
3. Copy connection string for `DATABASE_URL`.
4. Restrict network access to backend platform where possible.

### B) Deploy Backend (Render)

1. Create a new Render Web Service from the GitHub repo.
2. Set Root Directory to `backend`.
3. Build command: `npm ci`
4. Start command: `npm run start`
5. Add environment variables from section 4.1.
6. Set `FRONTEND_ORIGIN` to `https://<github-username>.github.io`.
7. Run migration once per release: `npx prisma migrate deploy`.
8. Set health check path to `/api/v1/health`.

### C) Deploy Frontend (GitHub Pages)

1. Build frontend with the correct Vite base.
2. Publish `frontend/dist` through GitHub Pages workflow.
3. Verify site opens at github.io URL.
4. Verify login calls backend API URL from `VITE_API_URL`.

## 9. Stakeholder Account Provisioning and Login

There is no public self-signup flow in the current backend.

That means stakeholders must be provisioned by admin/ops before they can log in.

## 9.1 Create Stakeholder Users

For each stakeholder, create a User row with:

- email
- fullName
- role (ADMIN, FACULTY, or STUDENT)
- passwordHash (bcrypt)

Safe option:

- use a controlled one-time admin script
- or insert through secure internal admin tooling

## 9.2 Share Login Details

Share with stakeholder:

- frontend URL
- email
- temporary password
- role and expected permissions

Ask stakeholder to log in and confirm role-based access:

- ADMIN: admin routes and controls available
- FACULTY: booking actions available, no admin routes
- STUDENT: read-only availability access

## 10. Smoke Test Checklist After Deployment

Run these checks every release.

### 10.1 API and Auth

- Health endpoint returns 200
- Login works for one account from each role
- Auth refresh works (session survives token expiry)
- Logout invalidates refresh session

### 10.2 Core Business Flows

- Classroom list loads
- Availability endpoint returns slots
- Faculty can create booking in free slot
- Conflict booking is blocked
- Admin can view audit logs
- Admin can toggle maintenance mode

### 10.3 Security and Access

- Unauthorized request to protected route returns 401
- Wrong-role request to admin route returns 403
- Cookies are HttpOnly and Secure in production

## 11. Operational Jobs and Ongoing Checks

## 11.1 Backups

Follow backup and restore runbook:

- docs/backup-restore.md

Minimum policy:

- daily automated backups
- periodic restore validation drills

## 11.2 Audit Retention

Follow retention policy:

- docs/audit-log-retention.md

Schedule regular retention execution with correct retention days per environment.

## 11.3 Monitoring

Track at minimum:

- API uptime
- error rate
- p95 latency
- database CPU/storage
- login failure spikes

## 12. Rollback Procedure

If deployment causes major regression:

1. Put system in maintenance communication mode (announce degraded service).
2. Roll backend back to last known good release artifact.
3. Roll frontend back to last known good static build.
4. If migration is backward-incompatible, restore database from pre-release backup using docs/backup-restore.md.
5. Re-run smoke tests before reopening access.

## 13. Release Sign-Off Template

Use this before marking deployment complete.

- [ ] Frontend deployed and accessible via HTTPS
- [ ] Backend deployed and health check passing
- [ ] Database migrations applied successfully
- [ ] Backup created before migration
- [ ] Stakeholder accounts provisioned
- [ ] Role-based access verified (ADMIN/FACULTY/STUDENT)
- [ ] Core booking flow validated
- [ ] Audit logs visible to admin
- [ ] Monitoring and alerts confirmed
- [ ] Rollback artifact and plan confirmed

## 14. Known Project-Specific Notes

- Use npm run start for backend production process.
- Keep frontend VITE_API_URL aligned to backend public API URL.
- Do not run local dev reset or destructive seed commands in production.
