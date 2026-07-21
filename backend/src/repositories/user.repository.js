import { User } from '../models/User.model.js';

export const UserRepository = {
  findAll: async () => User.find().select('-password'),
  findByEmail: async (email) => User.findOne({ email }),
  findByEmailWithPassword: async (email) => User.findOne({ email }),
  findById: async (id) => User.findById(id).select('-password'),
  create: async (userData) => User.create(userData),
  updateByEmail: async (email, updateData) => User.findOneAndUpdate({ email }, updateData, { new: true }).select('-password'),
  deleteByEmail: async (email) => User.findOneAndDelete({ email }),
  count: async () => User.countDocuments()
};
