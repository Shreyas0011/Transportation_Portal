import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { validateSaveAttendance } from '../validators/attendance.validator.js';

const router = Router();

router.get('/', AttendanceController.getAllAttendance);
router.post('/', validateSaveAttendance, AttendanceController.saveAttendance);

export default router;
