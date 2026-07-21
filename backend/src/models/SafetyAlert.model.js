import mongoose from 'mongoose';

const SafetyAlertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  type: { type: String },
  severity: { type: String },
  timestamp: { type: String },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

export const SafetyAlert = mongoose.model('SafetyAlert', SafetyAlertSchema);
