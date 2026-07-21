import { Attendance } from '../models/Attendance.model.js';

export const AttendanceRepository = {
  findAll: async () => Attendance.find(),
  findById: async (id) => Attendance.findOne({ id }),
  upsert: async (record) => Attendance.findOneAndUpdate({ id: record.id }, record, { upsert: true, new: true })
};
