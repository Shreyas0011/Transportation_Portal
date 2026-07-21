import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  stopName: { type: String },
  arrivalTime: { type: String },
  dropTime: { type: String }
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true, unique: true },
  startingPoint: { type: String },
  destination: { type: String },
  assignedVehicle: { type: String },
  assignedDriver: { type: String },
  stops: [StopSchema]
}, { timestamps: true });

export const Route = mongoose.model('Route', RouteSchema);
