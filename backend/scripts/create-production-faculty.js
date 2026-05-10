// backend/scripts/create-production-faculty.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const facultyEmail = process.env.FACULTY_EMAIL;
  const facultyPassword = process.env.FACULTY_PASSWORD;

  if (!facultyEmail || !facultyPassword) {
    console.error(
      "Please provide FACULTY_EMAIL and FACULTY_PASSWORD environment variables.",
    );
    // Exit gracefully if vars are not set, so it doesn't block startup
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: facultyEmail },
  });

  if (existingUser) {
    console.log(
      `User with email ${facultyEmail} already exists. Skipping creation.`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(facultyPassword, 10);

  const faculty = await prisma.user.create({
    data: {
      email: facultyEmail,
      passwordHash: hashedPassword,
      fullName: "Faculty User",
      role: "FACULTY",
    },
  });

  console.log("Faculty user created successfully:");
  console.log(faculty);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
