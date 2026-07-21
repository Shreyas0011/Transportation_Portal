import { AttendanceRepository } from '../repositories/attendance.repository.js';

export const AttendanceService = {
  getAllAttendance: async () => AttendanceRepository.findAll(),
  saveAttendanceRecords: async (records) => {
    const list = Array.isArray(records) ? records : [records];
    const results = [];
    for (const rec of list) {
      const saved = await AttendanceRepository.upsert(rec);
      results.push(saved);
    }
    return results;
  }
};
