import { api } from "../../../services/api";

export async function importTimetable(payload) {
  const { data } = await api.post("/admin/timetable/import", payload);
  return data.data;
}

export async function toggleClassroomMaintenance(classroomId, isMaintenance) {
  const { data } = await api.patch(
    `/admin/classrooms/${classroomId}/maintenance`,
    {
      isMaintenance: Boolean(isMaintenance),
    },
  );
  return data.data;
}

export async function fetchAdminAuditLogs(params = {}) {
  const { data } = await api.get("/admin/audit-logs", { params });
  return data.data;
}
