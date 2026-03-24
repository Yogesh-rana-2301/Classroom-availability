import { after, before, describe, it, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { prisma } from "../../config/db.js";
import { app } from "../../app.js";
import {
  buildUniqueTimeWindow,
  credentials,
  loginAs,
  nextDateForWeekday,
  withAuth,
} from "./mvp-regression.helpers.js";

const state = {
  adminToken: "",
  facultyToken: "",
  studentToken: "",
  adminRole: "",
  facultyRole: "",
  studentRole: "",
  sampleRoomId: "",
  createdBookingId: "",
};

before(async () => {
  const adminSession = await loginAs("admin");
  const facultySession = await loginAs("faculty");
  const studentSession = await loginAs("student");

  state.adminToken = adminSession.accessToken;
  state.facultyToken = facultySession.accessToken;
  state.studentToken = studentSession.accessToken;
  state.adminRole = adminSession.user?.role || "";
  state.facultyRole = facultySession.user?.role || "";
  state.studentRole = studentSession.user?.role || "";

  const classroomsRes = await withAuth(
    request(app).get("/api/v1/classrooms"),
    state.facultyToken,
  ).expect(200);

  const firstClassroom = classroomsRes.body?.data?.items?.[0];
  assert.ok(firstClassroom?.id, "Expected at least one seeded classroom");
  state.sampleRoomId = firstClassroom.id;
});

after(async () => {
  if (state.createdBookingId) {
    await prisma.booking.deleteMany({ where: { id: state.createdBookingId } });
  }

  await prisma.$disconnect();
});

describe("MVP API regression scaffold", () => {
  describe("Environment health", () => {
    it("returns healthy system status", async () => {
      const res = await request(app).get("/api/v1/health").expect(200);

      assert.equal(res.body.success, true);
      assert.equal(res.body.data?.status, "ok");
    });
  });

  describe("Authentication and access", () => {
    it("establishes valid seeded sessions for all roles", async () => {
      assert.ok(state.adminToken);
      assert.ok(state.facultyToken);
      assert.ok(state.studentToken);
      assert.equal(state.adminRole, "ADMIN");
      assert.equal(state.facultyRole, "FACULTY");
      assert.equal(state.studentRole, "STUDENT");
    });

    it("rejects invalid login credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(credentials.invalid)
        .expect(401);

      assert.equal(res.body.success, false);
      assert.match(String(res.body.message), /invalid email or password/i);
    });

    it("returns 401 for unauthenticated protected endpoint", async () => {
      await request(app).get("/api/v1/auth/me").expect(401);
    });

    it("returns 403 for non-admin access to admin route", async () => {
      const res = await withAuth(
        request(app).get("/api/v1/admin/audit-logs"),
        state.facultyToken,
      ).expect(403);

      assert.match(String(res.body.message), /forbidden/i);
    });
  });

  describe("Validation and error-path checks", () => {
    it("returns 400 for invalid auth payload", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "missing-password@pec.local" })
        .expect(400);

      assert.match(String(res.body.message), /invalid request body/i);
      assert.ok(Array.isArray(res.body.errors));
    });
  });

  describe("Booking core-flow scaffold", () => {
    it("creates booking and rejects overlap for same room and slot", async () => {
      const date = nextDateForWeekday(0);
      const window = buildUniqueTimeWindow();

      const createPayload = {
        roomId: state.sampleRoomId,
        date,
        startTime: window.startTime,
        endTime: window.endTime,
        purpose: "MVP regression scaffold check",
      };

      const created = await withAuth(
        request(app).post("/api/v1/bookings").send(createPayload),
        state.facultyToken,
      ).expect(201);

      assert.equal(created.body.success, true);
      assert.ok(created.body.data?.booking?.id);
      state.createdBookingId = created.body.data.booking.id;

      const overlap = await withAuth(
        request(app).post("/api/v1/bookings").send(createPayload),
        state.facultyToken,
      ).expect(409);

      assert.match(String(overlap.body.message), /already booked/i);
    });

    it("returns current user bookings list", async () => {
      const res = await withAuth(
        request(app).get("/api/v1/bookings/my"),
        state.facultyToken,
      ).expect(200);

      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data?.items));
    });
  });

  describe("MVP backlog placeholders", () => {
    test.todo("Admin timetable import happy-path regression coverage");
    test.todo("Maintenance toggle conflict regression coverage");
    test.todo("Auth rate-limit threshold and retry-after coverage");
  });
});
