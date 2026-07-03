// src/api/transportApi.ts
import axiosInstance from './axios';
import type { User, Vehicle, Driver, Route, Student, Attendance, Notification } from '../utils/db';

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

  // Attendance
  getAttendance: async () => {
    const response = await axiosInstance.get('/attendance');
    return response.data as Attendance[];
  },
  saveAttendance: async (attendance: Attendance | Attendance[]) => {
    const response = await axiosInstance.post('/attendance', attendance);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data as Notification[];
  },
  addNotification: async (notification: Omit<Notification, 'id' | 'date'>) => {
    const response = await axiosInstance.post('/notifications', notification);
    return response.data as Notification;
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
};
