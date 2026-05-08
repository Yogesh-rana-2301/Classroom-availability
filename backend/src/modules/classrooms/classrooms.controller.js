import { classroomsService } from "./classrooms.service.js";
import { sendSuccess } from "../../common/response/formatter.js";
import {
  toAvailabilityDto,
  toClassroomDto,
  toClassroomListDto,
  toClassroomFilterOptionsDto,
} from "./classrooms.dto.js";

export const classroomsController = {
  async filterOptions(req, res) {
    const data = await classroomsService.filterOptions();
    return sendSuccess(res, {
      statusCode: 200,
      message: "Classroom filter options",
      data: toClassroomFilterOptionsDto(data),
      meta: { module: "classrooms", action: "filter-options" },
    });
  },

  async list(req, res) {
    const data = await classroomsService.list(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Classrooms fetched",
      data: toClassroomListDto(data),
      meta: { module: "classrooms", action: "list" },
    });
  },

  async getById(req, res) {
    const data = await classroomsService.getById(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Classroom details",
      data: { item: toClassroomDto(data.item) },
      meta: { module: "classrooms", action: "getById" },
    });
  },

  async availability(req, res) {
    const data = await classroomsService.availability(req.params.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Classroom availability",
      data: toAvailabilityDto(data),
      meta: { module: "classrooms", action: "availability" },
    });
  },
};
