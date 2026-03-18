import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEV_PASSWORD = "DevPass@123";

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@pec.local" },
    update: {
      fullName: "System Admin",
      role: "ADMIN",
      passwordHash,
    },
    create: {
      email: "admin@pec.local",
      fullName: "System Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  const faculty = await prisma.user.upsert({
    where: { email: "faculty@pec.local" },
    update: {
      fullName: "Faculty User",
      role: "FACULTY",
      passwordHash,
    },
    create: {
      email: "faculty@pec.local",
      fullName: "Faculty User",
      role: "FACULTY",
      passwordHash,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@pec.local" },
    update: {
      fullName: "Student User",
      role: "STUDENT",
      passwordHash,
    },
    create: {
      email: "student@pec.local",
      fullName: "Student User",
      role: "STUDENT",
      passwordHash,
    },
  });

  return { admin, faculty, student };
}

async function seedClassrooms() {
  const classroomsInput = [
    {
      roomCode: "NB-101",
      building: "New Academic Block",
      capacity: 60,
      facilities: ["Projector", "AC", "Smartboard"],
    },
    {
      roomCode: "NB-202",
      building: "New Academic Block",
      capacity: 40,
      facilities: ["Projector", "AC"],
    },
    {
      roomCode: "AB-105",
      building: "Administrative Block",
      capacity: 80,
      facilities: ["Projector"],
    },
  ];

  const classrooms = [];
  for (const room of classroomsInput) {
    const classroom = await prisma.classroom.upsert({
      where: { roomCode: room.roomCode },
      update: {
        building: room.building,
        capacity: room.capacity,
        facilities: room.facilities,
        isMaintenance: false,
      },
      create: room,
    });
    classrooms.push(classroom);
  }

  return classrooms;
}

async function seedTimetable(classrooms) {
  const slotsByRoomCode = {
    "NB-101": [
      {
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "10:00",
        subject: "CS101",
        facultyName: "Dr. Sharma",
      },
      {
        dayOfWeek: 3,
        startTime: "11:00",
        endTime: "12:00",
        subject: "MA201",
        facultyName: "Prof. Singh",
      },
    ],
    "NB-202": [
      {
        dayOfWeek: 2,
        startTime: "10:00",
        endTime: "11:00",
        subject: "EE102",
        facultyName: "Dr. Mehta",
      },
      {
        dayOfWeek: 4,
        startTime: "14:00",
        endTime: "15:00",
        subject: "PH103",
        facultyName: "Prof. Kaur",
      },
    ],
    "AB-105": [
      {
        dayOfWeek: 1,
        startTime: "13:00",
        endTime: "14:00",
        subject: "HS104",
        facultyName: "Dr. Rao",
      },
      {
        dayOfWeek: 5,
        startTime: "09:00",
        endTime: "10:00",
        subject: "ME205",
        facultyName: "Prof. Arora",
      },
    ],
  };

  for (const classroom of classrooms) {
    await prisma.timetableSlot.deleteMany({
      where: { classroomId: classroom.id },
    });

    const slots = slotsByRoomCode[classroom.roomCode] || [];
    if (slots.length > 0) {
      await prisma.timetableSlot.createMany({
        data: slots.map((slot) => ({
          classroomId: classroom.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subject: slot.subject,
          facultyName: slot.facultyName,
        })),
      });
    }
  }
}

async function seedAuditLog(adminUserId) {
  await prisma.auditLog.create({
    data: {
      userId: adminUserId,
      action: "SEED_BOOTSTRAP",
      entity: "SYSTEM",
      entityId: "dev-seed",
      metadata: {
        note: "Development seed initialized",
      },
    },
  });
}

async function main() {
  const users = await seedUsers();
  const classrooms = await seedClassrooms();
  await seedTimetable(classrooms);
  await seedAuditLog(users.admin.id);

  console.log("Seed complete.");
  console.log("Dev credentials:");
  console.log("- admin@pec.local / DevPass@123");
  console.log("- faculty@pec.local / DevPass@123");
  console.log("- student@pec.local / DevPass@123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
