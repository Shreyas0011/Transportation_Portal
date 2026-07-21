import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: {
    type: String,
    enum: ['General', 'Bus Delay', 'Arrival', 'Departure', 'Fee Reminder', 'Emergency', 'System'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Normal', 'Important', 'Emergency'],
    default: 'Normal'
  },
  recipientType: {
    type: String,
    enum: ['All', 'Students', 'Parents', 'User', 'Route', 'Bus', 'Role'],
    default: 'All'
  },
  recipientUsers: [{ type: String }],
  recipientRole: { type: String },
  routeId: { type: String },
  busId: { type: String },
  createdBy: { type: String, default: 'System' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  readBy: [{ type: String }]
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);
