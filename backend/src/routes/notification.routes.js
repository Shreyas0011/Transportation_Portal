import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Public / User authenticated endpoints
router.post('/token', authenticate, NotificationController.registerToken);
router.get('/history', authenticate, NotificationController.getHistory);
router.get('/', authenticate, NotificationController.getHistory);
router.patch('/:id/read', authenticate, NotificationController.markAsRead);

// Admin & Super Admin restricted notification sending endpoints
router.post('/send', authenticate, authorize('Transport Head', 'Super Admin'), NotificationController.sendNotification);
router.post('/broadcast', authenticate, authorize('Transport Head', 'Super Admin'), NotificationController.sendBroadcast);

export default router;
