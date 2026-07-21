import { Vehicle } from '../models/Vehicle.model.js';

export const VehicleRepository = {
  findAll: async () => Vehicle.find(),
  findByVehicleNumber: async (vehicleNumber) => Vehicle.findOne({ vehicleNumber }),
  create: async (vehicleData) => Vehicle.create(vehicleData),
  updateByVehicleNumber: async (vehicleNumber, updateData) => Vehicle.findOneAndUpdate({ vehicleNumber }, updateData, { new: true }),
  deleteByVehicleNumber: async (vehicleNumber) => Vehicle.findOneAndDelete({ vehicleNumber })
};
