import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  assignedVehicle: { type: String },
  assignedRoute: { type: String },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export const Driver = mongoose.model('Driver', DriverSchema);
