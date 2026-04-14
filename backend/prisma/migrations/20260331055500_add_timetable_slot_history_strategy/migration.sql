-- Preserve timetable slot history across imports by soft-deactivating superseded rows.
ALTER TABLE "TimetableSlot"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "importBatchId" TEXT,
ADD COLUMN "supersededAt" TIMESTAMP(3),
ADD COLUMN "supersededByBatchId" TEXT;

CREATE INDEX "TimetableSlot_classroomId_dayOfWeek_isActive_idx"
ON "TimetableSlot"("classroomId", "dayOfWeek", "isActive");

CREATE INDEX "TimetableSlot_importBatchId_idx"
ON "TimetableSlot"("importBatchId");

CREATE INDEX "TimetableSlot_supersededByBatchId_idx"
ON "TimetableSlot"("supersededByBatchId");
