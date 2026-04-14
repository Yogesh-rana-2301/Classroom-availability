import { useEffect, useState } from "react";
import FieldError from "../../../shared/feedback/FieldError";
import FormErrorSummary from "../../../shared/feedback/FormErrorSummary";
import TextInput from "../../../shared/forms/TextInput";
import { validateBookingForm } from "../../../shared/forms/validators";

const defaultFormState = {
  roomId: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
};

export default function BookingForm({
  onSubmit,
  initialValues = {},
  isLoading = false,
  submitLabel = "Create Booking",
  lockRoomAndDate = false,
  hideLockedFields = false,
}) {
  const [form, setForm] = useState({
    ...defaultFormState,
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      roomId: initialValues.roomId ?? prev.roomId,
      date: initialValues.date ?? prev.date,
      startTime: initialValues.startTime ?? prev.startTime,
      endTime: initialValues.endTime ?? prev.endTime,
    }));
  }, [
    initialValues.date,
    initialValues.endTime,
    initialValues.roomId,
    initialValues.startTime,
  ]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      roomId: String(form.roomId || "").trim(),
      date: String(form.date || "").trim(),
      startTime: String(form.startTime || "").trim(),
      endTime: String(form.endTime || "").trim(),
      purpose: String(form.purpose || "").trim(),
    };

    const validation = validateBookingForm(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(payload);
  }

  return (
    <form
      className="booking-form form-layout"
      onSubmit={handleSubmit}
      noValidate
    >
      <FormErrorSummary errors={errors} />

      {!hideLockedFields ? (
        <>
          <label className="form-field" htmlFor="booking-room-id">
            <span className="form-label">Room ID</span>
            <TextInput
              id="booking-room-id"
              className={errors.roomId ? "form-input-invalid" : ""}
              placeholder="Room ID"
              value={form.roomId}
              onChange={(e) => update("roomId", e.target.value)}
              disabled={isLoading || lockRoomAndDate}
              readOnly={lockRoomAndDate}
              required
              aria-invalid={Boolean(errors.roomId)}
              aria-describedby={
                errors.roomId ? "booking-room-id-error" : "booking-room-id-help"
              }
            />
            <span id="booking-room-id-help" className="form-helper">
              {lockRoomAndDate
                ? "Room is pre-selected from the availability page."
                : "Use the official room code."}
            </span>
            <FieldError id="booking-room-id-error" message={errors.roomId} />
          </label>

          <label className="form-field" htmlFor="booking-date">
            <span className="form-label">Date</span>
            <TextInput
              id="booking-date"
              className={errors.date ? "form-input-invalid" : ""}
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              disabled={isLoading || lockRoomAndDate}
              readOnly={lockRoomAndDate}
              required
              aria-invalid={Boolean(errors.date)}
              aria-describedby={
                errors.date ? "booking-date-error" : "booking-date-help"
              }
            />
            <span id="booking-date-help" className="form-helper">
              Select the date for this booking.
            </span>
            <FieldError id="booking-date-error" message={errors.date} />
          </label>
        </>
      ) : null}

      <label className="form-field" htmlFor="booking-start-time">
        <span className="form-label">Start Time</span>
        <TextInput
          id="booking-start-time"
          className={errors.startTime ? "form-input-invalid" : ""}
          type="time"
          value={form.startTime}
          onChange={(e) => update("startTime", e.target.value)}
          disabled={isLoading}
          required
          aria-invalid={Boolean(errors.startTime)}
          aria-describedby={
            errors.startTime
              ? "booking-start-time-error"
              : "booking-start-time-help"
          }
        />
        <span id="booking-start-time-help" className="form-helper">
          Use 24-hour format, for example 09:30.
        </span>
        <FieldError id="booking-start-time-error" message={errors.startTime} />
      </label>

      <label className="form-field" htmlFor="booking-end-time">
        <span className="form-label">End Time</span>
        <TextInput
          id="booking-end-time"
          className={errors.endTime ? "form-input-invalid" : ""}
          type="time"
          value={form.endTime}
          onChange={(e) => update("endTime", e.target.value)}
          disabled={isLoading}
          required
          aria-invalid={Boolean(errors.endTime)}
          aria-describedby={
            errors.endTime ? "booking-end-time-error" : "booking-end-time-help"
          }
        />
        <span id="booking-end-time-help" className="form-helper">
          End time must be after start time.
        </span>
        <FieldError id="booking-end-time-error" message={errors.endTime} />
      </label>

      <label className="form-field" htmlFor="booking-purpose">
        <span className="form-label">Purpose</span>
        <TextInput
          id="booking-purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          disabled={isLoading}
          aria-describedby="booking-purpose-help"
        />
        <span id="booking-purpose-help" className="form-helper">
          Optional. Add brief context for this booking.
        </span>
      </label>

      <button className="form-submit" type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : submitLabel}
      </button>
    </form>
  );
}
