import { useEffect, useState } from "react";

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
  }

  return (
    <form
      className="booking-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <input
        placeholder="Room ID"
        value={form.roomId}
        onChange={(e) => update("roomId", e.target.value)}
        disabled={isLoading || lockRoomAndDate}
        readOnly={lockRoomAndDate}
        required
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => update("date", e.target.value)}
        disabled={isLoading || lockRoomAndDate}
        readOnly={lockRoomAndDate}
        required
      />
      <input
        placeholder="Start (HH:mm)"
        value={form.startTime}
        onChange={(e) => update("startTime", e.target.value)}
        disabled={isLoading}
        required
      />
      <input
        placeholder="End (HH:mm)"
        value={form.endTime}
        onChange={(e) => update("endTime", e.target.value)}
        disabled={isLoading}
        required
      />
      <input
        placeholder="Purpose"
        value={form.purpose}
        onChange={(e) => update("purpose", e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : submitLabel}
      </button>
    </form>
  );
}
