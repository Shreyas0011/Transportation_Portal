import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import { logger } from './src/utils/logger.js';
import { seedDatabase } from './scripts/seedDatabase.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Backend server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
