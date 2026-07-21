import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  route: { type: String },
  bus: { type: String },
  status: { type: String, required: true },
  parentDeclaration: { type: String },
  actualBoarding: { type: String },
  accountabilityStatus: { type: String },
  accountabilityNote: { type: String },
  updatedBy: { type: String },
  dropOffTime: { type: String }
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
