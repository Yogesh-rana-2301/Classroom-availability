import { classroomsRepository } from "./classrooms.repository.js";
import {
  getUtcDayBounds,
  parseDateOnlyUtc,
} from "../../common/validators/dateOnly.js";

function timeToMinutes(value) {
  const [hour, minute] = String(value || "")
    .split(":")
    .map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  return hour * 60 + minute;
}

function buildAvailabilityFilter(filters) {
  if (!filters?.date && !filters?.startTime && !filters?.endTime) {
    return null;
  }

  if (!filters?.date || !filters?.startTime || !filters?.endTime) {
    const error = new Error(
      "Availability filters require date, startTime, and endTime",
    );
    error.status = 400;
    throw error;
  }

  const parsedDate = parseDateOnlyUtc(filters.date);
  if (!parsedDate) {
    const error = new Error("Invalid date format, expected YYYY-MM-DD");
    error.status = 400;
    throw error;
  }

  const startMinutes = timeToMinutes(filters.startTime);
  const endMinutes = timeToMinutes(filters.endTime);

  if (startMinutes === null || endMinutes === null) {
    const error = new Error("Invalid time format, expected HH:mm");
    error.status = 400;
    throw error;
  }

  if (startMinutes >= endMinutes) {
    const error = new Error("startTime must be before endTime");
    error.status = 400;
    throw error;
  }

  const { dayStart, dayEnd } = getUtcDayBounds(parsedDate.date);
  const dayOfWeek = dayStart.getUTCDay();
  const compatibleDayValues = dayOfWeek === 0 ? [0, 7] : [dayOfWeek];

  return {
    startTime: filters.startTime,
    endTime: filters.endTime,
    dayStart,
    dayEnd,
    compatibleDayValues,
  };
}

function buildMaintenanceSlots() {
  return [
    {
      startTime: "00:00",
      endTime: "23:59",
      status: "MAINTENANCE",
      reason: "Classroom is under maintenance",
    },
  ];
}

function mapTimetableSlot(slot) {
  return {
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "UNAVAILABLE",
    subject: slot.subject || undefined,
    facultyName: slot.facultyName || undefined,
    reason: slot.subject
      ? `Official timetable: ${slot.subject}`
      : "Official timetable slot",
  };
}

function mapBookingSlot(slot) {
  return {
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "BOOKED",
    purpose: slot.purpose || undefined,
    reason: slot.purpose || "Booked",
  };
}

export const classroomsService = {
  async filterOptions() {
    return classroomsRepository.listFilterOptions();
  },

  async list(filters) {
    const availability = buildAvailabilityFilter(filters);
    const nextFilters = { ...filters };

    if (availability) {
      if (typeof nextFilters.isMaintenance !== "boolean") {
        nextFilters.isMaintenance = false;
      }
      nextFilters.availability = availability;
    }

    return classroomsRepository.list(nextFilters);
  },

  async getById(id) {
    const item = await classroomsRepository.getById(id);
    return { item };
  },

  async availability(id, query) {
    const requestedDate = query?.date || new Date().toISOString().slice(0, 10);
    const parsedDate = parseDateOnlyUtc(requestedDate);

    if (!parsedDate) {
      const error = new Error("Invalid date format, expected YYYY-MM-DD");
      error.status = 400;
      throw error;
    }

    const { dayStart, dayEnd } = getUtcDayBounds(parsedDate.date);

    const dayOfWeek = dayStart.getUTCDay();
    const compatibleDayValues = dayOfWeek === 0 ? [0, 7] : [dayOfWeek];

    const { classroom, timetableSlots, bookings } =
      await classroomsRepository.getAvailabilityContext({
        classroomId: id,
        compatibleDayValues,
        dayStart,
        dayEnd,
      });

    if (!classroom) {
      const error = new Error("Classroom not found");
      error.status = 404;
      throw error;
    }

    if (classroom.isMaintenance) {
      return {
        roomId: id,
        date: parsedDate.normalized,
        slots: buildMaintenanceSlots(),
      };
    }

    const slots = [
      ...timetableSlots.map(mapTimetableSlot),
      ...bookings.map(mapBookingSlot),
    ];

    return {
      roomId: id,
      date: parsedDate.normalized,
      slots,
    };
  },
};
