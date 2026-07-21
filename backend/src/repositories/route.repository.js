import { Route } from '../models/Route.model.js';

export const RouteRepository = {
  findAll: async () => Route.find(),
  findByRouteName: async (routeName) => Route.findOne({ routeName }),
  create: async (routeData) => Route.create(routeData),
  updateByRouteName: async (routeName, updateData) => Route.findOneAndUpdate({ routeName }, updateData, { new: true }),
  deleteByRouteName: async (routeName) => Route.findOneAndDelete({ routeName })
};
