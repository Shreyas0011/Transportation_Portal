import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { validateCreateVehicle } from '../validators/vehicle.validator.js';

const router = Router();

router.get('/', VehicleController.getAllVehicles);
router.post('/', validateCreateVehicle, VehicleController.createVehicle);
router.put('/', VehicleController.updateVehicle);
router.delete('/:vehicleNumber', VehicleController.deleteVehicle);

export default router;
