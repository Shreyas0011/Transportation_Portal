import { Router } from 'express';
import { SafetyController } from '../controllers/safety.controller.js';

const router = Router();

router.get('/alerts', SafetyController.getAllAlerts);
router.post('/alerts', SafetyController.createAlerts);

export default router;
