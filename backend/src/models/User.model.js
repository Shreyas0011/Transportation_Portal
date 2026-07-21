import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String },
  studentId: { type: String },
  isActive: { type: Boolean, default: true },
  fcmTokens: [{ type: String }]
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
