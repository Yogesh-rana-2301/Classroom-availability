import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRoomAvailability } from "../features/availability/api/availabilityApi";
import AvailabilityGrid from "../features/availability/components/AvailabilityGrid";
import { createBooking } from "../features/bookings/api/bookingsApi";
import { validateBookingInput } from "../features/bookings/validators/bookingSchema";
import { BookingForm } from "../features/bookings";
import { useAuth } from "../app/AuthProvider";
import Button from "../shared/components/Button";
import { formatISODate } from "../utils/dateTime";

function getTodayDateValue() {
  return formatISODate(new Date().toISOString());
}

export default function RoomAvailabilityPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [date, setDate] = useState(getTodayDateValue);
  const [data, setData] = useState({
    roomId: id,
    date: getTodayDateValue(),
    slots: [],
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canBook = user?.role === "ADMIN" || user?.role === "FACULTY";

  const bookingFormDefaults = useMemo(
    () => ({
      roomId: id || "",
      date,
      startTime: selectedSlot?.startTime || "",
      endTime: selectedSlot?.endTime || "",
    }),
    [date, id, selectedSlot],
  );

  const loadAvailability = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetchRoomAvailability(id, { date });
      setData({
        roomId: response?.roomId || id,
        date: response?.date || date,
        slots: Array.isArray(response?.slots) ? response.slots : [],
        message: response?.message || "",
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to fetch room availability. Please try again.",
      );
      setData((current) => ({ ...current, slots: [] }));
    } finally {
      setIsLoading(false);
    }
  }, [date, id]);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }
      await loadAvailability();
    }

    run();

    return () => {
      active = false;
    };
  }, [loadAvailability]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [date]);

  async function handleCreateBooking(form) {
    if (!canBook) {
      setBookingError("Only faculty and admins can create bookings.");
      return;
    }

    const payload = {
      roomId: id,
      date,
      startTime: form.startTime?.trim(),
      endTime: form.endTime?.trim(),
      purpose: form.purpose?.trim() || undefined,
    };

    const validation = validateBookingInput(payload);
    if (!validation.valid) {
      setBookingError(validation.message);
      return;
    }

    if (payload.startTime >= payload.endTime) {
      setBookingError("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    setBookingError("");
    setBookingSuccess("");

    try {
      await createBooking(payload);
      setBookingSuccess("Booking created successfully.");
      await loadAvailability();
    } catch (requestError) {
      setBookingError(
        requestError?.response?.data?.message ||
          "Failed to create booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalSlots = data.slots.length;

  return (
    <section className="page room-availability-page">
      <h1>Room Availability</h1>

      <p>
        Room ID: <strong>{id}</strong>
      </p>

      <div className="availability-toolbar">
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setBookingSuccess("");
              setBookingError("");
            }}
          />
        </label>

        <Link to="/classrooms">
          <Button type="button">Back to Classrooms</Button>
        </Link>
      </div>

      <div className="availability-legend" aria-label="Availability legend">
        <span className="legend-pill legend-available">Available</span>
        <span className="legend-pill legend-booked">Booked</span>
        <span className="legend-pill legend-unavailable">Unavailable</span>
        <span className="legend-pill legend-maintenance">Maintenance</span>
      </div>

      {isLoading ? <p>Loading timeline...</p> : null}

      {error ? (
        <p className="status-error" role="alert">
          {error}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <>
          <p>
            Date: {data.date || date} | Returned slots: {totalSlots}
          </p>

          {data.message ? <p>{data.message}</p> : null}

          <AvailabilityGrid
            slots={data.slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => {
              setSelectedSlot(slot);
              setBookingSuccess("");
              setBookingError("");
            }}
          />

          <section className="booking-section">
            <h2>Create Booking</h2>
            <p>
              Select an available timeline row to prefill time, or enter times
              manually.
            </p>
            {selectedSlot ? (
              <p>
                Selected slot: {selectedSlot.startTime} - {selectedSlot.endTime}
              </p>
            ) : null}

            {!canBook ? (
              <p>
                Read-only for your role. Faculty/Admin accounts can create
                bookings.
              </p>
            ) : null}

            {bookingError ? (
              <p className="status-error" role="alert">
                {bookingError}
              </p>
            ) : null}

            {bookingSuccess ? (
              <p className="status-success" role="status">
                {bookingSuccess}
              </p>
            ) : null}

            <BookingForm
              onSubmit={handleCreateBooking}
              initialValues={bookingFormDefaults}
              isLoading={isSubmitting}
              lockRoomAndDate
              submitLabel="Create Booking"
            />
          </section>
        </>
      ) : null}
    </section>
  );
}
