import { Vehicle } from '../src/models/Vehicle.model.js';
import { logger } from '../src/utils/logger.js';

export const seedBuses = async (busesData) => {
  try {
    for (const bus of busesData) {
      await Vehicle.findOneAndUpdate(
        { vehicleNumber: bus.vehicleNumber },
        bus,
        { upsert: true, new: true }
      );
    }
    logger.info('Buses seeded successfully');
  } catch (error) {
    logger.error('Error seeding buses:', error);
  }
};
