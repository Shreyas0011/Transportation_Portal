import { StudentService } from '../services/student.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const StudentController = {
  getAllStudents: async (req, res) => {
    try {
      const students = await StudentService.getAllStudents();
      return sendSuccess(res, students, 'Students retrieved successfully');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createStudent: async (req, res) => {
    try {
      const student = await StudentService.createStudent(req.body);
      return sendSuccess(res, student, 'Student created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateStudent: async (req, res) => {
    try {
      const { studentId } = req.body;
      const updated = await StudentService.updateStudent(studentId, req.body);
      return sendSuccess(res, updated, 'Student updated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  allocateStudent: async (req, res) => {
    try {
      const { studentId, route, bus, pickupStop, dropStop } = req.body;
      const updated = await StudentService.allocateStudent(studentId, route, bus, pickupStop, dropStop);
      return sendSuccess(res, updated, 'Student allocated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  deallocateStudent: async (req, res) => {
    try {
      const { studentId } = req.body;
      const updated = await StudentService.deallocateStudent(studentId);
      return sendSuccess(res, updated, 'Student deallocated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
