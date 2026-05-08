import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const fullName = process.env.ADMIN_NAME;
const password = process.env.ADMIN_PASSWORD;

if (!email || !fullName || !password) {
  console.error("Missing ADMIN_EMAIL, ADMIN_NAME, or ADMIN_PASSWORD env var.");
  process.exit(1);
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      role: "ADMIN",
      passwordHash,
    },
    create: {
      email,
      fullName,
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log("Admin ensured:");
  console.log(`- id: ${admin.id}`);
  console.log(`- email: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error("Create admin failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
