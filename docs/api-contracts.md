# API Contract Reference (v1)

Base URL: `/api/v1`

## Common Response Envelope

All endpoints return this shape:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "a9a5fbb2-7f0f-4a5f-9dd7-ae0fbb1c9fca",
    "module": "auth",
    "action": "login"
  }
}
```

Error shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "message": "details" }],
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "a9a5fbb2-7f0f-4a5f-9dd7-ae0fbb1c9fca",
    "module": "system",
    "action": "error"
  }
}
```

---

## Auth Endpoints

### POST `/auth/login`

Request:

```json
{
  "email": "faculty@pec.local",
  "password": "DevPass@123"
}
```

Success 200:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx123",
      "email": "faculty@pec.local",
      "role": "FACULTY",
      "fullName": "Faculty User"
    },
    "accessToken": "<jwt>"
  },
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "req-id",
    "module": "auth",
    "action": "login"
  }
}
```

### POST `/auth/refresh`

Request: no body, requires `refreshToken` cookie.

Success 200:

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "user": {
      "id": "clx123",
      "email": "faculty@pec.local",
      "role": "FACULTY",
      "fullName": "Faculty User"
    },
    "accessToken": "<jwt>"
  },
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "req-id",
    "module": "auth",
    "action": "refresh"
  }
}
```

### POST `/auth/logout`

Request body (optional fallback token):

```json
{
  "refreshToken": "<optional-refresh-token>"
}
```

Success 200:

```json
{
  "success": true,
  "message": "Logged out",
  "data": { "message": "Logged out" },
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "req-id",
    "module": "auth",
    "action": "logout"
  }
}
```

---

## Booking Endpoints

### Date And Timezone Policy

- Booking and availability calendar dates use strict `YYYY-MM-DD` input format.
- Date-only values are normalized to UTC midnight (`00:00:00.000Z`) for storage and comparisons.
- Date range filters (`fromDate`, `toDate`) are interpreted as UTC calendar-day bounds.
- Slot fields (`startTime`, `endTime`) are timezone-less `HH:mm` wall-clock values and are compared on the same selected calendar date.
- API responses may return booking `date` as an ISO UTC timestamp (for example `2026-03-25T00:00:00.000Z`) representing the same canonical day.

### GET `/bookings/my?page=1&pageSize=20&status=CONFIRMED`

Success 200:

```json
{
  "success": true,
  "message": "My bookings",
  "data": {
    "items": [
      {
        "id": "bk_1",
        "classroomId": "room_1",
        "userId": "user_1",
        "date": "2026-03-25T00:00:00.000Z",
        "startTime": "10:00",
        "endTime": "11:00",
        "purpose": "Quiz",
        "status": "CONFIRMED",
        "createdAt": "2026-03-23T10:00:00.000Z",
        "updatedAt": "2026-03-23T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20,
    "count": 1
  },
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "req-id",
    "module": "bookings",
    "action": "mine"
  }
}
```

### GET `/bookings/:id`

Rules:

- Admin can read any booking.
- Faculty can read only own booking.

Possible errors:

- `403` Not allowed to view this booking
- `404` Booking not found

### PATCH `/bookings/:id/cancel`

Rules:

- Admin can cancel any booking.
- Faculty can cancel only own booking.

Possible errors:

- `403` Not allowed to cancel this booking
- `404` Booking not found

---

## Admin Timetable Endpoints

### POST `/admin/timetable/import`

Request:

```json
{
  "academic_year": "2025-2026",
  "department": "Computer Science and Engineering",
  "schedule": {
    "Monday": {
      "09:00-10:00": [
        { "course": "CSN4004-CAO G2", "venue": "L22" },
        { "course": "DSN4003-AI", "venue": "L407, Lab 304" }
      ]
    }
  }
}
```

Success 200:

```json
{
  "success": true,
  "message": "Timetable import processed",
  "data": {
    "message": "Timetable imported successfully",
    "payloadPreview": 3,
    "importedClassrooms": 3,
    "importedSlots": 3
  },
  "meta": {
    "timestamp": "2026-03-23T10:00:00.000Z",
    "requestId": "req-id",
    "module": "admin",
    "action": "importTimetable"
  }
}
```

Validation failures 400:

- invalid day labels
- invalid slot format (`HH:mm-HH:mm` expected)
- missing venue
- empty slot set

### GET `/admin/timetable?page=1&pageSize=50&dayOfWeek=1&classroomId=<id>`

Success 200: paginated list payload.

### GET `/admin/bookings?page=1&pageSize=20&status=CONFIRMED`

Success 200: paginated list payload.

### GET `/admin/audit-logs?page=1&pageSize=50&action=AUTH_LOGIN`

Success 200: paginated rows payload.

---

## Headers

- `x-request-id`: echoed in response for traceability.
- `authorization: Bearer <access-token>`: required for protected endpoints.
