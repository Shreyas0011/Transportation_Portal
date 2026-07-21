import { Student } from '../models/Student.model.js';

export const StudentRepository = {
  findAll: async () => Student.find(),
  findByStudentId: async (studentId) => Student.findOne({ studentId }),
  create: async (studentData) => Student.create(studentData),
  updateByStudentId: async (studentId, updateData) => Student.findOneAndUpdate({ studentId }, updateData, { new: true }),
  deleteByStudentId: async (studentId) => Student.findOneAndDelete({ studentId })
};
