import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  registrationNumber: { type: String },
  vehicleModel: { type: String },
  seatingCapacity: { type: Number },
  driverAssigned: { type: String },
  routeAssigned: { type: String },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

export const Vehicle = mongoose.model('Vehicle', VehicleSchema);
