import { VehicleService } from '../services/vehicle.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const VehicleController = {
  getAllVehicles: async (req, res) => {
    try {
      const vehicles = await VehicleService.getAllVehicles();
      return sendSuccess(res, vehicles, 'Vehicles retrieved successfully');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createVehicle: async (req, res) => {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      return sendSuccess(res, vehicle, 'Vehicle created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateVehicle: async (req, res) => {
    try {
      const { vehicleNumber } = req.body;
      const updated = await VehicleService.updateVehicle(vehicleNumber, req.body);
      return sendSuccess(res, updated, 'Vehicle updated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  deleteVehicle: async (req, res) => {
    try {
      const { vehicleNumber } = req.params;
      await VehicleService.deleteVehicle(decodeURIComponent(vehicleNumber));
      return sendSuccess(res, null, 'Vehicle deleted successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
