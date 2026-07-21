import { Router } from 'express';
import { FastagController } from '../controllers/fastag.controller.js';

const router = Router();

router.get('/logs', FastagController.getAllLogs);
router.post('/logs', FastagController.createLogs);

export default router;
