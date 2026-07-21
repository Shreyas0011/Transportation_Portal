import { Router } from 'express';
import { DriverController } from '../controllers/driver.controller.js';
import { validateCreateDriver } from '../validators/driver.validator.js';

const router = Router();

router.get('/', DriverController.getAllDrivers);
router.post('/', validateCreateDriver, DriverController.createDriver);
router.put('/', DriverController.updateDriver);
router.delete('/:employeeId', DriverController.deleteDriver);

export default router;
