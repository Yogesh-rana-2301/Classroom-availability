import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseRetentionDays(raw) {
  const days = Number(raw);
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error("AUDIT_LOG_RETENTION_DAYS must be a positive integer");
  }
  return days;
}

function getCutoffDate(retentionDays) {
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(now - retentionDays * msPerDay);
}

async function main() {
  const retentionDays = parseRetentionDays(
    process.env.AUDIT_LOG_RETENTION_DAYS || "365",
  );
  const applyMode = process.argv.includes("--apply");
  const cutoff = getCutoffDate(retentionDays);

  const candidates = await prisma.auditLog.count({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });

  if (!applyMode) {
    console.log("Audit log retention dry run");
    console.log(`- retentionDays: ${retentionDays}`);
    console.log(`- cutoff: ${cutoff.toISOString()}`);
    console.log(`- candidateRows: ${candidates}`);
    console.log("No rows deleted. Re-run with --apply to execute deletion.");
    return;
  }

  const result = await prisma.auditLog.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });

  console.log("Audit log retention prune complete");
  console.log(`- retentionDays: ${retentionDays}`);
  console.log(`- cutoff: ${cutoff.toISOString()}`);
  console.log(`- deletedRows: ${result.count}`);
}

main()
  .catch((error) => {
    console.error("Audit log retention prune failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
