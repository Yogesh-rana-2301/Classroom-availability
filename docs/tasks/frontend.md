# Frontend Tasks

## Completed

- [x] Vite + React app scaffolded
- [x] Route structure created for auth, classrooms, bookings, and admin pages
- [x] Basic auth context/provider setup added
- [x] Feature-based folders created (`auth`, `availability`, `bookings`, `admin`)
- [x] Shared UI component folders created (`components`, `forms`, `table`, `modal`, `feedback`)
- [x] API service client structure added
- [x] Connect login page to live backend login endpoint and token lifecycle

## In Progress

- [~] Build classrooms list UI with filters and pagination foundation

## To Do

- [ ] Build real login form UX with loading and error states
- [ ] Store access token in memory and implement refresh flow integration
- [ ] Implement classrooms list UI with filters and pagination
- [ ] Implement room availability timeline/grid UI
- [ ] Implement booking form flow from room availability page
- [ ] Implement my bookings page with cancel action
- [ ] Implement admin timetable import UI
- [ ] Implement maintenance toggle UI per room
- [ ] Implement admin audit logs table with filters
- [ ] Add role-based navigation visibility
- [ ] Add form validation and reusable error components
- [ ] Add frontend environment setup notes in README

## Done Criteria

- Faculty can login, see classrooms, create/cancel booking.
- Admin can login, upload timetable, toggle maintenance, view audit logs.
- Student can login and view read-only availability.
