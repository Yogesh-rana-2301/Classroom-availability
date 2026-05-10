// backend/scripts/create-production-student.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const studentEmail = process.env.STUDENT_EMAIL;
  const studentPassword = process.env.STUDENT_PASSWORD;

  if (!studentEmail || !studentPassword) {
    console.error(
      "Please provide STUDENT_EMAIL and STUDENT_PASSWORD environment variables.",
    );
    // Exit gracefully if vars are not set, so it doesn't block startup
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: studentEmail },
  });

  if (existingUser) {
    console.log(
      `User with email ${studentEmail} already exists. Skipping creation.`,
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(studentPassword, 10);

  const student = await prisma.user.create({
    data: {
      email: studentEmail,
      passwordHash: hashedPassword,
      fullName: "Student User",
      role: "STUDENT",
    },
  });

  console.log("Student user created successfully:");
  console.log(student);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
