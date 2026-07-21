import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const AuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      return sendError(res, error.message, null, 401);
    }
  },
  logout: async (req, res) => {
    return sendSuccess(res, null, 'Logout successful');
  }
};
