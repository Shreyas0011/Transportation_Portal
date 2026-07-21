import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import driverRoutes from './driver.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import routeRoutes from './route.routes.js';
import studentRoutes from './student.routes.js';
import attendanceRoutes from './attendance.routes.js';
import notificationRoutes from './notification.routes.js';
import fastagRoutes from './fastag.routes.js';
import safetyRoutes from './safety.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/routes', routeRoutes);
router.use('/students', studentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/fastag', fastagRoutes);
router.use('/safety', safetyRoutes);

export default router;
