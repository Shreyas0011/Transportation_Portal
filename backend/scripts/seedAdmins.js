import { User } from '../src/models/User.model.js';
import { logger } from '../src/utils/logger.js';

export const seedAdmins = async (adminsData) => {
  try {
    for (const admin of adminsData) {
      await User.findOneAndUpdate(
        { email: admin.email },
        admin,
        { upsert: true, new: true }
      );
    }
    logger.info('Admins seeded successfully');
  } catch (error) {
    logger.error('Error seeding admins:', error);
  }
};
