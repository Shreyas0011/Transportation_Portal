import { Driver } from '../src/models/Driver.model.js';
import { logger } from '../src/utils/logger.js';

export const seedDrivers = async (driversData) => {
  try {
    for (const d of driversData) {
      await Driver.findOneAndUpdate(
        { employeeId: d.empId || d.employeeId },
        {
          name: d.name,
          employeeId: d.empId || d.employeeId,
          phone: d.phone.startsWith('+91') ? d.phone : `+91 ${d.phone}`,
          assignedVehicle: d.plate || d.assignedVehicle,
          assignedRoute: d.route || d.assignedRoute,
          status: 'Active'
        },
        { upsert: true, new: true }
      );
    }
    logger.info('Drivers seeded successfully');
  } catch (error) {
    logger.error('Error seeding drivers:', error);
  }
};
