import { UserRepository } from '../repositories/user.repository.js';
import { generateToken } from '../config/jwt.js';

export const AuthService = {
  login: async (email, password) => {
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }
    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  }
};
