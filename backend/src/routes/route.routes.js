import { Router } from 'express';
import { RouteController } from '../controllers/route.controller.js';
import { validateCreateRoute } from '../validators/route.validator.js';

const router = Router();

router.get('/', RouteController.getAllRoutes);
router.post('/', validateCreateRoute, RouteController.createRoute);
router.put('/', RouteController.updateRoute);
router.delete('/:routeName', RouteController.deleteRoute);

export default router;
