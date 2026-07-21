import { AttendanceService } from '../services/attendance.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const AttendanceController = {
  getAllAttendance: async (req, res) => {
    try {
      const list = await AttendanceService.getAllAttendance();
      return sendSuccess(res, list, 'Attendance records retrieved');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  saveAttendance: async (req, res) => {
    try {
      const saved = await AttendanceService.saveAttendanceRecords(req.body);
      return sendSuccess(res, saved, 'Attendance records saved');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
