# Classroom Availability System

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Role-Based Access](#role-based-access)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The Smart Classroom Scheduling and Resource Optimization System is a centralized, web-based institutional platform designed to manage classroom availability, handle bookings, and provide utilization analytics for Punjab Engineering College. The system replaces manual scheduling processes with an automated, conflict-aware engine that ensures transparency, efficiency, and optimal use of campus infrastructure. 


---

## Problem Statement

Traditional classroom management in academic institutions relies heavily on manual processes, leading to:

- No room availability for taking quizzes.
- Time wastage due to the absence of a centralized availability system
- Double booking conflicts arising from uncoordinated scheduling
- Poor room utilization with no data-driven visibility into usage patterns
- Lack of transparency for faculty and students regarding room status

This system addresses these issues by providing a real-time, role-based scheduling platform with intelligent conflict detection and resource analytics.

---

## System Architecture

The system follows a three-tier architecture:

**Presentation Layer**
The frontend provides a role-specific dashboard for Admins, Faculty, and Students. The interface reflects real-time room status and booking actions.

**Application Layer**
The backend handles all business logic including booking validation, conflict detection, role-based authorization, and room recommendation. This is where the core intelligence of the system resides.

**Data Layer**
A relational database stores all structured data with indexed time-slot querying to ensure performant schedule lookups across large datasets.

---

## Features

### Core Features

- **Real-Time Availability Display** — Rooms display live status as Available, Occupied, or Reserved, updated instantly on any booking or cancellation.
- **Timetable Engine** — Admins can upload official recurring weekly timetables. Core timetable slots are locked and cannot be overridden without administrative authority.
- **Conflict Detection Engine** — When a booking request is submitted, the system automatically checks for time-slot overlaps and prevents double booking. Alternative rooms and closest free time slots are suggested automatically.
- **Role-Based Access Control** — Distinct permissions are enforced for each user role (Admin, Faculty, Student).
- **Booking Management** — Faculty can create, view, and cancel bookings. All bookings are timestamped and logged for audit purposes.
- **Analytics Dashboard** — Admins have access to utilization reports, peak-hour heatmaps, most frequently booked rooms, and cancellation trends.
- **Maintenance Mode** — Admins can mark rooms as temporarily unavailable due to maintenance or other institutional requirements.
- **Audit Logs** — All system actions including bookings, cancellations, and overrides are recorded for accountability.
- **Email Notifications** — Users receive automated notifications for booking confirmations, cancellations, and reminders.

### Advanced Features

- **QR Code Check-In** — Scan the QR code outside the class and room instantly.
- **Smart Room Recommendation** — The system suggests rooms based on required capacity, available facilities (projector, AC, smartboard), and building proximity.

---

## Technology Stack

| Layer          | Technology              |
|----------------|-------------------------|
| Frontend       | React   |
| Backend        | Node.js  |
| Database       | PostgreSQL    |
| Authentication | JWT-based Role System   |
| Real-Time      | Socket.io  |
| Hosting        | Github   |
| Version Control| Git and GitHub          |

---

## Database Schema

The following entities form the core data model:

- **Users** — Stores user credentials, roles, and contact information.
- **Roles** — Defines permission sets for Admin, Faculty, and Student.
- **Classrooms** — Stores room number, building, capacity, and available facilities.
- **RoomFacilities** — Maps facility types to classrooms (AC, projector, smartboard, etc.).
- **Timetable** — Stores recurring official schedules linked to rooms, subjects, and faculty.
- **Bookings** — Records all booking requests with status (Pending, Confirmed, Cancelled).
- **Logs** — Audit trail of all user actions within the system.

Database indexes are applied on Room ID, Date, and Time Slot columns to optimize query performance.

---

## Installation and Setup

### Prerequisites  (/ To be fulfilled)

- [Runtime, e.g., Node.js v18+] installed
- [Database, e.g., PostgreSQL 15+] installed and running
- Git installed

### Steps

1. Clone the repository.

```bash
git clone https://github.com/yogesh-rana-2301/classroom-availability.git
cd classroom-availability
```

2. Install backend dependencies.

```bash
cd backend
[npm install / pip install -r requirements.txt]
```

3. Install frontend dependencies.

```bash
cd frontend
npm install
```

4. Configure environment variables (see section below).

5. Run database migrations.

```bash
[Migration command for your stack]
```

6. Start the development servers.

```bash
# Backend
[Start command, e.g., npm run dev]

# Frontend
npm run dev
```

The application will be accessible at `http://localhost:[port]`.

---

## Environment Variables

### Backend

Create a `.env` file in the `backend` directory (you can copy from `backend/.env.example`) and populate the following:

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/classroom_availability
JWT_ACCESS_SECRET=replace-with-access-secret
JWT_REFRESH_SECRET=replace-with-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
AUTH_MAX_REFRESH_SESSIONS=5
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend

Create a `.env` file in the `frontend` directory (you can copy from `frontend/.env.example`):

```bash
cd frontend
cp .env.example .env
```

Required frontend variable:

```
VITE_API_URL=http://localhost:4000/api/v1
```

Frontend environment notes:

- Variable names must start with `VITE_` to be exposed to the Vite client bundle.
- Keep `VITE_API_URL` pointed to your backend API base URL.
- Backend CORS origin (`FRONTEND_ORIGIN` in backend env) should match your frontend dev URL, normally `http://localhost:5173`.
- If cookies/session refresh stop working locally, verify frontend and backend ports/origins are consistent with the two variables above.

---

## Usage

### Admin

- Log in with admin credentials.
- Upload or configure the official weekly timetable under the Timetable Management section.
- Monitor room utilization through the Analytics Dashboard.
- Approve, override, or cancel bookings via the Admin Panel.
- Mark rooms under maintenance using the Room Management section.

### Faculty

- Log in with faculty credentials.
- View the real-time classroom availability grid.
- Submit a booking request by selecting a room, date, and time slot.
- Receive automatic conflict alerts and alternative room suggestions if a slot is unavailable.
- Cancel existing bookings from the My Bookings section.

### Student  

- Log in with student credentials.
- View classroom availability in read-only mode.
- [Restriction to be released for CRs]

---

## Role-Based Access

| Feature                     | Admin | Faculty | Student |
|-----------------------------|-------|---------|---------|
| View room availability      | Yes   | Yes     | Yes     |
| Create booking              | Yes   | Yes     | No      |
| Cancel own booking          | Yes   | Yes     | No      |
| Override any booking        | Yes   | No      | No      |
| Upload timetable            | Yes   | No      | No      |
| Access analytics dashboard  | Yes   | No      | No      |
| Mark room under maintenance | Yes   | No      | No      |
| View audit logs             | Yes   | No      | No      |

---

## API Documentation

Base URL: `http://localhost:[port]/api`

| Method | Endpoint                        | Description                        | Access       |
|--------|---------------------------------|------------------------------------|--------------|
| POST   | /auth/login                     | Authenticate user and return JWT   | Public       |
| GET    | /classrooms                     | Retrieve all classrooms            | All roles    |
| GET    | /classrooms/:id/availability    | Get availability for a room        | All roles    |
| POST   | /bookings                       | Create a new booking               | Admin, Faculty |
| GET    | /bookings/my                    | Get bookings of the current user   | Admin, Faculty |
| DELETE | /bookings/:id                   | Cancel a booking                   | Admin, Faculty |
| GET    | /analytics/utilization          | Get room utilization stats         | Admin        |
| POST   | /timetable/upload               | Upload timetable data              | Admin        |
| PATCH  | /classrooms/:id/maintenance     | Toggle maintenance mode            | Admin        |

For full API documentation, refer to : [TBD] .

---

## Contributing

This project was developed as a college-level institutional project. Contributions from team members follow the branching strategy below.

1. Create a feature branch from `main`.

```bash
git checkout -b feature/[feature-name]
```

2. Commit changes with descriptive messages.

```bash
git commit -m "Add: [brief description of change]"
```

3. Push and open a pull request for review before merging. 

---

## License

This project is developed for academic purposes at Punjab Engineering College. Unauthorized commercial use is not permitted. For academic reference and institutional use only.

2026 - Punjab Engineering College
