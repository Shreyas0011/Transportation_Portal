import { VehicleRepository } from '../repositories/vehicle.repository.js';

export const VehicleService = {
  getAllVehicles: async () => VehicleRepository.findAll(),
  createVehicle: async (vehicleData) => {
    const existing = await VehicleRepository.findByVehicleNumber(vehicleData.vehicleNumber);
    if (existing) {
      throw new Error('Vehicle with this vehicleNumber already exists');
    }
    return VehicleRepository.create(vehicleData);
  },
  updateVehicle: async (vehicleNumber, vehicleData) => {
    const updated = await VehicleRepository.updateByVehicleNumber(vehicleNumber, vehicleData);
    if (!updated) {
      throw new Error('Vehicle not found');
    }
    return updated;
  },
  deleteVehicle: async (vehicleNumber) => VehicleRepository.deleteByVehicleNumber(vehicleNumber)
};
