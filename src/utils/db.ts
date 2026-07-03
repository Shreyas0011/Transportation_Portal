// src/utils/db.ts

export interface Stop {
  stopName: string;
  arrivalTime: string;
  dropTime: string;
}

export interface Route {
  routeName: string;
  startingPoint: string;
  destination: string;
  stops: Stop[];
  assignedVehicle: string;
  assignedDriver: string;
}

export interface Vehicle {
  vehicleNumber: string;
  registrationNumber: string;
  vehicleModel: string;
  seatingCapacity: number;
  driverAssigned: string; // driver email or name
  routeAssigned: string;  // route name
  status: 'Active' | 'Under Maintenance' | 'Inactive';
}

export interface Driver {
  name: string;
  employeeId: string;
  phone: string;
  assignedVehicle: string;
  assignedRoute: string;
  status: 'Active' | 'Inactive' | 'On Leave';
}

export interface Student {
  studentName: string;
  studentId: string;
  route: string;
  bus: string;
  pickupStop: string;
  dropStop: string;
  parentContact: string;
  parentEmail?: string;
  healthRecord?: string;
}

export interface Attendance {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  route: string;
  bus: string;
  status: 'Boarded' | 'Absent' | 'Dropped';
}

export interface Notification {
  id: string;
  title: string;
  category: 'Bus delay' | 'Route change' | 'Vehicle maintenance' | 'Holiday notification' | 'Emergency announcement';
  message: string;
  date: string;
  sentBy: string;
}

export interface User {
  email: string;
  password?: string;
  role: 'Transport Head' | 'Parent' | 'Driver' | 'Super Admin';
  name: string;
  employeeId?: string;
  studentId?: string; // For parents to link to child
  isActive: boolean;
}

const DB_VERSION = 'v1.3';

// Seeding Default Data
const DEFAULT_USERS: User[] = [
  {
    email: 'head@transcend.org',
    password: 'head123',
    role: 'Transport Head',
    name: 'Rajesh Nair',
    employeeId: 'EMP-HEAD-001',
    isActive: true,
  },
  {
    email: 'parent1@transcend.org',
    password: 'parent123',
    role: 'Parent',
    name: 'Anil Sharma',
    studentId: 'STU001',
    isActive: true,
  },
  {
    email: 'parent2@transcend.org',
    password: 'parent123',
    role: 'Parent',
    name: 'Sunita Nair',
    studentId: 'STU002',
    isActive: true,
  },
  {
    email: 'driver1@transcend.org',
    password: 'driver123',
    role: 'Driver',
    name: 'Manjunath Gowda',
    employeeId: 'EMP-DRV-001',
    isActive: true,
  },
  {
    email: 'driver2@transcend.org',
    password: 'driver123',
    role: 'Driver',
    name: 'Satish Kumar',
    employeeId: 'EMP-DRV-002',
    isActive: true,
  },
  {
    email: 'superadmin@transcend.org',
    password: 'super123',
    role: 'Super Admin',
    name: 'Siddharth K T',
    employeeId: 'EMP-SAD-001',
    isActive: true,
  },
];

const DEFAULT_DRIVERS: Driver[] = [
  {
    name: 'Manjunath Gowda',
    employeeId: 'EMP-DRV-001',
    phone: '+91 98450 12345',
    assignedVehicle: 'KA-53-F-1234',
    assignedRoute: 'North Route',
    status: 'Active',
  },
  {
    name: 'Satish Kumar',
    employeeId: 'EMP-DRV-002',
    phone: '+91 98450 67890',
    assignedVehicle: 'KA-03-M-5678',
    assignedRoute: 'South-East Route',
    status: 'Active',
  },
  {
    name: 'Ramesh Naik',
    employeeId: 'EMP-DRV-003',
    phone: '+91 97412 34567',
    assignedVehicle: 'None',
    assignedRoute: 'None',
    status: 'Inactive',
  },
];

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    vehicleNumber: 'KA-53-F-1234',
    registrationNumber: 'REG88762',
    vehicleModel: 'Tata Winger 15-Seater',
    seatingCapacity: 15,
    driverAssigned: 'Manjunath Gowda',
    routeAssigned: 'North Route',
    status: 'Active',
  },
  {
    vehicleNumber: 'KA-03-M-5678',
    registrationNumber: 'REG98112',
    vehicleModel: 'Swaraj Mazda 30-Seater',
    seatingCapacity: 30,
    driverAssigned: 'Satish Kumar',
    routeAssigned: 'South-East Route',
    status: 'Active',
  },
  {
    vehicleNumber: 'KA-51-AB-9999',
    registrationNumber: 'REG10034',
    vehicleModel: 'Ashok Leyland 40-Seater',
    seatingCapacity: 40,
    driverAssigned: 'None',
    routeAssigned: 'None',
    status: 'Under Maintenance',
  },
];

const DEFAULT_ROUTES: Route[] = [
  {
    routeName: 'North Route',
    startingPoint: 'Bannerghatta Road',
    destination: 'Transcend Innovation Campus',
    assignedVehicle: 'KA-53-F-1234',
    assignedDriver: 'Manjunath Gowda',
    stops: [
      { stopName: 'Hebbal Flyover', arrivalTime: '07:30 AM', dropTime: '04:50 PM' },
      { stopName: 'Manyata Tech Park', arrivalTime: '07:45 AM', dropTime: '04:35 PM' },
      { stopName: 'Yelahanka Bypass', arrivalTime: '08:05 AM', dropTime: '04:15 PM' },
    ],
  },
  {
    routeName: 'South-East Route',
    startingPoint: 'Indiranagar Metro Station',
    destination: 'Transcend Innovation Campus',
    assignedVehicle: 'KA-03-M-5678',
    assignedDriver: 'Satish Kumar',
    stops: [
      { stopName: 'Marathahalli Bridge', arrivalTime: '07:15 AM', dropTime: '05:15 PM' },
      { stopName: 'KR Puram Station', arrivalTime: '07:35 AM', dropTime: '04:55 PM' },
      { stopName: 'Tin Factory', arrivalTime: '07:45 AM', dropTime: '04:45 PM' },
      { stopName: 'Kalyan Nagar', arrivalTime: '08:00 AM', dropTime: '04:30 PM' },
    ],
  },
];

const DEFAULT_STUDENTS: Student[] = [
  {
    studentName: 'Aarav Sharma',
    studentId: 'STU001',
    route: 'North Route',
    bus: 'KA-53-F-1234',
    pickupStop: 'Hebbal Flyover',
    dropStop: 'Hebbal Flyover',
    parentContact: '+91 98765 10001',
    parentEmail: 'parent1@transcend.org',
    healthRecord: 'Asthma - Needs inhaler in case of emergency.',
  },
  {
    studentName: 'Priya Nair',
    studentId: 'STU002',
    route: 'North Route',
    bus: 'KA-53-F-1234',
    pickupStop: 'Yelahanka Bypass',
    dropStop: 'Yelahanka Bypass',
    parentContact: '+91 98765 10002',
    parentEmail: 'parent2@transcend.org',
    healthRecord: 'Severe allergy to peanuts. Epipen in school bag.',
  },
  {
    studentName: 'Vihaan Verma',
    studentId: 'STU003',
    route: 'South-East Route',
    bus: 'KA-03-M-5678',
    pickupStop: 'Kalyan Nagar',
    dropStop: 'Kalyan Nagar',
    parentContact: '+91 98765 10003',
    healthRecord: 'No specific medical conditions or allergies.',
  },
  {
    studentName: 'Aditya Bhat',
    studentId: 'STU004',
    route: 'South-East Route',
    bus: 'KA-03-M-5678',
    pickupStop: 'Marathahalli Bridge',
    dropStop: 'Marathahalli Bridge',
    parentContact: '+91 98765 10004',
    healthRecord: 'Lactose intolerance. Avoid dairy products.',
  },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    title: 'Bus Route A Delay Announcement',
    category: 'Bus delay',
    message: 'Bus KA-53-F-1234 running on the North Route is delayed by 15 minutes due to heavy traffic near Manyata Tech Park. Expect delays at pickup points.',
    date: new Date().toISOString().split('T')[0],
    sentBy: 'Rajesh Nair (Transport Head)',
  },
  {
    id: 'NOT-002',
    title: 'Scheduled Vehicle Maintenance',
    category: 'Vehicle maintenance',
    message: 'Bus KA-51-AB-9999 has been scheduled for general maintenance and oil change. It will be out of operation from July 2 to July 4.',
    date: new Date().toISOString().split('T')[0],
    sentBy: 'Rajesh Nair (Transport Head)',
  },
  {
    id: 'NOT-003',
    title: 'Route Adjustment Hebbal Flyover stop',
    category: 'Route change',
    message: 'The pickup stop at Hebbal Flyover has been shifted 100m ahead of the bridge due to road repairs. The timing remains unchanged.',
    date: new Date().toISOString().split('T')[0],
    sentBy: 'Rajesh Nair (Transport Head)',
  },
];

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Generate last 5 days attendance
function generateDefaultAttendance(): Attendance[] {
  const attendanceList: Attendance[] = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    DEFAULT_STUDENTS.forEach((student, idx) => {
      // Create a deterministic status
      let status: 'Boarded' | 'Absent' | 'Dropped' = 'Dropped';
      if ((idx + i) % 7 === 0) {
        status = 'Absent';
      } else if (i === 0) {
        // Today, they might just be boarded and not dropped yet
        status = 'Boarded';
      }

      // Only add attendance if student has route and bus assigned
      if (student.route && student.bus) {
        attendanceList.push({
          id: `ATT-${student.studentId}-${dateStr}`,
          date: dateStr,
          studentId: student.studentId,
          studentName: student.studentName,
          route: student.route,
          bus: student.bus,
          status,
        });
      }
    });
  }
  return attendanceList;
}

export function initLocalStorageDB() {
  const cachedVersion = localStorage.getItem('transport_db_version');
  
  if (cachedVersion === DB_VERSION) {
    return;
  }

  // Reseed all data
  localStorage.setItem('transport_users', JSON.stringify(DEFAULT_USERS));
  localStorage.setItem('transport_drivers', JSON.stringify(DEFAULT_DRIVERS));
  localStorage.setItem('transport_vehicles', JSON.stringify(DEFAULT_VEHICLES));
  localStorage.setItem('transport_routes', JSON.stringify(DEFAULT_ROUTES));
  localStorage.setItem('transport_students', JSON.stringify(DEFAULT_STUDENTS));
  localStorage.setItem('transport_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
  localStorage.setItem('transport_attendance', JSON.stringify(generateDefaultAttendance()));
  localStorage.setItem('transport_db_version', DB_VERSION);
}

// Helper methods to read/write specific tables
export function readTable<T>(tableName: string): T[] {
  initLocalStorageDB();
  const rawData = localStorage.getItem(tableName);
  return rawData ? JSON.parse(rawData) : [];
}

export function writeTable<T>(tableName: string, data: T[]) {
  localStorage.setItem(tableName, JSON.stringify(data));
}

// --- DATABASE CRUD API ---

export const dbService = {
  // Users CRUD
  getUsers: (): User[] => readTable<User>('transport_users'),
  saveUsers: (users: User[]) => writeTable<User>('transport_users', users),
  
  // Drivers CRUD
  getDrivers: (): Driver[] => readTable<Driver>('transport_drivers'),
  saveDrivers: (drivers: Driver[]) => writeTable<Driver>('transport_drivers', drivers),
  
  // Vehicles CRUD
  getVehicles: (): Vehicle[] => readTable<Vehicle>('transport_vehicles'),
  saveVehicles: (vehicles: Vehicle[]) => writeTable<Vehicle>('transport_vehicles', vehicles),
  
  // Routes CRUD
  getRoutes: (): Route[] => readTable<Route>('transport_routes'),
  saveRoutes: (routes: Route[]) => writeTable<Route>('transport_routes', routes),
  
  // Students CRUD
  getStudents: (): Student[] => readTable<Student>('transport_students'),
  saveStudents: (students: Student[]) => writeTable<Student>('transport_students', students),
  
  // Notifications CRUD
  getNotifications: (): Notification[] => readTable<Notification>('transport_notifications'),
  saveNotifications: (notifications: Notification[]) => writeTable<Notification>('transport_notifications', notifications),
  
  // Attendance CRUD
  getAttendance: (): Attendance[] => readTable<Attendance>('transport_attendance'),
  saveAttendance: (attendance: Attendance[]) => writeTable<Attendance>('transport_attendance', attendance),
};
