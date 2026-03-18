import { useState } from "react";

export default function BookingForm({ onSubmit }) {
  const [form, setForm] = useState({
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <input
        placeholder="Room ID"
        value={form.roomId}
        onChange={(e) => update("roomId", e.target.value)}
        required
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => update("date", e.target.value)}
        required
      />
      <input
        placeholder="Start (HH:mm)"
        value={form.startTime}
        onChange={(e) => update("startTime", e.target.value)}
        required
      />
      <input
        placeholder="End (HH:mm)"
        value={form.endTime}
        onChange={(e) => update("endTime", e.target.value)}
        required
      />
      <input
        placeholder="Purpose"
        value={form.purpose}
        onChange={(e) => update("purpose", e.target.value)}
      />
      <button type="submit">Create Booking</button>
    </form>
  );
}
