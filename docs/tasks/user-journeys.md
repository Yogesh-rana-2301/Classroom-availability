# Target User Journeys and Success Criteria

Date: 2026-03-30
Scope: Faculty, Student, Admin primary workflows for classroom availability system

## Journey Design Principles

- Each journey should complete in <= 5 major steps.
- The user should always know next action within 3 seconds of page load.
- Error recovery must be possible without restarting the flow.
- Every critical action should return visible confirmation state.

## Faculty Journeys

### F1. Find Room and Create Booking

Goal: Faculty books an available room quickly for a teaching activity.

Entry Points:

- Classrooms page
- Dashboard quick action (target)

Happy Path:

1. User logs in and opens Classrooms.
2. User applies filters (building/capacity/facilities).
3. User opens Room Availability for selected room/date.
4. User selects available slot and submits booking form.
5. System confirms booking and user sees updated availability.

Failure/Edge Paths:

- Conflict on submit: show conflict reason and alternative slot suggestion.
- Validation error: keep entered values and show inline guidance.
- Network error: keep form state and allow retry.

Success Criteria:

- > = 90% task completion rate in usability tests.
- Median time to create booking <= 2 minutes.
- Booking form validation error rate <= 15% of attempts.
- Post-submit confidence score >= 4/5.

### F2. Cancel Existing Booking

Goal: Faculty cancels a confirmed booking safely and quickly.

Happy Path:

1. User opens My Bookings.
2. User filters to Confirmed bookings.
3. User clicks Cancel and confirms action.
4. System updates row status and shows success feedback.

Success Criteria:

- > = 95% cancellation success on first attempt.
- Median time to cancel <= 45 seconds.
- Mis-cancel incidents (user regret due to unclear affordance) <= 2%.

## Student Journeys

### S1. Check Room Availability (Read-Only)

Goal: Student quickly determines if a room is free at a specific time.

Entry Points:

- Classrooms page
- Dashboard quick lookup (target)

Happy Path:

1. Student logs in and opens Classrooms.
2. Student filters/searches by room/building.
3. Student opens Room Availability and selects date.
4. Student reads slot statuses and exits.

Failure/Edge Paths:

- Empty search: suggest relaxed filters.
- Loading delay: show explicit loading state.

Success Criteria:

- > = 92% completion rate for "find if room is free now" task.
- Median time to answer availability question <= 60 seconds.
- Wrong interpretation of slot status <= 5% in test sessions.

### S2. Understand Access Boundaries

Goal: Student understands they can view availability but not create bookings.

Happy Path:

1. Student reaches booking section on availability page.
2. UI clearly communicates read-only restriction.
3. Student can continue browsing availability without friction.

Success Criteria:

- > = 95% of students correctly identify permission boundaries.
- Unauthorized action attempts per session <= 0.2.

## Admin Journeys

### A1. Import Official Timetable

Goal: Admin imports timetable data with confidence and minimal errors.

Entry Point:

- Admin Timetable page

Happy Path:

1. Admin opens Timetable Import.
2. Admin pastes/uploads payload.
3. Admin submits import.
4. System shows import summary (classrooms, slots, processed entries).

Failure/Edge Paths:

- Invalid JSON: show line-level parse error (target improvement).
- Validation error: show grouped, actionable field errors.

Success Criteria:

- > = 90% successful imports on first corrected attempt.
- Median time from page open to successful import <= 4 minutes.
- Import-related support requests reduced by >= 30% after UX improvements.

### A2. Toggle Room Maintenance Status

Goal: Admin can reliably mark rooms active/maintenance.

Happy Path:

1. Admin opens Maintenance page.
2. Admin filters/searches target room.
3. Admin toggles maintenance switch.
4. System confirms status update and row reflects new state.

Success Criteria:

- > = 98% toggle success rate.
- Median time to update one room <= 30 seconds.
- Wrong-room toggle incidents <= 1%.

### A3. Audit and Investigate Activity

Goal: Admin can locate relevant audit events quickly.

Happy Path:

1. Admin opens Audit Logs.
2. Admin applies filters (action/entity/user).
3. Admin identifies target row and metadata context.

Success Criteria:

- > = 90% success on finding a known event.
- Median time to locate event <= 90 seconds.
- Metadata comprehension score >= 4/5.

## Cross-Role KPI Dashboard

- Task completion rate by role and journey.
- Median time on task by journey.
- Error rate (validation, API, permission).
- Retry rate after first failure.
- User confidence score after completion (1-5).

## Acceptance Gate For Journey Quality

A journey is considered production-ready only if:

- Completion rate >= 90% for primary tasks.
- Median task time meets thresholds above for 2 consecutive test rounds.
- No critical accessibility blocker remains in the journey path.
- No blocker-level usability issue remains unmitigated.
