import { timetableService } from "./timetable.service.js";
import { sendSuccess } from "../../common/response/formatter.js";
import {
  toTimetableImportResultDto,
  toTimetableItemsDto,
} from "./timetable.dto.js";

export const timetableController = {
  async list(req, res) {
    const data = await timetableService.list(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Timetable items",
      data: toTimetableItemsDto(data),
      meta: { module: "timetable", action: "list" },
    });
  },

  async importData(req, res) {
    const data = await timetableService.importData(req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Timetable import processed",
      data: toTimetableImportResultDto(data),
      meta: { module: "timetable", action: "importData" },
    });
  },
};
