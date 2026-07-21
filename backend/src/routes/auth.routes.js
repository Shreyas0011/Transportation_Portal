import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateLogin } from '../validators/auth.validator.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authRateLimiter, validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
