import { UserService } from '../services/user.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();
      return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createUser: async (req, res) => {
    try {
      const newUser = await UserService.createUser(req.body);
      return sendSuccess(res, newUser, 'User created successfully', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateUserStatus: async (req, res) => {
    try {
      const { email } = req.params;
      const { isActive } = req.body;
      const updated = await UserService.updateUserStatus(decodeURIComponent(email), isActive);
      return sendSuccess(res, updated, 'User status updated');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      const { email } = req.params;
      const { password } = req.body;
      await UserService.updateUserPassword(decodeURIComponent(email), password);
      return sendSuccess(res, null, 'User password updated');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { email } = req.params;
      await UserService.deleteUser(decodeURIComponent(email));
      return sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
