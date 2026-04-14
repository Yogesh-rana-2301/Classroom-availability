-- Enforce valid timetable slot day and time values.
ALTER TABLE "TimetableSlot"
ADD CONSTRAINT "TimetableSlot_dayOfWeek_range_check"
CHECK ("dayOfWeek" BETWEEN 0 AND 7);

ALTER TABLE "TimetableSlot"
ADD CONSTRAINT "TimetableSlot_startTime_format_check"
CHECK ("startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE "TimetableSlot"
ADD CONSTRAINT "TimetableSlot_endTime_format_check"
CHECK ("endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE "TimetableSlot"
ADD CONSTRAINT "TimetableSlot_time_order_check"
CHECK (
  CASE
    WHEN "startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      AND "endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
    THEN "startTime"::time < "endTime"::time
    ELSE false
  END
);

-- Enforce valid booking slot values and canonical date-only storage.
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_date_midnight_check"
CHECK ("date" = date_trunc('day', "date"));

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_startTime_format_check"
CHECK ("startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_endTime_format_check"
CHECK ("endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_time_order_check"
CHECK (
  CASE
    WHEN "startTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
      AND "endTime" ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
    THEN "startTime"::time < "endTime"::time
    ELSE false
  END
);
