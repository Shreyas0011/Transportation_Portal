import { UserRepository } from '../repositories/user.repository.js';

export const UserService = {
  getAllUsers: async () => UserRepository.findAll(),
  createUser: async (userData) => {
    const existing = await UserRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    return UserRepository.create(userData);
  },
  updateUserStatus: async (email, isActive) => UserRepository.updateByEmail(email, { isActive }),
  updateUserPassword: async (email, password) => UserRepository.updateByEmail(email, { password }),
  deleteUser: async (email) => UserRepository.deleteByEmail(email)
};
