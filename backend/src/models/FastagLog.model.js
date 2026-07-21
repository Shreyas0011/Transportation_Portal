import mongoose from 'mongoose';

const FastagLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  gateName: { type: String },
  direction: { type: String },
  timestamp: { type: String },
  status: { type: String, default: 'Valid' }
}, { timestamps: true });

export const FastagLog = mongoose.model('FastagLog', FastagLogSchema);
