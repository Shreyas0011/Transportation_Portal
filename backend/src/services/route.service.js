import { RouteRepository } from '../repositories/route.repository.js';

export const RouteService = {
  getAllRoutes: async () => RouteRepository.findAll(),
  createRoute: async (routeData) => {
    const existing = await RouteRepository.findByRouteName(routeData.routeName);
    if (existing) {
      throw new Error('Route with this routeName already exists');
    }
    return RouteRepository.create(routeData);
  },
  updateRoute: async (routeName, routeData) => {
    const updated = await RouteRepository.updateByRouteName(routeName, routeData);
    if (!updated) {
      throw new Error('Route not found');
    }
    return updated;
  },
  deleteRoute: async (routeName) => RouteRepository.deleteByRouteName(routeName)
};
