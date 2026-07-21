import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  route: { type: String, default: 'None' },
  bus: { type: String, default: 'None' },
  pickupStop: { type: String, default: 'None' },
  dropStop: { type: String, default: 'None' },
  parentContact: { type: String, required: true },
  parentEmail: { type: String },
  healthRecord: { type: String }
}, { timestamps: true });

export const Student = mongoose.model('Student', StudentSchema);
