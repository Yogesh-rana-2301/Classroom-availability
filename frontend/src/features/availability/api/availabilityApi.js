import { api } from "../../../services/api";

export async function fetchClassrooms(params = {}) {
  const { data } = await api.get("/classrooms", { params });
  return data.data;
}

export async function fetchRoomAvailability(roomId, params = {}) {
  const { data } = await api.get(`/classrooms/${roomId}/availability`, {
    params,
  });
  return data.data;
}
