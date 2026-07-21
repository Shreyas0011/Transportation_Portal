import { DriverService } from '../services/driver.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const DriverController = {
  getAllDrivers: async (req, res) => {
    try {
      const drivers = await DriverService.getAllDrivers();
      return sendSuccess(res, drivers, 'Drivers retrieved successfully');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createDriver: async (req, res) => {
    try {
      const driver = await DriverService.createDriver(req.body);
      return sendSuccess(res, driver, 'Driver created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateDriver: async (req, res) => {
    try {
      const { employeeId } = req.body;
      const updated = await DriverService.updateDriver(employeeId, req.body);
      return sendSuccess(res, updated, 'Driver updated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  deleteDriver: async (req, res) => {
    try {
      const { employeeId } = req.params;
      await DriverService.deleteDriver(decodeURIComponent(employeeId));
      return sendSuccess(res, null, 'Driver deleted successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
