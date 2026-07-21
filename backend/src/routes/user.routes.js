import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateCreateUser } from '../validators/user.validator.js';

const router = Router();

router.get('/', UserController.getAllUsers);
router.post('/', validateCreateUser, UserController.createUser);
router.put('/:email/status', UserController.updateUserStatus);
router.put('/:email/password', UserController.updateUserPassword);
router.delete('/:email', UserController.deleteUser);

export default router;
