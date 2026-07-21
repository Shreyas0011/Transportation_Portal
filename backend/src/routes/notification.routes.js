import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';

const router = Router();

router.get('/', NotificationController.getAllNotifications);
router.post('/', NotificationController.createNotification);

export default router;
