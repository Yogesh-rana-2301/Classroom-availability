import { prisma } from "../../config/db.js";

const DAY_OF_WEEK_MAP = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

function parseSlotRange(slotRange) {
  const match = String(slotRange)
    .trim()
    .match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/);

  if (!match) {
    return null;
  }

  const [, startTime, endTime] = match;
  return { startTime, endTime };
}

function normalizeRoomCode(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTimetableRecords(payload) {
  const schedule = payload.schedule || {};
  const records = [];
  const errors = [];
  const dedupe = new Set();

  for (const [dayLabel, slots] of Object.entries(schedule)) {
    const dayOfWeek = DAY_OF_WEEK_MAP[String(dayLabel).toLowerCase()];
    if (!dayOfWeek) {
      errors.push(`Unsupported day label: ${dayLabel}`);
      continue;
    }

    for (const [slotRange, entries] of Object.entries(slots || {})) {
      const parsedSlot = parseSlotRange(slotRange);
      if (!parsedSlot) {
        errors.push(`Invalid slot range: ${dayLabel} ${slotRange}`);
        continue;
      }

      for (const entry of entries || []) {
        const venues = String(entry.venue || "")
          .split(",")
          .map((venue) => normalizeRoomCode(venue))
          .filter(Boolean);

        if (!venues.length) {
          errors.push(`Missing venue: ${dayLabel} ${slotRange}`);
          continue;
        }

        for (const roomCode of venues) {
          const key = [
            roomCode,
            dayOfWeek,
            parsedSlot.startTime,
            parsedSlot.endTime,
            entry.course,
          ].join("|");

          if (dedupe.has(key)) {
            continue;
          }
          dedupe.add(key);

          records.push({
            roomCode,
            dayOfWeek,
            startTime: parsedSlot.startTime,
            endTime: parsedSlot.endTime,
            subject: String(entry.course || "").trim() || null,
            facultyName: null,
          });
        }
      }
    }
  }

  return { records, errors };
}

export const adminService = {
  async importTimetable(payload, actorUserId) {
    const { records, errors } = extractTimetableRecords(payload);

    if (errors.length) {
      const error = new Error("Timetable import validation failed");
      error.status = 400;
      error.errors = errors.map((message) => ({ message }));
      throw error;
    }

    if (!records.length) {
      const error = new Error("No timetable slots found in payload");
      error.status = 400;
      throw error;
    }

    const roomCodes = [...new Set(records.map((record) => record.roomCode))];

    const result = await prisma.$transaction(async (tx) => {
      const upsertedClassrooms = [];
      for (const roomCode of roomCodes) {
        const classroom = await tx.classroom.upsert({
          where: { roomCode },
          update: {},
          create: {
            roomCode,
            building: "Computer Science and Engineering", // Default building, can be updated later
            capacity: 50,
            facilities: [],
          },
        });
        upsertedClassrooms.push(classroom);
      }

      const roomCodeToId = new Map(
        upsertedClassrooms.map((classroom) => [
          classroom.roomCode,
          classroom.id,
        ]),
      );

      const importedClassroomIds = upsertedClassrooms.map(
        (classroom) => classroom.id,
      );

      await tx.timetableSlot.deleteMany({
        where: {
          classroomId: {
            in: importedClassroomIds,
          },
        },
      });

      await tx.timetableSlot.createMany({
        data: records.map((record) => ({
          classroomId: roomCodeToId.get(record.roomCode),
          dayOfWeek: record.dayOfWeek,
          startTime: record.startTime,
          endTime: record.endTime,
          subject: record.subject,
          facultyName: record.facultyName,
        })),
      });

      await tx.auditLog.create({
        data: {
          userId: actorUserId,
          action: "TIMETABLE_IMPORTED",
          entity: "TIMETABLE",
          entityId: "bulk-import",
          metadata: {
            department: payload.department || null,
            academicYear: payload.academic_year || null,
            importedClassrooms: roomCodes.length,
            importedSlots: records.length,
          },
        },
      });

      return {
        importedClassrooms: roomCodes.length,
        importedSlots: records.length,
      };
    });

    return {
      message: "Timetable imported successfully",
      payloadPreview: records.length,
      importedClassrooms: result.importedClassrooms,
      importedSlots: result.importedSlots,
    };
  },

  async listTimetable(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(typeof query.dayOfWeek === "number"
        ? { dayOfWeek: query.dayOfWeek }
        : {}),
      ...(query.classroomId ? { classroomId: query.classroomId } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.timetableSlot.findMany({
        where,
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        skip,
        take: pageSize,
      }),
      prisma.timetableSlot.count({ where }),
    ]);

    return { items, total, page, pageSize };
  },

  async toggleMaintenance(classroomId, isMaintenance = true) {
    const classroom = await prisma.classroom.update({
      where: { id: classroomId },
      data: { isMaintenance: Boolean(isMaintenance) },
    });
    return { classroom };
  },

  async bookings(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.classroomId ? { classroomId: query.classroomId } : {}),
      ...(query.fromDate || query.toDate
        ? {
            date: {
              ...(query.fromDate ? { gte: new Date(query.fromDate) } : {}),
              ...(query.toDate ? { lte: new Date(query.toDate) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: { classroom: true, user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ]);

    return { items, total, page, pageSize };
  },

  async auditLogs(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(query.action
        ? {
            action: {
              contains: query.action,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.entity
        ? {
            entity: {
              contains: query.entity,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.userId ? { userId: query.userId } : {}),
    };

    const [rows, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { rows, total, page, pageSize };
  },
};
