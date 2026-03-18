import { prisma } from "../../config/db.js";

function timeToMinutes(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  return hour * 60 + minute;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

export const bookingConflictService = {
  async assertNoConflict(payload) {
    const startMinutes = timeToMinutes(payload.startTime);
    const endMinutes = timeToMinutes(payload.endTime);

    if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) {
      const error = new Error("Invalid time format, expected HH:mm");
      error.status = 400;
      throw error;
    }

    if (startMinutes >= endMinutes) {
      const error = new Error("startTime must be before endTime");
      error.status = 400;
      throw error;
    }

    const bookingDate = new Date(`${payload.date}T00:00:00`);
    if (Number.isNaN(bookingDate.getTime())) {
      const error = new Error("Invalid date format, expected YYYY-MM-DD");
      error.status = 400;
      throw error;
    }

    const classroom = await prisma.classroom.findUnique({
      where: { id: payload.roomId },
      select: { id: true, isMaintenance: true },
    });

    if (!classroom) {
      const error = new Error("Classroom not found");
      error.status = 404;
      throw error;
    }

    if (classroom.isMaintenance) {
      const error = new Error("Classroom is under maintenance");
      error.status = 409;
      throw error;
    }

    const dayStart = new Date(bookingDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayOfWeek = bookingDate.getDay();
    const compatibleDayValues = dayOfWeek === 0 ? [0, 7] : [dayOfWeek];

    const timetableSlots = await prisma.timetableSlot.findMany({
      where: {
        classroomId: payload.roomId,
        dayOfWeek: { in: compatibleDayValues },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    const timetableConflict = timetableSlots.find((slot) => {
      const slotStart = timeToMinutes(slot.startTime);
      const slotEnd = timeToMinutes(slot.endTime);
      return overlaps(startMinutes, endMinutes, slotStart, slotEnd);
    });

    if (timetableConflict) {
      const error = new Error(
        "Requested slot conflicts with official timetable",
      );
      error.status = 409;
      throw error;
    }

    const sameDayBookings = await prisma.booking.findMany({
      where: {
        classroomId: payload.roomId,
        status: "CONFIRMED",
        date: {
          gte: dayStart,
          lt: dayEnd,
        },
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    const bookingConflict = sameDayBookings.find((booking) => {
      const bookingStart = timeToMinutes(booking.startTime);
      const bookingEnd = timeToMinutes(booking.endTime);
      return overlaps(startMinutes, endMinutes, bookingStart, bookingEnd);
    });

    if (bookingConflict) {
      const error = new Error("Time slot already booked");
      error.status = 409;
      throw error;
    }
  },
};
