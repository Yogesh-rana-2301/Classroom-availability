import request from "supertest";
import { app } from "../../app.js";

export const credentials = {
  admin: { email: "admin@pec.local", password: "DevPass@123" },
  faculty: { email: "faculty@pec.local", password: "DevPass@123" },
  student: { email: "student@pec.local", password: "DevPass@123" },
  invalid: { email: "faculty@pec.local", password: "WrongPass@123" },
};

export async function loginAs(role) {
  const identity = credentials[role];
  if (!identity) {
    throw new Error(`Unknown role: ${role}`);
  }

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send(identity)
    .expect(200);

  return {
    accessToken: res.body?.data?.accessToken,
    user: res.body?.data?.user,
  };
}

export function withAuth(req, token) {
  return req.set("Authorization", `Bearer ${token}`);
}

export function nextDateForWeekday(targetWeekday) {
  const todayUtc = new Date();
  const date = new Date(
    Date.UTC(
      todayUtc.getUTCFullYear(),
      todayUtc.getUTCMonth(),
      todayUtc.getUTCDate(),
    ),
  );

  const delta = (targetWeekday - date.getUTCDay() + 7) % 7 || 7;
  date.setUTCDate(date.getUTCDate() + delta);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildUniqueTimeWindow() {
  const now = new Date();
  const seed = now.getMinutes() % 6;
  const startHour = 8 + seed;
  const endHour = startHour + 1;

  return {
    startTime: `${String(startHour).padStart(2, "0")}:00`,
    endTime: `${String(endHour).padStart(2, "0")}:00`,
  };
}
