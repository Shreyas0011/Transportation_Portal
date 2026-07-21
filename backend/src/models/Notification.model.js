import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  sentBy: { type: String, required: true }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
