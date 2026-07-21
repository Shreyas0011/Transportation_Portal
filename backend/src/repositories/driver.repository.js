import { Driver } from '../models/Driver.model.js';

export const DriverRepository = {
  findAll: async () => Driver.find(),
  findByEmployeeId: async (employeeId) => Driver.findOne({ employeeId }),
  create: async (driverData) => Driver.create(driverData),
  updateByEmployeeId: async (employeeId, updateData) => Driver.findOneAndUpdate({ employeeId }, updateData, { new: true }),
  deleteByEmployeeId: async (employeeId) => Driver.findOneAndDelete({ employeeId })
};
