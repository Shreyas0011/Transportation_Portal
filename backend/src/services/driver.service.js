import { DriverRepository } from '../repositories/driver.repository.js';

export const DriverService = {
  getAllDrivers: async () => DriverRepository.findAll(),
  createDriver: async (driverData) => {
    const existing = await DriverRepository.findByEmployeeId(driverData.employeeId);
    if (existing) {
      throw new Error('Driver with this employeeId already exists');
    }
    return DriverRepository.create(driverData);
  },
  updateDriver: async (employeeId, driverData) => {
    const updated = await DriverRepository.updateByEmployeeId(employeeId, driverData);
    if (!updated) {
      throw new Error('Driver not found');
    }
    return updated;
  },
  deleteDriver: async (employeeId) => DriverRepository.deleteByEmployeeId(employeeId)
};
