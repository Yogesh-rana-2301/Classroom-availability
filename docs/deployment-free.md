# Free and Easy Deployment (Render + Neon)

This is the simplest no-cost setup for this repo:

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: Neon PostgreSQL (free tier)

Tradeoff: free tiers sleep on inactivity. The first request after idle can be slow.

## 1) Create the database (Neon)

1. Create a Neon account and a new PostgreSQL project.
2. Copy the connection string as DATABASE_URL.

## 2) Deploy the backend (Render Web Service)

1. Create a new Render Web Service from this GitHub repo.
2. Set the root directory to backend.
3. Build command:

   npm ci

4. Start command:

   npm start

5. Set environment variables:

   NODE_ENV=production
   PORT=4000
   FRONTEND_ORIGIN=https://<your-frontend>.onrender.com

   DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>

   JWT_ACCESS_SECRET=<random-32+bytes>
   JWT_REFRESH_SECRET=<random-32+bytes>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   AUTH_MAX_REFRESH_SESSIONS=5

6. After the first deploy, open the Shell in Render and run:

   npx prisma migrate deploy

7. Verify health:

   https://<your-backend>.onrender.com/api/v1/health

Expected: HTTP 200 and status ok.

## 3) Deploy the frontend (Render Static Site)

1. Create a new Render Static Site from this repo.
2. Set the root directory to frontend.
3. Build command:

   npm ci && npm run build

4. Publish directory:

   dist

5. Set environment variable:

   VITE_API_URL=https://<your-backend>.onrender.com/api/v1

6. Deploy and open the frontend URL.

## 4) Post-deploy checks

- Login and confirm API calls succeed.
- Create a booking and verify it appears in the UI.
- If refresh token fails across domains, update cookie settings in backend:

  sameSite: "none"
  secure: true

(Only needed for cross-site auth issues.)
