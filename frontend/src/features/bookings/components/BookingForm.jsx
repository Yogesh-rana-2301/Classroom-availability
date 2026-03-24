import { useEffect, useState } from "react";
import FieldError from "../../../shared/feedback/FieldError";
import FormErrorSummary from "../../../shared/feedback/FormErrorSummary";
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
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <FormErrorSummary errors={errors} />

      <label className="form-field">
        Room ID
        <input
          placeholder="Room ID"
          value={form.roomId}
          onChange={(e) => update("roomId", e.target.value)}
          disabled={isLoading || lockRoomAndDate}
          readOnly={lockRoomAndDate}
          required
        />
        <FieldError message={errors.roomId} />
      </label>

      <label className="form-field">
        Date
        <input
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          disabled={isLoading || lockRoomAndDate}
          readOnly={lockRoomAndDate}
          required
        />
        <FieldError message={errors.date} />
      </label>

      <label className="form-field">
        Start Time
        <input
          placeholder="Start (HH:mm)"
          value={form.startTime}
          onChange={(e) => update("startTime", e.target.value)}
          disabled={isLoading}
          required
        />
        <FieldError message={errors.startTime} />
      </label>

      <label className="form-field">
        End Time
        <input
          placeholder="End (HH:mm)"
          value={form.endTime}
          onChange={(e) => update("endTime", e.target.value)}
          disabled={isLoading}
          required
        />
        <FieldError message={errors.endTime} />
      </label>

      <label className="form-field">
        Purpose
        <input
          placeholder="Purpose"
          value={form.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          disabled={isLoading}
        />
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : submitLabel}
      </button>
    </form>
  );
}
