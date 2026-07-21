import { StudentRepository } from '../repositories/student.repository.js';

export const StudentService = {
  getAllStudents: async () => StudentRepository.findAll(),
  createStudent: async (studentData) => {
    const existing = await StudentRepository.findByStudentId(studentData.studentId);
    if (existing) {
      throw new Error('Student with this studentId already exists');
    }
    return StudentRepository.create(studentData);
  },
  updateStudent: async (studentId, studentData) => {
    const updated = await StudentRepository.updateByStudentId(studentId, studentData);
    if (!updated) {
      throw new Error('Student not found');
    }
    return updated;
  },
  allocateStudent: async (studentId, route, bus, pickupStop, dropStop) => {
    return StudentRepository.updateByStudentId(studentId, { route, bus, pickupStop, dropStop });
  },
  deallocateStudent: async (studentId) => {
    return StudentRepository.updateByStudentId(studentId, { route: 'None', bus: 'None', pickupStop: 'None', dropStop: 'None' });
  },
  bulkCreateStudents: async (students) => {
    if (!Array.isArray(students) || students.length === 0) {
      throw new Error('Invalid or empty student records array');
    }
    return StudentRepository.bulkUpsert(students);
  }
};
