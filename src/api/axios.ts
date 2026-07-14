// src/api/axios.ts
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { dbService } from '../utils/db';
import type { User, Vehicle, Driver, Route, Attendance, Notification, Student, FastagLog } from '../utils/db';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup mock adapter to process requests locally via localStorage database
axiosInstance.defaults.adapter = async function (config): Promise<AxiosResponse<any>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const url = config.url || '';
  const method = config.method ? config.method.toLowerCase() : 'get';
  const data = config.data ? JSON.parse(config.data) : null;

  try {
    // ── 1. AUTH ENDPOINTS ──
    if (url.includes('/auth/login') && method === 'post') {
      const { email, password } = data;
      const users = dbService.getUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive
      );

      if (!user) {
        throw new Error('User not found or deactivated');
      }

      if (user.password && user.password !== password) {
        throw new Error('Incorrect password');
      }

      // Successful login
      const token = `mock-token-${user.role.replace(' ', '-').toLowerCase()}-${user.email}`;
      return {
        data: { accessToken: token, user: { email: user.email, name: user.name, role: user.role, studentId: user.studentId, employeeId: user.employeeId } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    if (url.includes('/auth/logout') && method === 'post') {
      return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
    }

    // ── 2. VEHICLES ENDPOINTS ──
    if (url.includes('/vehicles')) {
      const vehicles = dbService.getVehicles();

      if (method === 'get') {
        return { data: vehicles, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        // Add new vehicle
        const newVehicle: Vehicle = data;
        if (vehicles.some((v) => v.vehicleNumber === newVehicle.vehicleNumber)) {
          throw new Error('Vehicle number already exists');
        }
        vehicles.push(newVehicle);
        dbService.saveVehicles(vehicles);
        return { data: newVehicle, status: 201, statusText: 'Created', headers: {}, config };
      }

      if (method === 'put') {
        // Update vehicle
        const updatedVehicle: Vehicle = data;
        const index = vehicles.findIndex((v) => v.vehicleNumber === updatedVehicle.vehicleNumber);
        if (index === -1) throw new Error('Vehicle not found');

        // Sync old relations if driver/route changed
        vehicles[index] = updatedVehicle;
        dbService.saveVehicles(vehicles);

        // Auto sync driver assigned route/vehicle details
        const drivers = dbService.getDrivers();
        const routes = dbService.getRoutes();

        // Update driver table to reflect this assignment
        let driversChanged = false;
        const dIndex = drivers.findIndex((d) => d.name === updatedVehicle.driverAssigned);
        if (dIndex !== -1 && updatedVehicle.driverAssigned !== 'None') {
          drivers[dIndex].assignedVehicle = updatedVehicle.vehicleNumber;
          drivers[dIndex].assignedRoute = updatedVehicle.routeAssigned;
          driversChanged = true;
        }

        // Update route table to reflect vehicle assignment
        let routesChanged = false;
        const rIndex = routes.findIndex((r) => r.routeName === updatedVehicle.routeAssigned);
        if (rIndex !== -1 && updatedVehicle.routeAssigned !== 'None') {
          routes[rIndex].assignedVehicle = updatedVehicle.vehicleNumber;
          routes[rIndex].assignedDriver = updatedVehicle.driverAssigned;
          routesChanged = true;
        }

        if (driversChanged) dbService.saveDrivers(drivers);
        if (routesChanged) dbService.saveRoutes(routes);

        return { data: updatedVehicle, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'delete') {
        const vehicleNumber = url.split('/').pop() || '';
        const index = vehicles.findIndex((v) => v.vehicleNumber === decodeURIComponent(vehicleNumber));
        if (index === -1) throw new Error('Vehicle not found');
        
        const deleted = vehicles.splice(index, 1)[0];
        dbService.saveVehicles(vehicles);

        // Clean up allocations
        const drivers = dbService.getDrivers();
        const dIndex = drivers.findIndex((d) => d.assignedVehicle === deleted.vehicleNumber);
        if (dIndex !== -1) {
          drivers[dIndex].assignedVehicle = 'None';
          drivers[dIndex].assignedRoute = 'None';
          dbService.saveDrivers(drivers);
        }

        const routes = dbService.getRoutes();
        const rIndex = routes.findIndex((r) => r.assignedVehicle === deleted.vehicleNumber);
        if (rIndex !== -1) {
          routes[rIndex].assignedVehicle = 'None';
          routes[rIndex].assignedDriver = 'None';
          dbService.saveRoutes(routes);
        }

        const students = dbService.getStudents();
        let studentsChanged = false;
        students.forEach((s) => {
          if (s.bus === deleted.vehicleNumber) {
            s.bus = 'None';
            s.route = 'None';
            s.pickupStop = 'None';
            s.dropStop = 'None';
            studentsChanged = true;
          }
        });
        if (studentsChanged) dbService.saveStudents(students);

        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 3. DRIVERS ENDPOINTS ──
    if (url.includes('/drivers')) {
      const drivers = dbService.getDrivers();

      if (method === 'get') {
        return { data: drivers, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        const newDriver: Driver = data;
        if (drivers.some((d) => d.employeeId === newDriver.employeeId)) {
          throw new Error('Driver Employee ID already exists');
        }
        drivers.push(newDriver);
        dbService.saveDrivers(drivers);
        return { data: newDriver, status: 201, statusText: 'Created', headers: {}, config };
      }

      if (method === 'put') {
        const updatedDriver: Driver = data;
        const index = drivers.findIndex((d) => d.employeeId === updatedDriver.employeeId);
        if (index === -1) throw new Error('Driver not found');

        drivers[index] = updatedDriver;
        dbService.saveDrivers(drivers);

        // Sync vehicle assignment
        const vehicles = dbService.getVehicles();
        let vehiclesChanged = false;
        const vIndex = vehicles.findIndex((v) => v.vehicleNumber === updatedDriver.assignedVehicle);
        if (vIndex !== -1 && updatedDriver.assignedVehicle !== 'None') {
          vehicles[vIndex].driverAssigned = updatedDriver.name;
          vehicles[vIndex].routeAssigned = updatedDriver.assignedRoute;
          vehiclesChanged = true;
        }

        // Sync route assignment
        const routes = dbService.getRoutes();
        let routesChanged = false;
        const rIndex = routes.findIndex((r) => r.routeName === updatedDriver.assignedRoute);
        if (rIndex !== -1 && updatedDriver.assignedRoute !== 'None') {
          routes[rIndex].assignedDriver = updatedDriver.name;
          routes[rIndex].assignedVehicle = updatedDriver.assignedVehicle;
          routesChanged = true;
        }

        if (vehiclesChanged) dbService.saveVehicles(vehicles);
        if (routesChanged) dbService.saveRoutes(routes);

        return { data: updatedDriver, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'delete') {
        const employeeId = url.split('/').pop() || '';
        const index = drivers.findIndex((d) => d.employeeId === decodeURIComponent(employeeId));
        if (index === -1) throw new Error('Driver not found');

        const deleted = drivers.splice(index, 1)[0];
        dbService.saveDrivers(drivers);

        // Clean up allocations
        const vehicles = dbService.getVehicles();
        const vIndex = vehicles.findIndex((v) => v.driverAssigned === deleted.name);
        if (vIndex !== -1) {
          vehicles[vIndex].driverAssigned = 'None';
          vehicles[vIndex].routeAssigned = 'None';
          dbService.saveVehicles(vehicles);
        }

        const routes = dbService.getRoutes();
        const rIndex = routes.findIndex((r) => r.assignedDriver === deleted.name);
        if (rIndex !== -1) {
          routes[rIndex].assignedDriver = 'None';
          routes[rIndex].assignedVehicle = 'None';
          dbService.saveRoutes(routes);
        }

        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 4. ROUTES ENDPOINTS ──
    if (url.includes('/routes')) {
      const routes = dbService.getRoutes();

      if (method === 'get') {
        return { data: routes, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        const newRoute: Route = data;
        if (routes.some((r) => r.routeName.toLowerCase() === newRoute.routeName.toLowerCase())) {
          throw new Error('Route Name already exists');
        }
        routes.push(newRoute);
        dbService.saveRoutes(routes);
        return { data: newRoute, status: 201, statusText: 'Created', headers: {}, config };
      }

      if (method === 'put') {
        const updatedRoute: Route = data;
        const index = routes.findIndex((r) => r.routeName === updatedRoute.routeName);
        if (index === -1) throw new Error('Route not found');

        routes[index] = updatedRoute;
        dbService.saveRoutes(routes);

        // Sync vehicle
        const vehicles = dbService.getVehicles();
        let vehiclesChanged = false;
        const vIndex = vehicles.findIndex((v) => v.vehicleNumber === updatedRoute.assignedVehicle);
        if (vIndex !== -1 && updatedRoute.assignedVehicle !== 'None') {
          vehicles[vIndex].routeAssigned = updatedRoute.routeName;
          vehicles[vIndex].driverAssigned = updatedRoute.assignedDriver;
          vehiclesChanged = true;
        }

        // Sync driver
        const drivers = dbService.getDrivers();
        let driversChanged = false;
        const dIndex = drivers.findIndex((d) => d.name === updatedRoute.assignedDriver);
        if (dIndex !== -1 && updatedRoute.assignedDriver !== 'None') {
          drivers[dIndex].assignedRoute = updatedRoute.routeName;
          drivers[dIndex].assignedVehicle = updatedRoute.assignedVehicle;
          driversChanged = true;
        }

        if (vehiclesChanged) dbService.saveVehicles(vehicles);
        if (driversChanged) dbService.saveDrivers(drivers);

        return { data: updatedRoute, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'delete') {
        const routeName = url.split('/').pop() || '';
        const decodedRouteName = decodeURIComponent(routeName);
        const index = routes.findIndex((r) => r.routeName === decodedRouteName);
        if (index === -1) throw new Error('Route not found');

        const deleted = routes.splice(index, 1)[0];
        dbService.saveRoutes(routes);

        // Clean up allocations
        const vehicles = dbService.getVehicles();
        const vIndex = vehicles.findIndex((v) => v.routeAssigned === deleted.routeName);
        if (vIndex !== -1) {
          vehicles[vIndex].routeAssigned = 'None';
          vehicles[vIndex].driverAssigned = 'None';
          dbService.saveVehicles(vehicles);
        }

        const drivers = dbService.getDrivers();
        const dIndex = drivers.findIndex((d) => d.assignedRoute === deleted.routeName);
        if (dIndex !== -1) {
          drivers[dIndex].assignedRoute = 'None';
          drivers[dIndex].assignedVehicle = 'None';
          dbService.saveDrivers(drivers);
        }

        const students = dbService.getStudents();
        let studentsChanged = false;
        students.forEach((s) => {
          if (s.route === deleted.routeName) {
            s.route = 'None';
            s.bus = 'None';
            s.pickupStop = 'None';
            s.dropStop = 'None';
            studentsChanged = true;
          }
        });
        if (studentsChanged) dbService.saveStudents(students);

        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 5. STUDENTS ENDPOINTS ──
    if (url.includes('/students')) {
      const students = dbService.getStudents();

      if (method === 'get') {
        return { data: students, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'put') {
        const updatedStudent: Student = data;
        const index = students.findIndex((s) => s.studentId === updatedStudent.studentId);
        if (index === -1) throw new Error('Student not found');
        students[index] = { ...students[index], ...updatedStudent };
        dbService.saveStudents(students);
        return { data: students[index], status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/allocate') && method === 'post') {
        const { studentId, route, bus, pickupStop, dropStop } = data;
        const sIndex = students.findIndex((s) => s.studentId === studentId);
        if (sIndex === -1) throw new Error('Student not found');

        students[sIndex].route = route;
        students[sIndex].bus = bus;
        students[sIndex].pickupStop = pickupStop;
        students[sIndex].dropStop = dropStop;

        dbService.saveStudents(students);
        return { data: students[sIndex], status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/deallocate') && method === 'post') {
        const { studentId } = data;
        const sIndex = students.findIndex((s) => s.studentId === studentId);
        if (sIndex === -1) throw new Error('Student not found');

        students[sIndex].route = 'None';
        students[sIndex].bus = 'None';
        students[sIndex].pickupStop = 'None';
        students[sIndex].dropStop = 'None';

        dbService.saveStudents(students);
        return { data: students[sIndex], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 6. ATTENDANCE ENDPOINTS ──
    if (url.includes('/attendance')) {
      const attendance = dbService.getAttendance();

      if (method === 'get') {
        return { data: attendance, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        // Bulk save attendance or update single attendance
        // Format of data: Attendance or Attendance[]
        if (Array.isArray(data)) {
          const records: Attendance[] = data;
          records.forEach((record) => {
            const index = attendance.findIndex((a) => a.id === record.id);
            if (index !== -1) {
              attendance[index] = record;
            } else {
              attendance.push(record);
            }
          });
        } else {
          const record: Attendance = data;
          const index = attendance.findIndex((a) => a.id === record.id);
          if (index !== -1) {
            attendance[index] = record;
          } else {
            attendance.push(record);
          }
        }
        dbService.saveAttendance(attendance);
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 7. NOTIFICATIONS ENDPOINTS ──
    if (url.includes('/notifications')) {
      const notifications = dbService.getNotifications();

      if (method === 'get') {
        return { data: notifications, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        const newNotif: Notification = {
          id: `NOT-${Date.now()}`,
          ...data,
          date: new Date().toISOString().split('T')[0],
        };
        notifications.unshift(newNotif); // latest first
        dbService.saveNotifications(notifications);
        return { data: newNotif, status: 201, statusText: 'Created', headers: {}, config };
      }
    }

    // ── 8. USERS ENDPOINTS (SUPER ADMIN ONLY) ──
    if (url.includes('/users')) {
      const users = dbService.getUsers();

      if (method === 'get') {
        // Strip passwords before returning
        const safeUsers = users.map(({ password, ...u }) => u);
        return { data: safeUsers, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'post') {
        const newUser: User = data;
        if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
          throw new Error('User email already registered');
        }
        users.push(newUser);
        dbService.saveUsers(users);

        // Also create a linked entity if role is Driver or Parent
        if (newUser.role === 'Driver') {
          const drivers = dbService.getDrivers();
          if (!drivers.some((d) => d.name === newUser.name)) {
            drivers.push({
              name: newUser.name,
              employeeId: newUser.employeeId || `EMP-DRV-${Date.now().toString().slice(-3)}`,
              phone: '+91 99000 11000',
              assignedVehicle: 'None',
              assignedRoute: 'None',
              status: 'Active',
            });
            dbService.saveDrivers(drivers);
          }
        } else if (newUser.role === 'Parent') {
          const students = dbService.getStudents();
          const sIndex = students.findIndex((s) => s.studentId === newUser.studentId);
          if (sIndex !== -1) {
            students[sIndex].parentEmail = newUser.email;
            dbService.saveStudents(students);
          }
        }

        const { password, ...safeUser } = newUser;
        return { data: safeUser, status: 201, statusText: 'Created', headers: {}, config };
      }

      if (url.includes('/status') && method === 'put') {
        const parts = url.split('/');
        const email = decodeURIComponent(parts[parts.length - 2]);
        const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
        if (index === -1) throw new Error('User not found');

        users[index].isActive = data.isActive;
        dbService.saveUsers(users);
        const { password, ...safeUser } = users[index];
        return { data: safeUser, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url.includes('/password') && method === 'put') {
        const parts = url.split('/');
        const email = decodeURIComponent(parts[parts.length - 2]);
        const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
        if (index === -1) throw new Error('User not found');

        users[index].password = data.password;
        dbService.saveUsers(users);
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (method === 'delete') {
        const email = url.split('/').pop() || '';
        const decodedEmail = decodeURIComponent(email);
        const index = users.findIndex((u) => u.email.toLowerCase() === decodedEmail.toLowerCase());
        if (index === -1) throw new Error('User not found');

        users.splice(index, 1);
        dbService.saveUsers(users);
        return { data: { success: true }, status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    // ── 9. FASTAG ACCESS LOGS ──
    if (url.includes('/fastag/logs')) {
      const logs = dbService.getFastagLogs();
      if (method === 'get') {
        return { data: logs, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (method === 'post') {
        const newLog: FastagLog = {
          ...data,
          id: `FT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date().toISOString()
        };
        logs.unshift(newLog); // latest first
        dbService.saveFastagLogs(logs);

        // Optional: Update vehicle location status on gate entry/exit
        const vehicles = dbService.getVehicles();
        const vIndex = vehicles.findIndex((v) => v.vehicleNumber === newLog.vehicleNumber);
        if (vIndex !== -1) {
          vehicles[vIndex].status = newLog.direction === 'Entry' ? 'Active' : 'Active'; // Keep status Active but sync is done
          dbService.saveVehicles(vehicles);
        }

        return { data: newLog, status: 201, statusText: 'Created', headers: {}, config };
      }
    }

    // ── 10. SAFETY ALERTS ──
    if (url.includes('/safety/alerts')) {
      const alerts = dbService.getSafetyAlerts();
      if (method === 'get') {
        return { data: alerts, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (url.endsWith('/resolve') && method === 'put') {
        const parts = url.split('/');
        const resolveIndex = parts.indexOf('resolve');
        const alertId = decodeURIComponent(parts[resolveIndex - 1] || '');
        const index = alerts.findIndex((a) => a.id === alertId);
        if (index === -1) throw new Error('Safety Alert not found');
        alerts[index].resolved = true;
        dbService.saveSafetyAlerts(alerts);
        return { data: alerts[index], status: 200, statusText: 'OK', headers: {}, config };
      }
    }

    throw new Error(`Endpoint not matched: ${url} (${method})`);
  } catch (error: any) {
    return Promise.reject({
      response: {
        data: { message: error.message || 'Internal Server Error' },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
      },
    });
  }
};

// Request interceptor to set Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('transport_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session timeout (e.g. 401 response)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('transport_token');
      localStorage.removeItem('transport_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
