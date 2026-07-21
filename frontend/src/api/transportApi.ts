// src/api/transportApi.ts
import axiosInstance from './axios';
import type { User, Vehicle, Driver, Route, Student, Attendance, Notification, FastagLog, SafetyAlert } from '../utils/db';

export const transportApi = {
  // Auth
  login: async (credentials: any) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // Vehicles
  getVehicles: async () => {
    const response = await axiosInstance.get('/vehicles');
    return response.data as Vehicle[];
  },
  addVehicle: async (vehicle: Vehicle) => {
    const response = await axiosInstance.post('/vehicles', vehicle);
    return response.data as Vehicle;
  },
  updateVehicle: async (vehicle: Vehicle) => {
    const response = await axiosInstance.put('/vehicles', vehicle);
    return response.data as Vehicle;
  },
  deleteVehicle: async (vehicleNumber: string) => {
    const response = await axiosInstance.delete(`/vehicles/${encodeURIComponent(vehicleNumber)}`);
    return response.data;
  },

  // Drivers
  getDrivers: async () => {
    const response = await axiosInstance.get('/drivers');
    return response.data as Driver[];
  },
  addDriver: async (driver: Driver) => {
    const response = await axiosInstance.post('/drivers', driver);
    return response.data as Driver;
  },
  updateDriver: async (driver: Driver) => {
    const response = await axiosInstance.put('/drivers', driver);
    return response.data as Driver;
  },
  deleteDriver: async (employeeId: string) => {
    const response = await axiosInstance.delete(`/drivers/${encodeURIComponent(employeeId)}`);
    return response.data;
  },

  // Routes
  getRoutes: async () => {
    const response = await axiosInstance.get('/routes');
    return response.data as Route[];
  },
  addRoute: async (route: Route) => {
    const response = await axiosInstance.post('/routes', route);
    return response.data as Route;
  },
  updateRoute: async (route: Route) => {
    const response = await axiosInstance.put('/routes', route);
    return response.data as Route;
  },
  deleteRoute: async (routeName: string) => {
    const response = await axiosInstance.delete(`/routes/${encodeURIComponent(routeName)}`);
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await axiosInstance.get('/students');
    return response.data as Student[];
  },
  allocateStudent: async (allocation: { studentId: string; route: string; bus: string; pickupStop: string; dropStop: string }) => {
    const response = await axiosInstance.post('/students/allocate', allocation);
    return response.data as Student;
  },
  deallocateStudent: async (studentId: string) => {
    const response = await axiosInstance.post('/students/deallocate', { studentId });
    return response.data as Student;
  },
  updateStudent: async (student: Student) => {
    const response = await axiosInstance.put('/students', student);
    return response.data as Student;
  },
  addStudent: async (student: Student) => {
    const response = await axiosInstance.post('/students', student);
    return response.data as Student;
  },
  bulkAddStudents: async (students: Student[]) => {
    const response = await axiosInstance.post('/students/bulk', students);
    return response.data;
  },

  // Attendance
  getAttendance: async () => {
    const response = await axiosInstance.get('/attendance');
    return response.data as Attendance[];
  },
  saveAttendance: async (attendance: Attendance | Attendance[]) => {
    const response = await axiosInstance.post('/attendance', attendance);
    return response.data;
  },

  // Notifications & FCM Push
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    const data = response.data;
    return (data.data || data) as Notification[];
  },
  getNotificationHistory: async () => {
    const response = await axiosInstance.get('/notifications/history');
    const data = response.data;
    return (data.data || data) as any[];
  },
  addNotification: async (notification: Omit<Notification, 'id' | 'date'>) => {
    const response = await axiosInstance.post('/notifications', notification);
    return response.data as Notification;
  },
  registerFcmToken: async (fcmToken: string) => {
    const response = await axiosInstance.post('/notifications/token', { fcmToken });
    return response.data;
  },
  sendNotification: async (payload: { title: string; body: string; recipientType?: string; recipientId?: string; routeId?: string; busId?: string; priority?: string; type?: string }) => {
    const response = await axiosInstance.post('/notifications/send', payload);
    return response.data;
  },
  sendBroadcastNotification: async (payload: { title: string; body: string; priority?: string; type?: string }) => {
    const response = await axiosInstance.post('/notifications/broadcast', payload);
    return response.data;
  },
  markNotificationAsRead: async (id: string) => {
    const response = await axiosInstance.patch(`/notifications/${encodeURIComponent(id)}/read`);
    return response.data;
  },

  // Users (Super Admin)
  getUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data as Omit<User, 'password'>[];
  },
  createUser: async (user: User) => {
    const response = await axiosInstance.post('/users', user);
    return response.data as Omit<User, 'password'>;
  },
  deleteUser: async (email: string) => {
    const response = await axiosInstance.delete(`/users/${encodeURIComponent(email)}`);
    return response.data;
  },
  toggleUserStatus: async (email: string, isActive: boolean) => {
    const response = await axiosInstance.put(`/users/${encodeURIComponent(email)}/status`, { isActive });
    return response.data as Omit<User, 'password'>;
  },
  resetUserPassword: async (email: string, password: string) => {
    const response = await axiosInstance.put(`/users/${encodeURIComponent(email)}/password`, { password });
    return response.data;
  },

  // Fastag Gate Logs
  getFastagLogs: async () => {
    const response = await axiosInstance.get('/fastag/logs');
    return response.data as FastagLog[];
  },
  addFastagLog: async (log: Omit<FastagLog, 'id' | 'timestamp'>) => {
    const response = await axiosInstance.post('/fastag/logs', log);
    return response.data as FastagLog;
  },

  // Safety & Dashcam Alerts
  getSafetyAlerts: async () => {
    const response = await axiosInstance.get('/safety/alerts');
    return response.data as SafetyAlert[];
  },
  resolveSafetyAlert: async (id: string) => {
    const response = await axiosInstance.put(`/safety/alerts/${encodeURIComponent(id)}/resolve`);
    return response.data as SafetyAlert;
  },
};
