import { RouteService } from '../services/route.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const RouteController = {
  getAllRoutes: async (req, res) => {
    try {
      const routes = await RouteService.getAllRoutes();
      return sendSuccess(res, routes, 'Routes retrieved successfully');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createRoute: async (req, res) => {
    try {
      const route = await RouteService.createRoute(req.body);
      return sendSuccess(res, route, 'Route created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateRoute: async (req, res) => {
    try {
      const { routeName } = req.body;
      const updated = await RouteService.updateRoute(routeName, req.body);
      return sendSuccess(res, updated, 'Route updated successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  deleteRoute: async (req, res) => {
    try {
      const { routeName } = req.params;
      await RouteService.deleteRoute(decodeURIComponent(routeName));
      return sendSuccess(res, null, 'Route deleted successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
