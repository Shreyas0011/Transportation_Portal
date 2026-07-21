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
  status: 'Boarded' | 'Absent' | 'Dropped' | 'No-Show' | 'Present';
  parentDeclaration?: 'Present' | 'Absent';
  actualBoarding?: 'Boarded' | 'No-Show' | 'Dropped';
  accountabilityStatus?: 'Pending' | 'Warned' | 'Resolved';
  accountabilityNote?: string;
  updatedBy?: string;
  dropOffTime?: string;
}

export interface Notification {
  id: string;
  title: string;
  category: 'Bus delay' | 'Route change' | 'Vehicle maintenance' | 'Holiday notification' | 'Emergency announcement';
  message: string;
  date: string;
  sentBy: string;
}

export interface FastagLog {
  id: string;
  vehicleNumber: string;
  gateName: string;
  direction: 'Entry' | 'Exit';
  timestamp: string;
  status: string;
}

export interface SafetyAlert {
  id: string;
  vehicleNumber: string;
  type: 'Speeding' | 'Driver Distraction' | 'Sudden Braking' | 'Seatbelt Off';
  severity: 'Warning' | 'Critical';
  timestamp: string;
  resolved: boolean;
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

const DB_VERSION = 'v4.0';

const DEFAULT_USERS: User[] = [
  {
    "email": "head@transcend.org",
    "password": "head123",
    "role": "Transport Head",
    "name": "Rajesh Nair",
    "employeeId": "EMP-HEAD-001",
    "isActive": true
  },
  {
    "email": "superadmin@transcend.org",
    "password": "super123",
    "role": "Super Admin",
    "name": "Siddharth K T",
    "employeeId": "EMP-SAD-001",
    "isActive": true
  },
  {
    "email": "driver001@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manjunath Gowda",
    "employeeId": "EMP-DRV-001",
    "isActive": true
  },
  {
    "email": "driver002@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vihaan Gowda",
    "employeeId": "EMP-DRV-002",
    "isActive": true
  },
  {
    "email": "driver003@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Aditya Gowda",
    "employeeId": "EMP-DRV-003",
    "isActive": true
  },
  {
    "email": "driver004@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manjunath Gowda",
    "employeeId": "EMP-DRV-004",
    "isActive": true
  },
  {
    "email": "driver005@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Satish Kumar",
    "employeeId": "EMP-DRV-005",
    "isActive": true
  },
  {
    "email": "driver006@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ramesh Gowda",
    "employeeId": "EMP-DRV-006",
    "isActive": true
  },
  {
    "email": "driver007@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sandeep Gowda",
    "employeeId": "EMP-DRV-007",
    "isActive": true
  },
  {
    "email": "driver008@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ramesh Naik",
    "employeeId": "EMP-DRV-008",
    "isActive": true
  },
  {
    "email": "driver009@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manoj Gowda",
    "employeeId": "EMP-DRV-009",
    "isActive": true
  },
  {
    "email": "driver010@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Arun Gowda",
    "employeeId": "EMP-DRV-010",
    "isActive": true
  },
  {
    "email": "driver011@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ajay Gowda",
    "employeeId": "EMP-DRV-011",
    "isActive": true
  },
  {
    "email": "driver012@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vikram Gowda",
    "employeeId": "EMP-DRV-012",
    "isActive": true
  },
  {
    "email": "driver013@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Deepak Gowda",
    "employeeId": "EMP-DRV-013",
    "isActive": true
  },
  {
    "email": "driver014@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Rajesh Gowda",
    "employeeId": "EMP-DRV-014",
    "isActive": true
  },
  {
    "email": "driver015@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Bhaskar Gowda",
    "employeeId": "EMP-DRV-015",
    "isActive": true
  },
  {
    "email": "driver016@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Narayana Gowda",
    "employeeId": "EMP-DRV-016",
    "isActive": true
  },
  {
    "email": "driver017@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Suresh Gowda",
    "employeeId": "EMP-DRV-017",
    "isActive": true
  },
  {
    "email": "driver018@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Amit Gowda",
    "employeeId": "EMP-DRV-018",
    "isActive": true
  },
  {
    "email": "driver019@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Karan Gowda",
    "employeeId": "EMP-DRV-019",
    "isActive": true
  },
  {
    "email": "driver020@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Devendra Gowda",
    "employeeId": "EMP-DRV-020",
    "isActive": true
  },
  {
    "email": "driver021@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Prasad Gowda",
    "employeeId": "EMP-DRV-021",
    "isActive": true
  },
  {
    "email": "driver022@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Harish Gowda",
    "employeeId": "EMP-DRV-022",
    "isActive": true
  },
  {
    "email": "driver023@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Gopal Gowda",
    "employeeId": "EMP-DRV-023",
    "isActive": true
  },
  {
    "email": "driver024@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sanjay Gowda",
    "employeeId": "EMP-DRV-024",
    "isActive": true
  },
  {
    "email": "driver025@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Anil Gowda",
    "employeeId": "EMP-DRV-025",
    "isActive": true
  },
  {
    "email": "driver026@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sunil Gowda",
    "employeeId": "EMP-DRV-026",
    "isActive": true
  },
  {
    "email": "driver027@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vijay Gowda",
    "employeeId": "EMP-DRV-027",
    "isActive": true
  },
  {
    "email": "driver028@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ashok Gowda",
    "employeeId": "EMP-DRV-028",
    "isActive": true
  },
  {
    "email": "driver029@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Kishore Gowda",
    "employeeId": "EMP-DRV-029",
    "isActive": true
  },
  {
    "email": "driver030@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Prathap Gowda",
    "employeeId": "EMP-DRV-030",
    "isActive": true
  },
  {
    "email": "driver031@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Mohan Gowda",
    "employeeId": "EMP-DRV-031",
    "isActive": true
  },
  {
    "email": "driver032@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Shivakumar Gowda",
    "employeeId": "EMP-DRV-032",
    "isActive": true
  },
  {
    "email": "driver033@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Nandish Gowda",
    "employeeId": "EMP-DRV-033",
    "isActive": true
  },
  {
    "email": "driver034@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Kiran Gowda",
    "employeeId": "EMP-DRV-034",
    "isActive": true
  },
  {
    "email": "driver035@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sudhakar Gowda",
    "employeeId": "EMP-DRV-035",
    "isActive": true
  },
  {
    "email": "driver036@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Rajendra Gowda",
    "employeeId": "EMP-DRV-036",
    "isActive": true
  },
  {
    "email": "driver037@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Jagadish Gowda",
    "employeeId": "EMP-DRV-037",
    "isActive": true
  },
  {
    "email": "driver038@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ananth Gowda",
    "employeeId": "EMP-DRV-038",
    "isActive": true
  },
  {
    "email": "driver039@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ganesh Gowda",
    "employeeId": "EMP-DRV-039",
    "isActive": true
  },
  {
    "email": "driver040@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Aarav Kumar",
    "employeeId": "EMP-DRV-040",
    "isActive": true
  },
  {
    "email": "driver041@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vihaan Kumar",
    "employeeId": "EMP-DRV-041",
    "isActive": true
  },
  {
    "email": "driver042@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Aditya Kumar",
    "employeeId": "EMP-DRV-042",
    "isActive": true
  },
  {
    "email": "driver043@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manjunath Kumar",
    "employeeId": "EMP-DRV-043",
    "isActive": true
  },
  {
    "email": "driver044@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Satish Kumar",
    "employeeId": "EMP-DRV-044",
    "isActive": true
  },
  {
    "email": "driver045@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ramesh Kumar",
    "employeeId": "EMP-DRV-045",
    "isActive": true
  },
  {
    "email": "driver046@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sandeep Kumar",
    "employeeId": "EMP-DRV-046",
    "isActive": true
  },
  {
    "email": "driver047@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Alok Kumar",
    "employeeId": "EMP-DRV-047",
    "isActive": true
  },
  {
    "email": "driver048@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manoj Kumar",
    "employeeId": "EMP-DRV-048",
    "isActive": true
  },
  {
    "email": "driver049@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Arun Kumar",
    "employeeId": "EMP-DRV-049",
    "isActive": true
  },
  {
    "email": "driver050@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ajay Kumar",
    "employeeId": "EMP-DRV-050",
    "isActive": true
  },
  {
    "email": "driver051@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vikram Kumar",
    "employeeId": "EMP-DRV-051",
    "isActive": true
  },
  {
    "email": "driver052@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Deepak Kumar",
    "employeeId": "EMP-DRV-052",
    "isActive": true
  },
  {
    "email": "driver053@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Rajesh Kumar",
    "employeeId": "EMP-DRV-053",
    "isActive": true
  },
  {
    "email": "driver054@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Bhaskar Kumar",
    "employeeId": "EMP-DRV-054",
    "isActive": true
  },
  {
    "email": "driver055@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Narayana Kumar",
    "employeeId": "EMP-DRV-055",
    "isActive": true
  },
  {
    "email": "driver056@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Suresh Kumar",
    "employeeId": "EMP-DRV-056",
    "isActive": true
  },
  {
    "email": "driver057@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Amit Kumar",
    "employeeId": "EMP-DRV-057",
    "isActive": true
  },
  {
    "email": "driver058@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Karan Kumar",
    "employeeId": "EMP-DRV-058",
    "isActive": true
  },
  {
    "email": "driver059@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Devendra Kumar",
    "employeeId": "EMP-DRV-059",
    "isActive": true
  },
  {
    "email": "driver060@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Prasad Kumar",
    "employeeId": "EMP-DRV-060",
    "isActive": true
  },
  {
    "email": "driver061@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Harish Kumar",
    "employeeId": "EMP-DRV-061",
    "isActive": true
  },
  {
    "email": "driver062@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Gopal Kumar",
    "employeeId": "EMP-DRV-062",
    "isActive": true
  },
  {
    "email": "driver063@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sanjay Kumar",
    "employeeId": "EMP-DRV-063",
    "isActive": true
  },
  {
    "email": "driver064@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Anil Kumar",
    "employeeId": "EMP-DRV-064",
    "isActive": true
  },
  {
    "email": "driver065@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sunil Kumar",
    "employeeId": "EMP-DRV-065",
    "isActive": true
  },
  {
    "email": "driver066@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vijay Kumar",
    "employeeId": "EMP-DRV-066",
    "isActive": true
  },
  {
    "email": "driver067@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ashok Kumar",
    "employeeId": "EMP-DRV-067",
    "isActive": true
  },
  {
    "email": "driver068@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Kishore Kumar",
    "employeeId": "EMP-DRV-068",
    "isActive": true
  },
  {
    "email": "driver069@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Prathap Kumar",
    "employeeId": "EMP-DRV-069",
    "isActive": true
  },
  {
    "email": "driver070@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Mohan Kumar",
    "employeeId": "EMP-DRV-070",
    "isActive": true
  },
  {
    "email": "driver071@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Shivakumar Kumar",
    "employeeId": "EMP-DRV-071",
    "isActive": true
  },
  {
    "email": "driver072@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Nandish Kumar",
    "employeeId": "EMP-DRV-072",
    "isActive": true
  },
  {
    "email": "driver073@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Kiran Kumar",
    "employeeId": "EMP-DRV-073",
    "isActive": true
  },
  {
    "email": "driver074@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sudhakar Kumar",
    "employeeId": "EMP-DRV-074",
    "isActive": true
  },
  {
    "email": "driver075@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Rajendra Kumar",
    "employeeId": "EMP-DRV-075",
    "isActive": true
  },
  {
    "email": "driver076@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Jagadish Kumar",
    "employeeId": "EMP-DRV-076",
    "isActive": true
  },
  {
    "email": "driver077@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ananth Kumar",
    "employeeId": "EMP-DRV-077",
    "isActive": true
  },
  {
    "email": "driver078@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ganesh Kumar",
    "employeeId": "EMP-DRV-078",
    "isActive": true
  },
  {
    "email": "driver079@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Aarav Naik",
    "employeeId": "EMP-DRV-079",
    "isActive": true
  },
  {
    "email": "driver080@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vihaan Naik",
    "employeeId": "EMP-DRV-080",
    "isActive": true
  },
  {
    "email": "driver081@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Aditya Naik",
    "employeeId": "EMP-DRV-081",
    "isActive": true
  },
  {
    "email": "driver082@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manjunath Naik",
    "employeeId": "EMP-DRV-082",
    "isActive": true
  },
  {
    "email": "driver083@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Satish Naik",
    "employeeId": "EMP-DRV-083",
    "isActive": true
  },
  {
    "email": "driver084@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ramesh Naik",
    "employeeId": "EMP-DRV-084",
    "isActive": true
  },
  {
    "email": "driver085@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sandeep Naik",
    "employeeId": "EMP-DRV-085",
    "isActive": true
  },
  {
    "email": "driver086@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Alok Naik",
    "employeeId": "EMP-DRV-086",
    "isActive": true
  },
  {
    "email": "driver087@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Manoj Naik",
    "employeeId": "EMP-DRV-087",
    "isActive": true
  },
  {
    "email": "driver088@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Arun Naik",
    "employeeId": "EMP-DRV-088",
    "isActive": true
  },
  {
    "email": "driver089@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Ajay Naik",
    "employeeId": "EMP-DRV-089",
    "isActive": true
  },
  {
    "email": "driver090@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vikram Naik",
    "employeeId": "EMP-DRV-090",
    "isActive": true
  },
  {
    "email": "driver091@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Deepak Naik",
    "employeeId": "EMP-DRV-091",
    "isActive": true
  },
  {
    "email": "driver092@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Rajesh Naik",
    "employeeId": "EMP-DRV-092",
    "isActive": true
  },
  {
    "email": "driver093@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Bhaskar Naik",
    "employeeId": "EMP-DRV-093",
    "isActive": true
  },
  {
    "email": "driver094@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Narayana Naik",
    "employeeId": "EMP-DRV-094",
    "isActive": true
  },
  {
    "email": "driver095@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Suresh Naik",
    "employeeId": "EMP-DRV-095",
    "isActive": true
  },
  {
    "email": "driver096@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Amit Naik",
    "employeeId": "EMP-DRV-096",
    "isActive": true
  },
  {
    "email": "driver097@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Karan Naik",
    "employeeId": "EMP-DRV-097",
    "isActive": true
  },
  {
    "email": "driver098@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Devendra Naik",
    "employeeId": "EMP-DRV-098",
    "isActive": true
  },
  {
    "email": "driver099@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Prasad Naik",
    "employeeId": "EMP-DRV-099",
    "isActive": true
  },
  {
    "email": "driver100@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Harish Naik",
    "employeeId": "EMP-DRV-100",
    "isActive": true
  },
  {
    "email": "driver101@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Gopal Naik",
    "employeeId": "EMP-DRV-101",
    "isActive": true
  },
  {
    "email": "driver102@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sanjay Naik",
    "employeeId": "EMP-DRV-102",
    "isActive": true
  },
  {
    "email": "driver103@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Anil Naik",
    "employeeId": "EMP-DRV-103",
    "isActive": true
  },
  {
    "email": "driver104@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Sunil Naik",
    "employeeId": "EMP-DRV-104",
    "isActive": true
  },
  {
    "email": "driver105@transcend.org",
    "password": "driver123",
    "role": "Driver",
    "name": "Vijay Naik",
    "employeeId": "EMP-DRV-105",
    "isActive": true
  },
  {
    "email": "parent.251p2474@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Deshpande",
    "studentId": "251P2474",
    "isActive": true
  },
  {
    "email": "parent.231s1096@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Shenoy",
    "studentId": "231S1096",
    "isActive": true
  },
  {
    "email": "parent.251p1590@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Vyas",
    "studentId": "251P1590",
    "isActive": true
  },
  {
    "email": "parent.231s1071@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sharma",
    "studentId": "231S1071",
    "isActive": true
  },
  {
    "email": "parent.241s1136@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Pai",
    "studentId": "241S1136",
    "isActive": true
  },
  {
    "email": "parent.261s1009@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Kulkarni",
    "studentId": "261S1009",
    "isActive": true
  },
  {
    "email": "parent.231s1047@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Naidu",
    "studentId": "231S1047",
    "isActive": true
  },
  {
    "email": "parent.241s1457@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Sharma",
    "studentId": "241S1457",
    "isActive": true
  },
  {
    "email": "parent.201s1001@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Acharya",
    "studentId": "201S1001",
    "isActive": true
  },
  {
    "email": "parent.241s1127@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Deshpande",
    "studentId": "241S1127",
    "isActive": true
  },
  {
    "email": "parent.241s1254@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Vyas",
    "studentId": "241S1254",
    "isActive": true
  },
  {
    "email": "parent.231s1080@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Vaid",
    "studentId": "231S1080",
    "isActive": true
  },
  {
    "email": "parent.231s1038@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Pai",
    "studentId": "231S1038",
    "isActive": true
  },
  {
    "email": "parent.251s1481@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Vyas",
    "studentId": "251S1481",
    "isActive": true
  },
  {
    "email": "parent.251p1116@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Hegde",
    "studentId": "251P1116",
    "isActive": true
  },
  {
    "email": "parent.251p1877@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Vaid",
    "studentId": "251P1877",
    "isActive": true
  },
  {
    "email": "parent.201s1033@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Aithal",
    "studentId": "201S1033",
    "isActive": true
  },
  {
    "email": "parent.261p3114@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Bhat",
    "studentId": "261P3114",
    "isActive": true
  },
  {
    "email": "parent.261p3021@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Vaid",
    "studentId": "261P3021",
    "isActive": true
  },
  {
    "email": "parent.261p3903@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Shenoy",
    "studentId": "261P3903",
    "isActive": true
  },
  {
    "email": "parent.261p3231@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Hegde",
    "studentId": "261P3231",
    "isActive": true
  },
  {
    "email": "parent.261p3355@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Gowda",
    "studentId": "261P3355",
    "isActive": true
  },
  {
    "email": "parent.261p3908@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Pai",
    "studentId": "261P3908",
    "isActive": true
  },
  {
    "email": "parent.261p3018@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Prabhu",
    "studentId": "261P3018",
    "isActive": true
  },
  {
    "email": "parent.241s1606@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Naidu",
    "studentId": "241S1606",
    "isActive": true
  },
  {
    "email": "parent.251p2450@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Reddy",
    "studentId": "251P2450",
    "isActive": true
  },
  {
    "email": "parent.221s1056@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshkulkarni",
    "studentId": "221S1056",
    "isActive": true
  },
  {
    "email": "parent.241s1657@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Aithal",
    "studentId": "241S1657",
    "isActive": true
  },
  {
    "email": "parent.251p2195@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Reddy",
    "studentId": "251P2195",
    "isActive": true
  },
  {
    "email": "parent.261p3099@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Bhat",
    "studentId": "261P3099",
    "isActive": true
  },
  {
    "email": "parent.261p3963@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Vyas",
    "studentId": "261P3963",
    "isActive": true
  },
  {
    "email": "parent.261p3817@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Rao",
    "studentId": "261P3817",
    "isActive": true
  },
  {
    "email": "parent.261p3493@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sharma",
    "studentId": "261P3493",
    "isActive": true
  },
  {
    "email": "parent.261p3316@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Reddy",
    "studentId": "261P3316",
    "isActive": true
  },
  {
    "email": "parent.261p3312@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Rao",
    "studentId": "261P3312",
    "isActive": true
  },
  {
    "email": "parent.261p3968@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Prabhu",
    "studentId": "261P3968",
    "isActive": true
  },
  {
    "email": "parent.251p1425@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Deshpande",
    "studentId": "251P1425",
    "isActive": true
  },
  {
    "email": "parent.251p2425@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Naidu",
    "studentId": "251P2425",
    "isActive": true
  },
  {
    "email": "parent.241s1745@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Sastry",
    "studentId": "241S1745",
    "isActive": true
  },
  {
    "email": "parent.261p3208@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Hegde",
    "studentId": "261P3208",
    "isActive": true
  },
  {
    "email": "parent.261p3608@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Joshi",
    "studentId": "261P3608",
    "isActive": true
  },
  {
    "email": "parent.261p3157@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Gowda",
    "studentId": "261P3157",
    "isActive": true
  },
  {
    "email": "parent.251p1084@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Reddy",
    "studentId": "251P1084",
    "isActive": true
  },
  {
    "email": "parent.231s1046@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vyas",
    "studentId": "231S1046",
    "isActive": true
  },
  {
    "email": "parent.241s1446@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Joshi",
    "studentId": "241S1446",
    "isActive": true
  },
  {
    "email": "parent.261p3624@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Rao",
    "studentId": "261P3624",
    "isActive": true
  },
  {
    "email": "parent.251p2557@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Naidu",
    "studentId": "251P2557",
    "isActive": true
  },
  {
    "email": "parent.251p1477@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Hegde",
    "studentId": "251P1477",
    "isActive": true
  },
  {
    "email": "parent.251p1532@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Reddy",
    "studentId": "251P1532",
    "isActive": true
  },
  {
    "email": "parent.251p2251@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "251P2251",
    "isActive": true
  },
  {
    "email": "parent.251p1684@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Hegde",
    "studentId": "251P1684",
    "isActive": true
  },
  {
    "email": "parent.251p1963@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Vaid",
    "studentId": "251P1963",
    "isActive": true
  },
  {
    "email": "parent.251p1479@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Reddy",
    "studentId": "251P1479",
    "isActive": true
  },
  {
    "email": "parent.261p3548@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Joshi",
    "studentId": "261P3548",
    "isActive": true
  },
  {
    "email": "parent.261p3736@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Vaid",
    "studentId": "261P3736",
    "isActive": true
  },
  {
    "email": "parent.251p1937@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Bhat",
    "studentId": "251P1937",
    "isActive": true
  },
  {
    "email": "parent.241s1286@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Sharma",
    "studentId": "241S1286",
    "isActive": true
  },
  {
    "email": "parent.261p3471@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Acharya",
    "studentId": "261P3471",
    "isActive": true
  },
  {
    "email": "parent.261p3758@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Kulkarni",
    "studentId": "261P3758",
    "isActive": true
  },
  {
    "email": "parent.261p3520@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "261P3520",
    "isActive": true
  },
  {
    "email": "parent.261p3523@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Sharma",
    "studentId": "261P3523",
    "isActive": true
  },
  {
    "email": "parent.261p3103@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Sharma",
    "studentId": "261P3103",
    "isActive": true
  },
  {
    "email": "parent.251p1467@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Hegde",
    "studentId": "251P1467",
    "isActive": true
  },
  {
    "email": "parent.251p1103@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Sharma",
    "studentId": "251P1103",
    "isActive": true
  },
  {
    "email": "parent.251p1495@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Prabhu",
    "studentId": "251P1495",
    "isActive": true
  },
  {
    "email": "parent.261p3967@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Shenoy",
    "studentId": "261P3967",
    "isActive": true
  },
  {
    "email": "parent.261p3672@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Vyas",
    "studentId": "261P3672",
    "isActive": true
  },
  {
    "email": "parent.261p3725@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Aithal",
    "studentId": "261P3725",
    "isActive": true
  },
  {
    "email": "parent.261p3488@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Prabhu",
    "studentId": "261P3488",
    "isActive": true
  },
  {
    "email": "parent.251p2252@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Hegde",
    "studentId": "251P2252",
    "isActive": true
  },
  {
    "email": "parent.231s1055@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Vaid",
    "studentId": "231S1055",
    "isActive": true
  },
  {
    "email": "parent.261p3280@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Hegde",
    "studentId": "261P3280",
    "isActive": true
  },
  {
    "email": "parent.261p3102@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Chavan",
    "studentId": "261P3102",
    "isActive": true
  },
  {
    "email": "parent.221s1012@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Naidu",
    "studentId": "221S1012",
    "isActive": true
  },
  {
    "email": "parent.261p3720@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Rao",
    "studentId": "261P3720",
    "isActive": true
  },
  {
    "email": "parent.261p3139@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Deshpande",
    "studentId": "261P3139",
    "isActive": true
  },
  {
    "email": "parent.251s1735@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Rao",
    "studentId": "251S1735",
    "isActive": true
  },
  {
    "email": "parent.261p3038@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Joshi",
    "studentId": "261P3038",
    "isActive": true
  },
  {
    "email": "parent.261p3184@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Kulkarni",
    "studentId": "261P3184",
    "isActive": true
  },
  {
    "email": "parent.251s1126@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Reddy",
    "studentId": "251S1126",
    "isActive": true
  },
  {
    "email": "parent.261p3542@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Sharma",
    "studentId": "261P3542",
    "isActive": true
  },
  {
    "email": "parent.261p3697@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshpande",
    "studentId": "261P3697",
    "isActive": true
  },
  {
    "email": "parent.261p3658@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Kulkarni",
    "studentId": "261P3658",
    "isActive": true
  },
  {
    "email": "parent.261p3126@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Deshkulkarni",
    "studentId": "261P3126",
    "isActive": true
  },
  {
    "email": "parent.261s1089@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Reddy",
    "studentId": "261S1089",
    "isActive": true
  },
  {
    "email": "parent.251p1096@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Aithal",
    "studentId": "251P1096",
    "isActive": true
  },
  {
    "email": "parent.231s0022@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Rao",
    "studentId": "231S0022",
    "isActive": true
  },
  {
    "email": "parent.241s1067@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Joshi",
    "studentId": "241S1067",
    "isActive": true
  },
  {
    "email": "parent.241s2144@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Prabhu",
    "studentId": "241S2144",
    "isActive": true
  },
  {
    "email": "parent.251s1795@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Kulkarni",
    "studentId": "251S1795",
    "isActive": true
  },
  {
    "email": "parent.261p3341@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Prabhu",
    "studentId": "261P3341",
    "isActive": true
  },
  {
    "email": "parent.261p3331@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Bhat",
    "studentId": "261P3331",
    "isActive": true
  },
  {
    "email": "parent.261p3130@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Bhat",
    "studentId": "261P3130",
    "isActive": true
  },
  {
    "email": "parent.261p3690@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Reddy",
    "studentId": "261P3690",
    "isActive": true
  },
  {
    "email": "parent.261p3283@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Gowda",
    "studentId": "261P3283",
    "isActive": true
  },
  {
    "email": "parent.261s1006@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Reddy",
    "studentId": "261S1006",
    "isActive": true
  },
  {
    "email": "parent.231s1001@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Aithal",
    "studentId": "231S1001",
    "isActive": true
  },
  {
    "email": "parent.251s1824@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Vaid",
    "studentId": "251S1824",
    "isActive": true
  },
  {
    "email": "parent.241s1346@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sastry",
    "studentId": "241S1346",
    "isActive": true
  },
  {
    "email": "parent.251p1500@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Hegde",
    "studentId": "251P1500",
    "isActive": true
  },
  {
    "email": "parent.241s1467@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Acharya",
    "studentId": "241S1467",
    "isActive": true
  },
  {
    "email": "parent.251p1859@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Chavan",
    "studentId": "251P1859",
    "isActive": true
  },
  {
    "email": "parent.251p1072@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Aithal",
    "studentId": "251P1072",
    "isActive": true
  },
  {
    "email": "parent.251s1333@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Acharya",
    "studentId": "251S1333",
    "isActive": true
  },
  {
    "email": "parent.251s1183@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Shenoy",
    "studentId": "251S1183",
    "isActive": true
  },
  {
    "email": "parent.251p2311@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Kulkarni",
    "studentId": "251P2311",
    "isActive": true
  },
  {
    "email": "parent.261p4023@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Hegde",
    "studentId": "261P4023",
    "isActive": true
  },
  {
    "email": "parent.261p3838@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Joshi",
    "studentId": "261P3838",
    "isActive": true
  },
  {
    "email": "parent.261p3240@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "261P3240",
    "isActive": true
  },
  {
    "email": "parent.261p3534@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Prabhu",
    "studentId": "261P3534",
    "isActive": true
  },
  {
    "email": "parent.231s1084@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Joshi",
    "studentId": "231S1084",
    "isActive": true
  },
  {
    "email": "parent.251s1985@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Naidu",
    "studentId": "251S1985",
    "isActive": true
  },
  {
    "email": "parent.231s1039@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Naidu",
    "studentId": "231S1039",
    "isActive": true
  },
  {
    "email": "parent.251p2448@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Pai",
    "studentId": "251P2448",
    "isActive": true
  },
  {
    "email": "parent.241s1163@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Rao",
    "studentId": "241S1163",
    "isActive": true
  },
  {
    "email": "parent.241s1003@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Bhat",
    "studentId": "241S1003",
    "isActive": true
  },
  {
    "email": "parent.231s0003@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Sastry",
    "studentId": "231S0003",
    "isActive": true
  },
  {
    "email": "parent.231s1041@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Acharya",
    "studentId": "231S1041",
    "isActive": true
  },
  {
    "email": "parent.261p3136@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Hegde",
    "studentId": "261P3136",
    "isActive": true
  },
  {
    "email": "parent.231s1045@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sastry",
    "studentId": "231S1045",
    "isActive": true
  },
  {
    "email": "parent.261p3484@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Gowda",
    "studentId": "261P3484",
    "isActive": true
  },
  {
    "email": "parent.261p3171@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Prabhu",
    "studentId": "261P3171",
    "isActive": true
  },
  {
    "email": "parent.241s1364@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Sastry",
    "studentId": "241S1364",
    "isActive": true
  },
  {
    "email": "parent.251s1707@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Joshi",
    "studentId": "251S1707",
    "isActive": true
  },
  {
    "email": "parent.241s1434@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Acharya",
    "studentId": "241S1434",
    "isActive": true
  },
  {
    "email": "parent.261p3366@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Bhat",
    "studentId": "261P3366",
    "isActive": true
  },
  {
    "email": "parent.251p2082@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Deshpande",
    "studentId": "251P2082",
    "isActive": true
  },
  {
    "email": "parent.251p1821@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Pai",
    "studentId": "251P1821",
    "isActive": true
  },
  {
    "email": "parent.251p2510@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Acharya",
    "studentId": "251P2510",
    "isActive": true
  },
  {
    "email": "parent.251p1301@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Kulkarni",
    "studentId": "251P1301",
    "isActive": true
  },
  {
    "email": "parent.241s1311@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Vyas",
    "studentId": "241S1311",
    "isActive": true
  },
  {
    "email": "parent.261p3363@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Rao",
    "studentId": "261P3363",
    "isActive": true
  },
  {
    "email": "parent.251s1709@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Deshpande",
    "studentId": "251S1709",
    "isActive": true
  },
  {
    "email": "parent.231s1022@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Acharya",
    "studentId": "231S1022",
    "isActive": true
  },
  {
    "email": "parent.241s1273@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Gowda",
    "studentId": "241S1273",
    "isActive": true
  },
  {
    "email": "parent.251s1624@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Vaid",
    "studentId": "251S1624",
    "isActive": true
  },
  {
    "email": "parent.261p3072@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Deshkulkarni",
    "studentId": "261P3072",
    "isActive": true
  },
  {
    "email": "parent.261p3037@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Acharya",
    "studentId": "261P3037",
    "isActive": true
  },
  {
    "email": "parent.261p3905@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Vaid",
    "studentId": "261P3905",
    "isActive": true
  },
  {
    "email": "parent.211s1013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Gowda",
    "studentId": "211S1013",
    "isActive": true
  },
  {
    "email": "parent.251p1535@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Reddy",
    "studentId": "251P1535",
    "isActive": true
  },
  {
    "email": "parent.251p1682@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Deshkulkarni",
    "studentId": "251P1682",
    "isActive": true
  },
  {
    "email": "parent.251s1689@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Prabhu",
    "studentId": "251S1689",
    "isActive": true
  },
  {
    "email": "parent.261p3284@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Vaid",
    "studentId": "261P3284",
    "isActive": true
  },
  {
    "email": "parent.261p3559@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Shenoy",
    "studentId": "261P3559",
    "isActive": true
  },
  {
    "email": "parent.261p3310@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Hegde",
    "studentId": "261P3310",
    "isActive": true
  },
  {
    "email": "parent.261p4193@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Pai",
    "studentId": "261P4193",
    "isActive": true
  },
  {
    "email": "parent.251p1064@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Acharya",
    "studentId": "251P1064",
    "isActive": true
  },
  {
    "email": "parent.251p1267@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Prabhu",
    "studentId": "251P1267",
    "isActive": true
  },
  {
    "email": "parent.251p1930@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Bhat",
    "studentId": "251P1930",
    "isActive": true
  },
  {
    "email": "parent.251s1065@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Reddy",
    "studentId": "251S1065",
    "isActive": true
  },
  {
    "email": "parent.251s1825@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Prabhu",
    "studentId": "251S1825",
    "isActive": true
  },
  {
    "email": "parent.261p4155@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Bhat",
    "studentId": "261P4155",
    "isActive": true
  },
  {
    "email": "parent.261p3267@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Shenoy",
    "studentId": "261P3267",
    "isActive": true
  },
  {
    "email": "parent.261p3270@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Gowda",
    "studentId": "261P3270",
    "isActive": true
  },
  {
    "email": "parent.261p3168@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Deshkulkarni",
    "studentId": "261P3168",
    "isActive": true
  },
  {
    "email": "parent.261p3148@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Aithal",
    "studentId": "261P3148",
    "isActive": true
  },
  {
    "email": "parent.231s1036@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Naidu",
    "studentId": "231S1036",
    "isActive": true
  },
  {
    "email": "parent.251s1293@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Shenoy",
    "studentId": "251S1293",
    "isActive": true
  },
  {
    "email": "parent.261p3887@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Rao",
    "studentId": "261P3887",
    "isActive": true
  },
  {
    "email": "parent.261p3409@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Shenoy",
    "studentId": "261P3409",
    "isActive": true
  },
  {
    "email": "parent.231s1013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Gowda",
    "studentId": "231S1013",
    "isActive": true
  },
  {
    "email": "parent.251s1896@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Rao",
    "studentId": "251S1896",
    "isActive": true
  },
  {
    "email": "parent.261p3845@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Joshi",
    "studentId": "261P3845",
    "isActive": true
  },
  {
    "email": "parent.191s1036@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Sastry",
    "studentId": "191S1036",
    "isActive": true
  },
  {
    "email": "parent.241s1314@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Vaid",
    "studentId": "241S1314",
    "isActive": true
  },
  {
    "email": "parent.261p3252@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Pai",
    "studentId": "261P3252",
    "isActive": true
  },
  {
    "email": "parent.241s1603@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Sharma",
    "studentId": "241S1603",
    "isActive": true
  },
  {
    "email": "parent.231s1052@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Gowda",
    "studentId": "231S1052",
    "isActive": true
  },
  {
    "email": "parent.261s1098@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Deshpande",
    "studentId": "261S1098",
    "isActive": true
  },
  {
    "email": "parent.231s1101@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Chavan",
    "studentId": "231S1101",
    "isActive": true
  },
  {
    "email": "parent.231s1100@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Reddy",
    "studentId": "231S1100",
    "isActive": true
  },
  {
    "email": "parent.241s1123@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Prabhu",
    "studentId": "241S1123",
    "isActive": true
  },
  {
    "email": "parent.261p3840@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "261P3840",
    "isActive": true
  },
  {
    "email": "parent.241s1227@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Shenoy",
    "studentId": "241S1227",
    "isActive": true
  },
  {
    "email": "parent.261p3281@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Shenoy",
    "studentId": "261P3281",
    "isActive": true
  },
  {
    "email": "parent.251p2361@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Aithal",
    "studentId": "251P2361",
    "isActive": true
  },
  {
    "email": "parent.231s1017@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Aithal",
    "studentId": "231S1017",
    "isActive": true
  },
  {
    "email": "parent.261p3145@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Kulkarni",
    "studentId": "261P3145",
    "isActive": true
  },
  {
    "email": "parent.261p3424@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Bhat",
    "studentId": "261P3424",
    "isActive": true
  },
  {
    "email": "parent.261p3485@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Deshpande",
    "studentId": "261P3485",
    "isActive": true
  },
  {
    "email": "parent.261p3296@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Joshi",
    "studentId": "261P3296",
    "isActive": true
  },
  {
    "email": "parent.261p3376@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Bhat",
    "studentId": "261P3376",
    "isActive": true
  },
  {
    "email": "parent.261p3257@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Prabhu",
    "studentId": "261P3257",
    "isActive": true
  },
  {
    "email": "parent.261p3670@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Deshpande",
    "studentId": "261P3670",
    "isActive": true
  },
  {
    "email": "parent.261p4102@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Hegde",
    "studentId": "261P4102",
    "isActive": true
  },
  {
    "email": "parent.231s1069@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Rao",
    "studentId": "231S1069",
    "isActive": true
  },
  {
    "email": "parent.261s1047@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Shenoy",
    "studentId": "261S1047",
    "isActive": true
  },
  {
    "email": "parent.241s1463@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Gowda",
    "studentId": "241S1463",
    "isActive": true
  },
  {
    "email": "parent.251s1667@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Reddy",
    "studentId": "251S1667",
    "isActive": true
  },
  {
    "email": "parent.261p3260@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Pai",
    "studentId": "261P3260",
    "isActive": true
  },
  {
    "email": "parent.251p1589@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Aithal",
    "studentId": "251P1589",
    "isActive": true
  },
  {
    "email": "parent.251p1259@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Hegde",
    "studentId": "251P1259",
    "isActive": true
  },
  {
    "email": "parent.251p1934@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Acharya",
    "studentId": "251P1934",
    "isActive": true
  },
  {
    "email": "parent.201s1010@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "201S1010",
    "isActive": true
  },
  {
    "email": "parent.261p3522@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Prabhu",
    "studentId": "261P3522",
    "isActive": true
  },
  {
    "email": "parent.251s1653@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Aithal",
    "studentId": "251S1653",
    "isActive": true
  },
  {
    "email": "parent.241s1488@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Naidu",
    "studentId": "241S1488",
    "isActive": true
  },
  {
    "email": "parent.261p4152@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vaid",
    "studentId": "261P4152",
    "isActive": true
  },
  {
    "email": "parent.261p4001@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Pai",
    "studentId": "261P4001",
    "isActive": true
  },
  {
    "email": "parent.231s1002@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Kulkarni",
    "studentId": "231S1002",
    "isActive": true
  },
  {
    "email": "parent.241s1536@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Prabhu",
    "studentId": "241S1536",
    "isActive": true
  },
  {
    "email": "parent.261p4010@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vyas",
    "studentId": "261P4010",
    "isActive": true
  },
  {
    "email": "parent.261p3181@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Joshi",
    "studentId": "261P3181",
    "isActive": true
  },
  {
    "email": "parent.261p3340@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Naidu",
    "studentId": "261P3340",
    "isActive": true
  },
  {
    "email": "parent.261p3605@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Kulkarni",
    "studentId": "261P3605",
    "isActive": true
  },
  {
    "email": "parent.251p1798@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vaid",
    "studentId": "251P1798",
    "isActive": true
  },
  {
    "email": "parent.261p3510@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Naidu",
    "studentId": "261P3510",
    "isActive": true
  },
  {
    "email": "parent.251p1867@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Hegde",
    "studentId": "251P1867",
    "isActive": true
  },
  {
    "email": "parent.251p2342@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Naidu",
    "studentId": "251P2342",
    "isActive": true
  },
  {
    "email": "parent.221s1067@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Chavan",
    "studentId": "221S1067",
    "isActive": true
  },
  {
    "email": "parent.251p1059@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Shenoy",
    "studentId": "251P1059",
    "isActive": true
  },
  {
    "email": "parent.251p1839@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Acharya",
    "studentId": "251P1839",
    "isActive": true
  },
  {
    "email": "parent.251p2483@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Bhat",
    "studentId": "251P2483",
    "isActive": true
  },
  {
    "email": "parent.261p3859@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Joshi",
    "studentId": "261P3859",
    "isActive": true
  },
  {
    "email": "parent.241s2186@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Prabhu",
    "studentId": "241S2186",
    "isActive": true
  },
  {
    "email": "parent.261p3464@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Joshi",
    "studentId": "261P3464",
    "isActive": true
  },
  {
    "email": "parent.231s1049@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Shenoy",
    "studentId": "231S1049",
    "isActive": true
  },
  {
    "email": "parent.261p3944@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Kulkarni",
    "studentId": "261P3944",
    "isActive": true
  },
  {
    "email": "parent.251p1179@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Naidu",
    "studentId": "251P1179",
    "isActive": true
  },
  {
    "email": "parent.251p2164@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Shenoy",
    "studentId": "251P2164",
    "isActive": true
  },
  {
    "email": "parent.251p1890@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Acharya",
    "studentId": "251P1890",
    "isActive": true
  },
  {
    "email": "parent.251p1726@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Chavan",
    "studentId": "251P1726",
    "isActive": true
  },
  {
    "email": "parent.261p4103@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Deshpande",
    "studentId": "261P4103",
    "isActive": true
  },
  {
    "email": "parent.261p3149@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Bhat",
    "studentId": "261P3149",
    "isActive": true
  },
  {
    "email": "parent.261p3023@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Vaid",
    "studentId": "261P3023",
    "isActive": true
  },
  {
    "email": "parent.251p2113@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Sastry",
    "studentId": "251P2113",
    "isActive": true
  },
  {
    "email": "parent.261p4035@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Shenoy",
    "studentId": "261P4035",
    "isActive": true
  },
  {
    "email": "parent.241s1412@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Reddy",
    "studentId": "241S1412",
    "isActive": true
  },
  {
    "email": "parent.261p3784@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Deshkulkarni",
    "studentId": "261P3784",
    "isActive": true
  },
  {
    "email": "parent.261p3577@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Naidu",
    "studentId": "261P3577",
    "isActive": true
  },
  {
    "email": "parent.251p1617@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Joshi",
    "studentId": "251P1617",
    "isActive": true
  },
  {
    "email": "parent.261p3737@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Shenoy",
    "studentId": "261P3737",
    "isActive": true
  },
  {
    "email": "parent.261p3773@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Sastry",
    "studentId": "261P3773",
    "isActive": true
  },
  {
    "email": "parent.251p1340@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Chavan",
    "studentId": "251P1340",
    "isActive": true
  },
  {
    "email": "parent.251p2121@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Vyas",
    "studentId": "251P2121",
    "isActive": true
  },
  {
    "email": "parent.261p3189@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vaid",
    "studentId": "261P3189",
    "isActive": true
  },
  {
    "email": "parent.251p1269@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Shenoy",
    "studentId": "251P1269",
    "isActive": true
  },
  {
    "email": "parent.261p3350@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Shenoy",
    "studentId": "261P3350",
    "isActive": true
  },
  {
    "email": "parent.261p3668@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Chavan",
    "studentId": "261P3668",
    "isActive": true
  },
  {
    "email": "parent.251p1793@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Gowda",
    "studentId": "251P1793",
    "isActive": true
  },
  {
    "email": "parent.261p3406@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Hegde",
    "studentId": "261P3406",
    "isActive": true
  },
  {
    "email": "parent.261p3724@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Sharma",
    "studentId": "261P3724",
    "isActive": true
  },
  {
    "email": "parent.261p3308@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Vyas",
    "studentId": "261P3308",
    "isActive": true
  },
  {
    "email": "parent.251p1220@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Aithal",
    "studentId": "251P1220",
    "isActive": true
  },
  {
    "email": "parent.261p4221@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Chavan",
    "studentId": "261P4221",
    "isActive": true
  },
  {
    "email": "parent.251p1038@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Kulkarni",
    "studentId": "251P1038",
    "isActive": true
  },
  {
    "email": "parent.261p3261@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Hegde",
    "studentId": "261P3261",
    "isActive": true
  },
  {
    "email": "parent.261s1051@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Aithal",
    "studentId": "261S1051",
    "isActive": true
  },
  {
    "email": "parent.261p3039@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Acharya",
    "studentId": "261P3039",
    "isActive": true
  },
  {
    "email": "parent.261p3508@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Deshpande",
    "studentId": "261P3508",
    "isActive": true
  },
  {
    "email": "parent.261p3504@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Aithal",
    "studentId": "261P3504",
    "isActive": true
  },
  {
    "email": "parent.261p3420@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Prabhu",
    "studentId": "261P3420",
    "isActive": true
  },
  {
    "email": "parent.261p3413@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Chavan",
    "studentId": "261P3413",
    "isActive": true
  },
  {
    "email": "parent.251p1565@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Deshkulkarni",
    "studentId": "251P1565",
    "isActive": true
  },
  {
    "email": "parent.261p3230@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Reddy",
    "studentId": "261P3230",
    "isActive": true
  },
  {
    "email": "parent.251p1037@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Pai",
    "studentId": "251P1037",
    "isActive": true
  },
  {
    "email": "parent.251p1201@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Deshkulkarni",
    "studentId": "251P1201",
    "isActive": true
  },
  {
    "email": "parent.261p3051@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Bhat",
    "studentId": "261P3051",
    "isActive": true
  },
  {
    "email": "parent.251p2228@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshpande",
    "studentId": "251P2228",
    "isActive": true
  },
  {
    "email": "parent.261p4119@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Aithal",
    "studentId": "261P4119",
    "isActive": true
  },
  {
    "email": "parent.261p3447@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Reddy",
    "studentId": "261P3447",
    "isActive": true
  },
  {
    "email": "parent.261p3572@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Chavan",
    "studentId": "261P3572",
    "isActive": true
  },
  {
    "email": "parent.251p1674@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Gowda",
    "studentId": "251P1674",
    "isActive": true
  },
  {
    "email": "parent.251p2028@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Vaid",
    "studentId": "251P2028",
    "isActive": true
  },
  {
    "email": "parent.251p1094@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Pai",
    "studentId": "251P1094",
    "isActive": true
  },
  {
    "email": "parent.261p3115@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Aithal",
    "studentId": "261P3115",
    "isActive": true
  },
  {
    "email": "parent.261p3138@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Pai",
    "studentId": "261P3138",
    "isActive": true
  },
  {
    "email": "parent.261p3390@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Joshi",
    "studentId": "261P3390",
    "isActive": true
  },
  {
    "email": "parent.261p3412@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Reddy",
    "studentId": "261P3412",
    "isActive": true
  },
  {
    "email": "parent.241s1011@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Prabhu",
    "studentId": "241S1011",
    "isActive": true
  },
  {
    "email": "parent.251s1320@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Reddy",
    "studentId": "251S1320",
    "isActive": true
  },
  {
    "email": "parent.261p3377@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Gowda",
    "studentId": "261P3377",
    "isActive": true
  },
  {
    "email": "parent.261p4101@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Gowda",
    "studentId": "261P4101",
    "isActive": true
  },
  {
    "email": "parent.251p2457@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vaid",
    "studentId": "251P2457",
    "isActive": true
  },
  {
    "email": "parent.251p2421@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Deshkulkarni",
    "studentId": "251P2421",
    "isActive": true
  },
  {
    "email": "parent.261p3571@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Chavan",
    "studentId": "261P3571",
    "isActive": true
  },
  {
    "email": "parent.261p3626@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Joshi",
    "studentId": "261P3626",
    "isActive": true
  },
  {
    "email": "parent.261p3011@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Vyas",
    "studentId": "261P3011",
    "isActive": true
  },
  {
    "email": "parent.231s1019@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Vaid",
    "studentId": "231S1019",
    "isActive": true
  },
  {
    "email": "parent.261p3834@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Bhat",
    "studentId": "261P3834",
    "isActive": true
  },
  {
    "email": "parent.261p3073@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Vaid",
    "studentId": "261P3073",
    "isActive": true
  },
  {
    "email": "parent.241s1649@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Chavan",
    "studentId": "241S1649",
    "isActive": true
  },
  {
    "email": "parent.261s1044@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Gowda",
    "studentId": "261S1044",
    "isActive": true
  },
  {
    "email": "parent.261p3677@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Aithal",
    "studentId": "261P3677",
    "isActive": true
  },
  {
    "email": "parent.261p4214@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Deshpande",
    "studentId": "261P4214",
    "isActive": true
  },
  {
    "email": "parent.261p3074@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Naidu",
    "studentId": "261P3074",
    "isActive": true
  },
  {
    "email": "parent.261p4165@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Shenoy",
    "studentId": "261P4165",
    "isActive": true
  },
  {
    "email": "parent.261p3337@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Chavan",
    "studentId": "261P3337",
    "isActive": true
  },
  {
    "email": "parent.251p2291@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Shenoy",
    "studentId": "251P2291",
    "isActive": true
  },
  {
    "email": "parent.261p4198@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Pai",
    "studentId": "261P4198",
    "isActive": true
  },
  {
    "email": "parent.261p3578@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Prabhu",
    "studentId": "261P3578",
    "isActive": true
  },
  {
    "email": "parent.251p2555@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Prabhu",
    "studentId": "251P2555",
    "isActive": true
  },
  {
    "email": "parent.251s2065@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Pai",
    "studentId": "251S2065",
    "isActive": true
  },
  {
    "email": "parent.201s1008@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Pai",
    "studentId": "201S1008",
    "isActive": true
  },
  {
    "email": "parent.201s1009@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Pai",
    "studentId": "201S1009",
    "isActive": true
  },
  {
    "email": "parent.261p3016@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Sastry",
    "studentId": "261P3016",
    "isActive": true
  },
  {
    "email": "parent.261p3632@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Aithal",
    "studentId": "261P3632",
    "isActive": true
  },
  {
    "email": "parent.231s1008@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Kulkarni",
    "studentId": "231S1008",
    "isActive": true
  },
  {
    "email": "parent.261p3716@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Aithal",
    "studentId": "261P3716",
    "isActive": true
  },
  {
    "email": "parent.261p3129@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Kulkarni",
    "studentId": "261P3129",
    "isActive": true
  },
  {
    "email": "parent.251s1082@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Chavan",
    "studentId": "251S1082",
    "isActive": true
  },
  {
    "email": "parent.261p3621@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Hegde",
    "studentId": "261P3621",
    "isActive": true
  },
  {
    "email": "parent.261p3419@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Rao",
    "studentId": "261P3419",
    "isActive": true
  },
  {
    "email": "parent.261p4202@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshkulkarni",
    "studentId": "261P4202",
    "isActive": true
  },
  {
    "email": "parent.231s1070@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Bhat",
    "studentId": "231S1070",
    "isActive": true
  },
  {
    "email": "parent.261p4148@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vaid",
    "studentId": "261P4148",
    "isActive": true
  },
  {
    "email": "parent.261p3594@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Vaid",
    "studentId": "261P3594",
    "isActive": true
  },
  {
    "email": "parent.261p3222@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Aithal",
    "studentId": "261P3222",
    "isActive": true
  },
  {
    "email": "parent.261p3695@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Joshi",
    "studentId": "261P3695",
    "isActive": true
  },
  {
    "email": "parent.251p1160@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Joshi",
    "studentId": "251P1160",
    "isActive": true
  },
  {
    "email": "parent.251p1486@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Bhat",
    "studentId": "251P1486",
    "isActive": true
  },
  {
    "email": "parent.261p3860@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Chavan",
    "studentId": "261P3860",
    "isActive": true
  },
  {
    "email": "parent.261p3088@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Vyas",
    "studentId": "261P3088",
    "isActive": true
  },
  {
    "email": "parent.251p1852@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Hegde",
    "studentId": "251P1852",
    "isActive": true
  },
  {
    "email": "parent.261p3019@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Reddy",
    "studentId": "261P3019",
    "isActive": true
  },
  {
    "email": "parent.261p3137@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Aithal",
    "studentId": "261P3137",
    "isActive": true
  },
  {
    "email": "parent.261p3942@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Shenoy",
    "studentId": "261P3942",
    "isActive": true
  },
  {
    "email": "parent.261p3567@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "261P3567",
    "isActive": true
  },
  {
    "email": "parent.261p3040@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Chavan",
    "studentId": "261P3040",
    "isActive": true
  },
  {
    "email": "parent.261p3198@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Rao",
    "studentId": "261P3198",
    "isActive": true
  },
  {
    "email": "parent.261p3358@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vyas",
    "studentId": "261P3358",
    "isActive": true
  },
  {
    "email": "parent.261p3214@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Sharma",
    "studentId": "261P3214",
    "isActive": true
  },
  {
    "email": "parent.261p3814@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Shenoy",
    "studentId": "261P3814",
    "isActive": true
  },
  {
    "email": "parent.251p1208@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Deshpande",
    "studentId": "251P1208",
    "isActive": true
  },
  {
    "email": "parent.251p1252@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Kulkarni",
    "studentId": "251P1252",
    "isActive": true
  },
  {
    "email": "parent.261p3215@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Reddy",
    "studentId": "261P3215",
    "isActive": true
  },
  {
    "email": "parent.261p3295@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Vyas",
    "studentId": "261P3295",
    "isActive": true
  },
  {
    "email": "parent.261p3865@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Pai",
    "studentId": "261P3865",
    "isActive": true
  },
  {
    "email": "parent.261p3093@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Pai",
    "studentId": "261P3093",
    "isActive": true
  },
  {
    "email": "parent.261p3601@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Chavan",
    "studentId": "261P3601",
    "isActive": true
  },
  {
    "email": "parent.261p4116@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshpande",
    "studentId": "261P4116",
    "isActive": true
  },
  {
    "email": "parent.261p3201@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Joshi",
    "studentId": "261P3201",
    "isActive": true
  },
  {
    "email": "parent.261p3395@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Naidu",
    "studentId": "261P3395",
    "isActive": true
  },
  {
    "email": "parent.261p3686@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vyas",
    "studentId": "261P3686",
    "isActive": true
  },
  {
    "email": "parent.261p4016@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Prabhu",
    "studentId": "261P4016",
    "isActive": true
  },
  {
    "email": "parent.261p3797@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Sastry",
    "studentId": "261P3797",
    "isActive": true
  },
  {
    "email": "parent.251p2185@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Hegde",
    "studentId": "251P2185",
    "isActive": true
  },
  {
    "email": "parent.261p3867@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Chavan",
    "studentId": "261P3867",
    "isActive": true
  },
  {
    "email": "parent.211s1018@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Reddy",
    "studentId": "211S1018",
    "isActive": true
  },
  {
    "email": "parent.251p1916@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Kulkarni",
    "studentId": "251P1916",
    "isActive": true
  },
  {
    "email": "parent.261p3586@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Gowda",
    "studentId": "261P3586",
    "isActive": true
  },
  {
    "email": "parent.251p1455@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Gowda",
    "studentId": "251P1455",
    "isActive": true
  },
  {
    "email": "parent.251p2423@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Deshpande",
    "studentId": "251P2423",
    "isActive": true
  },
  {
    "email": "parent.251p1769@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Vaid",
    "studentId": "251P1769",
    "isActive": true
  },
  {
    "email": "parent.251p2518@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Shenoy",
    "studentId": "251P2518",
    "isActive": true
  },
  {
    "email": "parent.261p3696@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Vaid",
    "studentId": "261P3696",
    "isActive": true
  },
  {
    "email": "parent.231s1048@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Kulkarni",
    "studentId": "231S1048",
    "isActive": true
  },
  {
    "email": "parent.251p1013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Acharya",
    "studentId": "251P1013",
    "isActive": true
  },
  {
    "email": "parent.251s1668@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Joshi",
    "studentId": "251S1668",
    "isActive": true
  },
  {
    "email": "parent.251p2153@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "251P2153",
    "isActive": true
  },
  {
    "email": "parent.241s1456@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sharma",
    "studentId": "241S1456",
    "isActive": true
  },
  {
    "email": "parent.251p1990@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sharma",
    "studentId": "251P1990",
    "isActive": true
  },
  {
    "email": "parent.261p4265@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Rao",
    "studentId": "261P4265",
    "isActive": true
  },
  {
    "email": "parent.221s2023@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Aithal",
    "studentId": "221S2023",
    "isActive": true
  },
  {
    "email": "parent.251s1728@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Sharma",
    "studentId": "251S1728",
    "isActive": true
  },
  {
    "email": "parent.261p3411@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Hegde",
    "studentId": "261P3411",
    "isActive": true
  },
  {
    "email": "parent.261s1105@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "261S1105",
    "isActive": true
  },
  {
    "email": "parent.241s1623@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Kulkarni",
    "studentId": "241S1623",
    "isActive": true
  },
  {
    "email": "parent.241s2119@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Deshkulkarni",
    "studentId": "241S2119",
    "isActive": true
  },
  {
    "email": "parent.221s1058@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Joshi",
    "studentId": "221S1058",
    "isActive": true
  },
  {
    "email": "parent.221s1048@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Vyas",
    "studentId": "221S1048",
    "isActive": true
  },
  {
    "email": "parent.221s1060@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Hegde",
    "studentId": "221S1060",
    "isActive": true
  },
  {
    "email": "parent.221s1061@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Pai",
    "studentId": "221S1061",
    "isActive": true
  },
  {
    "email": "parent.221s1063@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Sastry",
    "studentId": "221S1063",
    "isActive": true
  },
  {
    "email": "parent.231s1104@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "231S1104",
    "isActive": true
  },
  {
    "email": "parent.201s1013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Sastry",
    "studentId": "201S1013",
    "isActive": true
  },
  {
    "email": "parent.261s1097@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Joshi",
    "studentId": "261S1097",
    "isActive": true
  },
  {
    "email": "parent.261s1020@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Gowda",
    "studentId": "261S1020",
    "isActive": true
  },
  {
    "email": "parent.261p3478@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Deshkulkarni",
    "studentId": "261P3478",
    "isActive": true
  },
  {
    "email": "parent.231s1067@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Chavan",
    "studentId": "231S1067",
    "isActive": true
  },
  {
    "email": "parent.261p3778@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Pai",
    "studentId": "261P3778",
    "isActive": true
  },
  {
    "email": "parent.261s1087@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Rao",
    "studentId": "261S1087",
    "isActive": true
  },
  {
    "email": "parent.251p1297@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Vaid",
    "studentId": "251P1297",
    "isActive": true
  },
  {
    "email": "parent.261p3580@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Sastry",
    "studentId": "261P3580",
    "isActive": true
  },
  {
    "email": "parent.261p3250@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Pai",
    "studentId": "261P3250",
    "isActive": true
  },
  {
    "email": "parent.231s1021@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Joshi",
    "studentId": "231S1021",
    "isActive": true
  },
  {
    "email": "parent.251p2166@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Prabhu",
    "studentId": "251P2166",
    "isActive": true
  },
  {
    "email": "parent.261p3912@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Gowda",
    "studentId": "261P3912",
    "isActive": true
  },
  {
    "email": "parent.251s1363@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Rao",
    "studentId": "251S1363",
    "isActive": true
  },
  {
    "email": "parent.241s1159@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Pai",
    "studentId": "241S1159",
    "isActive": true
  },
  {
    "email": "parent.251p1365@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Sastry",
    "studentId": "251P1365",
    "isActive": true
  },
  {
    "email": "parent.261p4115@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Rao",
    "studentId": "261P4115",
    "isActive": true
  },
  {
    "email": "parent.251p1491@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Aithal",
    "studentId": "251P1491",
    "isActive": true
  },
  {
    "email": "parent.241s1105@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshpande",
    "studentId": "241S1105",
    "isActive": true
  },
  {
    "email": "parent.261p3116@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Naidu",
    "studentId": "261P3116",
    "isActive": true
  },
  {
    "email": "parent.261p3630@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Aithal",
    "studentId": "261P3630",
    "isActive": true
  },
  {
    "email": "parent.261p3560@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Naidu",
    "studentId": "261P3560",
    "isActive": true
  },
  {
    "email": "parent.221s1015@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Hegde",
    "studentId": "221S1015",
    "isActive": true
  },
  {
    "email": "parent.251p2258@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Vaid",
    "studentId": "251P2258",
    "isActive": true
  },
  {
    "email": "parent.261p4234@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Deshkulkarni",
    "studentId": "261P4234",
    "isActive": true
  },
  {
    "email": "parent.261p3976@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Prabhu",
    "studentId": "261P3976",
    "isActive": true
  },
  {
    "email": "parent.261p3694@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Acharya",
    "studentId": "261P3694",
    "isActive": true
  },
  {
    "email": "parent.231s1011@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Rao",
    "studentId": "231S1011",
    "isActive": true
  },
  {
    "email": "parent.241s1086@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Bhat",
    "studentId": "241S1086",
    "isActive": true
  },
  {
    "email": "parent.251s1011@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Rao",
    "studentId": "251S1011",
    "isActive": true
  },
  {
    "email": "parent.251p2268@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Naidu",
    "studentId": "251P2268",
    "isActive": true
  },
  {
    "email": "parent.261p3750@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Rao",
    "studentId": "261P3750",
    "isActive": true
  },
  {
    "email": "parent.261p3387@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Rao",
    "studentId": "261P3387",
    "isActive": true
  },
  {
    "email": "parent.261p3554@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Vyas",
    "studentId": "261P3554",
    "isActive": true
  },
  {
    "email": "parent.261p3123@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Naidu",
    "studentId": "261P3123",
    "isActive": true
  },
  {
    "email": "parent.231s1083@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Sastry",
    "studentId": "231S1083",
    "isActive": true
  },
  {
    "email": "parent.261p3650@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Naidu",
    "studentId": "261P3650",
    "isActive": true
  },
  {
    "email": "parent.261p3368@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Vyas",
    "studentId": "261P3368",
    "isActive": true
  },
  {
    "email": "parent.251p1101@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Acharya",
    "studentId": "251P1101",
    "isActive": true
  },
  {
    "email": "parent.261p3041@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Acharya",
    "studentId": "261P3041",
    "isActive": true
  },
  {
    "email": "parent.251s1263@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Hegde",
    "studentId": "251S1263",
    "isActive": true
  },
  {
    "email": "parent.251p1309@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Vyas",
    "studentId": "251P1309",
    "isActive": true
  },
  {
    "email": "parent.261p3760@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Aithal",
    "studentId": "261P3760",
    "isActive": true
  },
  {
    "email": "parent.251p1876@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sastry",
    "studentId": "251P1876",
    "isActive": true
  },
  {
    "email": "parent.251p1737@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Deshpande",
    "studentId": "251P1737",
    "isActive": true
  },
  {
    "email": "parent.251p1304@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Chavan",
    "studentId": "251P1304",
    "isActive": true
  },
  {
    "email": "parent.251s2180@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Gowda",
    "studentId": "251S2180",
    "isActive": true
  },
  {
    "email": "parent.251p1612@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Sastry",
    "studentId": "251P1612",
    "isActive": true
  },
  {
    "email": "parent.251p2494@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Reddy",
    "studentId": "251P2494",
    "isActive": true
  },
  {
    "email": "parent.241s1004@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Prabhu",
    "studentId": "241S1004",
    "isActive": true
  },
  {
    "email": "parent.261p3983@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Sharma",
    "studentId": "261P3983",
    "isActive": true
  },
  {
    "email": "parent.261p4183@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Rao",
    "studentId": "261P4183",
    "isActive": true
  },
  {
    "email": "parent.251p1970@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Prabhu",
    "studentId": "251P1970",
    "isActive": true
  },
  {
    "email": "parent.261p3418@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Kulkarni",
    "studentId": "261P3418",
    "isActive": true
  },
  {
    "email": "parent.261p3507@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Kulkarni",
    "studentId": "261P3507",
    "isActive": true
  },
  {
    "email": "parent.251p1749@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sastry",
    "studentId": "251P1749",
    "isActive": true
  },
  {
    "email": "parent.231s1082@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Deshkulkarni",
    "studentId": "231S1082",
    "isActive": true
  },
  {
    "email": "parent.261p3638@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "261P3638",
    "isActive": true
  },
  {
    "email": "parent.261p4123@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Acharya",
    "studentId": "261P4123",
    "isActive": true
  },
  {
    "email": "parent.261p4073@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Deshkulkarni",
    "studentId": "261P4073",
    "isActive": true
  },
  {
    "email": "parent.261p3712@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Naidu",
    "studentId": "261P3712",
    "isActive": true
  },
  {
    "email": "parent.261s1080@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Gowda",
    "studentId": "261S1080",
    "isActive": true
  },
  {
    "email": "parent.261p3362@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Reddy",
    "studentId": "261P3362",
    "isActive": true
  },
  {
    "email": "parent.261p3933@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Shenoy",
    "studentId": "261P3933",
    "isActive": true
  },
  {
    "email": "parent.261p4167@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Joshi",
    "studentId": "261P4167",
    "isActive": true
  },
  {
    "email": "parent.261p3714@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Sastry",
    "studentId": "261P3714",
    "isActive": true
  },
  {
    "email": "parent.261p3639@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Pai",
    "studentId": "261P3639",
    "isActive": true
  },
  {
    "email": "parent.251p2288@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Deshpande",
    "studentId": "251P2288",
    "isActive": true
  },
  {
    "email": "parent.261p3746@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Shenoy",
    "studentId": "261P3746",
    "isActive": true
  },
  {
    "email": "parent.251p1899@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Prabhu",
    "studentId": "251P1899",
    "isActive": true
  },
  {
    "email": "parent.251p1572@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Acharya",
    "studentId": "251P1572",
    "isActive": true
  },
  {
    "email": "parent.261p3451@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Deshpande",
    "studentId": "261P3451",
    "isActive": true
  },
  {
    "email": "parent.251p1610@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Prabhu",
    "studentId": "251P1610",
    "isActive": true
  },
  {
    "email": "parent.261p3324@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Pai",
    "studentId": "261P3324",
    "isActive": true
  },
  {
    "email": "parent.261p4039@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Rao",
    "studentId": "261P4039",
    "isActive": true
  },
  {
    "email": "parent.261p3529@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Aithal",
    "studentId": "261P3529",
    "isActive": true
  },
  {
    "email": "parent.261p3317@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Aithal",
    "studentId": "261P3317",
    "isActive": true
  },
  {
    "email": "parent.251p1166@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Rao",
    "studentId": "251P1166",
    "isActive": true
  },
  {
    "email": "parent.261p3361@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Chavan",
    "studentId": "261P3361",
    "isActive": true
  },
  {
    "email": "parent.251p2098@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Aithal",
    "studentId": "251P2098",
    "isActive": true
  },
  {
    "email": "parent.261p4206@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Sharma",
    "studentId": "261P4206",
    "isActive": true
  },
  {
    "email": "parent.261p3104@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Vyas",
    "studentId": "261P3104",
    "isActive": true
  },
  {
    "email": "parent.261p3956@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vaid",
    "studentId": "261P3956",
    "isActive": true
  },
  {
    "email": "parent.261p3086@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Chavan",
    "studentId": "261P3086",
    "isActive": true
  },
  {
    "email": "parent.251p1312@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Aithal",
    "studentId": "251P1312",
    "isActive": true
  },
  {
    "email": "parent.251p1790@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Naidu",
    "studentId": "251P1790",
    "isActive": true
  },
  {
    "email": "parent.261p3117@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Acharya",
    "studentId": "261P3117",
    "isActive": true
  },
  {
    "email": "parent.251p2116@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Shenoy",
    "studentId": "251P2116",
    "isActive": true
  },
  {
    "email": "parent.251p1239@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vyas",
    "studentId": "251P1239",
    "isActive": true
  },
  {
    "email": "parent.251p1511@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshpande",
    "studentId": "251P1511",
    "isActive": true
  },
  {
    "email": "parent.251p1632@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Acharya",
    "studentId": "251P1632",
    "isActive": true
  },
  {
    "email": "parent.251p2338@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Naidu",
    "studentId": "251P2338",
    "isActive": true
  },
  {
    "email": "parent.261p3254@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Sharma",
    "studentId": "261P3254",
    "isActive": true
  },
  {
    "email": "parent.231s1007@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Kulkarni",
    "studentId": "231S1007",
    "isActive": true
  },
  {
    "email": "parent.261p3470@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Reddy",
    "studentId": "261P3470",
    "isActive": true
  },
  {
    "email": "parent.251p1971@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Shenoy",
    "studentId": "251P1971",
    "isActive": true
  },
  {
    "email": "parent.251p1227@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Aithal",
    "studentId": "251P1227",
    "isActive": true
  },
  {
    "email": "parent.251p1152@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Hegde",
    "studentId": "251P1152",
    "isActive": true
  },
  {
    "email": "parent.251p1261@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Sharma",
    "studentId": "251P1261",
    "isActive": true
  },
  {
    "email": "parent.261p4236@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Acharya",
    "studentId": "261P4236",
    "isActive": true
  },
  {
    "email": "parent.261p3255@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Reddy",
    "studentId": "261P3255",
    "isActive": true
  },
  {
    "email": "parent.251s1222@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Rao",
    "studentId": "251S1222",
    "isActive": true
  },
  {
    "email": "parent.261p3619@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Deshkulkarni",
    "studentId": "261P3619",
    "isActive": true
  },
  {
    "email": "parent.261p3421@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Vyas",
    "studentId": "261P3421",
    "isActive": true
  },
  {
    "email": "parent.261p3796@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Deshkulkarni",
    "studentId": "261P3796",
    "isActive": true
  },
  {
    "email": "parent.261p3798@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Naidu",
    "studentId": "261P3798",
    "isActive": true
  },
  {
    "email": "parent.251p2427@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Gowda",
    "studentId": "251P2427",
    "isActive": true
  },
  {
    "email": "parent.251p1310@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Reddy",
    "studentId": "251P1310",
    "isActive": true
  },
  {
    "email": "parent.251p1695@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Deshpande",
    "studentId": "251P1695",
    "isActive": true
  },
  {
    "email": "parent.251p1713@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Prabhu",
    "studentId": "251P1713",
    "isActive": true
  },
  {
    "email": "parent.251p2112@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Sharma",
    "studentId": "251P2112",
    "isActive": true
  },
  {
    "email": "parent.261p3644@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Reddy",
    "studentId": "261P3644",
    "isActive": true
  },
  {
    "email": "parent.261p3989@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Naidu",
    "studentId": "261P3989",
    "isActive": true
  },
  {
    "email": "parent.261p3547@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Sharma",
    "studentId": "261P3547",
    "isActive": true
  },
  {
    "email": "parent.261p3827@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Aithal",
    "studentId": "261P3827",
    "isActive": true
  },
  {
    "email": "parent.261p3828@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshkulkarni",
    "studentId": "261P3828",
    "isActive": true
  },
  {
    "email": "parent.261p4081@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "261P4081",
    "isActive": true
  },
  {
    "email": "parent.261p4248@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Rao",
    "studentId": "261P4248",
    "isActive": true
  },
  {
    "email": "parent.261p3109@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Deshkulkarni",
    "studentId": "261P3109",
    "isActive": true
  },
  {
    "email": "parent.251p2013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Kulkarni",
    "studentId": "251P2013",
    "isActive": true
  },
  {
    "email": "parent.261p3755@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Pai",
    "studentId": "261P3755",
    "isActive": true
  },
  {
    "email": "parent.251p1401@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Vaid",
    "studentId": "251P1401",
    "isActive": true
  },
  {
    "email": "parent.261p3314@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Bhat",
    "studentId": "261P3314",
    "isActive": true
  },
  {
    "email": "parent.261p3988@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Kulkarni",
    "studentId": "261P3988",
    "isActive": true
  },
  {
    "email": "parent.261p4066@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Aithal",
    "studentId": "261P4066",
    "isActive": true
  },
  {
    "email": "parent.251p1928@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Naidu",
    "studentId": "251P1928",
    "isActive": true
  },
  {
    "email": "parent.251p2092@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Deshkulkarni",
    "studentId": "251P2092",
    "isActive": true
  },
  {
    "email": "parent.251p1331@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Shenoy",
    "studentId": "251P1331",
    "isActive": true
  },
  {
    "email": "parent.231s1044@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Pai",
    "studentId": "231S1044",
    "isActive": true
  },
  {
    "email": "parent.261p3416@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Acharya",
    "studentId": "261P3416",
    "isActive": true
  },
  {
    "email": "parent.251p1450@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Deshkulkarni",
    "studentId": "251P1450",
    "isActive": true
  },
  {
    "email": "parent.261p3287@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Chavan",
    "studentId": "261P3287",
    "isActive": true
  },
  {
    "email": "parent.251p2501@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Shenoy",
    "studentId": "251P2501",
    "isActive": true
  },
  {
    "email": "parent.261p4219@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Chavan",
    "studentId": "261P4219",
    "isActive": true
  },
  {
    "email": "parent.251p1521@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Hegde",
    "studentId": "251P1521",
    "isActive": true
  },
  {
    "email": "parent.251p1123@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Naidu",
    "studentId": "251P1123",
    "isActive": true
  },
  {
    "email": "parent.261p3151@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Deshkulkarni",
    "studentId": "261P3151",
    "isActive": true
  },
  {
    "email": "parent.251p2443@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Rao",
    "studentId": "251P2443",
    "isActive": true
  },
  {
    "email": "parent.251s2105@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Pai",
    "studentId": "251S2105",
    "isActive": true
  },
  {
    "email": "parent.251p2495@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Deshpande",
    "studentId": "251P2495",
    "isActive": true
  },
  {
    "email": "parent.261p3678@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vaid",
    "studentId": "261P3678",
    "isActive": true
  },
  {
    "email": "parent.261p3044@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Pai",
    "studentId": "261P3044",
    "isActive": true
  },
  {
    "email": "parent.251p1562@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sastry",
    "studentId": "251P1562",
    "isActive": true
  },
  {
    "email": "parent.261p4301@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sastry",
    "studentId": "261P4301",
    "isActive": true
  },
  {
    "email": "parent.261p3141@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Bhat",
    "studentId": "261P3141",
    "isActive": true
  },
  {
    "email": "parent.261p3744@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Rao",
    "studentId": "261P3744",
    "isActive": true
  },
  {
    "email": "parent.261p3873@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Vyas",
    "studentId": "261P3873",
    "isActive": true
  },
  {
    "email": "parent.261p3612@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Shenoy",
    "studentId": "261P3612",
    "isActive": true
  },
  {
    "email": "parent.251p2250@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Aithal",
    "studentId": "251P2250",
    "isActive": true
  },
  {
    "email": "parent.261p3106@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshkulkarni",
    "studentId": "261P3106",
    "isActive": true
  },
  {
    "email": "parent.261p3124@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Naidu",
    "studentId": "261P3124",
    "isActive": true
  },
  {
    "email": "parent.251p2326@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Pai",
    "studentId": "251P2326",
    "isActive": true
  },
  {
    "email": "parent.251p2390@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Sharma",
    "studentId": "251P2390",
    "isActive": true
  },
  {
    "email": "parent.261p3458@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Kulkarni",
    "studentId": "261P3458",
    "isActive": true
  },
  {
    "email": "parent.251p1139@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Prabhu",
    "studentId": "251P1139",
    "isActive": true
  },
  {
    "email": "parent.251p2060@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Gowda",
    "studentId": "251P2060",
    "isActive": true
  },
  {
    "email": "parent.261p3823@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Rao",
    "studentId": "261P3823",
    "isActive": true
  },
  {
    "email": "parent.251p2020@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Acharya",
    "studentId": "251P2020",
    "isActive": true
  },
  {
    "email": "parent.251p2468@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Gowda",
    "studentId": "251P2468",
    "isActive": true
  },
  {
    "email": "parent.251p1662@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Prabhu",
    "studentId": "251P1662",
    "isActive": true
  },
  {
    "email": "parent.261p3585@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Prabhu",
    "studentId": "261P3585",
    "isActive": true
  },
  {
    "email": "parent.261p3345@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Hegde",
    "studentId": "261P3345",
    "isActive": true
  },
  {
    "email": "parent.261p3819@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshkulkarni",
    "studentId": "261P3819",
    "isActive": true
  },
  {
    "email": "parent.261p3247@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Acharya",
    "studentId": "261P3247",
    "isActive": true
  },
  {
    "email": "parent.261p3224@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Sharma",
    "studentId": "261P3224",
    "isActive": true
  },
  {
    "email": "parent.261p4017@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Kulkarni",
    "studentId": "261P4017",
    "isActive": true
  },
  {
    "email": "parent.251p1433@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Pai",
    "studentId": "251P1433",
    "isActive": true
  },
  {
    "email": "parent.261p3513@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Deshkulkarni",
    "studentId": "261P3513",
    "isActive": true
  },
  {
    "email": "parent.261p3525@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Aithal",
    "studentId": "261P3525",
    "isActive": true
  },
  {
    "email": "parent.251s1270@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Naidu",
    "studentId": "251S1270",
    "isActive": true
  },
  {
    "email": "parent.261p3965@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "261P3965",
    "isActive": true
  },
  {
    "email": "parent.251p1623@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Pai",
    "studentId": "251P1623",
    "isActive": true
  },
  {
    "email": "parent.251p1830@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Bhat",
    "studentId": "251P1830",
    "isActive": true
  },
  {
    "email": "parent.261p3229@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Sharma",
    "studentId": "261P3229",
    "isActive": true
  },
  {
    "email": "parent.251p1850@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Reddy",
    "studentId": "251P1850",
    "isActive": true
  },
  {
    "email": "parent.261p3640@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "261P3640",
    "isActive": true
  },
  {
    "email": "parent.261p3815@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Gowda",
    "studentId": "261P3815",
    "isActive": true
  },
  {
    "email": "parent.251p2214@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Prabhu",
    "studentId": "251P2214",
    "isActive": true
  },
  {
    "email": "parent.251p1459@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Shenoy",
    "studentId": "251P1459",
    "isActive": true
  },
  {
    "email": "parent.261p4014@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Joshi",
    "studentId": "261P4014",
    "isActive": true
  },
  {
    "email": "parent.261p3551@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Pai",
    "studentId": "261P3551",
    "isActive": true
  },
  {
    "email": "parent.261p3808@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Vaid",
    "studentId": "261P3808",
    "isActive": true
  },
  {
    "email": "parent.251p2386@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Acharya",
    "studentId": "251P2386",
    "isActive": true
  },
  {
    "email": "parent.261p3774@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshpande",
    "studentId": "261P3774",
    "isActive": true
  },
  {
    "email": "parent.261p3870@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Shenoy",
    "studentId": "261P3870",
    "isActive": true
  },
  {
    "email": "parent.261p3017@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Shenoy",
    "studentId": "261P3017",
    "isActive": true
  },
  {
    "email": "parent.251p1541@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Prabhu",
    "studentId": "251P1541",
    "isActive": true
  },
  {
    "email": "parent.261p4169@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Shenoy",
    "studentId": "261P4169",
    "isActive": true
  },
  {
    "email": "parent.261p3186@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Deshpande",
    "studentId": "261P3186",
    "isActive": true
  },
  {
    "email": "parent.261p3415@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Naidu",
    "studentId": "261P3415",
    "isActive": true
  },
  {
    "email": "parent.261p3127@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Aithal",
    "studentId": "261P3127",
    "isActive": true
  },
  {
    "email": "parent.261p3265@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Rao",
    "studentId": "261P3265",
    "isActive": true
  },
  {
    "email": "parent.261p3210@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Deshpande",
    "studentId": "261P3210",
    "isActive": true
  },
  {
    "email": "parent.261p3657@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Sharma",
    "studentId": "261P3657",
    "isActive": true
  },
  {
    "email": "parent.261p3671@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshkulkarni",
    "studentId": "261P3671",
    "isActive": true
  },
  {
    "email": "parent.261p3146@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vyas",
    "studentId": "261P3146",
    "isActive": true
  },
  {
    "email": "parent.251p2545@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Pai",
    "studentId": "251P2545",
    "isActive": true
  },
  {
    "email": "parent.261p3717@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Gowda",
    "studentId": "261P3717",
    "isActive": true
  },
  {
    "email": "parent.251s1817@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Rao",
    "studentId": "251S1817",
    "isActive": true
  },
  {
    "email": "parent.261p3467@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Acharya",
    "studentId": "261P3467",
    "isActive": true
  },
  {
    "email": "parent.261p3462@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Bhat",
    "studentId": "261P3462",
    "isActive": true
  },
  {
    "email": "parent.261p3897@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Shenoy",
    "studentId": "261P3897",
    "isActive": true
  },
  {
    "email": "parent.231s1043@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Kulkarni",
    "studentId": "231S1043",
    "isActive": true
  },
  {
    "email": "parent.251p1355@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Acharya",
    "studentId": "251P1355",
    "isActive": true
  },
  {
    "email": "parent.251p2429@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Deshkulkarni",
    "studentId": "251P2429",
    "isActive": true
  },
  {
    "email": "parent.221s1045@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Pai",
    "studentId": "221S1045",
    "isActive": true
  },
  {
    "email": "parent.251p1530@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Sharma",
    "studentId": "251P1530",
    "isActive": true
  },
  {
    "email": "parent.251p1871@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Rao",
    "studentId": "251P1871",
    "isActive": true
  },
  {
    "email": "parent.251s1684@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Bhat",
    "studentId": "251S1684",
    "isActive": true
  },
  {
    "email": "parent.251p1638@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Vyas",
    "studentId": "251P1638",
    "isActive": true
  },
  {
    "email": "parent.261p3521@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Deshkulkarni",
    "studentId": "261P3521",
    "isActive": true
  },
  {
    "email": "parent.261p3702@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Sharma",
    "studentId": "261P3702",
    "isActive": true
  },
  {
    "email": "parent.261p3329@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vaid",
    "studentId": "261P3329",
    "isActive": true
  },
  {
    "email": "parent.261p3383@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Bhat",
    "studentId": "261P3383",
    "isActive": true
  },
  {
    "email": "parent.261p3290@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Aithal",
    "studentId": "261P3290",
    "isActive": true
  },
  {
    "email": "parent.251p2148@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Deshkulkarni",
    "studentId": "251P2148",
    "isActive": true
  },
  {
    "email": "parent.261p3747@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Prabhu",
    "studentId": "261P3747",
    "isActive": true
  },
  {
    "email": "parent.261p3403@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Deshpande",
    "studentId": "261P3403",
    "isActive": true
  },
  {
    "email": "parent.251p1512@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshpande",
    "studentId": "251P1512",
    "isActive": true
  },
  {
    "email": "parent.251p1969@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Prabhu",
    "studentId": "251P1969",
    "isActive": true
  },
  {
    "email": "parent.261p3570@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Kulkarni",
    "studentId": "261P3570",
    "isActive": true
  },
  {
    "email": "parent.261p3669@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Chavan",
    "studentId": "261P3669",
    "isActive": true
  },
  {
    "email": "parent.261p3291@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Rao",
    "studentId": "261P3291",
    "isActive": true
  },
  {
    "email": "parent.261p3772@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Vyas",
    "studentId": "261P3772",
    "isActive": true
  },
  {
    "email": "parent.261p4282@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Sharma",
    "studentId": "261P4282",
    "isActive": true
  },
  {
    "email": "parent.261p3332@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Gowda",
    "studentId": "261P3332",
    "isActive": true
  },
  {
    "email": "parent.251p1870@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshkulkarni",
    "studentId": "251P1870",
    "isActive": true
  },
  {
    "email": "parent.261p3262@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Deshpande",
    "studentId": "261P3262",
    "isActive": true
  },
  {
    "email": "parent.261p3100@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Sharma",
    "studentId": "261P3100",
    "isActive": true
  },
  {
    "email": "parent.261p3896@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Bhat",
    "studentId": "261P3896",
    "isActive": true
  },
  {
    "email": "parent.261p3909@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vyas",
    "studentId": "261P3909",
    "isActive": true
  },
  {
    "email": "parent.261p3592@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Kulkarni",
    "studentId": "261P3592",
    "isActive": true
  },
  {
    "email": "parent.251p1603@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Hegde",
    "studentId": "251P1603",
    "isActive": true
  },
  {
    "email": "parent.251p1058@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Hegde",
    "studentId": "251P1058",
    "isActive": true
  },
  {
    "email": "parent.261p3006@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshpande",
    "studentId": "261P3006",
    "isActive": true
  },
  {
    "email": "parent.251p1891@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshkulkarni",
    "studentId": "251P1891",
    "isActive": true
  },
  {
    "email": "parent.261p3598@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sastry",
    "studentId": "261P3598",
    "isActive": true
  },
  {
    "email": "parent.251p1024@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Gowda",
    "studentId": "251P1024",
    "isActive": true
  },
  {
    "email": "parent.251p1330@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Shenoy",
    "studentId": "251P1330",
    "isActive": true
  },
  {
    "email": "parent.251p1016@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Vyas",
    "studentId": "251P1016",
    "isActive": true
  },
  {
    "email": "parent.251p1290@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Aithal",
    "studentId": "251P1290",
    "isActive": true
  },
  {
    "email": "parent.251p1960@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Vyas",
    "studentId": "251P1960",
    "isActive": true
  },
  {
    "email": "parent.261p3009@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Vaid",
    "studentId": "261P3009",
    "isActive": true
  },
  {
    "email": "parent.261s1071@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Bhat",
    "studentId": "261S1071",
    "isActive": true
  },
  {
    "email": "parent.251p1280@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Hegde",
    "studentId": "251P1280",
    "isActive": true
  },
  {
    "email": "parent.261s1060@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Shenoy",
    "studentId": "261S1060",
    "isActive": true
  },
  {
    "email": "parent.261p3066@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Deshkulkarni",
    "studentId": "261P3066",
    "isActive": true
  },
  {
    "email": "parent.261p3133@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Acharya",
    "studentId": "261P3133",
    "isActive": true
  },
  {
    "email": "parent.251s1137@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Aithal",
    "studentId": "251S1137",
    "isActive": true
  },
  {
    "email": "parent.251p1081@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Aithal",
    "studentId": "251P1081",
    "isActive": true
  },
  {
    "email": "parent.261p4280@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Shenoy",
    "studentId": "261P4280",
    "isActive": true
  },
  {
    "email": "parent.251p1171@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sastry",
    "studentId": "251P1171",
    "isActive": true
  },
  {
    "email": "parent.251p2417@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Rao",
    "studentId": "251P2417",
    "isActive": true
  },
  {
    "email": "parent.261p3929@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Reddy",
    "studentId": "261P3929",
    "isActive": true
  },
  {
    "email": "parent.251p1752@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Aithal",
    "studentId": "251P1752",
    "isActive": true
  },
  {
    "email": "parent.251p1711@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sastry",
    "studentId": "251P1711",
    "isActive": true
  },
  {
    "email": "parent.251p1374@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Deshkulkarni",
    "studentId": "251P1374",
    "isActive": true
  },
  {
    "email": "parent.251p1706@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Hegde",
    "studentId": "251P1706",
    "isActive": true
  },
  {
    "email": "parent.251p2530@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Bhat",
    "studentId": "251P2530",
    "isActive": true
  },
  {
    "email": "parent.261p3035@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Vyas",
    "studentId": "261P3035",
    "isActive": true
  },
  {
    "email": "parent.261p3221@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Gowda",
    "studentId": "261P3221",
    "isActive": true
  },
  {
    "email": "parent.261p3878@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Chavan",
    "studentId": "261P3878",
    "isActive": true
  },
  {
    "email": "parent.261p3408@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Vaid",
    "studentId": "261P3408",
    "isActive": true
  },
  {
    "email": "parent.261p3142@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Chavan",
    "studentId": "261P3142",
    "isActive": true
  },
  {
    "email": "parent.251p1289@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Shenoy",
    "studentId": "251P1289",
    "isActive": true
  },
  {
    "email": "parent.251p1119@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Kulkarni",
    "studentId": "251P1119",
    "isActive": true
  },
  {
    "email": "parent.251p2136@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Vaid",
    "studentId": "251P2136",
    "isActive": true
  },
  {
    "email": "parent.251p2354@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Kulkarni",
    "studentId": "251P2354",
    "isActive": true
  },
  {
    "email": "parent.251p1354@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Hegde",
    "studentId": "251P1354",
    "isActive": true
  },
  {
    "email": "parent.251p1048@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Pai",
    "studentId": "251P1048",
    "isActive": true
  },
  {
    "email": "parent.251p1669@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Bhat",
    "studentId": "251P1669",
    "isActive": true
  },
  {
    "email": "parent.261p3092@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Vaid",
    "studentId": "261P3092",
    "isActive": true
  },
  {
    "email": "parent.261p3636@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Deshkulkarni",
    "studentId": "261P3636",
    "isActive": true
  },
  {
    "email": "parent.261p3762@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Sastry",
    "studentId": "261P3762",
    "isActive": true
  },
  {
    "email": "parent.261p3225@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Gowda",
    "studentId": "261P3225",
    "isActive": true
  },
  {
    "email": "parent.251p1579@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Joshi",
    "studentId": "251P1579",
    "isActive": true
  },
  {
    "email": "parent.261p3188@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Bhat",
    "studentId": "261P3188",
    "isActive": true
  },
  {
    "email": "parent.261p4208@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Vaid",
    "studentId": "261P4208",
    "isActive": true
  },
  {
    "email": "parent.221s1066@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Aithal",
    "studentId": "221S1066",
    "isActive": true
  },
  {
    "email": "parent.251p1272@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Vyas",
    "studentId": "251P1272",
    "isActive": true
  },
  {
    "email": "parent.251s1661@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshpande",
    "studentId": "251S1661",
    "isActive": true
  },
  {
    "email": "parent.261p3664@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Vyas",
    "studentId": "261P3664",
    "isActive": true
  },
  {
    "email": "parent.251p1032@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Sharma",
    "studentId": "251P1032",
    "isActive": true
  },
  {
    "email": "parent.251p1078@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Kulkarni",
    "studentId": "251P1078",
    "isActive": true
  },
  {
    "email": "parent.261p3164@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sharma",
    "studentId": "261P3164",
    "isActive": true
  },
  {
    "email": "parent.251p1033@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Hegde",
    "studentId": "251P1033",
    "isActive": true
  },
  {
    "email": "parent.251p2419@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Deshkulkarni",
    "studentId": "251P2419",
    "isActive": true
  },
  {
    "email": "parent.261p3519@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Joshi",
    "studentId": "261P3519",
    "isActive": true
  },
  {
    "email": "parent.251s1019@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Shenoy",
    "studentId": "251S1019",
    "isActive": true
  },
  {
    "email": "parent.261p3566@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Naidu",
    "studentId": "261P3566",
    "isActive": true
  },
  {
    "email": "parent.261p3775@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Deshkulkarni",
    "studentId": "261P3775",
    "isActive": true
  },
  {
    "email": "parent.251s1627@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Chavan",
    "studentId": "251S1627",
    "isActive": true
  },
  {
    "email": "parent.261p3907@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Joshi",
    "studentId": "261P3907",
    "isActive": true
  },
  {
    "email": "parent.251p1434@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Acharya",
    "studentId": "251P1434",
    "isActive": true
  },
  {
    "email": "parent.251p1918@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vyas",
    "studentId": "251P1918",
    "isActive": true
  },
  {
    "email": "parent.251p2272@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Gowda",
    "studentId": "251P2272",
    "isActive": true
  },
  {
    "email": "parent.261p3159@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vyas",
    "studentId": "261P3159",
    "isActive": true
  },
  {
    "email": "parent.251p1792@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Rao",
    "studentId": "251P1792",
    "isActive": true
  },
  {
    "email": "parent.261p3027@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Sastry",
    "studentId": "261P3027",
    "isActive": true
  },
  {
    "email": "parent.261p3911@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Sharma",
    "studentId": "261P3911",
    "isActive": true
  },
  {
    "email": "parent.261p3948@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Acharya",
    "studentId": "261P3948",
    "isActive": true
  },
  {
    "email": "parent.261p3140@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Joshi",
    "studentId": "261P3140",
    "isActive": true
  },
  {
    "email": "parent.261p3439@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Shenoy",
    "studentId": "261P3439",
    "isActive": true
  },
  {
    "email": "parent.261p3787@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Prabhu",
    "studentId": "261P3787",
    "isActive": true
  },
  {
    "email": "parent.251s1488@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Prabhu",
    "studentId": "251S1488",
    "isActive": true
  },
  {
    "email": "parent.261p3811@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Kulkarni",
    "studentId": "261P3811",
    "isActive": true
  },
  {
    "email": "parent.251p1678@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Gowda",
    "studentId": "251P1678",
    "isActive": true
  },
  {
    "email": "parent.251p1628@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Sharma",
    "studentId": "251P1628",
    "isActive": true
  },
  {
    "email": "parent.251p1364@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Hegde",
    "studentId": "251P1364",
    "isActive": true
  },
  {
    "email": "parent.261p4266@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Reddy",
    "studentId": "261P4266",
    "isActive": true
  },
  {
    "email": "parent.261p3997@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Naidu",
    "studentId": "261P3997",
    "isActive": true
  },
  {
    "email": "parent.251p1349@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Reddy",
    "studentId": "251P1349",
    "isActive": true
  },
  {
    "email": "parent.261p3900@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Vaid",
    "studentId": "261P3900",
    "isActive": true
  },
  {
    "email": "parent.261p3183@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vaid",
    "studentId": "261P3183",
    "isActive": true
  },
  {
    "email": "parent.261p3180@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Vyas",
    "studentId": "261P3180",
    "isActive": true
  },
  {
    "email": "parent.261p3047@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Rao",
    "studentId": "261P3047",
    "isActive": true
  },
  {
    "email": "parent.261p3553@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Chavan",
    "studentId": "261P3553",
    "isActive": true
  },
  {
    "email": "parent.231s1028@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Sastry",
    "studentId": "231S1028",
    "isActive": true
  },
  {
    "email": "parent.261p3055@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "261P3055",
    "isActive": true
  },
  {
    "email": "parent.261p3322@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Shenoy",
    "studentId": "261P3322",
    "isActive": true
  },
  {
    "email": "parent.251p1781@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Gowda",
    "studentId": "251P1781",
    "isActive": true
  },
  {
    "email": "parent.251p1287@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Gowda",
    "studentId": "251P1287",
    "isActive": true
  },
  {
    "email": "parent.261p3469@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Kulkarni",
    "studentId": "261P3469",
    "isActive": true
  },
  {
    "email": "parent.261p3379@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Bhat",
    "studentId": "261P3379",
    "isActive": true
  },
  {
    "email": "parent.251p1041@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Aithal",
    "studentId": "251P1041",
    "isActive": true
  },
  {
    "email": "parent.241s1850@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Aithal",
    "studentId": "241S1850",
    "isActive": true
  },
  {
    "email": "parent.261p4076@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "261P4076",
    "isActive": true
  },
  {
    "email": "parent.261p3889@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Prabhu",
    "studentId": "261P3889",
    "isActive": true
  },
  {
    "email": "parent.261p3085@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Kulkarni",
    "studentId": "261P3085",
    "isActive": true
  },
  {
    "email": "parent.251p1457@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Vaid",
    "studentId": "251P1457",
    "isActive": true
  },
  {
    "email": "parent.261p3212@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Joshi",
    "studentId": "261P3212",
    "isActive": true
  },
  {
    "email": "parent.261p3609@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Reddy",
    "studentId": "261P3609",
    "isActive": true
  },
  {
    "email": "parent.261p3715@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Vyas",
    "studentId": "261P3715",
    "isActive": true
  },
  {
    "email": "parent.261p3288@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Rao",
    "studentId": "261P3288",
    "isActive": true
  },
  {
    "email": "parent.261p3082@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Naidu",
    "studentId": "261P3082",
    "isActive": true
  },
  {
    "email": "parent.241s1652@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Sastry",
    "studentId": "241S1652",
    "isActive": true
  },
  {
    "email": "parent.251s1127@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Vaid",
    "studentId": "251S1127",
    "isActive": true
  },
  {
    "email": "parent.261p3943@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Aithal",
    "studentId": "261P3943",
    "isActive": true
  },
  {
    "email": "parent.261p3803@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Rao",
    "studentId": "261P3803",
    "isActive": true
  },
  {
    "email": "parent.261p3013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Prabhu",
    "studentId": "261P3013",
    "isActive": true
  },
  {
    "email": "parent.261p3704@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Naidu",
    "studentId": "261P3704",
    "isActive": true
  },
  {
    "email": "parent.251p1134@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Prabhu",
    "studentId": "251P1134",
    "isActive": true
  },
  {
    "email": "parent.261p3268@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Naidu",
    "studentId": "261P3268",
    "isActive": true
  },
  {
    "email": "parent.261p3307@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Chavan",
    "studentId": "261P3307",
    "isActive": true
  },
  {
    "email": "parent.261p4084@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Hegde",
    "studentId": "261P4084",
    "isActive": true
  },
  {
    "email": "parent.261p3128@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Deshkulkarni",
    "studentId": "261P3128",
    "isActive": true
  },
  {
    "email": "parent.261p4013@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vaid",
    "studentId": "261P4013",
    "isActive": true
  },
  {
    "email": "parent.251p1727@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Vyas",
    "studentId": "251P1727",
    "isActive": true
  },
  {
    "email": "parent.251p1383@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Prabhu",
    "studentId": "251P1383",
    "isActive": true
  },
  {
    "email": "parent.251p1510@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Vaid",
    "studentId": "251P1510",
    "isActive": true
  },
  {
    "email": "parent.251s1350@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Bhat",
    "studentId": "251S1350",
    "isActive": true
  },
  {
    "email": "parent.201s1041@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Prabhu",
    "studentId": "201S1041",
    "isActive": true
  },
  {
    "email": "parent.261p4181@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Prabhu",
    "studentId": "261P4181",
    "isActive": true
  },
  {
    "email": "parent.241s1482@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Kulkarni",
    "studentId": "241S1482",
    "isActive": true
  },
  {
    "email": "parent.261p3249@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Kulkarni",
    "studentId": "261P3249",
    "isActive": true
  },
  {
    "email": "parent.261p3131@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Reddy",
    "studentId": "261P3131",
    "isActive": true
  },
  {
    "email": "parent.261p3433@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Aithal",
    "studentId": "261P3433",
    "isActive": true
  },
  {
    "email": "parent.261p3237@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Vaid",
    "studentId": "261P3237",
    "isActive": true
  },
  {
    "email": "parent.251p1398@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Pai",
    "studentId": "251P1398",
    "isActive": true
  },
  {
    "email": "parent.251p1804@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Prabhu",
    "studentId": "251P1804",
    "isActive": true
  },
  {
    "email": "parent.261p3349@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sastry",
    "studentId": "261P3349",
    "isActive": true
  },
  {
    "email": "parent.261p3097@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Shenoy",
    "studentId": "261P3097",
    "isActive": true
  },
  {
    "email": "parent.251p2579@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vaid",
    "studentId": "251P2579",
    "isActive": true
  },
  {
    "email": "parent.261p3244@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Pai",
    "studentId": "261P3244",
    "isActive": true
  },
  {
    "email": "parent.261p4133@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Aithal",
    "studentId": "261P4133",
    "isActive": true
  },
  {
    "email": "parent.261p3025@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Chavan",
    "studentId": "261P3025",
    "isActive": true
  },
  {
    "email": "parent.261s1019@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Bhat",
    "studentId": "261S1019",
    "isActive": true
  },
  {
    "email": "parent.261p3334@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Deshpande",
    "studentId": "261P3334",
    "isActive": true
  },
  {
    "email": "parent.261s1010@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Naidu",
    "studentId": "261S1010",
    "isActive": true
  },
  {
    "email": "parent.261p3304@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vaid",
    "studentId": "261P3304",
    "isActive": true
  },
  {
    "email": "parent.261p3263@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Vaid",
    "studentId": "261P3263",
    "isActive": true
  },
  {
    "email": "parent.261p3863@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Gowda",
    "studentId": "261P3863",
    "isActive": true
  },
  {
    "email": "parent.251p1499@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Vyas",
    "studentId": "251P1499",
    "isActive": true
  },
  {
    "email": "parent.251p1092@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Pai",
    "studentId": "251P1092",
    "isActive": true
  },
  {
    "email": "parent.261p3947@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Vyas",
    "studentId": "261P3947",
    "isActive": true
  },
  {
    "email": "parent.251p1164@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Acharya",
    "studentId": "251P1164",
    "isActive": true
  },
  {
    "email": "parent.251p2089@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Naidu",
    "studentId": "251P2089",
    "isActive": true
  },
  {
    "email": "parent.251p2109@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Joshi",
    "studentId": "251P2109",
    "isActive": true
  },
  {
    "email": "parent.261p4043@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Rao",
    "studentId": "261P4043",
    "isActive": true
  },
  {
    "email": "parent.251p1494@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Sastry",
    "studentId": "251P1494",
    "isActive": true
  },
  {
    "email": "parent.261p3158@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Acharya",
    "studentId": "261P3158",
    "isActive": true
  },
  {
    "email": "parent.261p3783@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Deshkulkarni",
    "studentId": "261P3783",
    "isActive": true
  },
  {
    "email": "parent.251p2438@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Hegde",
    "studentId": "251P2438",
    "isActive": true
  },
  {
    "email": "parent.261p3313@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sastry",
    "studentId": "261P3313",
    "isActive": true
  },
  {
    "email": "parent.251p1093@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Sastry",
    "studentId": "251P1093",
    "isActive": true
  },
  {
    "email": "parent.251p1833@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Deshkulkarni",
    "studentId": "251P1833",
    "isActive": true
  },
  {
    "email": "parent.261p3804@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Kulkarni",
    "studentId": "261P3804",
    "isActive": true
  },
  {
    "email": "parent.261p3480@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Chavan",
    "studentId": "261P3480",
    "isActive": true
  },
  {
    "email": "parent.261p3057@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Pai",
    "studentId": "261P3057",
    "isActive": true
  },
  {
    "email": "parent.251p2460@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Aithal",
    "studentId": "251P2460",
    "isActive": true
  },
  {
    "email": "parent.261p3275@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Vyas",
    "studentId": "261P3275",
    "isActive": true
  },
  {
    "email": "parent.261p4243@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Joshi",
    "studentId": "261P4243",
    "isActive": true
  },
  {
    "email": "parent.261p3220@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Pai",
    "studentId": "261P3220",
    "isActive": true
  },
  {
    "email": "parent.261p3877@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Deshpande",
    "studentId": "261P3877",
    "isActive": true
  },
  {
    "email": "parent.251p1858@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Aithal",
    "studentId": "251P1858",
    "isActive": true
  },
  {
    "email": "parent.261p4260@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Reddy",
    "studentId": "261P4260",
    "isActive": true
  },
  {
    "email": "parent.261p3779@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Gowda",
    "studentId": "261P3779",
    "isActive": true
  },
  {
    "email": "parent.261p3683@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Sastry",
    "studentId": "261P3683",
    "isActive": true
  },
  {
    "email": "parent.261p3752@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Joshi",
    "studentId": "261P3752",
    "isActive": true
  },
  {
    "email": "parent.261p4258@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Prabhu",
    "studentId": "261P4258",
    "isActive": true
  },
  {
    "email": "parent.251p2355@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Reddy",
    "studentId": "251P2355",
    "isActive": true
  },
  {
    "email": "parent.261p3423@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Naidu",
    "studentId": "261P3423",
    "isActive": true
  },
  {
    "email": "parent.251p1604@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshkulkarni",
    "studentId": "251P1604",
    "isActive": true
  },
  {
    "email": "parent.251p1648@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Aithal",
    "studentId": "251P1648",
    "isActive": true
  },
  {
    "email": "parent.251p1655@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Acharya",
    "studentId": "251P1655",
    "isActive": true
  },
  {
    "email": "parent.261p3245@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Hegde",
    "studentId": "261P3245",
    "isActive": true
  },
  {
    "email": "parent.261p3315@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Rao",
    "studentId": "261P3315",
    "isActive": true
  },
  {
    "email": "parent.251p1110@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Chavan",
    "studentId": "251P1110",
    "isActive": true
  },
  {
    "email": "parent.251p2373@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Shenoy",
    "studentId": "251P2373",
    "isActive": true
  },
  {
    "email": "parent.261p3325@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Vyas",
    "studentId": "261P3325",
    "isActive": true
  },
  {
    "email": "parent.261p4053@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Acharya",
    "studentId": "261P4053",
    "isActive": true
  },
  {
    "email": "parent.261p3095@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Sastry",
    "studentId": "261P3095",
    "isActive": true
  },
  {
    "email": "parent.261p3112@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Joshi",
    "studentId": "261P3112",
    "isActive": true
  },
  {
    "email": "parent.251p2281@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Vaid",
    "studentId": "251P2281",
    "isActive": true
  },
  {
    "email": "parent.251p2120@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Acharya",
    "studentId": "251P2120",
    "isActive": true
  },
  {
    "email": "parent.251p1172@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Joshi",
    "studentId": "251P1172",
    "isActive": true
  },
  {
    "email": "parent.261p4171@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Gowda",
    "studentId": "261P4171",
    "isActive": true
  },
  {
    "email": "parent.261p3637@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Sharma",
    "studentId": "261P3637",
    "isActive": true
  },
  {
    "email": "parent.261p4007@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Prabhu",
    "studentId": "261P4007",
    "isActive": true
  },
  {
    "email": "parent.261p3497@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Deshpande",
    "studentId": "261P3497",
    "isActive": true
  },
  {
    "email": "parent.251p1882@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Vyas",
    "studentId": "251P1882",
    "isActive": true
  },
  {
    "email": "parent.261p3588@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Acharya",
    "studentId": "261P3588",
    "isActive": true
  },
  {
    "email": "parent.251p1021@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Deshkulkarni",
    "studentId": "251P1021",
    "isActive": true
  },
  {
    "email": "parent.251p1257@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Gowda",
    "studentId": "251P1257",
    "isActive": true
  },
  {
    "email": "parent.251p1599@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Sharma",
    "studentId": "251P1599",
    "isActive": true
  },
  {
    "email": "parent.231s1054@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Chavan",
    "studentId": "231S1054",
    "isActive": true
  },
  {
    "email": "parent.241s1128@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Vaid",
    "studentId": "241S1128",
    "isActive": true
  },
  {
    "email": "parent.251s1211@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Kulkarni",
    "studentId": "251S1211",
    "isActive": true
  },
  {
    "email": "parent.261p3301@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Sastry",
    "studentId": "261P3301",
    "isActive": true
  },
  {
    "email": "parent.251p2066@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Acharya",
    "studentId": "251P2066",
    "isActive": true
  },
  {
    "email": "parent.251p1149@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Chavan",
    "studentId": "251P1149",
    "isActive": true
  },
  {
    "email": "parent.241s1231@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Chavan",
    "studentId": "241S1231",
    "isActive": true
  },
  {
    "email": "parent.261p3732@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Prabhu",
    "studentId": "261P3732",
    "isActive": true
  },
  {
    "email": "parent.251p1822@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "251P1822",
    "isActive": true
  },
  {
    "email": "parent.251p1509@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Chavan",
    "studentId": "251P1509",
    "isActive": true
  },
  {
    "email": "parent.261p3191@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Kulkarni",
    "studentId": "261P3191",
    "isActive": true
  },
  {
    "email": "parent.261p4185@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Aithal",
    "studentId": "261P4185",
    "isActive": true
  },
  {
    "email": "parent.261p3135@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Hegde",
    "studentId": "261P3135",
    "isActive": true
  },
  {
    "email": "parent.251p1107@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Deshpande",
    "studentId": "251P1107",
    "isActive": true
  },
  {
    "email": "parent.261p3048@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Acharya",
    "studentId": "261P3048",
    "isActive": true
  },
  {
    "email": "parent.251p1118@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Bhat",
    "studentId": "251P1118",
    "isActive": true
  },
  {
    "email": "parent.261p3935@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Rao",
    "studentId": "261P3935",
    "isActive": true
  },
  {
    "email": "parent.261p3599@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Shenoy",
    "studentId": "261P3599",
    "isActive": true
  },
  {
    "email": "parent.251p1591@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Joshi",
    "studentId": "251P1591",
    "isActive": true
  },
  {
    "email": "parent.251p1112@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Naidu",
    "studentId": "251P1112",
    "isActive": true
  },
  {
    "email": "parent.261p4200@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Kulkarni",
    "studentId": "261P4200",
    "isActive": true
  },
  {
    "email": "parent.251p2345@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Shenoy",
    "studentId": "251P2345",
    "isActive": true
  },
  {
    "email": "parent.251p1325@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Acharya",
    "studentId": "251P1325",
    "isActive": true
  },
  {
    "email": "parent.251s1236@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Deshkulkarni",
    "studentId": "251S1236",
    "isActive": true
  },
  {
    "email": "parent.251p1406@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Bhat",
    "studentId": "251P1406",
    "isActive": true
  },
  {
    "email": "parent.251p2307@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Pai",
    "studentId": "251P2307",
    "isActive": true
  },
  {
    "email": "parent.261p3187@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Deshpande",
    "studentId": "261P3187",
    "isActive": true
  },
  {
    "email": "parent.251p1015@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Sharma",
    "studentId": "251P1015",
    "isActive": true
  },
  {
    "email": "parent.251p1741@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Chavan",
    "studentId": "251P1741",
    "isActive": true
  },
  {
    "email": "parent.221s1039@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Rao",
    "studentId": "221S1039",
    "isActive": true
  },
  {
    "email": "parent.241s1389@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Joshi",
    "studentId": "241S1389",
    "isActive": true
  },
  {
    "email": "parent.251p1441@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Vyas",
    "studentId": "251P1441",
    "isActive": true
  },
  {
    "email": "parent.261p3235@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Chavan",
    "studentId": "261P3235",
    "isActive": true
  },
  {
    "email": "parent.251p2396@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Bhat",
    "studentId": "251P2396",
    "isActive": true
  },
  {
    "email": "parent.261p3533@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Vyas",
    "studentId": "261P3533",
    "isActive": true
  },
  {
    "email": "parent.261p4231@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Pai",
    "studentId": "261P4231",
    "isActive": true
  },
  {
    "email": "parent.251p2521@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Sastry",
    "studentId": "251P2521",
    "isActive": true
  },
  {
    "email": "parent.261p3089@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Bhat",
    "studentId": "261P3089",
    "isActive": true
  },
  {
    "email": "parent.221s1023@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Sharma",
    "studentId": "221S1023",
    "isActive": true
  },
  {
    "email": "parent.251p1128@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Gowda",
    "studentId": "251P1128",
    "isActive": true
  },
  {
    "email": "parent.251s1018@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Bhat",
    "studentId": "251S1018",
    "isActive": true
  },
  {
    "email": "parent.261p3648@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ananth Joshi",
    "studentId": "261P3648",
    "isActive": true
  },
  {
    "email": "parent.261p3721@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Reddy",
    "studentId": "261P3721",
    "isActive": true
  },
  {
    "email": "parent.251p1067@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Joshi",
    "studentId": "251P1067",
    "isActive": true
  },
  {
    "email": "parent.241s1626@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Hegde",
    "studentId": "241S1626",
    "isActive": true
  },
  {
    "email": "parent.261p3306@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Shenoy",
    "studentId": "261P3306",
    "isActive": true
  },
  {
    "email": "parent.251p1274@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Sharma",
    "studentId": "251P1274",
    "isActive": true
  },
  {
    "email": "parent.261p3028@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Chavan",
    "studentId": "261P3028",
    "isActive": true
  },
  {
    "email": "parent.261p3070@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Aithal",
    "studentId": "261P3070",
    "isActive": true
  },
  {
    "email": "parent.261p3375@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Joshi",
    "studentId": "261P3375",
    "isActive": true
  },
  {
    "email": "parent.261s1008@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Shenoy",
    "studentId": "261S1008",
    "isActive": true
  },
  {
    "email": "parent.261s1103@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Acharya",
    "studentId": "261S1103",
    "isActive": true
  },
  {
    "email": "parent.261p3318@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vyas",
    "studentId": "261P3318",
    "isActive": true
  },
  {
    "email": "parent.241s1002@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Hegde",
    "studentId": "241S1002",
    "isActive": true
  },
  {
    "email": "parent.241s1514@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Devendra Chavan",
    "studentId": "241S1514",
    "isActive": true
  },
  {
    "email": "parent.221s1054@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Hegde",
    "studentId": "221S1054",
    "isActive": true
  },
  {
    "email": "parent.261p3264@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Sharma",
    "studentId": "261P3264",
    "isActive": true
  },
  {
    "email": "parent.231s1009@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Sharma",
    "studentId": "231S1009",
    "isActive": true
  },
  {
    "email": "parent.261p3042@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Naidu",
    "studentId": "261P3042",
    "isActive": true
  },
  {
    "email": "parent.261p3276@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Reddy",
    "studentId": "261P3276",
    "isActive": true
  },
  {
    "email": "parent.261s1018@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Kulkarni",
    "studentId": "261S1018",
    "isActive": true
  },
  {
    "email": "parent.261p3866@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Sharma",
    "studentId": "261P3866",
    "isActive": true
  },
  {
    "email": "parent.261p3178@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Sharma",
    "studentId": "261P3178",
    "isActive": true
  },
  {
    "email": "parent.241s1832@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Hegde",
    "studentId": "241S1832",
    "isActive": true
  },
  {
    "email": "parent.261p4222@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Rao",
    "studentId": "261P4222",
    "isActive": true
  },
  {
    "email": "parent.261p3662@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Pai",
    "studentId": "261P3662",
    "isActive": true
  },
  {
    "email": "parent.261p4156@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Deshpande",
    "studentId": "261P4156",
    "isActive": true
  },
  {
    "email": "parent.261p3751@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Karan Chavan",
    "studentId": "261P3751",
    "isActive": true
  },
  {
    "email": "parent.251p1815@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Hegde",
    "studentId": "251P1815",
    "isActive": true
  },
  {
    "email": "parent.251p2022@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Prabhu",
    "studentId": "251P2022",
    "isActive": true
  },
  {
    "email": "parent.261s1104@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Reddy",
    "studentId": "261S1104",
    "isActive": true
  },
  {
    "email": "parent.261p4008@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Vyas",
    "studentId": "261P4008",
    "isActive": true
  },
  {
    "email": "parent.261p3068@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Chavan",
    "studentId": "261P3068",
    "isActive": true
  },
  {
    "email": "parent.261p3688@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Sharma",
    "studentId": "261P3688",
    "isActive": true
  },
  {
    "email": "parent.251p1744@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Sastry",
    "studentId": "251P1744",
    "isActive": true
  },
  {
    "email": "parent.261p3197@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Aithal",
    "studentId": "261P3197",
    "isActive": true
  },
  {
    "email": "parent.251p1036@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Deshpande",
    "studentId": "251P1036",
    "isActive": true
  },
  {
    "email": "parent.261p3156@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Deshpande",
    "studentId": "261P3156",
    "isActive": true
  },
  {
    "email": "parent.261p3946@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Chavan",
    "studentId": "261P3946",
    "isActive": true
  },
  {
    "email": "parent.261p4077@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Joshi",
    "studentId": "261P4077",
    "isActive": true
  },
  {
    "email": "parent.261p3382@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Rao",
    "studentId": "261P3382",
    "isActive": true
  },
  {
    "email": "parent.261p3595@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Vyas",
    "studentId": "261P3595",
    "isActive": true
  },
  {
    "email": "parent.241s1618@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Prabhu",
    "studentId": "241S1618",
    "isActive": true
  },
  {
    "email": "parent.261p3120@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rakesh Bhat",
    "studentId": "261P3120",
    "isActive": true
  },
  {
    "email": "parent.261p3417@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Srinivas Deshpande",
    "studentId": "261P3417",
    "isActive": true
  },
  {
    "email": "parent.241s1284@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Naidu",
    "studentId": "241S1284",
    "isActive": true
  },
  {
    "email": "parent.261p4161@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Sharma",
    "studentId": "261P4161",
    "isActive": true
  },
  {
    "email": "parent.261p3505@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Gowda",
    "studentId": "261P3505",
    "isActive": true
  },
  {
    "email": "parent.261p3514@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Pai",
    "studentId": "261P3514",
    "isActive": true
  },
  {
    "email": "parent.251p1594@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Sastry",
    "studentId": "251P1594",
    "isActive": true
  },
  {
    "email": "parent.251p1190@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Satish Vyas",
    "studentId": "251P1190",
    "isActive": true
  },
  {
    "email": "parent.251p1748@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Acharya",
    "studentId": "251P1748",
    "isActive": true
  },
  {
    "email": "parent.241s1107@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Chavan",
    "studentId": "241S1107",
    "isActive": true
  },
  {
    "email": "parent.261p4059@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Acharya",
    "studentId": "261P4059",
    "isActive": true
  },
  {
    "email": "parent.261p3155@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Vaid",
    "studentId": "261P3155",
    "isActive": true
  },
  {
    "email": "parent.241s1451@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Pai",
    "studentId": "241S1451",
    "isActive": true
  },
  {
    "email": "parent.251p1115@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Deshpande",
    "studentId": "251P1115",
    "isActive": true
  },
  {
    "email": "parent.251p1158@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prakash Vyas",
    "studentId": "251P1158",
    "isActive": true
  },
  {
    "email": "parent.261p3448@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Acharya",
    "studentId": "261P3448",
    "isActive": true
  },
  {
    "email": "parent.261s1062@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Joshi",
    "studentId": "261S1062",
    "isActive": true
  },
  {
    "email": "parent.241s1006@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vaid",
    "studentId": "241S1006",
    "isActive": true
  },
  {
    "email": "parent.261s1039@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ashok Bhat",
    "studentId": "261S1039",
    "isActive": true
  },
  {
    "email": "parent.261s1043@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Manoj Joshi",
    "studentId": "261S1043",
    "isActive": true
  },
  {
    "email": "parent.241s1019@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ajay Bhat",
    "studentId": "241S1019",
    "isActive": true
  },
  {
    "email": "parent.251s1736@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Aithal",
    "studentId": "251S1736",
    "isActive": true
  },
  {
    "email": "parent.251s1640@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Acharya",
    "studentId": "251S1640",
    "isActive": true
  },
  {
    "email": "parent.251s1324@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sanjay Vyas",
    "studentId": "251S1324",
    "isActive": true
  },
  {
    "email": "parent.251s1338@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Vijay Naidu",
    "studentId": "251S1338",
    "isActive": true
  },
  {
    "email": "parent.261s1029@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Anil Pai",
    "studentId": "261S1029",
    "isActive": true
  },
  {
    "email": "parent.261s1045@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Hegde",
    "studentId": "261S1045",
    "isActive": true
  },
  {
    "email": "parent.261s1091@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Gowda",
    "studentId": "261S1091",
    "isActive": true
  },
  {
    "email": "parent.251s1925@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Vaid",
    "studentId": "251S1925",
    "isActive": true
  },
  {
    "email": "parent.261p3627@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Joshi",
    "studentId": "261P3627",
    "isActive": true
  },
  {
    "email": "parent.261p3768@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kiran Pai",
    "studentId": "261P3768",
    "isActive": true
  },
  {
    "email": "parent.261s1028@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Shivakumar Prabhu",
    "studentId": "261S1028",
    "isActive": true
  },
  {
    "email": "parent.241s1253@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mahesh Bhat",
    "studentId": "241S1253",
    "isActive": true
  },
  {
    "email": "parent.261p3884@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Aithal",
    "studentId": "261P3884",
    "isActive": true
  },
  {
    "email": "parent.261s1072@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Rajendra Bhat",
    "studentId": "261S1072",
    "isActive": true
  },
  {
    "email": "parent.261p3339@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Gowda",
    "studentId": "261P3339",
    "isActive": true
  },
  {
    "email": "parent.261p4117@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Mohan Kulkarni",
    "studentId": "261P4117",
    "isActive": true
  },
  {
    "email": "parent.261p4307@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Arun Hegde",
    "studentId": "261P4307",
    "isActive": true
  },
  {
    "email": "parent.261p3820@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Kishore Gowda",
    "studentId": "261P3820",
    "isActive": true
  },
  {
    "email": "parent.261p3654@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Nandish Vyas",
    "studentId": "261P3654",
    "isActive": true
  },
  {
    "email": "parent.261s1076@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sandeep Chavan",
    "studentId": "261S1076",
    "isActive": true
  },
  {
    "email": "parent.241s1486@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sudhakar Gowda",
    "studentId": "241S1486",
    "isActive": true
  },
  {
    "email": "parent.261p4075@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Prathap Aithal",
    "studentId": "261P4075",
    "isActive": true
  },
  {
    "email": "parent.251s1982@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Sunil Deshpande",
    "studentId": "251S1982",
    "isActive": true
  },
  {
    "email": "parent.261p3356@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Jagadish Joshi",
    "studentId": "261P3356",
    "isActive": true
  },
  {
    "email": "parent.261p4313@transcend.org",
    "password": "parent123",
    "role": "Parent",
    "name": "Ganesh Joshi",
    "studentId": "261P4313",
    "isActive": true
  }
];

const DEFAULT_DRIVERS: Driver[] = [
  { name: "Devmanjunath M", employeeId: "EMP-DRV-001", phone: "+91 9972444550", assignedVehicle: "KA05AL8080", assignedRoute: "Route Ecco Car", status: "Active" },
  { name: "Raghavendra R", employeeId: "EMP-DRV-002", phone: "+91 8861446172", assignedVehicle: "KA05AL1642", assignedRoute: "Route 01", status: "Active" },
  { name: "Manjunath HR", employeeId: "EMP-DRV-003", phone: "+91 9900565365", assignedVehicle: "KA05AL1645", assignedRoute: "Route 02", status: "Active" },
  { name: "Rajumon", employeeId: "EMP-DRV-004", phone: "+91 9620834936", assignedVehicle: "KA05AL1646", assignedRoute: "Route 03", status: "Active" },
  { name: "Raja K C", employeeId: "EMP-DRV-005", phone: "+91 9901666746", assignedVehicle: "KA05AL1890", assignedRoute: "Route 04", status: "Active" },
  { name: "Bharath Raj N", employeeId: "EMP-DRV-006", phone: "+91 7708350151", assignedVehicle: "KA05AL3112", assignedRoute: "Route 05", status: "Active" },
  { name: "Soma Naik", employeeId: "EMP-DRV-007", phone: "+91 9972337542", assignedVehicle: "KA05AM3317", assignedRoute: "Route 06", status: "Active" },
  { name: "Muni Choodaiah B M", employeeId: "EMP-DRV-008", phone: "+91 9972133327", assignedVehicle: "KA05AM3318", assignedRoute: "Route 07", status: "Active" },
  { name: "Saibanna", employeeId: "EMP-DRV-009", phone: "+91 9164926837", assignedVehicle: "KA05AM4927", assignedRoute: "Route 08", status: "Active" },
  { name: "Srinivasa", employeeId: "EMP-DRV-010", phone: "+91 9739539233", assignedVehicle: "KA05AM3881", assignedRoute: "Route 09", status: "Active" },
  { name: "Sumanth G C", employeeId: "EMP-DRV-011", phone: "+91 8296801580", assignedVehicle: "KA05AM5541", assignedRoute: "Route 10", status: "Active" },
  { name: "Nagaraju N", employeeId: "EMP-DRV-012", phone: "+91 9535085330", assignedVehicle: "KA05AM8222", assignedRoute: "Route 11", status: "Active" },
  { name: "Parthasarathi", employeeId: "EMP-DRV-013", phone: "+91 7406050424", assignedVehicle: "KA05AP0787", assignedRoute: "Route 12", status: "Active" },
  { name: "Raju B", employeeId: "EMP-DRV-014", phone: "+91 9980957119", assignedVehicle: "KA05AP0786", assignedRoute: "Route 13", status: "Active" },
  { name: "Manjunatha K", employeeId: "EMP-DRV-015", phone: "+91 8105980947", assignedVehicle: "KA05AP0785", assignedRoute: "Route 14", status: "Active" },
  { name: "Naveen M", employeeId: "EMP-DRV-016", phone: "+91 9481845727", assignedVehicle: "KA05AP0788", assignedRoute: "Route 15", status: "Active" },
  { name: "Umesh N", employeeId: "EMP-DRV-017", phone: "+91 9738447755", assignedVehicle: "KA05AP1551", assignedRoute: "Route 16", status: "Active" },
  { name: "Venkateshreddy", employeeId: "EMP-DRV-018", phone: "+91 9886231563", assignedVehicle: "KA05AP1550", assignedRoute: "Route 17", status: "Active" },
  { name: "Santhosh Kumar C", employeeId: "EMP-DRV-019", phone: "+91 9980908010", assignedVehicle: "KA05AP1725", assignedRoute: "Route 18", status: "Active" },
  { name: "Jai Kumar", employeeId: "EMP-DRV-020", phone: "+91 7760832939", assignedVehicle: "KA05AQ6799", assignedRoute: "Route 19", status: "Active" },
  { name: "Ananda M", employeeId: "EMP-DRV-021", phone: "+91 9741605925", assignedVehicle: "KA05AQ6798", assignedRoute: "Route 20", status: "Active" },
  { name: "Deepak S", employeeId: "EMP-DRV-022", phone: "+91 8073493899", assignedVehicle: "KA05AQ6625", assignedRoute: "Route 21", status: "Active" },
  { name: "Vinod I D", employeeId: "EMP-DRV-023", phone: "+91 8197225717", assignedVehicle: "KA05AQ6624", assignedRoute: "Route 22", status: "Active" },
  { name: "Girish D R", employeeId: "EMP-DRV-024", phone: "+91 8197679255", assignedVehicle: "KA05AQ7289", assignedRoute: "Route 23", status: "Active" },
  { name: "Sudhakara C", employeeId: "EMP-DRV-025", phone: "+91 8088077759", assignedVehicle: "KA05AQ7927", assignedRoute: "Route 24", status: "Active" },
  { name: "Mahalinga N", employeeId: "EMP-DRV-026", phone: "+91 6361762727", assignedVehicle: "KA05AS3154", assignedRoute: "Route 25", status: "Active" },
  { name: "Shivakumar T M", employeeId: "EMP-DRV-027", phone: "+91 9019055383", assignedVehicle: "KA05AS3155", assignedRoute: "Route 26", status: "Active" },
  { name: "Tejas Kumar K S", employeeId: "EMP-DRV-028", phone: "+91 7338319603", assignedVehicle: "KA05AS4439", assignedRoute: "Route 27", status: "Active" }
];

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    "vehicleNumber": "KA-53-F-1234",
    "registrationNumber": "REGKA53F1234",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manjunath Gowda",
    "routeAssigned": "Route 1",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-01-XX-0020",
    "registrationNumber": "REGKA01XX0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vihaan Gowda",
    "routeAssigned": "Route 1",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-01-XX-0000",
    "registrationNumber": "REGKA01XX0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Aditya Gowda",
    "routeAssigned": "Route 1",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-02-XX-0002",
    "registrationNumber": "REGKA02XX0002",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manjunath Gowda",
    "routeAssigned": "Route 2",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-03-M-5678",
    "registrationNumber": "REGKA03M5678",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Satish Kumar",
    "routeAssigned": "Route 2",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-02-XX-0011",
    "registrationNumber": "REGKA02XX0011",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ramesh Gowda",
    "routeAssigned": "Route 2",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-02-XX-0000",
    "registrationNumber": "REGKA02XX0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Sandeep Gowda",
    "routeAssigned": "Route 2",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-51-AB-9999",
    "registrationNumber": "REGKA51AB9999",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Ramesh Naik",
    "routeAssigned": "Route 3",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-03-XX-0016",
    "registrationNumber": "REGKA03XX0016",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manoj Gowda",
    "routeAssigned": "Route 3",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-03-XX-0018",
    "registrationNumber": "REGKA03XX0018",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Arun Gowda",
    "routeAssigned": "Route 3",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-03-XX-0000",
    "registrationNumber": "REGKA03XX0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Ajay Gowda",
    "routeAssigned": "Route 3",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-04-XX-0002",
    "registrationNumber": "REGKA04XX0002",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vikram Gowda",
    "routeAssigned": "Route 4",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-04-XX-0009",
    "registrationNumber": "REGKA04XX0009",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Deepak Gowda",
    "routeAssigned": "Route 4",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-04-XX-0011",
    "registrationNumber": "REGKA04XX0011",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Rajesh Gowda",
    "routeAssigned": "Route 4",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-04-XX-0023",
    "registrationNumber": "REGKA04XX0023",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Bhaskar Gowda",
    "routeAssigned": "Route 4",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-04-XX-0000",
    "registrationNumber": "REGKA04XX0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Narayana Gowda",
    "routeAssigned": "Route 4",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-05-AB-0005",
    "registrationNumber": "REGKA05AB0005",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Suresh Gowda",
    "routeAssigned": "Route 5",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-05-AB-0009",
    "registrationNumber": "REGKA05AB0009",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Amit Gowda",
    "routeAssigned": "Route 5",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-05-AB-0010",
    "registrationNumber": "REGKA05AB0010",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Karan Gowda",
    "routeAssigned": "Route 5",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-05-AB-0000",
    "registrationNumber": "REGKA05AB0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Devendra Gowda",
    "routeAssigned": "Route 5",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0002",
    "registrationNumber": "REGKA06CD0002",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Prasad Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0007",
    "registrationNumber": "REGKA06CD0007",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Harish Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0009",
    "registrationNumber": "REGKA06CD0009",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Gopal Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0012",
    "registrationNumber": "REGKA06CD0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sanjay Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0022",
    "registrationNumber": "REGKA06CD0022",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Anil Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-06-CD-0000",
    "registrationNumber": "REGKA06CD0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Sunil Gowda",
    "routeAssigned": "Route 6",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0007",
    "registrationNumber": "REGKA07EF0007",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vijay Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0008",
    "registrationNumber": "REGKA07EF0008",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ashok Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0012",
    "registrationNumber": "REGKA07EF0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Kishore Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0013",
    "registrationNumber": "REGKA07EF0013",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Prathap Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0016",
    "registrationNumber": "REGKA07EF0016",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Mohan Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-07-EF-0000",
    "registrationNumber": "REGKA07EF0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Shivakumar Gowda",
    "routeAssigned": "Route 7",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-08-GH-0008",
    "registrationNumber": "REGKA08GH0008",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Nandish Gowda",
    "routeAssigned": "Route 8",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-08-GH-0009",
    "registrationNumber": "REGKA08GH0009",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Kiran Gowda",
    "routeAssigned": "Route 8",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-08-GH-0013",
    "registrationNumber": "REGKA08GH0013",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sudhakar Gowda",
    "routeAssigned": "Route 8",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-08-GH-0000",
    "registrationNumber": "REGKA08GH0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Rajendra Gowda",
    "routeAssigned": "Route 8",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-09-IJ-0002",
    "registrationNumber": "REGKA09IJ0002",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Jagadish Gowda",
    "routeAssigned": "Route 9",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-09-IJ-0000",
    "registrationNumber": "REGKA09IJ0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Ananth Gowda",
    "routeAssigned": "Route 9",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-10-KL-0010",
    "registrationNumber": "REGKA10KL0010",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ganesh Gowda",
    "routeAssigned": "Route 10",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-10-KL-0000",
    "registrationNumber": "REGKA10KL0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Aarav Kumar",
    "routeAssigned": "Route 10",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-11-MN-0004",
    "registrationNumber": "REGKA11MN0004",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vihaan Kumar",
    "routeAssigned": "Route 11",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-11-MN-0000",
    "registrationNumber": "REGKA11MN0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Aditya Kumar",
    "routeAssigned": "Route 11",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-12-OP-0010",
    "registrationNumber": "REGKA12OP0010",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manjunath Kumar",
    "routeAssigned": "Route 12",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-12-OP-0012",
    "registrationNumber": "REGKA12OP0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Satish Kumar",
    "routeAssigned": "Route 12",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-12-OP-0015",
    "registrationNumber": "REGKA12OP0015",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ramesh Kumar",
    "routeAssigned": "Route 12",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-12-OP-0023",
    "registrationNumber": "REGKA12OP0023",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sandeep Kumar",
    "routeAssigned": "Route 12",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-12-OP-0000",
    "registrationNumber": "REGKA12OP0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Alok Kumar",
    "routeAssigned": "Route 12",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-13-QR-0001",
    "registrationNumber": "REGKA13QR0001",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manoj Kumar",
    "routeAssigned": "Route 13",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-13-QR-0005",
    "registrationNumber": "REGKA13QR0005",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Arun Kumar",
    "routeAssigned": "Route 13",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-13-QR-0013",
    "registrationNumber": "REGKA13QR0013",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ajay Kumar",
    "routeAssigned": "Route 13",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-13-QR-0000",
    "registrationNumber": "REGKA13QR0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Vikram Kumar",
    "routeAssigned": "Route 13",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-14-ST-0014",
    "registrationNumber": "REGKA14ST0014",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Deepak Kumar",
    "routeAssigned": "Route 14",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-14-ST-0000",
    "registrationNumber": "REGKA14ST0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Rajesh Kumar",
    "routeAssigned": "Route 14",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-15-UV-0012",
    "registrationNumber": "REGKA15UV0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Bhaskar Kumar",
    "routeAssigned": "Route 15",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-15-UV-0015",
    "registrationNumber": "REGKA15UV0015",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Narayana Kumar",
    "routeAssigned": "Route 15",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-15-UV-0000",
    "registrationNumber": "REGKA15UV0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Suresh Kumar",
    "routeAssigned": "Route 15",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-16-WX-0016",
    "registrationNumber": "REGKA16WX0016",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Amit Kumar",
    "routeAssigned": "Route 16",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-16-WX-0017",
    "registrationNumber": "REGKA16WX0017",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Karan Kumar",
    "routeAssigned": "Route 16",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-16-WX-0020",
    "registrationNumber": "REGKA16WX0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Devendra Kumar",
    "routeAssigned": "Route 16",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-16-WX-0000",
    "registrationNumber": "REGKA16WX0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Prasad Kumar",
    "routeAssigned": "Route 16",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-17-YZ-0006",
    "registrationNumber": "REGKA17YZ0006",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Harish Kumar",
    "routeAssigned": "Route 17",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-17-YZ-0019",
    "registrationNumber": "REGKA17YZ0019",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Gopal Kumar",
    "routeAssigned": "Route 17",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-17-YZ-0000",
    "registrationNumber": "REGKA17YZ0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Sanjay Kumar",
    "routeAssigned": "Route 17",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-18-BC-0016",
    "registrationNumber": "REGKA18BC0016",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Anil Kumar",
    "routeAssigned": "Route 18",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-18-BC-0018",
    "registrationNumber": "REGKA18BC0018",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sunil Kumar",
    "routeAssigned": "Route 18",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-18-BC-0000",
    "registrationNumber": "REGKA18BC0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Vijay Kumar",
    "routeAssigned": "Route 18",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-19-DF-0003",
    "registrationNumber": "REGKA19DF0003",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ashok Kumar",
    "routeAssigned": "Route 19",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-19-DF-0019",
    "registrationNumber": "REGKA19DF0019",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Kishore Kumar",
    "routeAssigned": "Route 19",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-19-DF-0020",
    "registrationNumber": "REGKA19DF0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Prathap Kumar",
    "routeAssigned": "Route 19",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-19-DF-0000",
    "registrationNumber": "REGKA19DF0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Mohan Kumar",
    "routeAssigned": "Route 19",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-20-FG-0018",
    "registrationNumber": "REGKA20FG0018",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Shivakumar Kumar",
    "routeAssigned": "Route 20",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-20-FG-0020",
    "registrationNumber": "REGKA20FG0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Nandish Kumar",
    "routeAssigned": "Route 20",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-20-FG-0024",
    "registrationNumber": "REGKA20FG0024",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Kiran Kumar",
    "routeAssigned": "Route 20",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-20-FG-0000",
    "registrationNumber": "REGKA20FG0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Sudhakar Kumar",
    "routeAssigned": "Route 20",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-21-HJ-0001",
    "registrationNumber": "REGKA21HJ0001",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Rajendra Kumar",
    "routeAssigned": "Route 21",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-21-HJ-0012",
    "registrationNumber": "REGKA21HJ0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Jagadish Kumar",
    "routeAssigned": "Route 21",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-21-HJ-0015",
    "registrationNumber": "REGKA21HJ0015",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ananth Kumar",
    "routeAssigned": "Route 21",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-21-HJ-0021",
    "registrationNumber": "REGKA21HJ0021",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ganesh Kumar",
    "routeAssigned": "Route 21",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-21-HJ-0000",
    "registrationNumber": "REGKA21HJ0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Aarav Naik",
    "routeAssigned": "Route 21",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-22-JK-0012",
    "registrationNumber": "REGKA22JK0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vihaan Naik",
    "routeAssigned": "Route 22",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-22-JK-0022",
    "registrationNumber": "REGKA22JK0022",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Aditya Naik",
    "routeAssigned": "Route 22",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-22-JK-0000",
    "registrationNumber": "REGKA22JK0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Manjunath Naik",
    "routeAssigned": "Route 22",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-23-LM-0012",
    "registrationNumber": "REGKA23LM0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Satish Naik",
    "routeAssigned": "Route 23",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-23-LM-0021",
    "registrationNumber": "REGKA23LM0021",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ramesh Naik",
    "routeAssigned": "Route 23",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-23-LM-0023",
    "registrationNumber": "REGKA23LM0023",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sandeep Naik",
    "routeAssigned": "Route 23",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-23-LM-0000",
    "registrationNumber": "REGKA23LM0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Alok Naik",
    "routeAssigned": "Route 23",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-24-NP-0003",
    "registrationNumber": "REGKA24NP0003",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Manoj Naik",
    "routeAssigned": "Route 24",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-24-NP-0006",
    "registrationNumber": "REGKA24NP0006",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Arun Naik",
    "routeAssigned": "Route 24",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-24-NP-0020",
    "registrationNumber": "REGKA24NP0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Ajay Naik",
    "routeAssigned": "Route 24",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-24-NP-0024",
    "registrationNumber": "REGKA24NP0024",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vikram Naik",
    "routeAssigned": "Route 24",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-24-NP-0000",
    "registrationNumber": "REGKA24NP0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Deepak Naik",
    "routeAssigned": "Route 24",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-25-PR-0006",
    "registrationNumber": "REGKA25PR0006",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Rajesh Naik",
    "routeAssigned": "Route 25",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-25-PR-0008",
    "registrationNumber": "REGKA25PR0008",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Bhaskar Naik",
    "routeAssigned": "Route 25",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-25-PR-0020",
    "registrationNumber": "REGKA25PR0020",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Narayana Naik",
    "routeAssigned": "Route 25",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-25-PR-0024",
    "registrationNumber": "REGKA25PR0024",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Suresh Naik",
    "routeAssigned": "Route 25",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-25-PR-0000",
    "registrationNumber": "REGKA25PR0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Amit Naik",
    "routeAssigned": "Route 25",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-26-RS-0009",
    "registrationNumber": "REGKA26RS0009",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Karan Naik",
    "routeAssigned": "Route 26",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-26-RS-0012",
    "registrationNumber": "REGKA26RS0012",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Devendra Naik",
    "routeAssigned": "Route 26",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-26-RS-0000",
    "registrationNumber": "REGKA26RS0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Prasad Naik",
    "routeAssigned": "Route 26",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-27-TV-0003",
    "registrationNumber": "REGKA27TV0003",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Harish Naik",
    "routeAssigned": "Route 27",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-27-TV-0016",
    "registrationNumber": "REGKA27TV0016",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Gopal Naik",
    "routeAssigned": "Route 27",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-27-TV-0017",
    "registrationNumber": "REGKA27TV0017",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sanjay Naik",
    "routeAssigned": "Route 27",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-27-TV-0000",
    "registrationNumber": "REGKA27TV0000",
    "vehicleModel": "Swaraj Mazda 40-Seater",
    "seatingCapacity": 40,
    "driverAssigned": "Anil Naik",
    "routeAssigned": "Route 27",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-99-CAR-0001",
    "registrationNumber": "REGKA99CAR0001",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Sunil Naik",
    "routeAssigned": "Route Car",
    "status": "Active"
  },
  {
    "vehicleNumber": "KA-99-ECCO-0001",
    "registrationNumber": "REGKA99ECCO0001",
    "vehicleModel": "Force Traveller 15-Seater",
    "seatingCapacity": 15,
    "driverAssigned": "Vijay Naik",
    "routeAssigned": "Route Ecco",
    "status": "Active"
  }
];

const DEFAULT_ROUTES: Route[] = [
  {
    "routeName": "Route 1",
    "startingPoint": "Basavanagudi",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-53-F-1234",
    "assignedDriver": "Manjunath Gowda",
    "stops": [
      {
        "stopName": "Basavangudi Ratna Villas Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Pai Vista Convention Hall( HDFC BANK)",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jains Prakriti apartment, kanakpura road",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "JSS High School",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near NMH hotel",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to Bajaj Popular Showroom",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shoba Apartment, Indhra Gandhi Circle",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SLJ iyengar bakery",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sobha Dewflower Apartments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "VV Puram jain Temple",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "VV Puram Middle School Road",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vybhav Enclave Vanivilas Road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 2",
    "startingPoint": "Chikkalasandra",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-02-XX-0002",
    "assignedDriver": "Manjunath Gowda",
    "stops": [
      {
        "stopName": "#53, 6th Main Road, KSRTC Layout Chikkalasandra",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "005, Sumukha Simhadri Springs, Uttarahalli Main Road(Only Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "12 B Bus Stop Pama padmanabhanagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adjacent to sobha clovelly, Gowdanapalya, Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Agarwal eye hospital , Padmanabhanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "bangalore international public school Uttarahalli main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Jnana Vignana padmanabhanagar, Patel Medical",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade Komarla Apartment, Chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brindavan apartments back gate, Uttarahalli opp tp vishal mart",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Chartered Madhura, Near Nano hospital uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ibaco Ice, Uttarahalli main raod",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kadrinahalli Indian Oil Petrol Bunk",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kidney Foundation padmanabhanagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "maharaja agrasen hospital padmanabhanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bangalore International school",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Lakshmi temple Desai garden",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Lenskart, Padmanabhanagar, Patel Medical",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Maharaja Agrasena Hospital, Padmanabhanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near max show room uttarahalli main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Patel Medical kindny foundtion",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Patel Medical Padmanabhanagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal Mart,Padmanabha Nagar Bangalore",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royalmart Supermarket Padmanabhanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shaneshwara Swamy Temple, Chikkalasandra Main Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Infiniti Uttarahalli",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vedanta college",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vishal Mart, Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yoganada Hospital PB Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yogananada Hospital Padmanbhanagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 3",
    "startingPoint": "Arekere Mico Layout",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-51-AB-9999",
    "assignedDriver": "Ramesh Naik",
    "stops": [
      {
        "stopName": "Subramanya Temple Arekere Mico Layout,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(Aaradhana School) S J R LUXURIA",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(Aaradhana School)IRIS SURYA APARTMENT,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(GR Lavender)milestone apartment ,",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adarsh Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adarsha Apartment,Tuesday and Thursday drop at Career Launcher, Jayanagar 4th Block",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adishiwara Super market, Panduranga Nagar",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Apollo hospital back gate, 4th Phase, JP Nagar",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind cake shop, Tyre factory road, D mart Ready Pickup",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Giffi Kidz Preschool In JP Nagar 8th phase RenukaYellamma Temple",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "GR lavender Apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "GR Lavender apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "J. P. Nagar,yengar Bakery and Ragav diagnostics, Gavrou Nagar Amma's pastric cake shop",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lyengar Bakery, Shreyas Colony",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "M S Ramaiah City ( Halli Thota )",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Medplus Ramaiah City,(Halli Thota )",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "MS Ramaiah City Layout, JP Nagar 7th Phase, Bengaluru, Karnataka",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Adarsh Apartment Panduranga Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Apolo Pharmacy, JP Nagar 7th Phase, Arekere",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Aradhana Academy",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near aradhana school",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bescom Office( Beakery)",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Sjr luxuria apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next To Appollo Pharmacy Sai Enclave JP Nagar 7th Phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nisha Fitness",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ramaiah south City",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "S.R. Residency, Arekere MICO Layout 2nd stage",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "sai enclave ,near ms Ramaiah city road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Enclave, M.S.Ramaiah city, 7th phase, JP Nagar",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Enclave, MS Ramaiah City Main Rd",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SJR LUXURIA appts, Arkere mico layout",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SLV symphony apartment 7th phase J.P.Nagar Chunchghatta main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SLV Synfony",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Krishna vaibhava grand, Anjaneya Temple, Chunchgatta",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Whispering Winds, MS Ramaiah City Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 17",
    "startingPoint": "Arakere",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-17-YZ-0006",
    "assignedDriver": "Harish Kumar",
    "stops": [
      {
        "stopName": "Arkera BDA 80Feet Road Sai Baba temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SHREE ENCLAVE LAYOUT, NYANAPPANAH DLF",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#12,Siri,9th main,Chamundeshwarinagar,Begur Bande park",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "A 2604, Queensgate, House of Hiranandani, Akshaynagar",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bharath petrol pump",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BTM 4th stg. Next to Green Orchards apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DLF Union Bank Akshayanagara,Bangalore-",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DLF Newtown, Akshayanagar",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DLF Road Apollo Pharmacy",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dlf town circle, begur hulimavu road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DLF Westend Heights, DLF New Town, Akshaya Nag",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "G004, Niranjan Maxima Apt Sai Baba Road, Arekere,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hiranandani Hill Crest Rd, Akshaya Gardens, Akshayanagar, Bengaluru, Karnataka 560114",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hiranandani, Apartment",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hiranandhini Apartment",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Keya Springs, 80 ft road, Arekere Sai baba temple road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Arekere RTO",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near DLF Akshaynagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near KA51 RTO",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Maruthi Enterprises (Kent Authorised dealer), Indira Gandhi Housing Colony, Arekere, Sai baba temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near RTO office, Devarachikkanahalli Rd",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Stone Park",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp Dominos Pizza, Nyanappana Halli, Hulimavu",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to Mayura Bakery Sai Baba Temple Road 80 Feet Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to Stone Park/playground",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Baba Temple Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Baba Temple Road,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Saibaba temple road 80feet road hulimamu road, Suraksha Landmark Apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Saptagiri Splendor, Opp RTO , D.C. main road, Bangalore BTM 4th stage",
        "arrivalTime": "7:42 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SHANTHINIKETAN LAYOUT Sai Baba Road ARAKERE BG ROAD",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Stone Park, Devarachikkanahalli Main Road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Stone park, Devarachikkanahalli",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yelenahalli Main Rd, DLF Newtown, Akshayanagar",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 4",
    "startingPoint": "Kumaraswamy Layout",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-04-XX-0002",
    "assignedDriver": "Vikram Gowda",
    "stops": [
      {
        "stopName": "(Pick Up)Near Canara bank, ISRO Layout and (Drop)Bunnies day care ISRO layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#3903, 13th Main, Kumaraswamy Layout,",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ayyapa Swamy Temple(Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bakery Road Near Padma Madam House",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Canara bank Kumarswamy Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "ISRO Layout Park",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kaderenahalli Indian Oil Petrol Bunk",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kadrenhalli petrol pump",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kardrenahalli petrol bunk silcon honda showroom",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kumarswamy layout, 15 F bustop road, Near Domino's pizza(Drop Only)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kumarswamy layout, water tank Stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near baby choice subramanyapura road(Kardrenahalli Circle)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Canara Bank",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "No 702, 23 cross, 1 st stage, kumarawamy layout(DROP)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SBI Bank",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Seva park, samvruddi layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Upinakai Road(DROP)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Appolo Pharmacy, Kumarswamy Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bhuvaneshwari Nagara Park Back Gate BSK 3rd Stage(Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "nanjappa layout, opposite asha apartment, yelchenhalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near appolo pharmacy kumarswamy layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prarthana School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ganpathipura",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "PICKUP - Apollo pharmacy, kumaraswamy layout, DROP - Podar jumbo kids preschool, ISRO layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dheen Dhayal badminton court or Pranitha condiments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 5",
    "startingPoint": "Chamrajpet",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-05-AB-0005",
    "assignedDriver": "Suresh Gowda",
    "stops": [
      {
        "stopName": "#125 2nd main t r nagar banglore 560028 T r nagar",
        "arrivalTime": "7:44 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#41, 4th Main Road, 6th Cross, 3rd Block, Thyagaraja Nagar,",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "117/9, Nagaraja Layout, Bull temple road, Banglore-19",
        "arrivalTime": "7:34 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "186 4th Floor 3rd Cross 2nd Main Road Chamrajpet Bengaluru -560018",
        "arrivalTime": "7:26 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adarsh College Chamarajpet",
        "arrivalTime": "7:23 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bata Shoe Store, 3rd Cross Rd, Kamalanagar, Chamrajpe",
        "arrivalTime": "7:26 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bata Shoe Store, chamrajpet",
        "arrivalTime": "7:26 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Canara bank Gavipuram Extension",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hanumathnagar, Basavanagudi near Sanjeevani pharma",
        "arrivalTime": "7:26 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "ICICI Bank, Chamrajpet",
        "arrivalTime": "7:37 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kholimane, TR Nagar",
        "arrivalTime": "7:47 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KR road, Shastri bakery(Blue Dart)",
        "arrivalTime": "7:57 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KR Road, Shastry Bakery(Blue Dart)",
        "arrivalTime": "7:57 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mukabika School, T R Nagar",
        "arrivalTime": "7:44 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Kiran Compu solutions, NR Colony, Basavanagudi",
        "arrivalTime": "7:42 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Saraswat bank",
        "arrivalTime": "7:54 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Saraswath Bank, Jayanagar 7th Block",
        "arrivalTime": "7:54 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nearby Leelavatti Multispeciality Hospital( Chamarajpet Bata Showroom)",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "NU Hospital, Padmanabanagar, Bangalore(Uma theater)",
        "arrivalTime": "7:23 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ragoo's hotel, 16, 5th B Main road, k r road, Basavanagudi, Bangalore",
        "arrivalTime": "7:52 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "shani mahatma templ TR Nagar",
        "arrivalTime": "7:47 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shri Dattatreya Swamy Temple",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Bvss Maratha Student’s Home, rayan circle",
        "arrivalTime": "7:33 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Thyagarajanagar Chaitanya clinic",
        "arrivalTime": "7:44 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "uma maheshwari temple kr road",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 6",
    "startingPoint": "Doddakallasandra",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-06-CD-0002",
    "assignedDriver": "Prasad Gowda",
    "stops": [
      {
        "stopName": "Behind Gajanan apartment, Indra Canteen Vasanthapura(Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "gokulam apartments, doddakalasandra",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kanti Sweets Doddakalandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity Gate 1",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity gate3",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity get 2",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity get 3",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity, Gate No2",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity, Gate No2, Near Doddakallasandra Metro Station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near arunodaya public school, Samastha Hospitals Pvt Ltd uttarahalli main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Vasanth Vallabha Temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pipline road vedanta college",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Falcon city",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Falcon City",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Lake Ridge",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige lake Ridge",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "prestige Lakeridge",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "shree sai palace, doddakallasandra, Drop only",
        "arrivalTime": "drop",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Big Market kanakapura road",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Uttarahalli circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vasanthapura Main Rd indra canteen",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yadalamma nagar bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yadallamma nagar bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Yadalum nagar bus stop",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Raja Gardenia Arch, Turahalli, Subramanyapura.",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Raja Gardenia opp Thurahalli Govt. School,goulk milk parlour",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Serenity Doddakallasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elegant Embassey near Subramanyapura lake on Turahalli Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 7",
    "startingPoint": "Vajarahalli",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-07-EF-0007",
    "assignedDriver": "Vijay Gowda",
    "stops": [
      {
        "stopName": "#101 vajarahalli, Shivaganga galax",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Axis bank, narayana nagar 1st Block, doddakallasandra",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "balamuri ganesha temple or asian international public school, Bayanpalya, Balaji Layout, Raghuvanahalli",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind IndusInd Bank, RMS International",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Krishnam Udupi hotel , Opposite to Narayana clinic",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Krishnam udupi hotel opposite to Narayana clinic",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BehindPVR Superplex Forum Mall South Bengaluru",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Car Washing Center, Ganarapalya",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Doadakallsandra kumaran's school",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Friendly Tails Pet Clinic, iberty Square Apartment, Raghunalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "garbagruha hospital Doddakallasandhra",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kirshna Temple",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KSIT college, Near Zymus hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Manjunath Medical Shop",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Manjunath Pharmacy",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Manjunatha Medical Shop",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "nammura hotel doddakallasandra",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Namura Uppahar, Doddakalasandra",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Narayan nagar dodakallasandra",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Narayana Nagar 1st Block, Doddakalasandra",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Parjna Bharathi Vidyalaya, Dodakallasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Shobha forest view apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Suraj ganga apartment, bayanpalya",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near to KSIT college, Raghuvanhalli.",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Vajaralli Metro Station, Kanakapura Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp to temple park, Sgs Parkview, Narayana Nagar",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to zymus hospital and before vajarahalli metro station",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shoba Forest Vajarahalli",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sobha Forest View, 100 Feet Rd, off Kanakapura Main Road, Banashankari 6th Stage",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sobha Forest View, Kanakapura Main Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sophia English School,Near D mart kanakapura main road vajarahalli",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Uma Maheshwara Temple road, ISR Uttam Apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vajarahalli, Bangalore City Municipal Corporation Layout, Metro Pillar 227(Drop Only)",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vajrahalli metro station",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Wings 5 apartment, Near Karishma hills",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nitesh Ceaser palace, Opp KSIT",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 8",
    "startingPoint": "JP Nagar",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-08-GH-0008",
    "assignedDriver": "Nandish Gowda",
    "stops": [
      {
        "stopName": "JP Nagar 2nd Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shanthi Park Apartments, Marenahalli Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#325,3rd main, 4th cross 3rd phase j p nagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Central Mall",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "East end",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Green City Hospital Nandhi Hotel Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Inchara Hotel",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jp nagar police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandhi Hotel",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandini lake view apartment, Puttenahalli, Phase 7, J. P. Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Narayana School, J.P.Nagar 5th Phase, Mahaveer Riviera Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Tirumalagiri Venkateshwara Temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to Narayana school, MANJUNATHA MOTORS JP Nagar 7th Phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Brigade Palmsprings",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Phoenix Women and Cardiac Center, KSRTC Layout, 2nd Phase, J. P. Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Puttenhalli circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ragigudda Anjaneya Temple Arch",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal High school,",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal School, 24th Main Road JP Nagar",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "samskruti conventional hall, JP Nagar 7th Phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sana super market, 24th main jp nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Siddeshwara Theater",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Chaitanya PU college , JP Nagar 7th phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Venkateshwara Temple(Central Mall Road)",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 14",
    "startingPoint": "BTM Layout",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-14-ST-0014",
    "assignedDriver": "Deepak Kumar",
    "stops": [
      {
        "stopName": "KEB road/Bangalore one",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": ", 27th Main Rd, BTM LAYOUT,2ND STAGE (Near Ganesh Temple)",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "22 main near play ground MC Donald",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "302, Tulip , Esteem Park, J P Nagar 5th Phase, Rose Garden Road JP Nagar 5th Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "363, 9th main, dolllors colony Jp nagar 4th phase bangalore",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Kesariya Restaurant",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BTM AXA junction",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dolllars Colony, Clearance School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dollors Colony, JP nagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ekya school j.p nagar 3rd phase",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Esteem Park Apartment Back Gate",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Eutopia BTM",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "JP Nagar 4th Phase, Dollars Colony, Kotak Mahindra Bank",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kalyani magnum ESTEEM PARK",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "kalyani magnum Vinayak Nagar Arch",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mahaveer springs apartmen Vinayaka Nagara",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli, (BTM 17th Main home needs super market)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Delmia Signal, eyka school",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near guru medicals, Olive Street Food Cafe - Btm Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near JP Nagar metro station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Purva bellmount apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near vaishnavi terecesses, Dollars Colony, Phase 4, J. P. Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "New Kabab Plaza, 19th Cross Road, NS Palya, BTM Layout 2nd Stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "NO.70, 2ND CROSS, 27TH MAIN, BTM 1ST STAGE,",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite road of Vishnu Park Hotel, kuvempu nagar bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Purva Belmont Apartment, Kanakapura main road",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Purva Belmont Apartment, Kanakapura main road(Only Way)",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "rameshwaram café, JP nagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sesha Banu Residency Apartment, N.S. Palya, 6th Main Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shravanthi Castle, Dollars Colony, N.S. palya,,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Nanjundeswara Layout",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Suraksha Enclave, 7th Main, 20th Cross, BTM layout, kabab plaza",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Tata key motors kanakpura road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Rameshwaram Cafe @ JP Nager 100 feet Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Udupi upachar, jp nagar 5th phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vaishnavi Terrace, Dollars Colony, Phase 4, J. P. Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vega City Mall Back Side chirga hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vigneshwara temple, BTM Layout 2nd Stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jarganahalli Arch",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 9",
    "startingPoint": "Chikkalasandra",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-09-IJ-0002",
    "assignedDriver": "Jagadish Gowda",
    "stops": [
      {
        "stopName": "Near Sri Chaitanya Techno School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(shriram adithya apartments) Naidu layout, chikkhalsandr",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(Sri ram Adithya apartment) Shriram Adithya Apartmen",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#104, V2 Poorvi Enclave, A Block Hanumahills Layout, Arehalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "12, Nisarga,19 Cross, Krishnaiah Layout, Ittamadu,",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Abbaiah Naidu Studio, Chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "ABBIAH NAIDU STUDIO LAYOUT, CHIKKALASANDRA",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Arahalli Arch, Taja Cake",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Arehalli, Near 45D bus stop",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ashwathkatte road chickalasandra, Areli mara Nandini Booth",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Big Basket Gowdan",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brindavan Upachar Hotel, Ramanjaneyanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brundavan hotel chikkallasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brundhavan Upachar Ramanjeneya layout",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DEEKSHA ENTERPRISES (XEROX 75 paise) - Xerox in chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ittamadu, Near Shri Raghavendra Swamy Matha",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Krishna apartment, near Arehalli arch, Uttarahalli,",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "M R SANNIDHI APARTMENT, (GARUDA BLOCK),AREHALL",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Manjunatha Wines, Ittamadu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mars Planet Apartment",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandhini Milk Booth, Ramanjaneyanagar, Chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Naveen DN Krishna Appartments Arehalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near abbayi naidu studio, chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Chaitanya college, Taja Cake",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Hotchips, Chikkallasandra road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Ramanajaneyanagar BMTC last bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near TATA PROMONT",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near to kaggis bakery - bank colony, Chikkallsandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nehind Interactive Preschool, Sarvabhoumanagara, chikkalasandra",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to Mythri Aditya Apartments, arahalli KEB",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp Arka Lotus Apartment brindavan hotel",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Mars Mount near Tata Promont",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pickup Tata paramount, Hoskerehalli, Ittumadu Drop JP Nagar 1st meeraambika school",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "ramanjaneya nagar chikkalasandra last bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ramanjaneyanagar BMTC Last Bus Stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ramapriya Brundavan Gardenia Arehalli, Hanumagiri layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ramapriya Brundavan Gardenia, Near Ramadev Medicals, Arehalli, Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Saketh Hillside, Gurudatta Layout, Hosakerehalli",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SHRIRAM ADITHYA APT ITTAMADU BSK 3rd Stage Banashankri",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SVS school, CHAITRASHREE LANDMARK KEB Arehalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Tata paramount Hoskerehalli",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Tata promont",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Tata Promont Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Promont (Tata Housing)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 10",
    "startingPoint": "Banashankari",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-10-KL-0010",
    "assignedDriver": "Ganesh Gowda",
    "stops": [
      {
        "stopName": "(BNMIT)1918, 'Kailash', 31st Banashankari",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#1356, Rajan's Castl, Srinivasnagr",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "4TH MAIN, 6TH CROSS, BANASHANKARI 3RD STAGE, 3RD PHASE,",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "AIRD education centre, Vidyapeetha circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Apollo Pharmacy near ITI colony bustop,Vidyapeetha Circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Banashankari referral hospital, BNM College",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bata Shoe Store, Srinivas Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BATA SHOWROOM, SRINIVAS NAGAR",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BDA Complex(Only Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Master Hirannayya House Near Kids Adda(Royal Enfield Showroom Thagyaraj Nagar)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bharat Gas Krishna College kathriguppe",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BMTC Nandi Milk Boot, Chanamankera achukatu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BNM College",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "C K achkut bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "carvery nagar bsk 2nd stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Chandrodaya Cinemas, Vidyapeeta",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "COCOA BAKES, Banashankari Stage II",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "D Mart(Namdhari)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Diagonally opposite to Banashankari Referral Hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mother hood hospital banashankri 3rd stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mother hood hospital bsk rd stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nayara Petrol Pump",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Banashankari BDA Complex",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near BNM School/BDA Complex",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near bsk bda complex or monotype",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Chennammanakere basket ball court",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Devegowda petrol bunk",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Fire station KEB Devegowda petrol bunk",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near hanumanth nagar police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp GK traders, 50ft feet road hanumantha Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pai International, Kathriguppe Main Rd, Krishna college",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "People's tree Hospital, Opp tp PES College srinagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "PES College ,Hanumanth Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pick up - Prasad Ice cream parlour Drop - Kaggis bakery (50Ft Road)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SBI ATM, Near Pizza hut BDA",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shrikrishna Krishna international school, Vidyapeeta Circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sinivas Nagar Bus Stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Hari Kalyana Mantapa",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srinivas Nagar bata showroom",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Svc co operative bank, hanumanthnagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Teachers Colony",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 11",
    "startingPoint": "Gubbalala",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-11-MN-0004",
    "assignedDriver": "Vihaan Kumar",
    "stops": [
      {
        "stopName": "Art of living international Ashram",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elegant whispering winds / mantri courtyard 2, Near Home School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gubbalala,80feet road ramanjinaya nagara",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Valley School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Provident Park Square - 2D, Vakil Garden City",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sobha arena judicial layout thalghatpura",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sobha Hillview back gate",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Udipalya Shoudamani Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vakil garden city",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "(Old water tank road) near sangam textiles Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brightway school road, next to vvr paradise",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to Drug house 2 ,near ambica Medicals ,above Kanasu Collection Shop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige folcon city, building 4",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The magic faraway tree near Silk Institute metro station, Kanakapura Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vajarahalli metro station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 12",
    "startingPoint": "Rajarajeshwari Nagar",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-12-OP-0010",
    "assignedDriver": "Manjunath Kumar",
    "stops": [
      {
        "stopName": "102 SAI LEELA APARTMENTS 581 C 25TH CROSS RAJARAJESHWARI NAGAR,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Bata Showroom, Kenchenhalli, Rajarajeshwari Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind NHVPS school, rr nagar(Sparsha Hospital Monish Coner)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Big Bazaar Road Kathirgupee",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Century Indus Apartments, Rajarajeshwari Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Century Indus Apartments, Rajarajeshwari Nagar, Bengaluru",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Century Indus, rajarajeshwari nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Girinagar police station",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Global Academy of Technology, rr nagar(Sparsha Hospital Suguna Apartment)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hanuram petrol bank rr nagar(Sparsha Hospital Davangere Been Dose)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "IndianOil, Outer Ring Rd, Hosakerehalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "kathriguppe water tank",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KATHRIGUPPE Water Tank Road",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kathriguppe water tank road",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kathriguppe water tank, Near sweet chariot bsk iii stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "katriguppewater tank",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kerekodi hebbarcondiments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lalith castle school, H V Halli, R R Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lalith international school, RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bata show room, rr nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Global Institute of Technology, Suguna Upper Crest Sparsh Hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Rama Mandira temple, Behind Modi hospital, Kathriguppe",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp to V legacy choltrey BSK 3rd stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pallavi Residency Apartment, katriguppewater tank",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestiage Apartment RR Nagar",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Bagamane Temple Bells, Near Sky Sports Arena",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pure Drinking water (Kudiyuwa neerina ghataka)",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SBI Bank RR Nagar double road end",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Swargarani School & PU College(Suguna), RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "V legacy convention ,v legacy road",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Verbardhara nagar Signal",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Watertank , Kathriguppe BSK third stage",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "YGR Mall RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Pai International BSK 3rd Stage",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 13",
    "startingPoint": "JP Nagar 1st Phase",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-13-QR-0001",
    "assignedDriver": "Manoj Kumar",
    "stops": [
      {
        "stopName": "#402, 11th A cross, 29th main, 1st Phase , J P nagar, B'lore",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "400, 17th main, 36th Cross, Jayanagar 4th T Block,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "6/20, 2nd Main, byrasandra Jayanagar Bangalore 560011",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "646 22nd Main Road Pattabhirama, Home Jayanagar 4th T block",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Asha Sweets RV College",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ashoka Pillar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ashoka pillar busstop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Auto Pad 11th Cross, Ashoke Piller",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BDA layout, Byrasandra, Jayanagar 1st Block, Bangalore 560011",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind BWSSB Office, JP nagar 1st Phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Byrasandra near halasina mara nimhans road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Desi masala 4th block Jayanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jaya Clinic East end",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jayanagar 4th Block",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jayanagar 4th T Block(Car washing corner)",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KFC Behind Signal",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lakshmi Medical(ATM)",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lifecare medical IG circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Madhavan Park Circle",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Madhavan park, 3rd block, Jayanagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mirambika school(RV dental college ,west gate on 27th main JpNagar 1st phase)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Jaya Clinic, Jayanagara 9th Block",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Milan hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "New veena musicals, Jayanagar ashoke pillar",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nimhans road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "No. 461, 39th B Cross, 9th Main, 5th Block, Jayanagar,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp to Ramakrishna nursing home Next to Malabar Golds, 2nd Block, Jayanagar",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Satya Sai Tourist, 5th block, Jayanagar, Namdharis",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "PM Swimming pool",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sanjay Ghandhi hospital",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shiva temple sarakki 80ft road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SHREE SAI KRUPA APT, 302, 22ND CROSS JAYANAGAR BLR 560011",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srikrishana residency sbi colony Jp nagar 1st phase",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Byrasandra halsinanna mara nimhans road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 15",
    "startingPoint": "Rajarajeshwari Nagar",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-15-UV-0012",
    "assignedDriver": "Bhaskar Kumar",
    "stops": [
      {
        "stopName": "(Near Bank of Baroda)# BEML Layout, RajarajeshwariNagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Reliance Fresh, RR Nagar, NImishabham Temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Best Club Apartment, Shanmuga temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dwaraka nagar, BEML 5th stage, R R Nagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gowdara Mudde Mane Srinivaspur",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Harsha Bengaluru, Royal Indraprastha, Rajarajeshwari Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hotel N.G.T Non Veg, RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jayanna Circle - RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kanthi Sweets RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kanti Sweets Double road RR nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kanti sweets RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kanti sweets rr nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "mahveer lake apartment near dominos sunkalpalya, kodiplaya Kengeri",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mailasandra, Rajarajeshwari Nagar B G S Gete",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mars Meadows Apartment , BEML layout, 5th stage, Rajarajeshwari Nagar,",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "mars meadows rr nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Ambrosia hotel, RR Nagar",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near mars meadows apartment Beml 5th satge . Rajarajeshwari Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "NEETHI MAARGA, PANCHASHEELA BLOCK, BEML 3rd STAGE, R R Nager",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to S & S Platinum Apartments BEML V STAGE RRNAGAR(Prishudajalla)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "no 306, 1st cross Bheml layout 4th stage, Raja Rajeshwari Nagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp. Baldwin Co Education Extension High School Gate No.4, RR nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite shanmugam temple, KPTCL, Rajarajeshwri Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prasad medicals rr nagar(Cricket Grounds)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rajarajeshwari Nagar, Bank of Baroda",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rajathadri Hotel, Uttarahalli",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "RR Nagar Kanthi Sweets",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Sadana building 5th stage rr nagar kalegowda layout R R nagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shakthi Hills, RR Nagar nice road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "shri Kalabhairaveshwara Swamy Temple (RR Nagar)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shri Nimishamba Devi Temple, Ideal Homes Circle",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shri Shanimahatma Swami Temple, RR Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Suvarna Bhavana PP layout, Uttarahalli",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Swargarani School & PU College, Rajarajeshwari Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sweet Home Layout, Shall Petrol Pump, Uttarahalli Main Road",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shanmuga temple RR nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 16",
    "startingPoint": "Hulimavu",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-16-WX-0016",
    "assignedDriver": "Amit Kumar",
    "stops": [
      {
        "stopName": "HM World City,Raghavana Palya, JP Nagar 9th Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "405 SLR Residency ,Gottigere Shell Petrol Pump",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bannerghatta road near Decathlon",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BG Road, Police Station Gottiger",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brahmakumari Shivashram Amodha Apartment",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bramhakumari",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brookes Haven, JP Nagar 8th phase",
        "arrivalTime": "7:48 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Chuchaghatta Circle, Udupi Garden Hotel",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "D306, Purva Panorama, Kalena Agrahara,(PICKUP)",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Decatalon, BG Road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gotigere bustop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "GR REGENT PARK, Gottigere lake",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HM worlc city",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HM World City Apartments, JP Nagar 9th Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HM World City Indigo",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KLV Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KLV layout kothnur",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KLV layout, 8th Phase",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lane opp to Decathlon Bannerghatta",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Residency , near Meenakshi Temple",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near AECS Nursing college, Hulimavu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bangalore public school, Gottigere Lake Rd, off Bannerghatta Road, Phase 2, Kammanahalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Namma Cake Aramane JP Nagar 8th Phase( KLV Layout)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near RML Law College, Vijayashree Hospitals Gottigere",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Vijayshree hospital Gottigere BG Road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nobo Nagar Doddakammanahalli road off Bannerghatta road",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nydhile residency, near Gottigere police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Easy Shopping Mart, Raja Aristos Apartment",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Raja Aristos near B G Road",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Road opposite to Meenakshi Temple. Bannerghatta Road.Dooda Kammanahalli road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "RV Institute of technology and management",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sai Nandana Gardenia, Gottigere Lake Rd",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Sai Paradise Next to Vinayaka theater",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijayashree Hospitals, Bannerghatta Rd",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Nandi Deepa apartment, Doddakammanahalli Main Rd, Hulimavu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal Lakefront Layout phase 2 central park in the opposite road of KLV Layout entrance",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Soudhamini Convention Hall",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 18",
    "startingPoint": "Gottigere",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-18-BC-0016",
    "assignedDriver": "Anil Kumar",
    "stops": [
      {
        "stopName": "Anjanapura Bus Depot, Adithya Garden Layout",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BK CIRCLE",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade Gardenia ,JPNagar, 7th phase , RBI LAYOUT",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BRIGADE GARDENIA, Capitol School",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "D mart",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dakshin cafe, Kothanur Road",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dakshin Cafe, Kothnur Main Rd",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Decatalon, BG Road",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Fiton sports, Gottigere,pavamana nagar Kembathalli main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gavran Nagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gottigere,pavamana nagar Kembathalli main road",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gourav Nagara bus stop, Aramane Done Briyani",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Gowravnagar bus stop",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jambu Savari dhinne water tank",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jambusavari Dinee Bus stand",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jambusavari Dinne Godhavari Hotel",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KEB Petrol Bunk Anjanapura, NPS School",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Keerthi convention hall, Kothnur BWSSB Water Tank",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kembathalli Main Rd, South Avenue, Gottigere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kembathalli main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kothanur Dinne Main Road",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mangalya Apartment, Kolifarm Gate",
        "arrivalTime": "7:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nature pure cold pressed oil Coconut shop Anjanapur",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Navodaya Nagar Bus Stop JP Nagar 7th phase Axis Aspira",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Navodaya Nagar Busstop, Kothanur Main Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near keerthi convention hall. Jp Nagar 8th phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to BWSSB water tank, South Avenue, Gundappa layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Park Square Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Revanker's Skin Clinic, Navodaya Nagar, JP Nagar 7th Phase",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal Serenity Apartment, Near godavari cafe",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sillicon Valley School, Kembathalli main raod,",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "South Avenue layout, Godavari Cafe",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Surabhi Nagar, jp nagar 8th phase above Maruti Suzuki Spare parts show room",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Texs Mart, Kothnur Main Rd, Navodaya Nagar, Bharath Petrol bunk Near",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Varah Healthcare Speciality Clinic, Kothnur Main Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vinayaka temple, kothnoordinne main road",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 20",
    "startingPoint": "Begur",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-20-FG-0018",
    "assignedDriver": "Shivakumar Kumar",
    "stops": [
      {
        "stopName": "Behind Capitol public school, JP Nagar 6th Phase",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Capitol Public School Main building opposite to RBI ground, next to SBI bank",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near BBMP office RBI layout, Full Address: No 50, Inchara, 6th A Main, 1st A Cross, Gaurav Nagar, SBI Bank",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Someshwara Sabha Bhavan, Kakal Kai Ruchi JP Nagar 7th Phase",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shaolin Wushu Cultural Center, Dakshin Café JP Nagar(SBI BAnk)",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Samrat layout, Pick up Arekere Signal Drop BPL",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Tranquil Gardens Apt, SAI RAM HOSPITAL Hulimavu",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijayashree Layout, Hulimavu, ICICI BANK Bannerghatta Road,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "# 11A, Samruddhi, Hulimavu Gate, Bannerghatta road,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "arakere signal, BPL Bus Stop Esteem Park Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Arekere shantiniketan layout, Kempamma temple road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BASE Arekere Gate, Bannerghatta Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Base pu college Arekere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind meenakshi temple or classic orchards arch , opp to loyala degree college",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Meenakshi temple, Bannerghatta Road.",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BPL B G Road",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Esteem Enclave Apt AREKERE BPL",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hulimavu police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kempamma temple hulimavu",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kempamma temple, Shantiniketan Layout, Hulimavu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kotak Mahindra Bank, Arekere, BG Road",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Woodlands, Arakere, B P L Bannerghatta Road,",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mithra siddi apartment, GF01, venugopal Reddy Arekere BPL",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp. Hulimavu gate",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite hulimavu police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Hulimavu police station",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to AGN Kalyana mantapa, Arekere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rose Garden Apartment, Arekere, BPL Bus Stop Madindar windchimes Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SBI Arekere Branch, Hulimavu Main Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Marquise By Sparkle Realty, Beside Meenakshi Temple,",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vaibhav ApartmenShantiniketana,Hulimavu, KEMPAMMA TEMPLE",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vedant Vihar Hulimavu Main Road",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Venugopal Reddy Layout, Opposite to BPL Softawares,",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 19",
    "startingPoint": "Konanakunte",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-19-DF-0003",
    "assignedDriver": "Ashok Kumar",
    "stops": [
      {
        "stopName": "Akshaya Nagar, DLF Road Ganiesh Temple",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "DLF Road Ganiesh Temple",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "L and T South City, Arekere Mico Layout,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "32, opp. Janahavi shelters, yelenahalli, akshaynagar",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "71, 2nd Main, 5th Cross, Yelenahalli md, euro kids preschool",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Adjacent to Bochs Akshaya Apartments, Fullinfaws College Yelenahalli Main Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "B10-306, L and T southcity apartments, arekere mico layout, bangalore -560076",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Between Ganesha Temple and Fullinfaws college",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "BTM Meadows, Akshayanagar",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "C3-1008, SNN -Raj Serenity, Begur-koppa road, Yellenhalli",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Doddakammanahalli, near scout fitness, Bannerghatta road, TVS Showroom",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dose Camp, Krishna Kutira",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "ICICI Bank Doddakammanahalli",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Krishna Kutira hotel road , Hulimavu",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kundapura coffee, yelenahalli main road",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "L & T southcity apartments, Arekere",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lnt Southcity diagnally opp to Apollo pharmacy atekere",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandi Citadel Apartment, Nobel Residency Rd, Padma Clinic",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandi Citadel,Nobel Residency Rd Padma Clinic",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near D mart",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Full in Faws College Akshayanagar, Davanagere Beene Dosa",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Janvi Nivas Apts, Akshayanagar",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Radiant Reshan, Yelenahalli, Akshayanagar, Prestige Sang Apartment",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Suraksha Marvella Apartment, Hulimavu",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "No 112, Sukruti , 2nd Main, 2nd Cr. Yelenahalli Post",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nyanappanahalli Main BTM KRS Bakery",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Nano Hospital, Arekere",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Prestige Song Of The South Yelenahalli Begur Koppa Road",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Radiant redwood, Nobel Residency, Phase 2, Tejaswini Nagar",
        "arrivalTime": "7:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "L & T SOUTH CITY",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 21",
    "startingPoint": "Yelenahalli",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-21-HJ-0001",
    "assignedDriver": "Rajendra Kumar",
    "stops": [
      {
        "stopName": "(Little Flower Public School Hoskerehalli,",
        "arrivalTime": "8:05 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "1) Nayandahalli Metro station. 2) Global Mall.",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Anand Diagnostics Centre near IndusInd Bank",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind BDA Complex, Ramakrishna Hegde Park, Nagarabhavi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brand factory, 100ft Ring Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brand Factory, taaza thindi, 100ft ringroad",
        "arrivalTime": "8:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Bus Stop under the Skywalk on Ring road near Nayandahalli; Opp. To Kailasheshwara Temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dr Ambedkar circle Nagarbhavi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HDFC BANK",
        "arrivalTime": "8:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hosakerehalli ( Near PESIT College)",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ittamad Taaza Thindi",
        "arrivalTime": "8:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jantha bazar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Janthabazzar",
        "arrivalTime": "8:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jes public school, Naagarabhaavi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kathriguppe Signal",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KATHRIGUPPE Water Tank Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KHB platinum apartments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Little Flower Public School Hoskerehalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mahaveer Lakes, Dr.Vishnuvardhan Rd(shirke apartment)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Malathalli lake road, parvigolden nest apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mallathalli lake Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Meghana shalini apartment, kadirenahallinpark",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Muscle Factory gym - Doddabsdti msin road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nagarabhavi Circle",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nagarbhavi",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nammoora Thindi, Nagarabhavi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Brand Factory",
        "arrivalTime": "8:15 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Cycle world, Kathriguppe Circle, Thaja tindi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Ganesha temple, Bhuvaneshwara nagar(Kathigupe Circle)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Hotel Udupi Khaadya, Kamayaka Main road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Kamakhya theatre(Brand Factory)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Mallathahalli RTO",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near NNSS Pickleball courts, Nagarbhavi",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "No 5073 prestige south ridge a Hoskeahalli",
        "arrivalTime": "8:05 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shopper's Choice, Shirke Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 22",
    "startingPoint": "Kothnur",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-22-JK-0012",
    "assignedDriver": "Vihaan Naik",
    "stops": [
      {
        "stopName": "Mantri Alpyne",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "#877,34th cross poorna pragna layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Amma's Pastrie's, Guballala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Back side brigade apartment ,Jayanagar housing socity",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind mantri alpyne , banashankari 5th stage",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind NPS school, near Brigade 7 Gardens",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind Santrupti Apartment, PP Layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade 7 garden apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade 7 Gardens",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade 7 Gardens,Paduka Mandira Rd, Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Dhanlakshmi Store Brigade 7 Gardens roads(Only Drop)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Happy Valley Pearl Apartment, near brigade 7 Gardens",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Karunadu Dum House, Brigade Omega",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lifecare Medicals, Near NPS Banashankari 6th stage",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Alpyne Apartment near Patalamma temple",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Alpyne Apartment, Near Patalamma temple",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Alypne",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandini Milk Parlour, Poorna Pragna Layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Paakashaala Heritage, Uttarahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Raghavendra Swamy Mutt, Poornapragna layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Venkateshwara water supply, near brigade 7 garden",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "NPS School",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite of Happy valley school Happy valley layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to patallama temple",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Paakashala Heritage Uttarahalli, Happy Valley Layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Paduka Mandir Main road, near brigade 7 garden",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pakashala Uttarahalli patalamma temple,Happy Valley Layout",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pride Spring Field",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pride Springfield Apartment",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "pride springfield apartment",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Raghavendra Swamy Mutt Thurahalli, Brigade 7 gardena",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srivara Vistara Apartment, Poornapragna Layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srivari forest breeze, National Public School, Banashankari",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "V2 men’s salon Poornapragna Housing Society Layout",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Poornapragna, nandini booth",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade 7 Gardens, Paduka Mandira Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 23",
    "startingPoint": "Bannerghatta Road",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-23-LM-0012",
    "assignedDriver": "Satish Naik",
    "stops": [
      {
        "stopName": "Attiguppe metrostation",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Attiguppe, Chord Road",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Attiguppe, Hampi Nagar, RPC Layout, Vijayanagar, Bengaluru, Karnataka 560040",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Avalahalli BDA Bangalore one Girinagar",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Big Bazaar Road Kathirgupee",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Big Bazar",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Cake of the day bakery,",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "fashion factory, near kamakya theatre",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Girinagar Circle, Narayan School",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kamakaya Theater",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kamakhya Theater",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "kamakya brand factory",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Karur Vysya bank kathirguppe",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Marriyaama Park Near Nilakhanteshwar Temple, Banashankari 3rd Stage, Kathriguppe Main Rd",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nayara's petrol Pump, Avalahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Aithalmitrakoota hotel Girinagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near bangalore one center, Avalahalli park",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bangalore one or Nayara petrol bunk girinagar",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Girinagar last Busstop",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Kamakaya theater",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Kamakhya bus depot",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "near kamyaka theather",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Mitra koota hotel, BDA Layout, Avalahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Padmanabha ayurvedic clinic, Kathriguppe water tank down",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Radhakrishna Hospital, Girinagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pai International, Kathriguppe Main Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Raghavendra Mutta Girinagar Circle,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Saligrama Party hall, Near Sita Circle",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Seetha Circle Srinivasnagar",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sita Circle Vinayaka hospital Girinagar",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sri Sundar Mahal, girinagar, Raghavendra matt",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 24",
    "startingPoint": "JP Nagar 8th Phase",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-24-NP-0003",
    "assignedDriver": "Manoj Naik",
    "stops": [
      {
        "stopName": "AARAMA SUITES, Sarvabowmanagar, Bhnd HSBC,",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Aditi Nursing Home, Omkar Nagar, Arekere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Arekere micolayout near forest gate",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ayyaapa swamy Temple, Namana Hotel Road",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Behind IIMB, Vijaya enclave , vijaya bank layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Brigade Millennium,",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ganesha Temple",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HDFC Bank Arakere HSBC Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "HDFC Bank, HSBC Road Arekere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Hellokids Bright, Nayara petrol bunk Puttanahalli lake",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kodichikkanahalli Main Rd, Someswar Layout, Ramanashree Enclave",
        "arrivalTime": "7:22 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Lane Next to Kabab Zone, 9th Main, Vijayabank Layout, Bangalore - 560076",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mahaveer Glacier Apartments, HDFC Bank Arekere",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near ayyappa swamy temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near brigade millenium",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Presidency School, Anugraha layout, Bilekahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ranka colony",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sarvabhouma Nagar, Arekere, HSBC Road.",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shree homes elegance",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shri Siddhi Vinayaka Temple Arakere Mico Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SNN Raj Lake View Phase 2, Ranka Colony",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srinivas Marriage Hall",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Surabhi Apartment, Ranka colony",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Surabhi apartments, Ranka Colony",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Surabhi Apartments, Ranka Colony, Bilekahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "vijaya bank layout ayyappa temple(Pickup)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Bank Layout signal",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Bank Layout, Bilekahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Bank Signal",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Enclave Kumaradhara Block",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Enclave,vijayabank layout, banneraghatta roa",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Vittala Praseeda , Arekere Main Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sarvabhoumanagar Near chaavdi hotel",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 25",
    "startingPoint": "Uttarahalli",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-25-PR-0006",
    "assignedDriver": "Rajesh Naik",
    "stops": [
      {
        "stopName": "deverachikknahalli pariwar Place Apartment Gangama Temple",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "439 B BLOCKkodichikanahalli",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ayyapa bakery kodichiknahalli",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Ayyappa bakery, Kodichikkanahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "chowdeshwari temple, Ayyappa bakery, Kodichikkanahalli",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Devarachikanahalli Bus stop, Arali mara",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Devarachikkana halli bus stop",
        "arrivalTime": "7:32 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elita Promenade Apartments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elita Promenade, Brigade Millenium",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elita Promenade, Brigade Millenium Road",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Elita prominade Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "FLAT A-302, ROYAL LEGEND APARTMENT, BOMMANAHALLI,",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Janapriya Lake view apartment Kodichikkanahalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Janhavi Enclave, Next RMR Park",
        "arrivalTime": "7:32 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kodichickanalli Main Road, KFC",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Kodichiknahalli, Sri Abhaya Anjaneya Temple",
        "arrivalTime": "7:23 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nadamma Layout, Virat Nagar Kodichikkanahalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Ayyappa Bakery, Jahnvi apartments",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near vaikunta narayana swamy temple",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Vaikunta Narayana Swamy Temple, Vijaya Bank Layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite to kodichikkanahalli HP petrol pump",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pariwar Prince apartment Kodichikanahalli Main Road, Anugraha Layout",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rajram Prak Kodichikkanahalli",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "RMR Park",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal Legend ApartmentsDevarachikkanahalli Main Rd",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal Legend Apt, 60 Kodichikanahalli Main Road, Bommanahalli,",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "S5 Vintage Elite Visweswarayya marg Indian Petol Bank Kodichikkanahalli,",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sana super market, vijaya bank layout",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shanimahatma temple, Kodichikkanahalli",
        "arrivalTime": "7:25 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Shiva Shakit Temple, Chunchaghatta Road",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sreenidhi Lak SHIVA SHAKTHI TEMPLE Eswara Layout",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Bank Layout signal",
        "arrivalTime": "7:45 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Vijaya Bank Layout, Indian oil Petrol Bunk",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "KVR IRIS Apartment, Near Someshwara Temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 26",
    "startingPoint": "Padmanabhanagar",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-26-RS-0009",
    "assignedDriver": "Karan Naik",
    "stops": [
      {
        "stopName": "Bharath housing society, Opp Turahalli forest, Brigade Omega",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Chartered Beverly Hills Apartment Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Chikkegowdanpalya shri krishna dwarak hotel",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Golden panorama apartments, Golden Panorama Road, 80 Feet Rd, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jain Swadesh Apartment, Gubalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Jain Swadesh apartment, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Karishma Hills, near to Vidhyashilp School, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Tranquil",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri tranquil apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri tranquil gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Tranquil Rd, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Tranquil, Gubbalal",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mantri Tranquil, Gubbalala",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near anjenya temple, Gubbalala Main Rd",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Bosch service centre gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Thurahalli forest",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near to Jain Swadeshi Apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near V6 enclaves apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to Pratyangiri temple",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to Singapore Gardens, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to srichaitanya techno school, Mantri Tranquil Rd, Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opposite Rohan Akriti Apartment, Charterd Bevarya",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pick up: V6 Enclave apartment Drop: Shivaganga Bliss, 1st crs, 1st mn, Harsha Layout, Yelchenahall",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rajathadri Royal Inn, near Brigade Omega",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rohan Akriti",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rohan Akriti apartments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rohan Akriti Gubbalala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rohan Akriti, Gubblala",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "The Valley by Essem18 back gate(Mantri Tranquil)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Trinco Shanthivana Layout",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route 27",
    "startingPoint": "Jayanagar",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-27-TV-0003",
    "assignedDriver": "Harish Naik",
    "stops": [
      {
        "stopName": "Agastya Vana, Royal Park Residency Layout",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Anjanapura 80 Feet Rd, Vajarmuni Home",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "anjanapura post office",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Arka hardware near bbmp tank, RV College Road",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Holiday Village Road",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Holiday Village Road, Venkataramana temple, vajarahalli",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "In front of Mahaveer meredian apartment, Maruthi School",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Janavikas school 8th phase jpnagar, Rao Party Hall",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "MAANGALYA SIGNATURE, Royal Park residency Layout 1, JP Nagar 9th Phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Mangalya Prosper apartment, Royal Park residency Layout 1, JP Nagar 9th Phase",
        "arrivalTime": "7:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Maruthi School",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Maruthi School, Kothanoor",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandhi Garden Rd, J. P. Nagar, Bengaluru, Karnataka",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Nandi Garden Phase 2",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near by the grarrage raghavana palya J p nager 9th phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near holiday village resort",
        "arrivalTime": "7:22 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near last bus stop Anjanapura(Post Office)",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Manglyam Apartment Anjanapura",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Nandi Gardens, Agasthya Wellness Center JP Nagar 9th Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near Skypool fitness centre, JP nagar 8th Phase",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Near yogitha chats, Mahaveer meredian apartment",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Next to Real house apartment, Anjanapura",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Opp Platinum Lifestyle Apartment, JP Nagar 8th phase",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Pearl Gardens Holiday village Road",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Platinum life Stile Apartment",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Purva Highland Apt,Near Kumarans school, Holiday village Road,",
        "arrivalTime": "7:20 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Purva Highland, Mallasandra",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rao Party Hall, Kothnoor Dinne, 8th Phase, J. P. Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Royal County Bus stop",
        "arrivalTime": "7:40 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "RV Institute",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "RV Institute Opp",
        "arrivalTime": "7:50 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "SADGURU TAPOVANA, ROYAL PARK RESIDENCY,",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Sattva Misty Charm, Holiday Village",
        "arrivalTime": "7:10 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Silicon City Academy of Secondary Education, Chunchaghatta Main Road",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Soudhamini Kalyana mantapa",
        "arrivalTime": "8:00 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Srinidhi Layout, 9th Cross",
        "arrivalTime": "7:55 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Swapnam Royal Park residency, Jp nagar 9th phase",
        "arrivalTime": "7:35 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Anjanapura, Post Office",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route Car",
    "startingPoint": "Special Transit",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-99-CAR-0001",
    "assignedDriver": "Sunil Naik",
    "stops": [
      {
        "stopName": "Sobha Dewflower Apartments",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  },
  {
    "routeName": "Route Ecco",
    "startingPoint": "Special Transit",
    "destination": "Transcend Innovation Campus",
    "assignedVehicle": "KA-99-ECCO-0001",
    "assignedDriver": "Vijay Naik",
    "stops": [
      {
        "stopName": "Dolor's Colony JP Nagar",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "J P Nagar 1st phase , Behind RV Dental college",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      },
      {
        "stopName": "Rama Iyengar Road, Lal Bagh West Gate, VV Puram",
        "arrivalTime": "07:30 AM",
        "dropTime": "04:45 PM"
      }
    ]
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    "studentName": "Triveni T S",
    "studentId": "251P2474",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "Basavangudi Ratna Villas Road",
    "dropStop": "Basavangudi Ratna Villas Road",
    "parentContact": "9448073200",
    "parentEmail": "parent.251p2474@transcend.org",
  },
  {
    "studentName": "K S SAHASRA PRAKRUTHI",
    "studentId": "231S1096",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "Behind Pai Vista Convention Hall( HDFC BANK)",
    "dropStop": "Behind Pai Vista Convention Hall( HDFC BANK)",
    "parentContact": "9052212387",
    "parentEmail": "parent.231s1096@transcend.org",
  },
  {
    "studentName": "Avani Vitala Rao",
    "studentId": "251P1590",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "Jains Prakriti apartment, kanakpura road",
    "dropStop": "Jains Prakriti apartment, kanakpura road",
    "parentContact": "9845188845",
    "parentEmail": "parent.251p1590@transcend.org",
  },
  {
    "studentName": "ISHAN J",
    "studentId": "231S1071",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "JSS High School",
    "dropStop": "JSS High School",
    "parentContact": "9845359796",
    "parentEmail": "parent.231s1071@transcend.org",
  },
  {
    "studentName": "ABHIRAMA KESARI",
    "studentId": "241S1136",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "JSS High School",
    "dropStop": "JSS High School",
    "parentContact": "9448925528",
    "parentEmail": "parent.241s1136@transcend.org",
  },
  {
    "studentName": "Khushi T S",
    "studentId": "261S1009",
    "route": "Route 1",
    "bus": "KA-01-XX-0000",
    "pickupStop": "Near NMH hotel",
    "dropStop": "Near NMH hotel",
    "parentContact": "9980837983",
    "parentEmail": "parent.261s1009@transcend.org",
  },
  {
    "studentName": "SRI PRANAV SULEGAI",
    "studentId": "231S1047",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "Opposite to Bajaj Popular Showroom",
    "dropStop": "Opposite to Bajaj Popular Showroom",
    "parentContact": "9380241929",
    "parentEmail": "parent.231s1047@transcend.org",
  },
  {
    "studentName": "MOHITH YADAV R",
    "studentId": "241S1457",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "Shoba Apartment, Indhra Gandhi Circle",
    "dropStop": "Shoba Apartment, Indhra Gandhi Circle",
    "parentContact": "9845707627/9902522511",
    "parentEmail": "parent.241s1457@transcend.org",
  },
  {
    "studentName": "SAMARTH S MALLER",
    "studentId": "201S1001",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "SLJ iyengar bakery",
    "dropStop": "SLJ iyengar bakery",
    "parentContact": "9845379212",
    "parentEmail": "parent.201s1001@transcend.org",
  },
  {
    "studentName": "Shresht S T",
    "studentId": "241S1127",
    "route": "Route 1",
    "bus": "KA-01-XX-0000",
    "pickupStop": "Sobha Dewflower Apartments",
    "dropStop": "Sobha Dewflower Apartments",
    "parentContact": "9945546701",
    "parentEmail": "parent.241s1127@transcend.org",
  },
  {
    "studentName": "Lakshya M Gowda",
    "studentId": "241S1254",
    "route": "Route 1",
    "bus": "KA-01-XX-0000",
    "pickupStop": "Sobha Dewflower Apartments",
    "dropStop": "Sobha Dewflower Apartments",
    "parentContact": "8722223300",
    "parentEmail": "parent.241s1254@transcend.org",
  },
  {
    "studentName": "NISHRA P JAIN",
    "studentId": "231S1080",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "VV Puram jain Temple",
    "dropStop": "VV Puram jain Temple",
    "parentContact": "9986545593",
    "parentEmail": "parent.231s1080@transcend.org",
  },
  {
    "studentName": "VIRTI P JAIN",
    "studentId": "241S1024",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "VV Puram jain Temple",
    "dropStop": "VV Puram jain Temple",
    "parentContact": "9986545593",
    "parentEmail": "parent.231s1080@transcend.org",
  },
  {
    "studentName": "RUTVIJ SANGHVI",
    "studentId": "231S1038",
    "route": "Route 1",
    "bus": "KA-53-F-1234",
    "pickupStop": "VV Puram Middle School Road",
    "dropStop": "VV Puram Middle School Road",
    "parentContact": "8105555389",
    "parentEmail": "parent.231s1038@transcend.org",
  },
  {
    "studentName": "LAAVI JAIN",
    "studentId": "251S1481",
    "route": "Route 1",
    "bus": "KA-01-XX-0020",
    "pickupStop": "Vybhav Enclave Vanivilas Road",
    "dropStop": "Vybhav Enclave Vanivilas Road",
    "parentContact": "9886821448",
    "parentEmail": "parent.251s1481@transcend.org",
  },
  {
    "studentName": "Ananya N Rao",
    "studentId": "251P1116",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "#53, 6th Main Road, KSRTC Layout Chikkalasandra",
    "dropStop": "#53, 6th Main Road, KSRTC Layout Chikkalasandra",
    "parentContact": "9916676541",
    "parentEmail": "parent.251p1116@transcend.org",
  },
  {
    "studentName": "Thanvi C H",
    "studentId": "251P1877",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "005, Sumukha Simhadri Springs, Uttarahalli Main Road(Only Drop)",
    "dropStop": "005, Sumukha Simhadri Springs, Uttarahalli Main Road(Only Drop)",
    "parentContact": "9845375366",
    "parentEmail": "parent.251p1877@transcend.org",
  },
  {
    "studentName": "NAKSHATRA A",
    "studentId": "201S1033",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "12 B Bus Stop Pama padmanabhanagar",
    "dropStop": "12 B Bus Stop Pama padmanabhanagar",
    "parentContact": "6360616120",
    "parentEmail": "parent.201s1033@transcend.org",
  },
  {
    "studentName": "Nikhita Srinath",
    "studentId": "261P3114",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Adjacent to sobha clovelly, Gowdanapalya, Uttarahalli",
    "dropStop": "Adjacent to sobha clovelly, Gowdanapalya, Uttarahalli",
    "parentContact": "9972544347",
    "parentEmail": "parent.261p3114@transcend.org",
  },
  {
    "studentName": "Sanvi K Mahalatkar",
    "studentId": "261P3021",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Agarwal eye hospital , Padmanabhanagar",
    "dropStop": "Agarwal eye hospital , Padmanabhanagar",
    "parentContact": "9980695274",
    "parentEmail": "parent.261p3021@transcend.org",
  },
  {
    "studentName": "Ninaad Chaudhari",
    "studentId": "261P3903",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "bangalore international public school Uttarahalli main road",
    "dropStop": "bangalore international public school Uttarahalli main road",
    "parentContact": "9741949475",
    "parentEmail": "parent.261p3903@transcend.org",
  },
  {
    "studentName": "Chaitra Phanish",
    "studentId": "261P3231",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Behind Jnana Vignana padmanabhanagar, Patel Medical",
    "dropStop": "Behind Jnana Vignana padmanabhanagar, Patel Medical",
    "parentContact": "8105022990",
    "parentEmail": "parent.261p3231@transcend.org",
  },
  {
    "studentName": "Nibha Kedilaya",
    "studentId": "261P3355",
    "route": "Route 2",
    "bus": "KA-02-XX-0002",
    "pickupStop": "Brigade Komarla Apartment, Chikkalasandra",
    "dropStop": "Brigade Komarla Apartment, Chikkalasandra",
    "parentContact": "9900277488",
    "parentEmail": "parent.261p3355@transcend.org",
  },
  {
    "studentName": "Surya R Iyer",
    "studentId": "261P3908",
    "route": "Route 2",
    "bus": "KA-02-XX-0002",
    "pickupStop": "Brindavan apartments back gate, Uttarahalli opp tp vishal mart",
    "dropStop": "Brindavan apartments back gate, Uttarahalli opp tp vishal mart",
    "parentContact": "8431958537",
    "parentEmail": "parent.261p3908@transcend.org",
  },
  {
    "studentName": "Avani Chiploonkar",
    "studentId": "261P3018",
    "route": "Route 2",
    "bus": "KA-02-XX-0002",
    "pickupStop": "Chartered Madhura, Near Nano hospital uttarahalli",
    "dropStop": "Chartered Madhura, Near Nano hospital uttarahalli",
    "parentContact": "9980089171",
    "parentEmail": "parent.261p3018@transcend.org",
  },
  {
    "studentName": "NIRVIKA C R",
    "studentId": "241S1606",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Ibaco Ice, Uttarahalli main raod",
    "dropStop": "Ibaco Ice, Uttarahalli main raod",
    "parentContact": "9731122744",
    "parentEmail": "parent.241s1606@transcend.org",
  },
  {
    "studentName": "Niveditha H A",
    "studentId": "251P2450",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kadrinahalli Indian Oil Petrol Bunk",
    "dropStop": "Kadrinahalli Indian Oil Petrol Bunk",
    "parentContact": "9448825850",
    "parentEmail": "parent.251p2450@transcend.org",
  },
  {
    "studentName": "CHARITHA.S",
    "studentId": "221S1056",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kidney Foundation padmanabhanagar",
    "dropStop": "Kidney Foundation padmanabhanagar",
    "parentContact": "9731562106/9986427402",
    "parentEmail": "parent.221s1056@transcend.org",
  },
  {
    "studentName": "AANYA RAGHAV BHAT",
    "studentId": "241S1657",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kidney Foundation padmanabhanagar",
    "dropStop": "Kidney Foundation padmanabhanagar",
    "parentContact": "9448023828",
    "parentEmail": "parent.241s1657@transcend.org",
  },
  {
    "studentName": "AANYA RAGHAV BHAT",
    "studentId": "241S1658",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kidney Foundation padmanabhanagar",
    "dropStop": "Kidney Foundation padmanabhanagar",
    "parentContact": "9448023828",
    "parentEmail": "parent.241s1657@transcend.org",
  },
  {
    "studentName": "AANYA RAGHAV BHAT",
    "studentId": "241S1659",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kidney Foundation padmanabhanagar",
    "dropStop": "Kidney Foundation padmanabhanagar",
    "parentContact": "9448023828",
    "parentEmail": "parent.241s1657@transcend.org",
  },
  {
    "studentName": "Hashika R",
    "studentId": "251P2195",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Kidney Foundation padmanabhanagar",
    "dropStop": "Kidney Foundation padmanabhanagar",
    "parentContact": "9945234565",
    "parentEmail": "parent.251p2195@transcend.org",
  },
  {
    "studentName": "Chinmay Sai S Reddy",
    "studentId": "261P3099",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "maharaja agrasen hospital padmanabhanagar",
    "dropStop": "maharaja agrasen hospital padmanabhanagar",
    "parentContact": "9481826640",
    "parentEmail": "parent.261p3099@transcend.org",
  },
  {
    "studentName": "Sharvari Tupsakri",
    "studentId": "261P3963",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Near Bangalore International school",
    "dropStop": "Near Bangalore International school",
    "parentContact": "9880483258",
    "parentEmail": "parent.261p3963@transcend.org",
  },
  {
    "studentName": "Aryan Manjunath",
    "studentId": "261P3817",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Near Lakshmi temple Desai garden",
    "dropStop": "Near Lakshmi temple Desai garden",
    "parentContact": "9886268411",
    "parentEmail": "parent.261p3817@transcend.org",
  },
  {
    "studentName": "Neesargha Girish",
    "studentId": "261P3493",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Near Lenskart, Padmanabhanagar, Patel Medical",
    "dropStop": "Near Lenskart, Padmanabhanagar, Patel Medical",
    "parentContact": "9886002709",
    "parentEmail": "parent.261p3493@transcend.org",
  },
  {
    "studentName": "Sinchana Alur",
    "studentId": "261P3316",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Near Maharaja Agrasena Hospital, Padmanabhanagar",
    "dropStop": "Near Maharaja Agrasena Hospital, Padmanabhanagar",
    "parentContact": "9900175861",
    "parentEmail": "parent.261p3316@transcend.org",
  },
  {
    "studentName": "Ramnath Prashant Shanbhagh",
    "studentId": "261P3312",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Near max show room uttarahalli main road",
    "dropStop": "Near max show room uttarahalli main road",
    "parentContact": "9845704587",
    "parentEmail": "parent.261p3312@transcend.org",
  },
  {
    "studentName": "Jayanth G",
    "studentId": "261P3968",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Patel Medical kindny foundtion",
    "dropStop": "Patel Medical kindny foundtion",
    "parentContact": "8296072935",
    "parentEmail": "parent.261p3968@transcend.org",
  },
  {
    "studentName": "Tanya Murali",
    "studentId": "251P1425",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Patel Medical Padmanabhanagar",
    "dropStop": "Patel Medical Padmanabhanagar",
    "parentContact": "9900787495",
    "parentEmail": "parent.251p1425@transcend.org",
  },
  {
    "studentName": "Niriksha T",
    "studentId": "251P2425",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Patel Medical Padmanabhanagar",
    "dropStop": "Patel Medical Padmanabhanagar",
    "parentContact": "9740468310",
    "parentEmail": "parent.251p2425@transcend.org",
  },
  {
    "studentName": "Hemashree J S",
    "studentId": "241S1745",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Royal Mart,Padmanabha Nagar Bangalore",
    "dropStop": "Royal Mart,Padmanabha Nagar Bangalore",
    "parentContact": "9686711080",
    "parentEmail": "parent.241s1745@transcend.org",
  },
  {
    "studentName": "Jayanth P Gowda",
    "studentId": "261P3208",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Royalmart Supermarket Padmanabhanagar",
    "dropStop": "Royalmart Supermarket Padmanabhanagar",
    "parentContact": "9880083138",
    "parentEmail": "parent.261p3208@transcend.org",
  },
  {
    "studentName": "Tanuj R Sai",
    "studentId": "261P3608",
    "route": "Route 2",
    "bus": "KA-02-XX-0000",
    "pickupStop": "Royalmart Supermarket Padmanabhanagar",
    "dropStop": "Royalmart Supermarket Padmanabhanagar",
    "parentContact": "9972677991",
    "parentEmail": "parent.261p3608@transcend.org",
  },
  {
    "studentName": "Disha Vishweshwar Hegde",
    "studentId": "261P3157",
    "route": "Route 2",
    "bus": "KA-02-XX-0002",
    "pickupStop": "Shaneshwara Swamy Temple, Chikkalasandra Main Rd",
    "dropStop": "Shaneshwara Swamy Temple, Chikkalasandra Main Rd",
    "parentContact": "9611855633",
    "parentEmail": "parent.261p3157@transcend.org",
  },
  {
    "studentName": "Vaishnavi Madihally Badrinath",
    "studentId": "251P1084",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "The Infiniti Uttarahalli",
    "dropStop": "The Infiniti Uttarahalli",
    "parentContact": "9686612390",
    "parentEmail": "parent.251p1084@transcend.org",
  },
  {
    "studentName": "DHRUVIKA A",
    "studentId": "231S1046",
    "route": "Route 2",
    "bus": "KA-02-XX-0011",
    "pickupStop": "Vedanta college",
    "dropStop": "Vedanta college",
    "parentContact": "7019206253",
    "parentEmail": "parent.231s1046@transcend.org",
  },
  {
    "studentName": "Varad Mahendra Rao",
    "studentId": "241S1446",
    "route": "Route 2",
    "bus": "KA-02-XX-0011",
    "pickupStop": "Vedanta college",
    "dropStop": "Vedanta college",
    "parentContact": "9243446807",
    "parentEmail": "parent.241s1446@transcend.org",
  },
  {
    "studentName": "Nikitha Shree T",
    "studentId": "261P3624",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Vishal Mart, Uttarahalli",
    "dropStop": "Vishal Mart, Uttarahalli",
    "parentContact": "9972003336/9008572736",
    "parentEmail": "parent.261p3624@transcend.org",
  },
  {
    "studentName": "Yashas P Bharat",
    "studentId": "251P2557",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Yoganada Hospital PB Nagar",
    "dropStop": "Yoganada Hospital PB Nagar",
    "parentContact": "9620063750",
    "parentEmail": "parent.251p2557@transcend.org",
  },
  {
    "studentName": "Vanshikha S N",
    "studentId": "251P1477",
    "route": "Route 2",
    "bus": "KA-03-M-5678",
    "pickupStop": "Yogananada Hospital Padmanbhanagar",
    "dropStop": "Yogananada Hospital Padmanbhanagar",
    "parentContact": "9620224541",
    "parentEmail": "parent.251p1477@transcend.org",
  },
  {
    "studentName": "T N Amogh",
    "studentId": "251P1532",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Subramanya Temple Arekere Mico Layout,",
    "dropStop": "Subramanya Temple Arekere Mico Layout,",
    "parentContact": "8073756310",
    "parentEmail": "parent.251p1532@transcend.org",
  },
  {
    "studentName": "Rajeev Vijayanand Hosmath",
    "studentId": "251P2251",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "(Aaradhana School) S J R LUXURIA",
    "dropStop": "(Aaradhana School) S J R LUXURIA",
    "parentContact": "8123896284",
    "parentEmail": "parent.251p2251@transcend.org",
  },
  {
    "studentName": "Havisha R",
    "studentId": "251P1684",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "(Aaradhana School)IRIS SURYA APARTMENT,",
    "dropStop": "(Aaradhana School)IRIS SURYA APARTMENT,",
    "parentContact": "9902535353",
    "parentEmail": "parent.251p1684@transcend.org",
  },
  {
    "studentName": "Reyansh Vyas",
    "studentId": "251P1963",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "(GR Lavender)milestone apartment ,",
    "dropStop": "(GR Lavender)milestone apartment ,",
    "parentContact": "9886692875",
    "parentEmail": "parent.251p1963@transcend.org",
  },
  {
    "studentName": "R Shohith Reddy",
    "studentId": "251P1479",
    "route": "Route 3",
    "bus": "KA-03-XX-0000",
    "pickupStop": "Adarsh Apartment",
    "dropStop": "Adarsh Apartment",
    "parentContact": "8095196214",
    "parentEmail": "parent.251p1479@transcend.org",
  },
  {
    "studentName": "Bokkasam Spoorthi Rao",
    "studentId": "261P3548",
    "route": "Route 3",
    "bus": "KA-03-XX-0000",
    "pickupStop": "Adarsha Apartment,Tuesday and Thursday drop at Career Launcher, Jayanagar 4th Block",
    "dropStop": "Adarsha Apartment,Tuesday and Thursday drop at Career Launcher, Jayanagar 4th Block",
    "parentContact": "9902099708",
    "parentEmail": "parent.261p3548@transcend.org",
  },
  {
    "studentName": "Prarthana Edith G",
    "studentId": "261P3736",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Adishiwara Super market, Panduranga Nagar",
    "dropStop": "Adishiwara Super market, Panduranga Nagar",
    "parentContact": "9886322211",
    "parentEmail": "parent.261p3736@transcend.org",
  },
  {
    "studentName": "Devalapalle Jahnavi",
    "studentId": "251P1937",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Apollo hospital back gate, 4th Phase, JP Nagar",
    "dropStop": "Apollo hospital back gate, 4th Phase, JP Nagar",
    "parentContact": "9900215874",
    "parentEmail": "parent.251p1937@transcend.org",
  },
  {
    "studentName": "Shrita Heroorker",
    "studentId": "241S1286",
    "route": "Route 17",
    "bus": "KA-17-YZ-0000",
    "pickupStop": "Arkera BDA 80Feet Road Sai Baba temple",
    "dropStop": "Arkera BDA 80Feet Road Sai Baba temple",
    "parentContact": "7899426655",
    "parentEmail": "parent.241s1286@transcend.org",
  },
  {
    "studentName": "Latika Jana",
    "studentId": "261P3471",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Behind cake shop, Tyre factory road, D mart Ready Pickup",
    "dropStop": "Behind cake shop, Tyre factory road, D mart Ready Pickup",
    "parentContact": "9886674415",
    "parentEmail": "parent.261p3471@transcend.org",
  },
  {
    "studentName": "Sowmya V",
    "studentId": "261P3758",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Giffi Kidz Preschool In JP Nagar 8th phase RenukaYellamma Temple",
    "dropStop": "Giffi Kidz Preschool In JP Nagar 8th phase RenukaYellamma Temple",
    "parentContact": "9902548186",
    "parentEmail": "parent.261p3758@transcend.org",
  },
  {
    "studentName": "Vijay Raghav Srinivasan",
    "studentId": "261P3520",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "GR lavender Apartment",
    "dropStop": "GR lavender Apartment",
    "parentContact": "9663382700",
    "parentEmail": "parent.261p3520@transcend.org",
  },
  {
    "studentName": "Arushi Nadgir",
    "studentId": "261P3523",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "GR Lavender apartment",
    "dropStop": "GR Lavender apartment",
    "parentContact": "8073487529",
    "parentEmail": "parent.261p3523@transcend.org",
  },
  {
    "studentName": "Sanvi Kini M",
    "studentId": "261P3103",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "J. P. Nagar,yengar Bakery and Ragav diagnostics, Gavrou Nagar Amma's pastric cake shop",
    "dropStop": "J. P. Nagar,yengar Bakery and Ragav diagnostics, Gavrou Nagar Amma's pastric cake shop",
    "parentContact": "9844244404",
    "parentEmail": "parent.261p3103@transcend.org",
  },
  {
    "studentName": "Mehak Kapil Kiran",
    "studentId": "251P1467",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Lyengar Bakery, Shreyas Colony",
    "dropStop": "Lyengar Bakery, Shreyas Colony",
    "parentContact": "9590016776",
    "parentEmail": "parent.251p1467@transcend.org",
  },
  {
    "studentName": "Nikitha Rao",
    "studentId": "251P1103",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "M S Ramaiah City ( Halli Thota )",
    "dropStop": "M S Ramaiah City ( Halli Thota )",
    "parentContact": "9731999006",
    "parentEmail": "parent.251p1103@transcend.org",
  },
  {
    "studentName": "Sthuti S Rao",
    "studentId": "251P1495",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Medplus Ramaiah City,(Halli Thota )",
    "dropStop": "Medplus Ramaiah City,(Halli Thota )",
    "parentContact": "9880019075",
    "parentEmail": "parent.251p1495@transcend.org",
  },
  {
    "studentName": "Sanjana Satish",
    "studentId": "261P3967",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "MS Ramaiah City Layout, JP Nagar 7th Phase, Bengaluru, Karnataka",
    "dropStop": "MS Ramaiah City Layout, JP Nagar 7th Phase, Bengaluru, Karnataka",
    "parentContact": "9686765317",
    "parentEmail": "parent.261p3967@transcend.org",
  },
  {
    "studentName": "Shreepad V Aithal",
    "studentId": "261P3672",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Near Adarsh Apartment Panduranga Nagar",
    "dropStop": "Near Adarsh Apartment Panduranga Nagar",
    "parentContact": "9845566412",
    "parentEmail": "parent.261p3672@transcend.org",
  },
  {
    "studentName": "As Mohita Varshini",
    "studentId": "261P3725",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Near Apolo Pharmacy, JP Nagar 7th Phase, Arekere",
    "dropStop": "Near Apolo Pharmacy, JP Nagar 7th Phase, Arekere",
    "parentContact": "9483972036",
    "parentEmail": "parent.261p3725@transcend.org",
  },
  {
    "studentName": "Sachit P Arun",
    "studentId": "261P3488",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Near Aradhana Academy",
    "dropStop": "Near Aradhana Academy",
    "parentContact": "9449631451",
    "parentEmail": "parent.261p3488@transcend.org",
  },
  {
    "studentName": "Rahul Vijayanand Hosmath",
    "studentId": "251P2252",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Near aradhana school",
    "dropStop": "Near aradhana school",
    "parentContact": "9741234099",
    "parentEmail": "parent.251p2252@transcend.org",
  },
  {
    "studentName": "SVASTI K S",
    "studentId": "231S1055",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Near Bescom Office( Beakery)",
    "dropStop": "Near Bescom Office( Beakery)",
    "parentContact": "9900917330",
    "parentEmail": "parent.231s1055@transcend.org",
  },
  {
    "studentName": "Ruchir S A",
    "studentId": "261P3280",
    "route": "Route 3",
    "bus": "KA-03-XX-0000",
    "pickupStop": "Near Sjr luxuria apartment",
    "dropStop": "Near Sjr luxuria apartment",
    "parentContact": "9448845373",
    "parentEmail": "parent.261p3280@transcend.org",
  },
  {
    "studentName": "Tvesha D",
    "studentId": "261P3102",
    "route": "Route 3",
    "bus": "KA-03-XX-0018",
    "pickupStop": "Next To Appollo Pharmacy Sai Enclave JP Nagar 7th Phase",
    "dropStop": "Next To Appollo Pharmacy Sai Enclave JP Nagar 7th Phase",
    "parentContact": "7760970816",
    "parentEmail": "parent.261p3102@transcend.org",
  },
  {
    "studentName": "ANIKET NIDISH",
    "studentId": "221S1012",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Nisha Fitness",
    "dropStop": "Nisha Fitness",
    "parentContact": "9036356525",
    "parentEmail": "parent.221s1012@transcend.org",
  },
  {
    "studentName": "ANANYA NIDISH",
    "studentId": "221S1013",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Nisha Fitness",
    "dropStop": "Nisha Fitness",
    "parentContact": "9036356525",
    "parentEmail": "parent.221s1012@transcend.org",
  },
  {
    "studentName": "Kushal S",
    "studentId": "261P3720",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Ramaiah south City",
    "dropStop": "Ramaiah south City",
    "parentContact": "9008522775",
    "parentEmail": "parent.261p3720@transcend.org",
  },
  {
    "studentName": "Saanvi Sriram",
    "studentId": "261P3139",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "S.R. Residency, Arekere MICO Layout 2nd stage",
    "dropStop": "S.R. Residency, Arekere MICO Layout 2nd stage",
    "parentContact": "9686380617",
    "parentEmail": "parent.261p3139@transcend.org",
  },
  {
    "studentName": "Mayank Bc",
    "studentId": "251S1735",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "sai enclave ,near ms Ramaiah city road",
    "dropStop": "sai enclave ,near ms Ramaiah city road",
    "parentContact": "9591221595",
    "parentEmail": "parent.251s1735@transcend.org",
  },
  {
    "studentName": "Pranati N Satish",
    "studentId": "261P3038",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Sai Enclave, M.S.Ramaiah city, 7th phase, JP Nagar",
    "dropStop": "Sai Enclave, M.S.Ramaiah city, 7th phase, JP Nagar",
    "parentContact": "9886179488",
    "parentEmail": "parent.261p3038@transcend.org",
  },
  {
    "studentName": "Nishchay S Babu",
    "studentId": "261P3184",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Sai Enclave, MS Ramaiah City Main Rd",
    "dropStop": "Sai Enclave, MS Ramaiah City Main Rd",
    "parentContact": "9845297139",
    "parentEmail": "parent.261p3184@transcend.org",
  },
  {
    "studentName": "Nishika S Babu",
    "studentId": "261P3194",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "Sai Enclave, MS Ramaiah City Main Rd",
    "dropStop": "Sai Enclave, MS Ramaiah City Main Rd",
    "parentContact": "9845297139",
    "parentEmail": "parent.261p3184@transcend.org",
  },
  {
    "studentName": "Ayushi Akhilesh Tenglikar",
    "studentId": "251S1126",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "SJR LUXURIA appts, Arkere mico layout",
    "dropStop": "SJR LUXURIA appts, Arkere mico layout",
    "parentContact": "9972465840",
    "parentEmail": "parent.251s1126@transcend.org",
  },
  {
    "studentName": "Haasini Srinivas",
    "studentId": "261P3542",
    "route": "Route 3",
    "bus": "KA-51-AB-9999",
    "pickupStop": "SLV symphony apartment 7th phase J.P.Nagar Chunchghatta main road",
    "dropStop": "SLV symphony apartment 7th phase J.P.Nagar Chunchghatta main road",
    "parentContact": "9972463469",
    "parentEmail": "parent.261p3542@transcend.org",
  },
  {
    "studentName": "APEKSH RAGHAV",
    "studentId": "261P3697",
    "route": "Route 3",
    "bus": "KA-03-XX-0000",
    "pickupStop": "SLV Synfony",
    "dropStop": "SLV Synfony",
    "parentContact": "9880306850",
    "parentEmail": "parent.261p3697@transcend.org",
  },
  {
    "studentName": "R Madhura Spoorthi spoorthi",
    "studentId": "261P3658",
    "route": "Route 3",
    "bus": "KA-03-XX-0016",
    "pickupStop": "Sri Krishna vaibhava grand, Anjaneya Temple, Chunchgatta",
    "dropStop": "Sri Krishna vaibhava grand, Anjaneya Temple, Chunchgatta",
    "parentContact": "9901760470",
    "parentEmail": "parent.261p3658@transcend.org",
  },
  {
    "studentName": "Rithanya Venkatesan",
    "studentId": "261P3126",
    "route": "Route 3",
    "bus": "KA-03-XX-0000",
    "pickupStop": "Whispering Winds, MS Ramaiah City Layout",
    "dropStop": "Whispering Winds, MS Ramaiah City Layout",
    "parentContact": "9972609922",
    "parentEmail": "parent.261p3126@transcend.org",
  },
  {
    "studentName": "Nihira Vijesh",
    "studentId": "261S1089",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "(Pick Up)Near Canara bank, ISRO Layout and (Drop)Bunnies day care ISRO layout",
    "dropStop": "(Pick Up)Near Canara bank, ISRO Layout and (Drop)Bunnies day care ISRO layout",
    "parentContact": "8807611438",
    "parentEmail": "parent.261s1089@transcend.org",
  },
  {
    "studentName": "Aditi Satya Vangara",
    "studentId": "251P1096",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "#3903, 13th Main, Kumaraswamy Layout,",
    "dropStop": "#3903, 13th Main, Kumaraswamy Layout,",
    "parentContact": "9845149700",
    "parentEmail": "parent.251p1096@transcend.org",
  },
  {
    "studentName": "P.Dhanveer",
    "studentId": "231S0022",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Ayyapa Swamy Temple(Drop)",
    "dropStop": "Ayyapa Swamy Temple(Drop)",
    "parentContact": "9845141530",
    "parentEmail": "parent.231s0022@transcend.org",
  },
  {
    "studentName": "Medhansh Sharma",
    "studentId": "241S1067",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Bakery Road Near Padma Madam House",
    "dropStop": "Bakery Road Near Padma Madam House",
    "parentContact": "9513317548",
    "parentEmail": "parent.241s1067@transcend.org",
  },
  {
    "studentName": "Shashank Siddan Korbu",
    "studentId": "241S2144",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Canara bank Kumarswamy Layout",
    "dropStop": "Canara bank Kumarswamy Layout",
    "parentContact": "9535550097",
    "parentEmail": "parent.241s2144@transcend.org",
  },
  {
    "studentName": "Aarav Changappa C B",
    "studentId": "251S1795",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "ISRO Layout Park",
    "dropStop": "ISRO Layout Park",
    "parentContact": "9844102050",
    "parentEmail": "parent.251s1795@transcend.org",
  },
  {
    "studentName": "Rikvith Shankar",
    "studentId": "261P3341",
    "route": "Route 4",
    "bus": "KA-04-XX-0009",
    "pickupStop": "Kaderenahalli Indian Oil Petrol Bunk",
    "dropStop": "Kaderenahalli Indian Oil Petrol Bunk",
    "parentContact": "9900099045",
    "parentEmail": "parent.261p3341@transcend.org",
  },
  {
    "studentName": "Shreesh Sunil Kumar Gowda",
    "studentId": "261P3331",
    "route": "Route 4",
    "bus": "KA-04-XX-0023",
    "pickupStop": "Kadrenhalli petrol pump",
    "dropStop": "Kadrenhalli petrol pump",
    "parentContact": "9448440715",
    "parentEmail": "parent.261p3331@transcend.org",
  },
  {
    "studentName": "Sunidhi Saparam",
    "studentId": "261P3130",
    "route": "Route 4",
    "bus": "KA-04-XX-0009",
    "pickupStop": "Kardrenahalli petrol bunk silcon honda showroom",
    "dropStop": "Kardrenahalli petrol bunk silcon honda showroom",
    "parentContact": "9916673165",
    "parentEmail": "parent.261p3130@transcend.org",
  },
  {
    "studentName": "Adoni Meghana",
    "studentId": "261P3690",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Kumarswamy layout, 15 F bustop road, Near Domino's pizza(Drop Only)",
    "dropStop": "Kumarswamy layout, 15 F bustop road, Near Domino's pizza(Drop Only)",
    "parentContact": "9972574099",
    "parentEmail": "parent.261p3690@transcend.org",
  },
  {
    "studentName": "Saaksha Gowda",
    "studentId": "261P3283",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Kumarswamy layout, water tank Stop",
    "dropStop": "Kumarswamy layout, water tank Stop",
    "parentContact": "9886776398",
    "parentEmail": "parent.261p3283@transcend.org",
  },
  {
    "studentName": "Charisha Gowda S",
    "studentId": "261S1031",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Kumarswamy layout, water tank Stop",
    "dropStop": "Kumarswamy layout, water tank Stop",
    "parentContact": "9886776398",
    "parentEmail": "parent.261p3283@transcend.org",
  },
  {
    "studentName": "Daiwik C b",
    "studentId": "261S1006",
    "route": "Route 4",
    "bus": "KA-04-XX-0002",
    "pickupStop": "Near baby choice subramanyapura road(Kardrenahalli Circle)",
    "dropStop": "Near baby choice subramanyapura road(Kardrenahalli Circle)",
    "parentContact": "9886125646",
    "parentEmail": "parent.261s1006@transcend.org",
  },
  {
    "studentName": "CHHAYA MANAS BORKAR",
    "studentId": "231S1001",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Near Canara Bank",
    "dropStop": "Near Canara Bank",
    "parentContact": "9833206004",
    "parentEmail": "parent.231s1001@transcend.org",
  },
  {
    "studentName": "Maanvitha R",
    "studentId": "251S1824",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "No 702, 23 cross, 1 st stage, kumarawamy layout(DROP)",
    "dropStop": "No 702, 23 cross, 1 st stage, kumarawamy layout(DROP)",
    "parentContact": "8310815263",
    "parentEmail": "parent.251s1824@transcend.org",
  },
  {
    "studentName": "Abhigyan P Shiode",
    "studentId": "241S1346",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "SBI Bank",
    "dropStop": "SBI Bank",
    "parentContact": "9845686268",
    "parentEmail": "parent.241s1346@transcend.org",
  },
  {
    "studentName": "Manasvina M J",
    "studentId": "251P1500",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Seva park, samvruddi layout",
    "dropStop": "Seva park, samvruddi layout",
    "parentContact": "7090333999",
    "parentEmail": "parent.251p1500@transcend.org",
  },
  {
    "studentName": "Ganavi H",
    "studentId": "241S1467",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Upinakai Road(DROP)",
    "dropStop": "Upinakai Road(DROP)",
    "parentContact": "9986737395",
    "parentEmail": "parent.241s1467@transcend.org",
  },
  {
    "studentName": "S JYOTHSNA",
    "studentId": "251P1859",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "#125 2nd main t r nagar banglore 560028 T r nagar",
    "dropStop": "#125 2nd main t r nagar banglore 560028 T r nagar",
    "parentContact": "9448369573",
    "parentEmail": "parent.251p1859@transcend.org",
  },
  {
    "studentName": "VIKAAS A",
    "studentId": "251P1072",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "#41, 4th Main Road, 6th Cross, 3rd Block, Thyagaraja Nagar,",
    "dropStop": "#41, 4th Main Road, 6th Cross, 3rd Block, Thyagaraja Nagar,",
    "parentContact": "9886017650",
    "parentEmail": "parent.251p1072@transcend.org",
  },
  {
    "studentName": "PRANAV C",
    "studentId": "251S1333",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "117/9, Nagaraja Layout, Bull temple road, Banglore-19",
    "dropStop": "117/9, Nagaraja Layout, Bull temple road, Banglore-19",
    "parentContact": "9035973969",
    "parentEmail": "parent.251s1333@transcend.org",
  },
  {
    "studentName": "HASHVI A JAIN",
    "studentId": "251S1183",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "186 4th Floor 3rd Cross 2nd Main Road Chamrajpet Bengaluru -560018",
    "dropStop": "186 4th Floor 3rd Cross 2nd Main Road Chamrajpet Bengaluru -560018",
    "parentContact": "9900905927",
    "parentEmail": "parent.251s1183@transcend.org",
  },
  {
    "studentName": "YASHIKA S",
    "studentId": "251P2311",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Adarsh College Chamarajpet",
    "dropStop": "Adarsh College Chamarajpet",
    "parentContact": "6364653993",
    "parentEmail": "parent.251p2311@transcend.org",
  },
  {
    "studentName": "S RITHANYA",
    "studentId": "261P4023",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Bata Shoe Store, 3rd Cross Rd, Kamalanagar, Chamrajpe",
    "dropStop": "Bata Shoe Store, 3rd Cross Rd, Kamalanagar, Chamrajpe",
    "parentContact": "9740084483",
    "parentEmail": "parent.261p4023@transcend.org",
  },
  {
    "studentName": "Aarav Sachin Gada",
    "studentId": "261P3838",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Bata Shoe Store, chamrajpet",
    "dropStop": "Bata Shoe Store, chamrajpet",
    "parentContact": "9886668262",
    "parentEmail": "parent.261p3838@transcend.org",
  },
  {
    "studentName": "Chinmayi Sunil",
    "studentId": "261P3240",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Canara bank Gavipuram Extension",
    "dropStop": "Canara bank Gavipuram Extension",
    "parentContact": "9900180838",
    "parentEmail": "parent.261p3240@transcend.org",
  },
  {
    "studentName": "Anannya B M",
    "studentId": "261P3534",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "Hanumathnagar, Basavanagudi near Sanjeevani pharma",
    "dropStop": "Hanumathnagar, Basavanagudi near Sanjeevani pharma",
    "parentContact": "9986600909",
    "parentEmail": "parent.261p3534@transcend.org",
  },
  {
    "studentName": "ATHARV C G",
    "studentId": "231S1084",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "ICICI Bank, Chamrajpet",
    "dropStop": "ICICI Bank, Chamrajpet",
    "parentContact": "9740150621",
    "parentEmail": "parent.231s1084@transcend.org",
  },
  {
    "studentName": "ADVIK P",
    "studentId": "251S1985",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Kholimane, TR Nagar",
    "dropStop": "Kholimane, TR Nagar",
    "parentContact": "9845148084",
    "parentEmail": "parent.251s1985@transcend.org",
  },
  {
    "studentName": "DEV PAI",
    "studentId": "231S1039",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "KR road, Shastri bakery(Blue Dart)",
    "dropStop": "KR road, Shastri bakery(Blue Dart)",
    "parentContact": "9900603265",
    "parentEmail": "parent.231s1039@transcend.org",
  },
  {
    "studentName": "Monisha N P",
    "studentId": "251P2448",
    "route": "Route 5",
    "bus": "KA-05-AB-0000",
    "pickupStop": "KR road, Shastri bakery(Blue Dart)",
    "dropStop": "KR road, Shastri bakery(Blue Dart)",
    "parentContact": "9880790909",
    "parentEmail": "parent.251p2448@transcend.org",
  },
  {
    "studentName": "VED PAI",
    "studentId": "231S1040",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "KR Road, Shastry Bakery(Blue Dart)",
    "dropStop": "KR Road, Shastry Bakery(Blue Dart)",
    "parentContact": "9900603265",
    "parentEmail": "parent.231s1039@transcend.org",
  },
  {
    "studentName": "KIMAYA N K",
    "studentId": "241S1163",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "KR Road, Shastry Bakery(Blue Dart)",
    "dropStop": "KR Road, Shastry Bakery(Blue Dart)",
    "parentContact": "9632006007/9980859498",
    "parentEmail": "parent.241s1163@transcend.org",
  },
  {
    "studentName": "SMAYAN N R",
    "studentId": "241S1003",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Mukabika School, T R Nagar",
    "dropStop": "Mukabika School, T R Nagar",
    "parentContact": "9972703280",
    "parentEmail": "parent.241s1003@transcend.org",
  },
  {
    "studentName": "Shrinika Santhosh",
    "studentId": "231S0003",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Near Kiran Compu solutions, NR Colony, Basavanagudi",
    "dropStop": "Near Kiran Compu solutions, NR Colony, Basavanagudi",
    "parentContact": "9590262150",
    "parentEmail": "parent.231s0003@transcend.org",
  },
  {
    "studentName": "SWARAN R P",
    "studentId": "231S1041",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "Near Saraswat bank",
    "dropStop": "Near Saraswat bank",
    "parentContact": "9886625694",
    "parentEmail": "parent.231s1041@transcend.org",
  },
  {
    "studentName": "C R Sonam",
    "studentId": "261P3136",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "Near Saraswath Bank, Jayanagar 7th Block",
    "dropStop": "Near Saraswath Bank, Jayanagar 7th Block",
    "parentContact": "9845069262",
    "parentEmail": "parent.261p3136@transcend.org",
  },
  {
    "studentName": "PAHEL A JAIN",
    "studentId": "231S1045",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Nearby Leelavatti Multispeciality Hospital( Chamarajpet Bata Showroom)",
    "dropStop": "Nearby Leelavatti Multispeciality Hospital( Chamarajpet Bata Showroom)",
    "parentContact": "7760621501",
    "parentEmail": "parent.231s1045@transcend.org",
  },
  {
    "studentName": "Trishan Javaji",
    "studentId": "261P3484",
    "route": "Route 5",
    "bus": "KA-05-AB-0009",
    "pickupStop": "NU Hospital, Padmanabanagar, Bangalore(Uma theater)",
    "dropStop": "NU Hospital, Padmanabanagar, Bangalore(Uma theater)",
    "parentContact": "8123056090",
    "parentEmail": "parent.261p3484@transcend.org",
  },
  {
    "studentName": "Yatin Maske B",
    "studentId": "261P3171",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Ragoo's hotel, 16, 5th B Main road, k r road, Basavanagudi, Bangalore",
    "dropStop": "Ragoo's hotel, 16, 5th B Main road, k r road, Basavanagudi, Bangalore",
    "parentContact": "9986058024",
    "parentEmail": "parent.261p3171@transcend.org",
  },
  {
    "studentName": "THAMAN ARYA D H",
    "studentId": "241S1364",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "shani mahatma templ TR Nagar",
    "dropStop": "shani mahatma templ TR Nagar",
    "parentContact": "9945499243",
    "parentEmail": "parent.241s1364@transcend.org",
  },
  {
    "studentName": "BHAVIK VAID",
    "studentId": "251S1707",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "shani mahatma templ TR Nagar",
    "dropStop": "shani mahatma templ TR Nagar",
    "parentContact": "9035961840",
    "parentEmail": "parent.251s1707@transcend.org",
  },
  {
    "studentName": "PEHEL NISHANT JAIN",
    "studentId": "241S1434",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Shri Dattatreya Swamy Temple",
    "dropStop": "Shri Dattatreya Swamy Temple",
    "parentContact": "9606206930",
    "parentEmail": "parent.241s1434@transcend.org",
  },
  {
    "studentName": "Laasya S Deshkulkarni",
    "studentId": "261P3366",
    "route": "Route 5",
    "bus": "KA-05-AB-0000",
    "pickupStop": "The Bvss Maratha Student’s Home, rayan circle",
    "dropStop": "The Bvss Maratha Student’s Home, rayan circle",
    "parentContact": "9480602382",
    "parentEmail": "parent.261p3366@transcend.org",
  },
  {
    "studentName": "Pavanashree H",
    "studentId": "251P2082",
    "route": "Route 5",
    "bus": "KA-05-AB-0005",
    "pickupStop": "Thyagarajanagar Chaitanya clinic",
    "dropStop": "Thyagarajanagar Chaitanya clinic",
    "parentContact": "9019973630",
    "parentEmail": "parent.251p2082@transcend.org",
  },
  {
    "studentName": "Yashaswini S",
    "studentId": "251P1821",
    "route": "Route 5",
    "bus": "KA-05-AB-0010",
    "pickupStop": "uma maheshwari temple kr road",
    "dropStop": "uma maheshwari temple kr road",
    "parentContact": "6362541557",
    "parentEmail": "parent.251p1821@transcend.org",
  },
  {
    "studentName": "Veda Rajeev Chavan",
    "studentId": "251P2510",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Behind Gajanan apartment, Indra Canteen Vasanthapura(Drop)",
    "dropStop": "Behind Gajanan apartment, Indra Canteen Vasanthapura(Drop)",
    "parentContact": "9844327884",
    "parentEmail": "parent.251p2510@transcend.org",
  },
  {
    "studentName": "Janaki Srikrishnan",
    "studentId": "251P1301",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "gokulam apartments, doddakalasandra",
    "dropStop": "gokulam apartments, doddakalasandra",
    "parentContact": "9818898270",
    "parentEmail": "parent.251p1301@transcend.org",
  },
  {
    "studentName": "Harshatha S",
    "studentId": "241S1311",
    "route": "Route 6",
    "bus": "KA-06-CD-0000",
    "pickupStop": "Kanti Sweets Doddakalandra",
    "dropStop": "Kanti Sweets Doddakalandra",
    "parentContact": "9972224929",
    "parentEmail": "parent.241s1311@transcend.org",
  },
  {
    "studentName": "Ankitha",
    "studentId": "261P3363",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity Gate 1",
    "dropStop": "Mantri Serenity Gate 1",
    "parentContact": "7358722141",
    "parentEmail": "parent.261p3363@transcend.org",
  },
  {
    "studentName": "Pradyuti Srinath",
    "studentId": "251S1709",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity gate3",
    "dropStop": "Mantri Serenity gate3",
    "parentContact": "9845650200",
    "parentEmail": "parent.251s1709@transcend.org",
  },
  {
    "studentName": "SANSKRITI SHARMA",
    "studentId": "231S1022",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity get 2",
    "dropStop": "Mantri Serenity get 2",
    "parentContact": "9620202515",
    "parentEmail": "parent.231s1022@transcend.org",
  },
  {
    "studentName": "ANIKA TALANKI",
    "studentId": "241S1273",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity get 3",
    "dropStop": "Mantri Serenity get 3",
    "parentContact": "8971907015",
    "parentEmail": "parent.241s1273@transcend.org",
  },
  {
    "studentName": "Yashmith H R",
    "studentId": "251S1624",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity, Gate No2",
    "dropStop": "Mantri Serenity, Gate No2",
    "parentContact": "9591463972",
    "parentEmail": "parent.251s1624@transcend.org",
  },
  {
    "studentName": "Yajath H R",
    "studentId": "251S1625",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "Mantri Serenity, Gate No2, Near Doddakallasandra Metro Station",
    "dropStop": "Mantri Serenity, Gate No2, Near Doddakallasandra Metro Station",
    "parentContact": "9591463972",
    "parentEmail": "parent.251s1624@transcend.org",
  },
  {
    "studentName": "Parnavi Yerrasani",
    "studentId": "261P3072",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Near arunodaya public school, Samastha Hospitals Pvt Ltd uttarahalli main road",
    "dropStop": "Near arunodaya public school, Samastha Hospitals Pvt Ltd uttarahalli main road",
    "parentContact": "8884250006",
    "parentEmail": "parent.261p3072@transcend.org",
  },
  {
    "studentName": "Aditi Aravind Mudhol",
    "studentId": "261P3037",
    "route": "Route 6",
    "bus": "KA-06-CD-0009",
    "pickupStop": "Near Vasanth Vallabha Temple",
    "dropStop": "Near Vasanth Vallabha Temple",
    "parentContact": "9886420822",
    "parentEmail": "parent.261p3037@transcend.org",
  },
  {
    "studentName": "Samiksha Pathronia",
    "studentId": "261P3905",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Pipline road vedanta college",
    "dropStop": "Pipline road vedanta college",
    "parentContact": "9880603849",
    "parentEmail": "parent.261p3905@transcend.org",
  },
  {
    "studentName": "SHRINIKA S",
    "studentId": "211S1013",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "Prestige Falcon city",
    "dropStop": "Prestige Falcon city",
    "parentContact": "9364222122",
    "parentEmail": "parent.211s1013@transcend.org",
  },
  {
    "studentName": "Bhoomika Sheshadri",
    "studentId": "251P1535",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "Prestige Falcon City",
    "dropStop": "Prestige Falcon City",
    "parentContact": "9741881166",
    "parentEmail": "parent.251p1535@transcend.org",
  },
  {
    "studentName": "Jagadish Karthik",
    "studentId": "251P1682",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "Prestige Falcon City",
    "dropStop": "Prestige Falcon City",
    "parentContact": "9004872775",
    "parentEmail": "parent.251p1682@transcend.org",
  },
  {
    "studentName": "DHANYAA SHREE R",
    "studentId": "251S1689",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "Prestige Falcon City",
    "dropStop": "Prestige Falcon City",
    "parentContact": "9845596040",
    "parentEmail": "parent.251s1689@transcend.org",
  },
  {
    "studentName": "Radhika Kamath",
    "studentId": "261P3284",
    "route": "Route 6",
    "bus": "KA-06-CD-0000",
    "pickupStop": "Prestige Falcon City",
    "dropStop": "Prestige Falcon City",
    "parentContact": "9844413877",
    "parentEmail": "parent.261p3284@transcend.org",
  },
  {
    "studentName": "Baani Bararia",
    "studentId": "261P3559",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "Prestige Falcon City",
    "dropStop": "Prestige Falcon City",
    "parentContact": "9341264630",
    "parentEmail": "parent.261p3559@transcend.org",
  },
  {
    "studentName": "Achintya R Kashyap",
    "studentId": "261P3310",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "Prestige Lake Ridge",
    "dropStop": "Prestige Lake Ridge",
    "parentContact": "9980126099",
    "parentEmail": "parent.261p3310@transcend.org",
  },
  {
    "studentName": "Pujita Vijay",
    "studentId": "261P4193",
    "route": "Route 6",
    "bus": "KA-06-CD-0000",
    "pickupStop": "Prestige lake Ridge",
    "dropStop": "Prestige lake Ridge",
    "parentContact": "7829992047",
    "parentEmail": "parent.261p4193@transcend.org",
  },
  {
    "studentName": "Rishi Mohan Kulkarni",
    "studentId": "251P1064",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "prestige Lakeridge",
    "dropStop": "prestige Lakeridge",
    "parentContact": "9845131325",
    "parentEmail": "parent.251p1064@transcend.org",
  },
  {
    "studentName": "Sai Anishka Ravada",
    "studentId": "251P1267",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "prestige Lakeridge",
    "dropStop": "prestige Lakeridge",
    "parentContact": "9619279235",
    "parentEmail": "parent.251p1267@transcend.org",
  },
  {
    "studentName": "Saanvi Vineeth Vastare",
    "studentId": "251P1930",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "prestige Lakeridge",
    "dropStop": "prestige Lakeridge",
    "parentContact": "9886399456",
    "parentEmail": "parent.251p1930@transcend.org",
  },
  {
    "studentName": "Ayush Mohan Kulkarni",
    "studentId": "251S1065",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "prestige Lakeridge",
    "dropStop": "prestige Lakeridge",
    "parentContact": "9880356436",
    "parentEmail": "parent.251s1065@transcend.org",
  },
  {
    "studentName": "VIPULA SHETTY N S",
    "studentId": "251S1825",
    "route": "Route 6",
    "bus": "KA-06-CD-0012",
    "pickupStop": "shree sai palace, doddakallasandra, Drop only",
    "dropStop": "shree sai palace, doddakallasandra, Drop only",
    "parentContact": "9845844513",
    "parentEmail": "parent.251s1825@transcend.org",
  },
  {
    "studentName": "Shaik Kashifah",
    "studentId": "261P4155",
    "route": "Route 6",
    "bus": "KA-06-CD-0007",
    "pickupStop": "The Big Market kanakapura road",
    "dropStop": "The Big Market kanakapura road",
    "parentContact": "9945263202",
    "parentEmail": "parent.261p4155@transcend.org",
  },
  {
    "studentName": "Prateek Sai P",
    "studentId": "261P3267",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Uttarahalli circle",
    "dropStop": "Uttarahalli circle",
    "parentContact": "8050719970",
    "parentEmail": "parent.261p3267@transcend.org",
  },
  {
    "studentName": "Parni Madhusudan",
    "studentId": "261P3270",
    "route": "Route 6",
    "bus": "KA-06-CD-0009",
    "pickupStop": "Vasanthapura Main Rd indra canteen",
    "dropStop": "Vasanthapura Main Rd indra canteen",
    "parentContact": "9845989201",
    "parentEmail": "parent.261p3270@transcend.org",
  },
  {
    "studentName": "Vishal Kumar Gowda",
    "studentId": "261P3168",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Yadalamma nagar bus stop",
    "dropStop": "Yadalamma nagar bus stop",
    "parentContact": "9611366388",
    "parentEmail": "parent.261p3168@transcend.org",
  },
  {
    "studentName": "Abhinav P J",
    "studentId": "261P3148",
    "route": "Route 6",
    "bus": "KA-06-CD-0009",
    "pickupStop": "Yadallamma nagar bus stop",
    "dropStop": "Yadallamma nagar bus stop",
    "parentContact": "9900590065",
    "parentEmail": "parent.261p3148@transcend.org",
  },
  {
    "studentName": "GURUCHARAN Y S",
    "studentId": "231S1036",
    "route": "Route 6",
    "bus": "KA-06-CD-0009",
    "pickupStop": "Yadalum nagar bus stop",
    "dropStop": "Yadalum nagar bus stop",
    "parentContact": "9900477933",
    "parentEmail": "parent.231s1036@transcend.org",
  },
  {
    "studentName": "NIHARIKHAA BHANU",
    "studentId": "251S1293",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "#101 vajarahalli, Shivaganga galax",
    "dropStop": "#101 vajarahalli, Shivaganga galax",
    "parentContact": "9945069958",
    "parentEmail": "parent.251s1293@transcend.org",
  },
  {
    "studentName": "Sanjana Gn",
    "studentId": "261P3887",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Axis bank, narayana nagar 1st Block, doddakallasandra",
    "dropStop": "Axis bank, narayana nagar 1st Block, doddakallasandra",
    "parentContact": "9844423790",
    "parentEmail": "parent.261p3887@transcend.org",
  },
  {
    "studentName": "Suhas",
    "studentId": "261P3409",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "balamuri ganesha temple or asian international public school, Bayanpalya, Balaji Layout, Raghuvanahalli",
    "dropStop": "balamuri ganesha temple or asian international public school, Bayanpalya, Balaji Layout, Raghuvanahalli",
    "parentContact": "8073018866",
    "parentEmail": "parent.261p3409@transcend.org",
  },
  {
    "studentName": "MANVA KULKARNI",
    "studentId": "231S1013",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Behind IndusInd Bank, RMS International",
    "dropStop": "Behind IndusInd Bank, RMS International",
    "parentContact": "9423567567",
    "parentEmail": "parent.231s1013@transcend.org",
  },
  {
    "studentName": "Dhriti",
    "studentId": "251S1896",
    "route": "Route 7",
    "bus": "KA-07-EF-0008",
    "pickupStop": "Behind Krishnam Udupi hotel , Opposite to Narayana clinic",
    "dropStop": "Behind Krishnam Udupi hotel , Opposite to Narayana clinic",
    "parentContact": "9611824787",
    "parentEmail": "parent.251s1896@transcend.org",
  },
  {
    "studentName": "PARIKSHIT",
    "studentId": "251S1895",
    "route": "Route 7",
    "bus": "KA-07-EF-0008",
    "pickupStop": "Behind Krishnam udupi hotel opposite to Narayana clinic",
    "dropStop": "Behind Krishnam udupi hotel opposite to Narayana clinic",
    "parentContact": "9611824787",
    "parentEmail": "parent.251s1896@transcend.org",
  },
  {
    "studentName": "Pranav Prakash Hegde",
    "studentId": "261P3845",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "BehindPVR Superplex Forum Mall South Bengaluru",
    "dropStop": "BehindPVR Superplex Forum Mall South Bengaluru",
    "parentContact": "9886641012",
    "parentEmail": "parent.261p3845@transcend.org",
  },
  {
    "studentName": "HANSIKA RAKESH",
    "studentId": "191S1036",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Car Washing Center, Ganarapalya",
    "dropStop": "Car Washing Center, Ganarapalya",
    "parentContact": "9900048208",
    "parentEmail": "parent.191s1036@transcend.org",
  },
  {
    "studentName": "C MANASVI",
    "studentId": "241S1314",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Doadakallsandra kumaran's school",
    "dropStop": "Doadakallsandra kumaran's school",
    "parentContact": "8978882795/9036168069",
    "parentEmail": "parent.241s1314@transcend.org",
  },
  {
    "studentName": "Aditi Ravikumar",
    "studentId": "261P3252",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Friendly Tails Pet Clinic, iberty Square Apartment, Raghunalli",
    "dropStop": "Friendly Tails Pet Clinic, iberty Square Apartment, Raghunalli",
    "parentContact": "9886096000",
    "parentEmail": "parent.261p3252@transcend.org",
  },
  {
    "studentName": "Yashwanth Gowda R",
    "studentId": "241S1603",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "garbagruha hospital Doddakallasandhra",
    "dropStop": "garbagruha hospital Doddakallasandhra",
    "parentContact": "9900749879",
    "parentEmail": "parent.241s1603@transcend.org",
  },
  {
    "studentName": "ARNAV KRISHNAN",
    "studentId": "231S1052",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Kirshna Temple",
    "dropStop": "Kirshna Temple",
    "parentContact": "9731919279",
    "parentEmail": "parent.231s1052@transcend.org",
  },
  {
    "studentName": "DYAN KRISHNAN",
    "studentId": "241S0188",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Kirshna Temple",
    "dropStop": "Kirshna Temple",
    "parentContact": "9731919279",
    "parentEmail": "parent.231s1052@transcend.org",
  },
  {
    "studentName": "Giyan M Gowda",
    "studentId": "261S1098",
    "route": "Route 7",
    "bus": "KA-07-EF-0000",
    "pickupStop": "KSIT college, Near Zymus hospital",
    "dropStop": "KSIT college, Near Zymus hospital",
    "parentContact": "9480583162",
    "parentEmail": "parent.261s1098@transcend.org",
  },
  {
    "studentName": "SRUSHTHI P VIHAANA",
    "studentId": "231S1101",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Manjunath Medical Shop",
    "dropStop": "Manjunath Medical Shop",
    "parentContact": "9060132692",
    "parentEmail": "parent.231s1101@transcend.org",
  },
  {
    "studentName": "KRISHA SAMRUDHI R",
    "studentId": "201S1024",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Manjunath Pharmacy",
    "dropStop": "Manjunath Pharmacy",
    "parentContact": "9060132692",
    "parentEmail": "parent.231s1101@transcend.org",
  },
  {
    "studentName": "VIDATRI A CHARITHA",
    "studentId": "231S1100",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Manjunatha Medical Shop",
    "dropStop": "Manjunatha Medical Shop",
    "parentContact": "9742022178",
    "parentEmail": "parent.231s1100@transcend.org",
  },
  {
    "studentName": "MYTHILI BHAT",
    "studentId": "241S1123",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "nammura hotel doddakallasandra",
    "dropStop": "nammura hotel doddakallasandra",
    "parentContact": "9844913792",
    "parentEmail": "parent.241s1123@transcend.org",
  },
  {
    "studentName": "Yashomati Nagaraj Nayak",
    "studentId": "261P3840",
    "route": "Route 7",
    "bus": "KA-07-EF-0016",
    "pickupStop": "Namura Uppahar, Doddakalasandra",
    "dropStop": "Namura Uppahar, Doddakalasandra",
    "parentContact": "9482485657",
    "parentEmail": "parent.261p3840@transcend.org",
  },
  {
    "studentName": "CHIRANTHANA R",
    "studentId": "241S1227",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Narayan nagar dodakallasandra",
    "dropStop": "Narayan nagar dodakallasandra",
    "parentContact": "9980012245",
    "parentEmail": "parent.241s1227@transcend.org",
  },
  {
    "studentName": "Naman",
    "studentId": "261P3281",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Narayana Nagar 1st Block, Doddakalasandra",
    "dropStop": "Narayana Nagar 1st Block, Doddakalasandra",
    "parentContact": "8884332666",
    "parentEmail": "parent.261p3281@transcend.org",
  },
  {
    "studentName": "Anika Naidu",
    "studentId": "251P2361",
    "route": "Route 7",
    "bus": "KA-07-EF-0013",
    "pickupStop": "Near Parjna Bharathi Vidyalaya, Dodakallasandra",
    "dropStop": "Near Parjna Bharathi Vidyalaya, Dodakallasandra",
    "parentContact": "9611131423",
    "parentEmail": "parent.251p2361@transcend.org",
  },
  {
    "studentName": "Anvitha Ravi",
    "studentId": "231S1017",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Near Shobha forest view apartment",
    "dropStop": "Near Shobha forest view apartment",
    "parentContact": "8722896547",
    "parentEmail": "parent.231s1017@transcend.org",
  },
  {
    "studentName": "Jeevitha S",
    "studentId": "261P3145",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Near Suraj ganga apartment, bayanpalya",
    "dropStop": "Near Suraj ganga apartment, bayanpalya",
    "parentContact": "9945915898",
    "parentEmail": "parent.261p3145@transcend.org",
  },
  {
    "studentName": "Sarthak Gade",
    "studentId": "261P3424",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Near to KSIT college, Raghuvanhalli.",
    "dropStop": "Near to KSIT college, Raghuvanhalli.",
    "parentContact": "8884421899",
    "parentEmail": "parent.261p3424@transcend.org",
  },
  {
    "studentName": "Moulya Nishanth Hiremath",
    "studentId": "261P3485",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Near Vajaralli Metro Station, Kanakapura Road",
    "dropStop": "Near Vajaralli Metro Station, Kanakapura Road",
    "parentContact": "9741192430",
    "parentEmail": "parent.261p3485@transcend.org",
  },
  {
    "studentName": "Saanvi Hardur",
    "studentId": "261P3296",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Opp to temple park, Sgs Parkview, Narayana Nagar",
    "dropStop": "Opp to temple park, Sgs Parkview, Narayana Nagar",
    "parentContact": "9945733668",
    "parentEmail": "parent.261p3296@transcend.org",
  },
  {
    "studentName": "Sarayu Pala",
    "studentId": "261P3376",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Opposite to zymus hospital and before vajarahalli metro station",
    "dropStop": "Opposite to zymus hospital and before vajarahalli metro station",
    "parentContact": "9900145332",
    "parentEmail": "parent.261p3376@transcend.org",
  },
  {
    "studentName": "Bhuvitha Ravi",
    "studentId": "221S0007",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Shoba Forest Vajarahalli",
    "dropStop": "Shoba Forest Vajarahalli",
    "parentContact": "8722896547",
    "parentEmail": "parent.231s1017@transcend.org",
  },
  {
    "studentName": "Anand B Nair",
    "studentId": "261P3257",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Sobha Forest View, 100 Feet Rd, off Kanakapura Main Road, Banashankari 6th Stage",
    "dropStop": "Sobha Forest View, 100 Feet Rd, off Kanakapura Main Road, Banashankari 6th Stage",
    "parentContact": "9341221015",
    "parentEmail": "parent.261p3257@transcend.org",
  },
  {
    "studentName": "N Bhargava Bairy",
    "studentId": "261P3670",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Sobha Forest View, Kanakapura Main Road",
    "dropStop": "Sobha Forest View, Kanakapura Main Road",
    "parentContact": "9980788083",
    "parentEmail": "parent.261p3670@transcend.org",
  },
  {
    "studentName": "Mithun N Gowda",
    "studentId": "261P4102",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Sophia English School,Near D mart kanakapura main road vajarahalli",
    "dropStop": "Sophia English School,Near D mart kanakapura main road vajarahalli",
    "parentContact": "9945876555",
    "parentEmail": "parent.261p4102@transcend.org",
  },
  {
    "studentName": "Aditi Dushyanth",
    "studentId": "231S1069",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Uma Maheshwara Temple road, ISR Uttam Apartment",
    "dropStop": "Uma Maheshwara Temple road, ISR Uttam Apartment",
    "parentContact": "9900048206",
    "parentEmail": "parent.231s1069@transcend.org",
  },
  {
    "studentName": "Reyansh B Patel",
    "studentId": "261S1047",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Vajarahalli, Bangalore City Municipal Corporation Layout, Metro Pillar 227(Drop Only)",
    "dropStop": "Vajarahalli, Bangalore City Municipal Corporation Layout, Metro Pillar 227(Drop Only)",
    "parentContact": "7760745711",
    "parentEmail": "parent.261s1047@transcend.org",
  },
  {
    "studentName": "AANYA S",
    "studentId": "241S1463",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Vajrahalli metro station",
    "dropStop": "Vajrahalli metro station",
    "parentContact": "9686191891",
    "parentEmail": "parent.241s1463@transcend.org",
  },
  {
    "studentName": "MANYU CHANDAN",
    "studentId": "251S1667",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Vajrahalli metro station",
    "dropStop": "Vajrahalli metro station",
    "parentContact": "8105619513/7022528783",
    "parentEmail": "parent.251s1667@transcend.org",
  },
  {
    "studentName": "Simrita Siri Raj",
    "studentId": "261P3260",
    "route": "Route 7",
    "bus": "KA-07-EF-0012",
    "pickupStop": "Wings 5 apartment, Near Karishma hills",
    "dropStop": "Wings 5 apartment, Near Karishma hills",
    "parentContact": "9886200500",
    "parentEmail": "parent.261p3260@transcend.org",
  },
  {
    "studentName": "Anshul Kumar",
    "studentId": "251P1589",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "JP Nagar 2nd Phase",
    "dropStop": "JP Nagar 2nd Phase",
    "parentContact": "9741410839",
    "parentEmail": "parent.251p1589@transcend.org",
  },
  {
    "studentName": "H. Aditi Niranjanaa",
    "studentId": "251P1259",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Shanthi Park Apartments, Marenahalli Road",
    "dropStop": "Shanthi Park Apartments, Marenahalli Road",
    "parentContact": "7674909555",
    "parentEmail": "parent.251p1259@transcend.org",
  },
  {
    "studentName": "Keerthan Satish",
    "studentId": "251P1934",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "#325,3rd main, 4th cross 3rd phase j p nagar",
    "dropStop": "#325,3rd main, 4th cross 3rd phase j p nagar",
    "parentContact": "9900909086",
    "parentEmail": "parent.251p1934@transcend.org",
  },
  {
    "studentName": "JANHAVI V A",
    "studentId": "201S1010",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Central Mall",
    "dropStop": "Central Mall",
    "parentContact": "9845445551",
    "parentEmail": "parent.201s1010@transcend.org",
  },
  {
    "studentName": "KUSHI V A",
    "studentId": "221S1018",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Central Mall",
    "dropStop": "Central Mall",
    "parentContact": "9845445551",
    "parentEmail": "parent.201s1010@transcend.org",
  },
  {
    "studentName": "Anika Aanya",
    "studentId": "261P3522",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "East end",
    "dropStop": "East end",
    "parentContact": "8050864966",
    "parentEmail": "parent.261p3522@transcend.org",
  },
  {
    "studentName": "Soni A S",
    "studentId": "251S1653",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Green City Hospital Nandhi Hotel Road",
    "dropStop": "Green City Hospital Nandhi Hotel Road",
    "parentContact": "9880734290",
    "parentEmail": "parent.251s1653@transcend.org",
  },
  {
    "studentName": "Renith Jaykar Nuthalapati",
    "studentId": "241S1488",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Inchara Hotel",
    "dropStop": "Inchara Hotel",
    "parentContact": "9632770450",
    "parentEmail": "parent.241s1488@transcend.org",
  },
  {
    "studentName": "Siri Chunchu",
    "studentId": "261P4152",
    "route": "Route 8",
    "bus": "KA-08-GH-0013",
    "pickupStop": "Jp nagar police station",
    "dropStop": "Jp nagar police station",
    "parentContact": "9986006007",
    "parentEmail": "parent.261p4152@transcend.org",
  },
  {
    "studentName": "Ananya Bandhole",
    "studentId": "261P4001",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "KEB road/Bangalore one",
    "dropStop": "KEB road/Bangalore one",
    "parentContact": "9845450110",
    "parentEmail": "parent.261p4001@transcend.org",
  },
  {
    "studentName": "ANVITA K S",
    "studentId": "231S1002",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Nandhi Hotel",
    "dropStop": "Nandhi Hotel",
    "parentContact": "9945668867",
    "parentEmail": "parent.231s1002@transcend.org",
  },
  {
    "studentName": "Dakshith Palaka",
    "studentId": "241S1536",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Nandhi Hotel",
    "dropStop": "Nandhi Hotel",
    "parentContact": "8050682808",
    "parentEmail": "parent.241s1536@transcend.org",
  },
  {
    "studentName": "Dhruva C Gowda",
    "studentId": "261P4010",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Nandini lake view apartment, Puttenahalli, Phase 7, J. P. Nagar",
    "dropStop": "Nandini lake view apartment, Puttenahalli, Phase 7, J. P. Nagar",
    "parentContact": "9036058109",
    "parentEmail": "parent.261p4010@transcend.org",
  },
  {
    "studentName": "Roshan Utukuri",
    "studentId": "261P3181",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Near Narayana School, J.P.Nagar 5th Phase, Mahaveer Riviera Apartment",
    "dropStop": "Near Narayana School, J.P.Nagar 5th Phase, Mahaveer Riviera Apartment",
    "parentContact": "9916077277",
    "parentEmail": "parent.261p3181@transcend.org",
  },
  {
    "studentName": "Saanvi Yarala",
    "studentId": "261P3340",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Near Tirumalagiri Venkateshwara Temple",
    "dropStop": "Near Tirumalagiri Venkateshwara Temple",
    "parentContact": "9886398351",
    "parentEmail": "parent.261p3340@transcend.org",
  },
  {
    "studentName": "Ira S Shetty",
    "studentId": "261P3605",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Next to Narayana school, MANJUNATHA MOTORS JP Nagar 7th Phase",
    "dropStop": "Next to Narayana school, MANJUNATHA MOTORS JP Nagar 7th Phase",
    "parentContact": "9845378654",
    "parentEmail": "parent.261p3605@transcend.org",
  },
  {
    "studentName": "Prithvi Kedilaya",
    "studentId": "251P1798",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Opposite Brigade Palmsprings",
    "dropStop": "Opposite Brigade Palmsprings",
    "parentContact": "9341228868",
    "parentEmail": "parent.251p1798@transcend.org",
  },
  {
    "studentName": "Nihal Bennadi",
    "studentId": "261P3510",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Phoenix Women and Cardiac Center, KSRTC Layout, 2nd Phase, J. P. Nagar",
    "dropStop": "Phoenix Women and Cardiac Center, KSRTC Layout, 2nd Phase, J. P. Nagar",
    "parentContact": "9036239060",
    "parentEmail": "parent.261p3510@transcend.org",
  },
  {
    "studentName": "Khushumithaa Ramnath",
    "studentId": "251P1867",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Puttenhalli circle",
    "dropStop": "Puttenhalli circle",
    "parentContact": "9019164725",
    "parentEmail": "parent.251p1867@transcend.org",
  },
  {
    "studentName": "Preeti Krishna P",
    "studentId": "251P2342",
    "route": "Route 8",
    "bus": "KA-08-GH-0000",
    "pickupStop": "Ragigudda Anjaneya Temple Arch",
    "dropStop": "Ragigudda Anjaneya Temple Arch",
    "parentContact": "9845023295",
    "parentEmail": "parent.251p2342@transcend.org",
  },
  {
    "studentName": "VIBHU K VIRALAM",
    "studentId": "221S1067",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Royal High school,",
    "dropStop": "Royal High school,",
    "parentContact": "9980553908",
    "parentEmail": "parent.221s1067@transcend.org",
  },
  {
    "studentName": "Rishi D R",
    "studentId": "251P1059",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Royal High school,",
    "dropStop": "Royal High school,",
    "parentContact": "9880483873",
    "parentEmail": "parent.251p1059@transcend.org",
  },
  {
    "studentName": "Safaa Siddiqa",
    "studentId": "251P1839",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Royal High school,",
    "dropStop": "Royal High school,",
    "parentContact": "8861275488",
    "parentEmail": "parent.251p1839@transcend.org",
  },
  {
    "studentName": "Namit Mittal",
    "studentId": "251P2483",
    "route": "Route 8",
    "bus": "KA-08-GH-0009",
    "pickupStop": "Royal School, 24th Main Road JP Nagar",
    "dropStop": "Royal School, 24th Main Road JP Nagar",
    "parentContact": "9844412138",
    "parentEmail": "parent.251p2483@transcend.org",
  },
  {
    "studentName": "Sahasra Palaka",
    "studentId": "261S1064",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "samskruti conventional hall, JP Nagar 7th Phase",
    "dropStop": "samskruti conventional hall, JP Nagar 7th Phase",
    "parentContact": "8050682808",
    "parentEmail": "parent.241s1536@transcend.org",
  },
  {
    "studentName": "Nayanika MC",
    "studentId": "261P3859",
    "route": "Route 8",
    "bus": "KA-08-GH-0013",
    "pickupStop": "Sana super market, 24th main jp nagar",
    "dropStop": "Sana super market, 24th main jp nagar",
    "parentContact": "9844062170",
    "parentEmail": "parent.261p3859@transcend.org",
  },
  {
    "studentName": "Hemanth Rao B",
    "studentId": "241S2186",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Siddeshwara Theater",
    "dropStop": "Siddeshwara Theater",
    "parentContact": "7019702416",
    "parentEmail": "parent.241s2186@transcend.org",
  },
  {
    "studentName": "Thajna Thangamma K P",
    "studentId": "261P3464",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Sri Chaitanya PU college , JP Nagar 7th phase",
    "dropStop": "Sri Chaitanya PU college , JP Nagar 7th phase",
    "parentContact": "9880595900",
    "parentEmail": "parent.261p3464@transcend.org",
  },
  {
    "studentName": "SAIAKSHI C S",
    "studentId": "231S1049",
    "route": "Route 8",
    "bus": "KA-08-GH-0008",
    "pickupStop": "Venkateshwara Temple(Central Mall Road)",
    "dropStop": "Venkateshwara Temple(Central Mall Road)",
    "parentContact": "9739656914",
    "parentEmail": "parent.231s1049@transcend.org",
  },
  {
    "studentName": "Sampada Lakkur Prakasha",
    "studentId": "261P3944",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Near Sri Chaitanya Techno School",
    "dropStop": "Near Sri Chaitanya Techno School",
    "parentContact": "9900567549",
    "parentEmail": "parent.261p3944@transcend.org",
  },
  {
    "studentName": "Shantanu Basidoni",
    "studentId": "251P1179",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "(shriram adithya apartments) Naidu layout, chikkhalsandr",
    "dropStop": "(shriram adithya apartments) Naidu layout, chikkhalsandr",
    "parentContact": "9945686776",
    "parentEmail": "parent.251p1179@transcend.org",
  },
  {
    "studentName": "Saiyam Jain",
    "studentId": "251P2164",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "(Sri ram Adithya apartment) Shriram Adithya Apartmen",
    "dropStop": "(Sri ram Adithya apartment) Shriram Adithya Apartmen",
    "parentContact": "9945260041",
    "parentEmail": "parent.251p2164@transcend.org",
  },
  {
    "studentName": "Janani R",
    "studentId": "251P1890",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "#104, V2 Poorvi Enclave, A Block Hanumahills Layout, Arehalli",
    "dropStop": "#104, V2 Poorvi Enclave, A Block Hanumahills Layout, Arehalli",
    "parentContact": "9845234245",
    "parentEmail": "parent.251p1890@transcend.org",
  },
  {
    "studentName": "Charitra Ramesh G",
    "studentId": "251P1726",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "12, Nisarga,19 Cross, Krishnaiah Layout, Ittamadu,",
    "dropStop": "12, Nisarga,19 Cross, Krishnaiah Layout, Ittamadu,",
    "parentContact": "9620231133",
    "parentEmail": "parent.251p1726@transcend.org",
  },
  {
    "studentName": "Shravya S",
    "studentId": "261P4103",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Abbaiah Naidu Studio, Chikkalasandra",
    "dropStop": "Abbaiah Naidu Studio, Chikkalasandra",
    "parentContact": "9886618661",
    "parentEmail": "parent.261p4103@transcend.org",
  },
  {
    "studentName": "Charan Sai P R",
    "studentId": "261P3149",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "ABBIAH NAIDU STUDIO LAYOUT, CHIKKALASANDRA",
    "dropStop": "ABBIAH NAIDU STUDIO LAYOUT, CHIKKALASANDRA",
    "parentContact": "9480742050",
    "parentEmail": "parent.261p3149@transcend.org",
  },
  {
    "studentName": "Tripti Krishna",
    "studentId": "261P3023",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Arahalli Arch, Taja Cake",
    "dropStop": "Arahalli Arch, Taja Cake",
    "parentContact": "9900195695",
    "parentEmail": "parent.261p3023@transcend.org",
  },
  {
    "studentName": "Dhatri Upasana R",
    "studentId": "251P2113",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Arehalli, Near 45D bus stop",
    "dropStop": "Arehalli, Near 45D bus stop",
    "parentContact": "9880499988",
    "parentEmail": "parent.251p2113@transcend.org",
  },
  {
    "studentName": "Vishal Rajiv P",
    "studentId": "261P4035",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Ashwathkatte road chickalasandra, Areli mara Nandini Booth",
    "dropStop": "Ashwathkatte road chickalasandra, Areli mara Nandini Booth",
    "parentContact": "9449859549/9448050893",
    "parentEmail": "parent.261p4035@transcend.org",
  },
  {
    "studentName": "NAKSHA SHETTY",
    "studentId": "241S1412",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Big Basket Gowdan",
    "dropStop": "Big Basket Gowdan",
    "parentContact": "9343023777",
    "parentEmail": "parent.241s1412@transcend.org",
  },
  {
    "studentName": "Priyanka P",
    "studentId": "261P3784",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Brindavan Upachar Hotel, Ramanjaneyanagar",
    "dropStop": "Brindavan Upachar Hotel, Ramanjaneyanagar",
    "parentContact": "9880141927",
    "parentEmail": "parent.261p3784@transcend.org",
  },
  {
    "studentName": "Aneesh Maiya",
    "studentId": "261P3577",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Brundavan hotel chikkallasandra",
    "dropStop": "Brundavan hotel chikkallasandra",
    "parentContact": "7899956262",
    "parentEmail": "parent.261p3577@transcend.org",
  },
  {
    "studentName": "G Lisha",
    "studentId": "251P1617",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Brundhavan Upachar Ramanjeneya layout",
    "dropStop": "Brundhavan Upachar Ramanjeneya layout",
    "parentContact": "9842139914",
    "parentEmail": "parent.251p1617@transcend.org",
  },
  {
    "studentName": "Rutu Rajesh",
    "studentId": "261P3737",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "DEEKSHA ENTERPRISES (XEROX 75 paise) - Xerox in chikkalasandra",
    "dropStop": "DEEKSHA ENTERPRISES (XEROX 75 paise) - Xerox in chikkalasandra",
    "parentContact": "7676182448",
    "parentEmail": "parent.261p3737@transcend.org",
  },
  {
    "studentName": "Himani S Gowda",
    "studentId": "261P3773",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Ittamadu, Near Shri Raghavendra Swamy Matha",
    "dropStop": "Ittamadu, Near Shri Raghavendra Swamy Matha",
    "parentContact": "9880988056",
    "parentEmail": "parent.261p3773@transcend.org",
  },
  {
    "studentName": "Jaagriti. G",
    "studentId": "251P1340",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Krishna apartment, near Arehalli arch, Uttarahalli,",
    "dropStop": "Krishna apartment, near Arehalli arch, Uttarahalli,",
    "parentContact": "9980022684",
    "parentEmail": "parent.251p1340@transcend.org",
  },
  {
    "studentName": "Rishi H U",
    "studentId": "251P2121",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "M R SANNIDHI APARTMENT, (GARUDA BLOCK),AREHALL",
    "dropStop": "M R SANNIDHI APARTMENT, (GARUDA BLOCK),AREHALL",
    "parentContact": "9740182248",
    "parentEmail": "parent.251p2121@transcend.org",
  },
  {
    "studentName": "Surabhi Shastry",
    "studentId": "261P3189",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Manjunatha Wines, Ittamadu",
    "dropStop": "Manjunatha Wines, Ittamadu",
    "parentContact": "9845204859",
    "parentEmail": "parent.261p3189@transcend.org",
  },
  {
    "studentName": "Upadhya Kumbashi Guruprasad Avani",
    "studentId": "251P1269",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Mars Planet Apartment",
    "dropStop": "Mars Planet Apartment",
    "parentContact": "8296063907",
    "parentEmail": "parent.251p1269@transcend.org",
  },
  {
    "studentName": "Ruchir A",
    "studentId": "261P3350",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Nandhini Milk Booth, Ramanjaneyanagar, Chikkalasandra",
    "dropStop": "Nandhini Milk Booth, Ramanjaneyanagar, Chikkalasandra",
    "parentContact": "9845982069",
    "parentEmail": "parent.261p3350@transcend.org",
  },
  {
    "studentName": "Anvitha R",
    "studentId": "261P3668",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Nandhini Milk Booth, Ramanjaneyanagar, Chikkalasandra",
    "dropStop": "Nandhini Milk Booth, Ramanjaneyanagar, Chikkalasandra",
    "parentContact": "9740023941",
    "parentEmail": "parent.261p3668@transcend.org",
  },
  {
    "studentName": "D N Kharthika",
    "studentId": "251P1793",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Naveen DN Krishna Appartments Arehalli",
    "dropStop": "Naveen DN Krishna Appartments Arehalli",
    "parentContact": "7483198822",
    "parentEmail": "parent.251p1793@transcend.org",
  },
  {
    "studentName": "Namrata",
    "studentId": "261P3406",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Near abbayi naidu studio, chikkalasandra",
    "dropStop": "Near abbayi naidu studio, chikkalasandra",
    "parentContact": "9448570707",
    "parentEmail": "parent.261p3406@transcend.org",
  },
  {
    "studentName": "Kamalashree Vishnumurthy",
    "studentId": "261P3724",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Near Chaitanya college, Taja Cake",
    "dropStop": "Near Chaitanya college, Taja Cake",
    "parentContact": "9164332868",
    "parentEmail": "parent.261p3724@transcend.org",
  },
  {
    "studentName": "Rohan S Bhat",
    "studentId": "261P3308",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Near Hotchips, Chikkallasandra road",
    "dropStop": "Near Hotchips, Chikkallasandra road",
    "parentContact": "9880036715",
    "parentEmail": "parent.261p3308@transcend.org",
  },
  {
    "studentName": "Vidisha Rajaram Pai",
    "studentId": "251P1220",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Near Ramanajaneyanagar BMTC last bus stop",
    "dropStop": "Near Ramanajaneyanagar BMTC last bus stop",
    "parentContact": "9916444502",
    "parentEmail": "parent.251p1220@transcend.org",
  },
  {
    "studentName": "Shravani Kulkarni",
    "studentId": "261P4221",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Near Sri Chaitanya Techno School",
    "dropStop": "Near Sri Chaitanya Techno School",
    "parentContact": "9972861804",
    "parentEmail": "parent.261p4221@transcend.org",
  },
  {
    "studentName": "Hasini U",
    "studentId": "251P1038",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Near TATA PROMONT",
    "dropStop": "Near TATA PROMONT",
    "parentContact": "9945024801",
    "parentEmail": "parent.251p1038@transcend.org",
  },
  {
    "studentName": "M S Shriya",
    "studentId": "261P3261",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Near to kaggis bakery - bank colony, Chikkallsandra",
    "dropStop": "Near to kaggis bakery - bank colony, Chikkallsandra",
    "parentContact": "9901385203",
    "parentEmail": "parent.261p3261@transcend.org",
  },
  {
    "studentName": "Nesara H Joshi",
    "studentId": "261S1051",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Nehind Interactive Preschool, Sarvabhoumanagara, chikkalasandra",
    "dropStop": "Nehind Interactive Preschool, Sarvabhoumanagara, chikkalasandra",
    "parentContact": "9591576576",
    "parentEmail": "parent.261s1051@transcend.org",
  },
  {
    "studentName": "P Siddharth Kumar",
    "studentId": "261P3039",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Next to Mythri Aditya Apartments, arahalli KEB",
    "dropStop": "Next to Mythri Aditya Apartments, arahalli KEB",
    "parentContact": "9663672013",
    "parentEmail": "parent.261p3039@transcend.org",
  },
  {
    "studentName": "Sushmasri",
    "studentId": "261P3508",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Opp Arka Lotus Apartment brindavan hotel",
    "dropStop": "Opp Arka Lotus Apartment brindavan hotel",
    "parentContact": "9880911833",
    "parentEmail": "parent.261p3508@transcend.org",
  },
  {
    "studentName": "Sanmitra Shivanand Bhat",
    "studentId": "261P3504",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Opposite Mars Mount near Tata Promont",
    "dropStop": "Opposite Mars Mount near Tata Promont",
    "parentContact": "9936865674",
    "parentEmail": "parent.261p3504@transcend.org",
  },
  {
    "studentName": "Viha Venugopal",
    "studentId": "261P3420",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Pickup Tata paramount, Hoskerehalli, Ittumadu Drop JP Nagar 1st meeraambika school",
    "dropStop": "Pickup Tata paramount, Hoskerehalli, Ittumadu Drop JP Nagar 1st meeraambika school",
    "parentContact": "9845140874",
    "parentEmail": "parent.261p3420@transcend.org",
  },
  {
    "studentName": "Kartik Tatti",
    "studentId": "261P3413",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "ramanjaneya nagar chikkalasandra last bus stop",
    "dropStop": "ramanjaneya nagar chikkalasandra last bus stop",
    "parentContact": "9986072048",
    "parentEmail": "parent.261p3413@transcend.org",
  },
  {
    "studentName": "Piyusha Rajaram Pai",
    "studentId": "251P1191",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Ramanjaneyanagar BMTC Last Bus Stop",
    "dropStop": "Ramanjaneyanagar BMTC Last Bus Stop",
    "parentContact": "9916444502",
    "parentEmail": "parent.251p1220@transcend.org",
  },
  {
    "studentName": "Adity Prakash",
    "studentId": "251P1565",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Ramapriya Brundavan Gardenia Arehalli, Hanumagiri layout",
    "dropStop": "Ramapriya Brundavan Gardenia Arehalli, Hanumagiri layout",
    "parentContact": "9880417551",
    "parentEmail": "parent.251p1565@transcend.org",
  },
  {
    "studentName": "Aditri Kulkarni",
    "studentId": "261P3230",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Ramapriya Brundavan Gardenia, Near Ramadev Medicals, Arehalli, Uttarahalli",
    "dropStop": "Ramapriya Brundavan Gardenia, Near Ramadev Medicals, Arehalli, Uttarahalli",
    "parentContact": "9886038960",
    "parentEmail": "parent.261p3230@transcend.org",
  },
  {
    "studentName": "Vibha Ashok",
    "studentId": "251P1037",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Saketh Hillside, Gurudatta Layout, Hosakerehalli",
    "dropStop": "Saketh Hillside, Gurudatta Layout, Hosakerehalli",
    "parentContact": "8861005338",
    "parentEmail": "parent.251p1037@transcend.org",
  },
  {
    "studentName": "Seemona Singh",
    "studentId": "251P1201",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "SHRIRAM ADITHYA APT ITTAMADU BSK 3rd Stage Banashankri",
    "dropStop": "SHRIRAM ADITHYA APT ITTAMADU BSK 3rd Stage Banashankri",
    "parentContact": "8277564164",
    "parentEmail": "parent.251p1201@transcend.org",
  },
  {
    "studentName": "Aditi Ravi Kumar",
    "studentId": "261P3051",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "SVS school, CHAITRASHREE LANDMARK KEB Arehalli",
    "dropStop": "SVS school, CHAITRASHREE LANDMARK KEB Arehalli",
    "parentContact": "7337808294",
    "parentEmail": "parent.261p3051@transcend.org",
  },
  {
    "studentName": "Smritishri N G",
    "studentId": "251P2228",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Tata paramount Hoskerehalli",
    "dropStop": "Tata paramount Hoskerehalli",
    "parentContact": "7400065466",
    "parentEmail": "parent.251p2228@transcend.org",
  },
  {
    "studentName": "Akshaj Uppal",
    "studentId": "261P4119",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "Tata promont",
    "dropStop": "Tata promont",
    "parentContact": "9902826826",
    "parentEmail": "parent.261p4119@transcend.org",
  },
  {
    "studentName": "Niharika v gujjar",
    "studentId": "261P3447",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Tata Promont Apartment",
    "dropStop": "Tata Promont Apartment",
    "parentContact": "9740875554",
    "parentEmail": "parent.261p3447@transcend.org",
  },
  {
    "studentName": "Dhriti Pradeep",
    "studentId": "261P3572",
    "route": "Route 9",
    "bus": "KA-09-IJ-0002",
    "pickupStop": "The Promont (Tata Housing)",
    "dropStop": "The Promont (Tata Housing)",
    "parentContact": "9312602442",
    "parentEmail": "parent.261p3572@transcend.org",
  },
  {
    "studentName": "Shivangi Singh",
    "studentId": "251P1674",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "(BNMIT)1918, 'Kailash', 31st Banashankari",
    "dropStop": "(BNMIT)1918, 'Kailash', 31st Banashankari",
    "parentContact": "9886020911",
    "parentEmail": "parent.251p1674@transcend.org",
  },
  {
    "studentName": "Stuti Sai",
    "studentId": "251P2028",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "#1356, Rajan's Castl, Srinivasnagr",
    "dropStop": "#1356, Rajan's Castl, Srinivasnagr",
    "parentContact": "9886398812",
    "parentEmail": "parent.251p2028@transcend.org",
  },
  {
    "studentName": "Aneesh Jaya Mohan",
    "studentId": "251P1094",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "4TH MAIN, 6TH CROSS, BANASHANKARI 3RD STAGE, 3RD PHASE,",
    "dropStop": "4TH MAIN, 6TH CROSS, BANASHANKARI 3RD STAGE, 3RD PHASE,",
    "parentContact": "9901599773",
    "parentEmail": "parent.251p1094@transcend.org",
  },
  {
    "studentName": "Diganth D",
    "studentId": "261P3115",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "AIRD education centre, Vidyapeetha circle",
    "dropStop": "AIRD education centre, Vidyapeetha circle",
    "parentContact": "9845450327",
    "parentEmail": "parent.261p3115@transcend.org",
  },
  {
    "studentName": "Tanay Ashwin Adiga",
    "studentId": "261P3138",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Apollo Pharmacy near ITI colony bustop,Vidyapeetha Circle",
    "dropStop": "Apollo Pharmacy near ITI colony bustop,Vidyapeetha Circle",
    "parentContact": "9448989869",
    "parentEmail": "parent.261p3138@transcend.org",
  },
  {
    "studentName": "Tasya Bn",
    "studentId": "261P3390",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Banashankari referral hospital, BNM College",
    "dropStop": "Banashankari referral hospital, BNM College",
    "parentContact": "9880211339",
    "parentEmail": "parent.261p3390@transcend.org",
  },
  {
    "studentName": "Sourabh Brijesh",
    "studentId": "261P3412",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Bata Shoe Store, Srinivas Nagar",
    "dropStop": "Bata Shoe Store, Srinivas Nagar",
    "parentContact": "9845054506",
    "parentEmail": "parent.261p3412@transcend.org",
  },
  {
    "studentName": "NIHAL SAI B A",
    "studentId": "241S1011",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "BATA SHOWROOM, SRINIVAS NAGAR",
    "dropStop": "BATA SHOWROOM, SRINIVAS NAGAR",
    "parentContact": "9845166171",
    "parentEmail": "parent.241s1011@transcend.org",
  },
  {
    "studentName": "PARNIKA JADAV P",
    "studentId": "251S1320",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "BDA Complex(Only Drop)",
    "dropStop": "BDA Complex(Only Drop)",
    "parentContact": "9164740743",
    "parentEmail": "parent.251s1320@transcend.org",
  },
  {
    "studentName": "Anagha B",
    "studentId": "261P3377",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "Behind Master Hirannayya House Near Kids Adda(Royal Enfield Showroom Thagyaraj Nagar)",
    "dropStop": "Behind Master Hirannayya House Near Kids Adda(Royal Enfield Showroom Thagyaraj Nagar)",
    "parentContact": "8553697015",
    "parentEmail": "parent.261p3377@transcend.org",
  },
  {
    "studentName": "Eesha B Shah",
    "studentId": "261P4101",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "Bharat Gas Krishna College kathriguppe",
    "dropStop": "Bharat Gas Krishna College kathriguppe",
    "parentContact": "9379055573",
    "parentEmail": "parent.261p4101@transcend.org",
  },
  {
    "studentName": "K Chakradhar",
    "studentId": "251P2457",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "BMTC Nandi Milk Boot, Chanamankera achukatu",
    "dropStop": "C K achkut bus stop",
    "parentContact": "9448890048",
    "parentEmail": "parent.251p2457@transcend.org",
  },
  {
    "studentName": "Yuvanitin V R",
    "studentId": "251P2421",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "BNM College",
    "dropStop": "BNM College",
    "parentContact": "8105830340",
    "parentEmail": "parent.251p2421@transcend.org",
  },
  {
    "studentName": "Nagar Satyaprasad Nayak",
    "studentId": "261P3571",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "carvery nagar bsk 2nd stage",
    "dropStop": "carvery nagar bsk 2nd stage",
    "parentContact": "9741501910",
    "parentEmail": "parent.261p3571@transcend.org",
  },
  {
    "studentName": "B R Binitha",
    "studentId": "261P3626",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Chandrodaya Cinemas, Vidyapeeta",
    "dropStop": "Chandrodaya Cinemas, Vidyapeeta",
    "parentContact": "9443082948",
    "parentEmail": "parent.261p3626@transcend.org",
  },
  {
    "studentName": "Avni Madhusoodan",
    "studentId": "261P3011",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "COCOA BAKES, Banashankari Stage II",
    "dropStop": "COCOA BAKES, Banashankari Stage II",
    "parentContact": "7019190506",
    "parentEmail": "parent.261p3011@transcend.org",
  },
  {
    "studentName": "SAI SUKRITI H",
    "studentId": "231S1019",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "D Mart(Namdhari)",
    "dropStop": "D Mart(Namdhari)",
    "parentContact": "9886201861",
    "parentEmail": "parent.231s1019@transcend.org",
  },
  {
    "studentName": "Stuthi B N",
    "studentId": "261P3014",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Diagonally opposite to Banashankari Referral Hospital",
    "dropStop": "Diagonally opposite to Banashankari Referral Hospital",
    "parentContact": "9880211339",
    "parentEmail": "parent.261p3390@transcend.org",
  },
  {
    "studentName": "Vaishnavi s shetty",
    "studentId": "261P3834",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Mother hood hospital banashankri 3rd stage",
    "dropStop": "Mother hood hospital banashankri 3rd stage",
    "parentContact": "9448090792",
    "parentEmail": "parent.261p3834@transcend.org",
  },
  {
    "studentName": "Samrudhi K",
    "studentId": "261P3073",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Mother hood hospital bsk rd stage",
    "dropStop": "Mother hood hospital bsk rd stage",
    "parentContact": "8073622108",
    "parentEmail": "parent.261p3073@transcend.org",
  },
  {
    "studentName": "RITHVIK V BOHARA",
    "studentId": "241S1649",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Nayara Petrol Pump",
    "dropStop": "Nayara Petrol Pump",
    "parentContact": "8904141411",
    "parentEmail": "parent.241s1649@transcend.org",
  },
  {
    "studentName": "Ritvik A Iyer",
    "studentId": "261S1044",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near Banashankari BDA Complex",
    "dropStop": "Near Banashankari BDA Complex",
    "parentContact": "9845506633",
    "parentEmail": "parent.261s1044@transcend.org",
  },
  {
    "studentName": "Anshul Kiran",
    "studentId": "261P3677",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near BNM School/BDA Complex",
    "dropStop": "Near BNM School/BDA Complex",
    "parentContact": "9880018947",
    "parentEmail": "parent.261p3677@transcend.org",
  },
  {
    "studentName": "Aanya Kiran",
    "studentId": "261P3328",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near bsk bda complex or monotype",
    "dropStop": "Near bsk bda complex or monotype",
    "parentContact": "9880018947",
    "parentEmail": "parent.261p3677@transcend.org",
  },
  {
    "studentName": "Manadha Venkatesha Murthy",
    "studentId": "261P4214",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near Chennammanakere basket ball court",
    "dropStop": "Near Chennammanakere basket ball court",
    "parentContact": "7483276662",
    "parentEmail": "parent.261p4214@transcend.org",
  },
  {
    "studentName": "Hima Gowri Chowdary Salaseemala",
    "studentId": "261P3074",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near Devegowda petrol bunk",
    "dropStop": "Near Devegowda petrol bunk",
    "parentContact": "9611555566",
    "parentEmail": "parent.261p3074@transcend.org",
  },
  {
    "studentName": "Kavira Ghorpade",
    "studentId": "261P4165",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near Fire station KEB Devegowda petrol bunk",
    "dropStop": "Near Fire station KEB Devegowda petrol bunk",
    "parentContact": "9008000285",
    "parentEmail": "parent.261p4165@transcend.org",
  },
  {
    "studentName": "Saanvi N",
    "studentId": "261P3337",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Near hanumanth nagar police station",
    "dropStop": "Near hanumanth nagar police station",
    "parentContact": "9845239007",
    "parentEmail": "parent.261p3337@transcend.org",
  },
  {
    "studentName": "Aashka Sharma",
    "studentId": "251P2291",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "Opp GK traders, 50ft feet road hanumantha Nagar",
    "dropStop": "Opp GK traders, 50ft feet road hanumantha Nagar",
    "parentContact": "9667232910",
    "parentEmail": "parent.251p2291@transcend.org",
  },
  {
    "studentName": "BS DEEPASHREE RAJU",
    "studentId": "261P4198",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "Pai International, Kathriguppe Main Rd, Krishna college",
    "dropStop": "Pai International, Kathriguppe Main Rd, Krishna college",
    "parentContact": "9742000022",
    "parentEmail": "parent.261p4198@transcend.org",
  },
  {
    "studentName": "Sankeerth Prasad V",
    "studentId": "261P3578",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "People's tree Hospital, Opp tp PES College srinagar",
    "dropStop": "People's tree Hospital, Opp tp PES College srinagar",
    "parentContact": "9886035549",
    "parentEmail": "parent.261p3578@transcend.org",
  },
  {
    "studentName": "Partha T M",
    "studentId": "251P2555",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "PES College ,Hanumanth Nagar",
    "dropStop": "PES College ,Hanumanth Nagar",
    "parentContact": "9902524258",
    "parentEmail": "parent.251p2555@transcend.org",
  },
  {
    "studentName": "Kavish A Jain",
    "studentId": "251S2065",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Pick up - Prasad Ice cream parlour Drop - Kaggis bakery (50Ft Road)",
    "dropStop": "Pick up - Prasad Ice cream parlour Drop - Kaggis bakery (50Ft Road)",
    "parentContact": "9986734481",
    "parentEmail": "parent.251s2065@transcend.org",
  },
  {
    "studentName": "S AMOGH",
    "studentId": "201S1008",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "SBI ATM, Near Pizza hut BDA",
    "dropStop": "SBI ATM, Near Pizza hut BDA",
    "parentContact": "9987288855",
    "parentEmail": "parent.201s1008@transcend.org",
  },
  {
    "studentName": "S AMEYA",
    "studentId": "201S1009",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "SBI ATM, Near Pizza hut BDA",
    "dropStop": "SBI ATM, Near Pizza hut BDA",
    "parentContact": "8884742525",
    "parentEmail": "parent.201s1009@transcend.org",
  },
  {
    "studentName": "Adithya S",
    "studentId": "261P3016",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Shrikrishna Krishna international school, Vidyapeeta Circle",
    "dropStop": "Shrikrishna Krishna international school, Vidyapeeta Circle",
    "parentContact": "9880437257",
    "parentEmail": "parent.261p3016@transcend.org",
  },
  {
    "studentName": "Bhoomika S Rao",
    "studentId": "261P3632",
    "route": "Route 10",
    "bus": "KA-10-KL-0000",
    "pickupStop": "Sinivas Nagar Bus Stop",
    "dropStop": "Sinivas Nagar Bus Stop",
    "parentContact": "9886143792",
    "parentEmail": "parent.261p3632@transcend.org",
  },
  {
    "studentName": "GUHAN DATTA RAJA JAYESH",
    "studentId": "231S1008",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Sri Hari Kalyana Mantapa",
    "dropStop": "Sri Hari Kalyana Mantapa",
    "parentContact": "9742125209",
    "parentEmail": "parent.231s1008@transcend.org",
  },
  {
    "studentName": "Ditya Chouhan",
    "studentId": "261P3716",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Srinivas Nagar bata showroom",
    "dropStop": "Srinivas Nagar bata showroom",
    "parentContact": "9035784823",
    "parentEmail": "parent.261p3716@transcend.org",
  },
  {
    "studentName": "Trishathi Chandrasheel",
    "studentId": "261P3129",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Svc co operative bank, hanumanthnagar",
    "dropStop": "Svc co operative bank, hanumanthnagar",
    "parentContact": "9845242873",
    "parentEmail": "parent.261p3129@transcend.org",
  },
  {
    "studentName": "Chiranth Chandrasheel",
    "studentId": "261S1017",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Svc co operative bank, hanumanthnagar",
    "dropStop": "Svc co operative bank, hanumanthnagar",
    "parentContact": "9845242873",
    "parentEmail": "parent.261p3129@transcend.org",
  },
  {
    "studentName": "ARJUN VENKAT",
    "studentId": "251S1082",
    "route": "Route 10",
    "bus": "KA-10-KL-0010",
    "pickupStop": "Teachers Colony",
    "dropStop": "Teachers Colony",
    "parentContact": "9845076007",
    "parentEmail": "parent.251s1082@transcend.org",
  },
  {
    "studentName": "Unmani Ranadhir",
    "studentId": "261P3621",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Art of living international Ashram",
    "dropStop": "Art of living international Ashram",
    "parentContact": "9740849673",
    "parentEmail": "parent.261p3621@transcend.org",
  },
  {
    "studentName": "Laxmi Priya Ramkumar",
    "studentId": "261P3419",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Elegant whispering winds / mantri courtyard 2, Near Home School",
    "dropStop": "Elegant whispering winds / mantri courtyard 2, Near Home School",
    "parentContact": "9677027810",
    "parentEmail": "parent.261p3419@transcend.org",
  },
  {
    "studentName": "K Sai Sindhura",
    "studentId": "261P4202",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Gubbalala,80feet road ramanjinaya nagara",
    "dropStop": "Gubbalala,80feet road ramanjinaya nagara",
    "parentContact": "9008814089",
    "parentEmail": "parent.261p4202@transcend.org",
  },
  {
    "studentName": "Daksh Saraf",
    "studentId": "231S1070",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Near Valley School",
    "dropStop": "Near Valley School",
    "parentContact": "9845892566",
    "parentEmail": "parent.231s1070@transcend.org",
  },
  {
    "studentName": "Yashica Prakash",
    "studentId": "261P4148",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Provident Park Square - 2D, Vakil Garden City",
    "dropStop": "Provident Park Square - 2D, Vakil Garden City",
    "parentContact": "9844166444",
    "parentEmail": "parent.261p4148@transcend.org",
  },
  {
    "studentName": "Abhay Smaran",
    "studentId": "261P3594",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Sobha arena judicial layout thalghatpura",
    "dropStop": "Sobha arena judicial layout thalghatpura",
    "parentContact": "9880939674",
    "parentEmail": "parent.261p3594@transcend.org",
  },
  {
    "studentName": "Rose Bipin",
    "studentId": "261P3222",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Sobha Hillview back gate",
    "dropStop": "Sobha Hillview back gate",
    "parentContact": "9731596144",
    "parentEmail": "parent.261p3222@transcend.org",
  },
  {
    "studentName": "Radhika Bansal",
    "studentId": "261P3695",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Udipalya Shoudamani Apartment",
    "dropStop": "Udipalya Shoudamani Apartment",
    "parentContact": "9910083221",
    "parentEmail": "parent.261p3695@transcend.org",
  },
  {
    "studentName": "Harshala G",
    "studentId": "251P1160",
    "route": "Route 11",
    "bus": "KA-11-MN-0004",
    "pickupStop": "Vakil garden city",
    "dropStop": "Vakil garden city",
    "parentContact": "9620713333",
    "parentEmail": "parent.251p1160@transcend.org",
  },
  {
    "studentName": "Shraddha Arun",
    "studentId": "251P1486",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "102 SAI LEELA APARTMENTS 581 C 25TH CROSS RAJARAJESHWARI NAGAR,",
    "dropStop": "102 SAI LEELA APARTMENTS 581 C 25TH CROSS RAJARAJESHWARI NAGAR,",
    "parentContact": "9945692121",
    "parentEmail": "parent.251p1486@transcend.org",
  },
  {
    "studentName": "Vaishnavi Joshi",
    "studentId": "261P3860",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Behind Bata Showroom, Kenchenhalli, Rajarajeshwari Nagar",
    "dropStop": "Behind Bata Showroom, Kenchenhalli, Rajarajeshwari Nagar",
    "parentContact": "9845029345",
    "parentEmail": "parent.261p3860@transcend.org",
  },
  {
    "studentName": "Shreya P Joshi",
    "studentId": "261P3088",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Behind NHVPS school, rr nagar(Sparsha Hospital Monish Coner)",
    "dropStop": "Behind NHVPS school, rr nagar(Sparsha Hospital Monish Coner)",
    "parentContact": "9980759979",
    "parentEmail": "parent.261p3088@transcend.org",
  },
  {
    "studentName": "Deeksha V M",
    "studentId": "251P1852",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Big Bazaar Road Kathirgupee",
    "dropStop": "Big Bazaar Road Kathirgupee",
    "parentContact": "9980813456",
    "parentEmail": "parent.251p1852@transcend.org",
  },
  {
    "studentName": "G Amogh",
    "studentId": "261P3019",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "dropStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "parentContact": "9243196017",
    "parentEmail": "parent.261p3019@transcend.org",
  },
  {
    "studentName": "Diya Anvesh Patwa",
    "studentId": "261P3137",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "dropStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "parentContact": "9620310635",
    "parentEmail": "parent.261p3137@transcend.org",
  },
  {
    "studentName": "Ullash Gowda P",
    "studentId": "261P3942",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Century Indus Apartments, Rajarajeshwari Nagar, Bengaluru",
    "dropStop": "Century Indus Apartments, Rajarajeshwari Nagar, Bengaluru",
    "parentContact": "8861302007",
    "parentEmail": "parent.261p3942@transcend.org",
  },
  {
    "studentName": "Pratham Theertha",
    "studentId": "261P3567",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Century Indus, rajarajeshwari nagar",
    "dropStop": "Century Indus, rajarajeshwari nagar",
    "parentContact": "9986193395",
    "parentEmail": "parent.261p3567@transcend.org",
  },
  {
    "studentName": "Parithosh",
    "studentId": "261P3040",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "Girinagar police station",
    "dropStop": "Girinagar police station",
    "parentContact": "7760690690",
    "parentEmail": "parent.261p3040@transcend.org",
  },
  {
    "studentName": "Shreya Mohan",
    "studentId": "261P3198",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Global Academy of Technology, rr nagar(Sparsha Hospital Suguna Apartment)",
    "dropStop": "Global Academy of Technology, rr nagar(Sparsha Hospital Suguna Apartment)",
    "parentContact": "9886826790",
    "parentEmail": "parent.261p3198@transcend.org",
  },
  {
    "studentName": "R Krithika",
    "studentId": "261P3358",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Hanuram petrol bank rr nagar(Sparsha Hospital Davangere Been Dose)",
    "dropStop": "Hanuram petrol bank rr nagar(Sparsha Hospital Davangere Been Dose)",
    "parentContact": "9845277773",
    "parentEmail": "parent.261p3358@transcend.org",
  },
  {
    "studentName": "Anvi Shetty",
    "studentId": "261P3214",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "IndianOil, Outer Ring Rd, Hosakerehalli",
    "dropStop": "IndianOil, Outer Ring Rd, Hosakerehalli",
    "parentContact": "9686599900",
    "parentEmail": "parent.261p3214@transcend.org",
  },
  {
    "studentName": "T N CHETAN",
    "studentId": "261P3814",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "kathriguppe water tank",
    "dropStop": "kathriguppe water tank",
    "parentContact": "9341883969",
    "parentEmail": "parent.261p3814@transcend.org",
  },
  {
    "studentName": "Supreeth J Rao",
    "studentId": "251P1208",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "KATHRIGUPPE Water Tank Road",
    "dropStop": "KATHRIGUPPE Water Tank Road",
    "parentContact": "9886414035/9739036410",
    "parentEmail": "parent.251p1208@transcend.org",
  },
  {
    "studentName": "K.S Dhatri Binal",
    "studentId": "251P1252",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "KATHRIGUPPE Water Tank Road",
    "dropStop": "KATHRIGUPPE Water Tank Road",
    "parentContact": "9844673708",
    "parentEmail": "parent.251p1252@transcend.org",
  },
  {
    "studentName": "Joshika .T N",
    "studentId": "251P1544",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "KATHRIGUPPE Water Tank Road",
    "dropStop": "KATHRIGUPPE Water Tank Road",
    "parentContact": "9341883969",
    "parentEmail": "parent.261p3814@transcend.org",
  },
  {
    "studentName": "Yeshaswini Ramakrishna Rao",
    "studentId": "261P3215",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Kathriguppe water tank road",
    "dropStop": "Kathriguppe water tank road",
    "parentContact": "7349261482",
    "parentEmail": "parent.261p3215@transcend.org",
  },
  {
    "studentName": "Yadhukiran Bhat",
    "studentId": "261P3295",
    "route": "Route 12",
    "bus": "KA-12-OP-0010",
    "pickupStop": "Kathriguppe water tank, Near sweet chariot bsk iii stage",
    "dropStop": "Kathriguppe water tank, Near sweet chariot bsk iii stage",
    "parentContact": "9035027196",
    "parentEmail": "parent.261p3295@transcend.org",
  },
  {
    "studentName": "Dhanvin K Shetty",
    "studentId": "261P3865",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "katriguppewater tank",
    "dropStop": "katriguppewater tank",
    "parentContact": "9449952755",
    "parentEmail": "parent.261p3865@transcend.org",
  },
  {
    "studentName": "Dhruthi H B",
    "studentId": "261P3093",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Kerekodi hebbarcondiments",
    "dropStop": "Kerekodi hebbarcondiments",
    "parentContact": "8861347788",
    "parentEmail": "parent.261p3093@transcend.org",
  },
  {
    "studentName": "Sanjana P B",
    "studentId": "261P3601",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Lalith castle school, H V Halli, R R Nagar",
    "dropStop": "Lalith castle school, H V Halli, R R Nagar",
    "parentContact": "9980168475",
    "parentEmail": "parent.261p3601@transcend.org",
  },
  {
    "studentName": "Dhanya Hegde",
    "studentId": "261P4116",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Lalith international school, RR Nagar",
    "dropStop": "Lalith international school, RR Nagar",
    "parentContact": "9845620004",
    "parentEmail": "parent.261p4116@transcend.org",
  },
  {
    "studentName": "Sudiksha Pradeep",
    "studentId": "261P3201",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Near Bata show room, rr nagar",
    "dropStop": "Near Bata show room, rr nagar",
    "parentContact": "7022255091",
    "parentEmail": "parent.261p3201@transcend.org",
  },
  {
    "studentName": "Inchara Matadhikari",
    "studentId": "261P3395",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Near Global Institute of Technology, Suguna Upper Crest Sparsh Hospital",
    "dropStop": "Near Global Institute of Technology, Suguna Upper Crest Sparsh Hospital",
    "parentContact": "9901033263",
    "parentEmail": "parent.261p3395@transcend.org",
  },
  {
    "studentName": "Sanvi B R",
    "studentId": "261P3686",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "Near Rama Mandira temple, Behind Modi hospital, Kathriguppe",
    "dropStop": "Near Rama Mandira temple, Behind Modi hospital, Kathriguppe",
    "parentContact": "9880649997",
    "parentEmail": "parent.261p3686@transcend.org",
  },
  {
    "studentName": "Ananya Mantri",
    "studentId": "261P4016",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Opp to V legacy choltrey BSK 3rd stage",
    "dropStop": "Opp to V legacy choltrey BSK 3rd stage",
    "parentContact": "9880957341",
    "parentEmail": "parent.261p4016@transcend.org",
  },
  {
    "studentName": "K G Vrishank Rao",
    "studentId": "261P3797",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Pallavi Residency Apartment, katriguppewater tank",
    "dropStop": "Pallavi Residency Apartment, katriguppewater tank",
    "parentContact": "9916781796",
    "parentEmail": "parent.261p3797@transcend.org",
  },
  {
    "studentName": "Jeevani",
    "studentId": "251P2185",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Prestiage Apartment RR Nagar",
    "dropStop": "Prestiage Apartment RR Nagar",
    "parentContact": "8197387534",
    "parentEmail": "parent.251p2185@transcend.org",
  },
  {
    "studentName": "YUVRITI SHARMA",
    "studentId": "261P3867",
    "route": "Route 12",
    "bus": "KA-12-OP-0015",
    "pickupStop": "Prestige Bagamane Temple Bells, Near Sky Sports Arena",
    "dropStop": "Prestige Bagamane Temple Bells, Near Sky Sports Arena",
    "parentContact": "9818860025",
    "parentEmail": "parent.261p3867@transcend.org",
  },
  {
    "studentName": "Daivik Kopparam",
    "studentId": "211S1018",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "Pure Drinking water (Kudiyuwa neerina ghataka)",
    "dropStop": "Pure Drinking water (Kudiyuwa neerina ghataka)",
    "parentContact": "9740018415",
    "parentEmail": "parent.211s1018@transcend.org",
  },
  {
    "studentName": "Ananya Kage",
    "studentId": "251P1916",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "SBI Bank RR Nagar double road end",
    "dropStop": "SBI Bank RR Nagar double road end",
    "parentContact": "9611291010",
    "parentEmail": "parent.251p1916@transcend.org",
  },
  {
    "studentName": "Siri Koti",
    "studentId": "261P3586",
    "route": "Route 12",
    "bus": "KA-12-OP-0000",
    "pickupStop": "Swargarani School & PU College(Suguna), RR Nagar",
    "dropStop": "Swargarani School & PU College(Suguna), RR Nagar",
    "parentContact": "9845212147",
    "parentEmail": "parent.261p3586@transcend.org",
  },
  {
    "studentName": "Niharika Raju",
    "studentId": "251P1455",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "V legacy convention ,v legacy road",
    "dropStop": "V legacy convention ,v legacy road",
    "parentContact": "9480078187",
    "parentEmail": "parent.251p1455@transcend.org",
  },
  {
    "studentName": "Kushal Gowda K",
    "studentId": "251P2423",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Verbardhara nagar Signal",
    "dropStop": "Verbardhara nagar Signal",
    "parentContact": "9886847656",
    "parentEmail": "parent.251p2423@transcend.org",
  },
  {
    "studentName": "Shriya V Belavadi",
    "studentId": "251P1769",
    "route": "Route 12",
    "bus": "KA-12-OP-0023",
    "pickupStop": "Watertank , Kathriguppe BSK third stage",
    "dropStop": "Watertank , Kathriguppe BSK third stage",
    "parentContact": "9880302356",
    "parentEmail": "parent.251p1769@transcend.org",
  },
  {
    "studentName": "Yuvraj G",
    "studentId": "251P2518",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Watertank , Kathriguppe BSK third stage",
    "dropStop": "Watertank , Kathriguppe BSK third stage",
    "parentContact": "9845149851",
    "parentEmail": "parent.251p2518@transcend.org",
  },
  {
    "studentName": "Nihal Ramesh",
    "studentId": "261P3696",
    "route": "Route 12",
    "bus": "KA-12-OP-0015",
    "pickupStop": "YGR Mall RR Nagar",
    "dropStop": "YGR Mall RR Nagar",
    "parentContact": "9972914896",
    "parentEmail": "parent.261p3696@transcend.org",
  },
  {
    "studentName": "ABHAY CHANDRA H C",
    "studentId": "231S1048",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "#402, 11th A cross, 29th main, 1st Phase , J P nagar, B'lore",
    "dropStop": "#402, 11th A cross, 29th main, 1st Phase , J P nagar, B'lore",
    "parentContact": "9538315916/9341221770",
    "parentEmail": "parent.231s1048@transcend.org",
  },
  {
    "studentName": "Stuti Navile",
    "studentId": "251P1013",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "400, 17th main, 36th Cross, Jayanagar 4th T Block,",
    "dropStop": "400, 17th main, 36th Cross, Jayanagar 4th T Block,",
    "parentContact": "9845865656",
    "parentEmail": "parent.251p1013@transcend.org",
  },
  {
    "studentName": "Srishti Navile",
    "studentId": "251S1697",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "400, 17th main, 36th Cross, Jayanagar 4th T Block,",
    "dropStop": "400, 17th main, 36th Cross, Jayanagar 4th T Block,",
    "parentContact": "9845865656",
    "parentEmail": "parent.251p1013@transcend.org",
  },
  {
    "studentName": "BHARGAV ATREYA P",
    "studentId": "251S1668",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "6/20, 2nd Main, byrasandra Jayanagar Bangalore 560011",
    "dropStop": "6/20, 2nd Main, byrasandra Jayanagar Bangalore 560011",
    "parentContact": "7019900106",
    "parentEmail": "parent.251s1668@transcend.org",
  },
  {
    "studentName": "Gauraang N Ghatge",
    "studentId": "251P2153",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "646 22nd Main Road Pattabhirama, Home Jayanagar 4th T block",
    "dropStop": "646 22nd Main Road Pattabhirama, Home Jayanagar 4th T block",
    "parentContact": "9900247640",
    "parentEmail": "parent.251p2153@transcend.org",
  },
  {
    "studentName": "JANHAVI SIMPI",
    "studentId": "241S1456",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Asha Sweets RV College",
    "dropStop": "Asha Sweets RV College",
    "parentContact": "9535307407",
    "parentEmail": "parent.241s1456@transcend.org",
  },
  {
    "studentName": "Druthi K S",
    "studentId": "251P1990",
    "route": "Route 13",
    "bus": "KA-13-QR-0001",
    "pickupStop": "Ashoka Pillar",
    "dropStop": "Ashoka Pillar",
    "parentContact": "9844556689",
    "parentEmail": "parent.251p1990@transcend.org",
  },
  {
    "studentName": "Neelesh S S",
    "studentId": "261P4265",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Ashoka pillar busstop",
    "dropStop": "Ashoka pillar busstop",
    "parentContact": "9845692123",
    "parentEmail": "parent.261p4265@transcend.org",
  },
  {
    "studentName": "KHUSHI VENUGOPAL",
    "studentId": "221S2023",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Auto Pad 11th Cross, Ashoke Piller",
    "dropStop": "Auto Pad 11th Cross, Ashoke Piller",
    "parentContact": "9945033500",
    "parentEmail": "parent.221s2023@transcend.org",
  },
  {
    "studentName": "Dhriti Sai R",
    "studentId": "251S1728",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "BDA layout, Byrasandra, Jayanagar 1st Block, Bangalore 560011",
    "dropStop": "BDA layout, Byrasandra, Jayanagar 1st Block, Bangalore 560011",
    "parentContact": "9880128783",
    "parentEmail": "parent.251s1728@transcend.org",
  },
  {
    "studentName": "Swara",
    "studentId": "261P3411",
    "route": "Route 13",
    "bus": "KA-13-QR-0000",
    "pickupStop": "Behind BWSSB Office, JP nagar 1st Phase",
    "dropStop": "Behind BWSSB Office, JP nagar 1st Phase",
    "parentContact": "9845224412",
    "parentEmail": "parent.261p3411@transcend.org",
  },
  {
    "studentName": "Advika Varsha",
    "studentId": "261S1105",
    "route": "Route 13",
    "bus": "KA-13-QR-0000",
    "pickupStop": "Byrasandra near halasina mara nimhans road",
    "dropStop": "Byrasandra near halasina mara nimhans road",
    "parentContact": "9538261246",
    "parentEmail": "parent.261s1105@transcend.org",
  },
  {
    "studentName": "Desik Raghavendra S V",
    "studentId": "241S1623",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Desi masala 4th block Jayanagar",
    "dropStop": "Desi masala 4th block Jayanagar",
    "parentContact": "9742749660",
    "parentEmail": "parent.241s1623@transcend.org",
  },
  {
    "studentName": "Adi Monish",
    "studentId": "241S2119",
    "route": "Route 13",
    "bus": "KA-13-QR-0000",
    "pickupStop": "Jaya Clinic East end",
    "dropStop": "Jaya Clinic East end",
    "parentContact": "9443250117",
    "parentEmail": "parent.241s2119@transcend.org",
  },
  {
    "studentName": "DRUTHI S V",
    "studentId": "251S1708",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Jayanagar 4th Block",
    "dropStop": "Jayanagar 4th Block",
    "parentContact": "9742749660",
    "parentEmail": "parent.241s1623@transcend.org",
  },
  {
    "studentName": "SAI NISHCHAY ACHWANI",
    "studentId": "221S1058",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Jayanagar 4th T Block(Car washing corner)",
    "dropStop": "Jayanagar 4th T Block(Car washing corner)",
    "parentContact": "9945242098",
    "parentEmail": "parent.221s1058@transcend.org",
  },
  {
    "studentName": "JYENA R",
    "studentId": "221S1048",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "KFC Behind Signal",
    "dropStop": "KFC Behind Signal",
    "parentContact": "9880998603",
    "parentEmail": "parent.221s1048@transcend.org",
  },
  {
    "studentName": "YAHVI JAIN",
    "studentId": "221S1060",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Lakshmi Medical(ATM)",
    "dropStop": "Lakshmi Medical(ATM)",
    "parentContact": "9742498248",
    "parentEmail": "parent.221s1060@transcend.org",
  },
  {
    "studentName": "HIYAAN JAIN",
    "studentId": "221S1061",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Lakshmi Medical(ATM)",
    "dropStop": "Lakshmi Medical(ATM)",
    "parentContact": "9986468040",
    "parentEmail": "parent.221s1061@transcend.org",
  },
  {
    "studentName": "SUVIDHI JAIN",
    "studentId": "221S1063",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Lakshmi Medical(ATM)",
    "dropStop": "Lakshmi Medical(ATM)",
    "parentContact": "9986793245",
    "parentEmail": "parent.221s1063@transcend.org",
  },
  {
    "studentName": "KHIYA JAIN",
    "studentId": "251S1704",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Lakshmi Medical(ATM)",
    "dropStop": "Lakshmi Medical(ATM)",
    "parentContact": "9986468040",
    "parentEmail": "parent.221s1061@transcend.org",
  },
  {
    "studentName": "Yashika B K",
    "studentId": "231S1104",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Lifecare medical IG circle",
    "dropStop": "Lifecare medical IG circle",
    "parentContact": "9945453592",
    "parentEmail": "parent.231s1104@transcend.org",
  },
  {
    "studentName": "VISHRUTH V BHARADWAJ",
    "studentId": "201S1013",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Madhavan Park Circle",
    "dropStop": "Madhavan Park Circle",
    "parentContact": "9845520676",
    "parentEmail": "parent.201s1013@transcend.org",
  },
  {
    "studentName": "Eshwar A Gadi",
    "studentId": "261S1097",
    "route": "Route 13",
    "bus": "KA-13-QR-0000",
    "pickupStop": "Madhavan park, 3rd block, Jayanagar",
    "dropStop": "Madhavan park, 3rd block, Jayanagar",
    "parentContact": "9900570600",
    "parentEmail": "parent.261s1097@transcend.org",
  },
  {
    "studentName": "Kanushni Sai M",
    "studentId": "261S1020",
    "route": "Route 13",
    "bus": "KA-13-QR-0005",
    "pickupStop": "Mirambika school(RV dental college ,west gate on 27th main JpNagar 1st phase)",
    "dropStop": "Mirambika school(RV dental college ,west gate on 27th main JpNagar 1st phase)",
    "parentContact": "9845408565",
    "parentEmail": "parent.261s1020@transcend.org",
  },
  {
    "studentName": "Ajay Revanth J",
    "studentId": "261P3478",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Near Jaya Clinic, Jayanagara 9th Block",
    "dropStop": "Near Jaya Clinic, Jayanagara 9th Block",
    "parentContact": "9980868049",
    "parentEmail": "parent.261p3478@transcend.org",
  },
  {
    "studentName": "Mihir Kashyap",
    "studentId": "231S1067",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Near Milan hospital",
    "dropStop": "Near Milan hospital",
    "parentContact": "8095321575",
    "parentEmail": "parent.231s1067@transcend.org",
  },
  {
    "studentName": "Syed Ammaar Taj",
    "studentId": "261P3778",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "New veena musicals, Jayanagar ashoke pillar",
    "dropStop": "New veena musicals, Jayanagar ashoke pillar",
    "parentContact": "9844034442",
    "parentEmail": "parent.261p3778@transcend.org",
  },
  {
    "studentName": "Yukthi Mb",
    "studentId": "261S1087",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Nimhans road",
    "dropStop": "Nimhans road",
    "parentContact": "8105100250",
    "parentEmail": "parent.261s1087@transcend.org",
  },
  {
    "studentName": "S Vaishnavi",
    "studentId": "251P1297",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "No. 461, 39th B Cross, 9th Main, 5th Block, Jayanagar,",
    "dropStop": "No. 461, 39th B Cross, 9th Main, 5th Block, Jayanagar,",
    "parentContact": "9900780078",
    "parentEmail": "parent.251p1297@transcend.org",
  },
  {
    "studentName": "Tanmay Hv",
    "studentId": "261P3580",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Opp to Ramakrishna nursing home Next to Malabar Golds, 2nd Block, Jayanagar",
    "dropStop": "Opp to Ramakrishna nursing home Next to Malabar Golds, 2nd Block, Jayanagar",
    "parentContact": "9845450955",
    "parentEmail": "parent.261p3580@transcend.org",
  },
  {
    "studentName": "Stuti Avinash",
    "studentId": "261P3250",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Opposite Satya Sai Tourist, 5th block, Jayanagar, Namdharis",
    "dropStop": "Opposite Satya Sai Tourist, 5th block, Jayanagar, Namdharis",
    "parentContact": "9845200492",
    "parentEmail": "parent.261p3250@transcend.org",
  },
  {
    "studentName": "VAISHNAVI ARJUN MEDA",
    "studentId": "231S1021",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "PM Swimming pool",
    "dropStop": "PM Swimming pool",
    "parentContact": "9845424349",
    "parentEmail": "parent.231s1021@transcend.org",
  },
  {
    "studentName": "Sufiyan Khan",
    "studentId": "251P2166",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Sanjay Ghandhi hospital",
    "dropStop": "Sanjay Ghandhi hospital",
    "parentContact": "9845051884",
    "parentEmail": "parent.251p2166@transcend.org",
  },
  {
    "studentName": "Nakshatra Alur",
    "studentId": "261P3912",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Shiva temple sarakki 80ft road",
    "dropStop": "Shiva temple sarakki 80ft road",
    "parentContact": "9886226905",
    "parentEmail": "parent.261p3912@transcend.org",
  },
  {
    "studentName": "PURNITHA M RAO",
    "studentId": "251S1363",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "SHREE SAI KRUPA APT, 302, 22ND CROSS JAYANAGAR BLR 560011",
    "dropStop": "SHREE SAI KRUPA APT, 302, 22ND CROSS JAYANAGAR BLR 560011",
    "parentContact": "9742572839",
    "parentEmail": "parent.251s1363@transcend.org",
  },
  {
    "studentName": "Pranavi S",
    "studentId": "241S1159",
    "route": "Route 13",
    "bus": "KA-13-QR-0013",
    "pickupStop": "Srikrishana residency sbi colony Jp nagar 1st phase",
    "dropStop": "Srikrishana residency sbi colony Jp nagar 1st phase",
    "parentContact": "9148525122",
    "parentEmail": "parent.241s1159@transcend.org",
  },
  {
    "studentName": "Shobitha S",
    "studentId": "251P1365",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": ", 27th Main Rd, BTM LAYOUT,2ND STAGE (Near Ganesh Temple)",
    "dropStop": ", 27th Main Rd, BTM LAYOUT,2ND STAGE (Near Ganesh Temple)",
    "parentContact": "9900566548",
    "parentEmail": "parent.251p1365@transcend.org",
  },
  {
    "studentName": "Pritika Anand",
    "studentId": "261P4115",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "22 main near play ground MC Donald",
    "dropStop": "22 main near play ground MC Donald",
    "parentContact": "9036512336",
    "parentEmail": "parent.261p4115@transcend.org",
  },
  {
    "studentName": "Vibha Marda",
    "studentId": "251P1491",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "302, Tulip , Esteem Park, J P Nagar 5th Phase, Rose Garden Road JP Nagar 5th Phase",
    "dropStop": "302, Tulip , Esteem Park, J P Nagar 5th Phase, Rose Garden Road JP Nagar 5th Phase",
    "parentContact": "9686077477",
    "parentEmail": "parent.251p1491@transcend.org",
  },
  {
    "studentName": "Trishika M Y",
    "studentId": "241S1105",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "363, 9th main, dolllors colony Jp nagar 4th phase bangalore",
    "dropStop": "363, 9th main, dolllors colony Jp nagar 4th phase bangalore",
    "parentContact": "9886572944",
    "parentEmail": "parent.241s1105@transcend.org",
  },
  {
    "studentName": "Kishara B Omprakash",
    "studentId": "261P3116",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Behind Kesariya Restaurant",
    "dropStop": "Behind Kesariya Restaurant",
    "parentContact": "9880066222",
    "parentEmail": "parent.261p3116@transcend.org",
  },
  {
    "studentName": "Abhinav Udaya Shankar",
    "studentId": "261P3630",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "BTM AXA junction",
    "dropStop": "BTM AXA junction",
    "parentContact": "9632353270",
    "parentEmail": "parent.261p3630@transcend.org",
  },
  {
    "studentName": "Tanvee Santhosh",
    "studentId": "261P3560",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Dolllars Colony, Clearance School",
    "dropStop": "Dolllars Colony, Clearance School",
    "parentContact": "9686809832",
    "parentEmail": "parent.261p3560@transcend.org",
  },
  {
    "studentName": "RITHIKA GOWRI",
    "studentId": "221S1015",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Dollors Colony, JP nagar",
    "dropStop": "Dollors Colony, JP nagar",
    "parentContact": "9900264025",
    "parentEmail": "parent.221s1015@transcend.org",
  },
  {
    "studentName": "Manith Krishna Raj",
    "studentId": "251P2258",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Ekya school j.p nagar 3rd phase",
    "dropStop": "Ekya school j.p nagar 3rd phase",
    "parentContact": "9844056619",
    "parentEmail": "parent.251p2258@transcend.org",
  },
  {
    "studentName": "Akshara Sumant Awate",
    "studentId": "261P4234",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Esteem Park Apartment Back Gate",
    "dropStop": "Esteem Park Apartment Back Gate",
    "parentContact": "9535148277",
    "parentEmail": "parent.261p4234@transcend.org",
  },
  {
    "studentName": "M Ruchira",
    "studentId": "261P3976",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "Eutopia BTM",
    "dropStop": "Eutopia BTM",
    "parentContact": "9632697773",
    "parentEmail": "parent.261p3976@transcend.org",
  },
  {
    "studentName": "Neha Kengatte",
    "studentId": "261P3694",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "JP Nagar 4th Phase, Dollars Colony, Kotak Mahindra Bank",
    "dropStop": "JP Nagar 4th Phase, Dollars Colony, Kotak Mahindra Bank",
    "parentContact": "9900401592",
    "parentEmail": "parent.261p3694@transcend.org",
  },
  {
    "studentName": "LAASYA M RAO",
    "studentId": "231S1011",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Kalyani magnum ESTEEM PARK",
    "dropStop": "Kalyani magnum ESTEEM PARK",
    "parentContact": "9845255409",
    "parentEmail": "parent.231s1011@transcend.org",
  },
  {
    "studentName": "KABIR RAO",
    "studentId": "241S1086",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "kalyani magnum Vinayak Nagar Arch",
    "dropStop": "kalyani magnum Vinayak Nagar Arch",
    "parentContact": "9845321260",
    "parentEmail": "parent.241s1086@transcend.org",
  },
  {
    "studentName": "NEEV VERMA",
    "studentId": "251S1011",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "kalyani magnum Vinayak Nagar Arch",
    "dropStop": "kalyani magnum Vinayak Nagar Arch",
    "parentContact": "9742132364",
    "parentEmail": "parent.251s1011@transcend.org",
  },
  {
    "studentName": "Sanjana Aytha",
    "studentId": "251P2268",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Mahaveer springs apartmen Vinayaka Nagara",
    "dropStop": "Mahaveer springs apartmen Vinayaka Nagara",
    "parentContact": "9845797028",
    "parentEmail": "parent.251p2268@transcend.org",
  },
  {
    "studentName": "Ananya M A",
    "studentId": "261P3750",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli, (BTM 17th Main home needs super market)",
    "dropStop": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli, (BTM 17th Main home needs super market)",
    "parentContact": "9986868620",
    "parentEmail": "parent.261p3750@transcend.org",
  },
  {
    "studentName": "Sanika P Sanath",
    "studentId": "261P3387",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Near Delmia Signal, eyka school",
    "dropStop": "Near Delmia Signal, eyka school",
    "parentContact": "9483923429",
    "parentEmail": "parent.261p3387@transcend.org",
  },
  {
    "studentName": "Tanish B Reddy",
    "studentId": "261P3554",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Near guru medicals, Olive Street Food Cafe - Btm Layout",
    "dropStop": "Near guru medicals, Olive Street Food Cafe - Btm Layout",
    "parentContact": "9845499888",
    "parentEmail": "parent.261p3554@transcend.org",
  },
  {
    "studentName": "Medha Santebennur",
    "studentId": "261P3123",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "Near JP Nagar metro station",
    "dropStop": "Near JP Nagar metro station",
    "parentContact": "8884545670",
    "parentEmail": "parent.261p3123@transcend.org",
  },
  {
    "studentName": "Shrijal Sandesh Kundar",
    "studentId": "231S1083",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "Near Purva bellmount apartment",
    "dropStop": "Near Purva bellmount apartment",
    "parentContact": "9986656756",
    "parentEmail": "parent.231s1083@transcend.org",
  },
  {
    "studentName": "Syeda Samra",
    "studentId": "261P3650",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Near vaishnavi terecesses, Dollars Colony, Phase 4, J. P. Nagar",
    "dropStop": "Near vaishnavi terecesses, Dollars Colony, Phase 4, J. P. Nagar",
    "parentContact": "9448967991",
    "parentEmail": "parent.261p3650@transcend.org",
  },
  {
    "studentName": "Sripada Pooja Rani",
    "studentId": "261P3368",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "New Kabab Plaza, 19th Cross Road, NS Palya, BTM Layout 2nd Stage",
    "dropStop": "New Kabab Plaza, 19th Cross Road, NS Palya, BTM Layout 2nd Stage",
    "parentContact": "9880868765",
    "parentEmail": "parent.261p3368@transcend.org",
  },
  {
    "studentName": "Rohita Reddy",
    "studentId": "251P1101",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "NO.70, 2ND CROSS, 27TH MAIN, BTM 1ST STAGE,",
    "dropStop": "NO.70, 2ND CROSS, 27TH MAIN, BTM 1ST STAGE,",
    "parentContact": "9880155771",
    "parentEmail": "parent.251p1101@transcend.org",
  },
  {
    "studentName": "Rujula R Totagi",
    "studentId": "261P3041",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Opposite road of Vishnu Park Hotel, kuvempu nagar bus stop",
    "dropStop": "Opposite road of Vishnu Park Hotel, kuvempu nagar bus stop",
    "parentContact": "9538803802",
    "parentEmail": "parent.261p3041@transcend.org",
  },
  {
    "studentName": "Laya Veeranayagam",
    "studentId": "251S1263",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Purva Belmont Apartment, Kanakapura main road",
    "dropStop": "Purva Belmont Apartment, Kanakapura main road",
    "parentContact": "9923751737",
    "parentEmail": "parent.251s1263@transcend.org",
  },
  {
    "studentName": "Shruthi Veeranayagam",
    "studentId": "251P1226",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Purva Belmont Apartment, Kanakapura main road(Only Way)",
    "dropStop": "Purva Belmont Apartment, Kanakapura main road(Only Way)",
    "parentContact": "9923751737",
    "parentEmail": "parent.251s1263@transcend.org",
  },
  {
    "studentName": "Ridhi Harish",
    "studentId": "251P1309",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "rameshwaram café, JP nagar",
    "dropStop": "rameshwaram café, JP nagar",
    "parentContact": "9845175520",
    "parentEmail": "parent.251p1309@transcend.org",
  },
  {
    "studentName": "Bhuvan Bopanna Ms",
    "studentId": "261P3760",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Sesha Banu Residency Apartment, N.S. Palya, 6th Main Road",
    "dropStop": "Sesha Banu Residency Apartment, N.S. Palya, 6th Main Road",
    "parentContact": "9845107970",
    "parentEmail": "parent.261p3760@transcend.org",
  },
  {
    "studentName": "Presha Avinash",
    "studentId": "251P1876",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Shravanthi Castle, Dollars Colony, N.S. palya,,",
    "dropStop": "Shravanthi Castle, Dollars Colony, N.S. palya,,",
    "parentContact": "9591480284",
    "parentEmail": "parent.251p1876@transcend.org",
  },
  {
    "studentName": "Tanmayi Krishna Naik",
    "studentId": "251P1737",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Sri Nanjundeswara Layout",
    "dropStop": "Sri Nanjundeswara Layout",
    "parentContact": "9845605645",
    "parentEmail": "parent.251p1737@transcend.org",
  },
  {
    "studentName": "Druthi Koundinya",
    "studentId": "251P1304",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Suraksha Enclave, 7th Main, 20th Cross, BTM layout, kabab plaza",
    "dropStop": "Suraksha Enclave, 7th Main, 20th Cross, BTM layout, kabab plaza",
    "parentContact": "9886000688",
    "parentEmail": "parent.251p1304@transcend.org",
  },
  {
    "studentName": "Hethvi Vivek Patel",
    "studentId": "251S2180",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Tata key motors kanakpura road",
    "dropStop": "Tata key motors kanakpura road",
    "parentContact": "9900071076",
    "parentEmail": "parent.251s2180@transcend.org",
  },
  {
    "studentName": "Rakshaya V",
    "studentId": "251P1612",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "The Rameshwaram Cafe @ JP Nager 100 feet Rd",
    "dropStop": "The Rameshwaram Cafe @ JP Nager 100 feet Rd",
    "parentContact": "9538833089",
    "parentEmail": "parent.251p1612@transcend.org",
  },
  {
    "studentName": "J Prathyush",
    "studentId": "251P2494",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "Udupi upachar, jp nagar 5th phase",
    "dropStop": "Udupi upachar, jp nagar 5th phase",
    "parentContact": "9980010345",
    "parentEmail": "parent.251p2494@transcend.org",
  },
  {
    "studentName": "Dhimahi M Y",
    "studentId": "241S1004",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Vaishnavi Terrace, Dollars Colony, Phase 4, J. P. Nagar",
    "dropStop": "Vaishnavi Terrace, Dollars Colony, Phase 4, J. P. Nagar",
    "parentContact": "9880909109",
    "parentEmail": "parent.241s1004@transcend.org",
  },
  {
    "studentName": "Reshmashree",
    "studentId": "261P3983",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Vega City Mall Back Side chirga hospital",
    "dropStop": "Vega City Mall Back Side chirga hospital",
    "parentContact": "9840890790",
    "parentEmail": "parent.261p3983@transcend.org",
  },
  {
    "studentName": "Kruthi Sm",
    "studentId": "261P4183",
    "route": "Route 14",
    "bus": "KA-14-ST-0014",
    "pickupStop": "Vigneshwara temple, BTM Layout 2nd Stage",
    "dropStop": "Vigneshwara temple, BTM Layout 2nd Stage",
    "parentContact": "9845307497",
    "parentEmail": "parent.261p4183@transcend.org",
  },
  {
    "studentName": "Sanchita Pradeep",
    "studentId": "251P1970",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "(Near Bank of Baroda)# BEML Layout, RajarajeshwariNagar",
    "dropStop": "(Near Bank of Baroda)# BEML Layout, RajarajeshwariNagar",
    "parentContact": "9845697064",
    "parentEmail": "parent.251p1970@transcend.org",
  },
  {
    "studentName": "Bhargava G G",
    "studentId": "261P3418",
    "route": "Route 15",
    "bus": "KA-15-UV-0012",
    "pickupStop": "Behind Reliance Fresh, RR Nagar, NImishabham Temple",
    "dropStop": "Behind Reliance Fresh, RR Nagar, NImishabham Temple",
    "parentContact": "9845855425",
    "parentEmail": "parent.261p3418@transcend.org",
  },
  {
    "studentName": "Yuktha K",
    "studentId": "261P3507",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Best Club Apartment, Shanmuga temple",
    "dropStop": "Best Club Apartment, Shanmuga temple",
    "parentContact": "8884565275",
    "parentEmail": "parent.261p3507@transcend.org",
  },
  {
    "studentName": "Poorna Purushotham Pai",
    "studentId": "251P1749",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Dwaraka nagar, BEML 5th stage, R R Nagar",
    "dropStop": "Dwaraka nagar, BEML 5th stage, R R Nagar",
    "parentContact": "8591097996",
    "parentEmail": "parent.251p1749@transcend.org",
  },
  {
    "studentName": "K KAUSHAL",
    "studentId": "231S1082",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Gowdara Mudde Mane Srinivaspur",
    "dropStop": "Gowdara Mudde Mane Srinivaspur",
    "parentContact": "8951622880",
    "parentEmail": "parent.231s1082@transcend.org",
  },
  {
    "studentName": "Shubhang Shirol",
    "studentId": "261P3638",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Harsha Bengaluru, Royal Indraprastha, Rajarajeshwari Nagar",
    "dropStop": "Harsha Bengaluru, Royal Indraprastha, Rajarajeshwari Nagar",
    "parentContact": "9687655630",
    "parentEmail": "parent.261p3638@transcend.org",
  },
  {
    "studentName": "Ujwal Gowda N",
    "studentId": "261P4123",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Hotel N.G.T Non Veg, RR Nagar",
    "dropStop": "Hotel N.G.T Non Veg, RR Nagar",
    "parentContact": "8861820015",
    "parentEmail": "parent.261p4123@transcend.org",
  },
  {
    "studentName": "Rishi pradeep",
    "studentId": "261P4073",
    "route": "Route 15",
    "bus": "KA-15-UV-0000",
    "pickupStop": "Jayanna Circle - RR Nagar",
    "dropStop": "Jayanna Circle - RR Nagar",
    "parentContact": "9945216501",
    "parentEmail": "parent.261p4073@transcend.org",
  },
  {
    "studentName": "Parnika S",
    "studentId": "261P3712",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Kanthi Sweets RR Nagar",
    "dropStop": "Kanthi Sweets RR Nagar",
    "parentContact": "9480426157",
    "parentEmail": "parent.261p3712@transcend.org",
  },
  {
    "studentName": "Achyutha",
    "studentId": "261S1080",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Kanti Sweets Double road RR nagar",
    "dropStop": "Kanti Sweets Double road RR nagar",
    "parentContact": "9845618304",
    "parentEmail": "parent.261s1080@transcend.org",
  },
  {
    "studentName": "Varsha R Navali",
    "studentId": "261P3362",
    "route": "Route 15",
    "bus": "KA-15-UV-0000",
    "pickupStop": "Kanti sweets RR Nagar",
    "dropStop": "Kanti sweets RR Nagar",
    "parentContact": "9148076395",
    "parentEmail": "parent.261p3362@transcend.org",
  },
  {
    "studentName": "Smaran S",
    "studentId": "261P3933",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Kanti sweets rr nagar",
    "dropStop": "Kanti sweets rr nagar",
    "parentContact": "7353755311",
    "parentEmail": "parent.261p3933@transcend.org",
  },
  {
    "studentName": "Cm Monisha",
    "studentId": "261P4167",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Kanti sweets rr nagar",
    "dropStop": "Kanti sweets rr nagar",
    "parentContact": "9845146725",
    "parentEmail": "parent.261p4167@transcend.org",
  },
  {
    "studentName": "Bhagyasree U N",
    "studentId": "261P3714",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "mahveer lake apartment near dominos sunkalpalya, kodiplaya Kengeri",
    "dropStop": "mahveer lake apartment near dominos sunkalpalya, kodiplaya Kengeri",
    "parentContact": "7093552225",
    "parentEmail": "parent.261p3714@transcend.org",
  },
  {
    "studentName": "Swastika R Balloli",
    "studentId": "261P3639",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Mailasandra, Rajarajeshwari Nagar B G S Gete",
    "dropStop": "Mailasandra, Rajarajeshwari Nagar B G S Gete",
    "parentContact": "8971994484",
    "parentEmail": "parent.261p3639@transcend.org",
  },
  {
    "studentName": "Niyati M",
    "studentId": "251P2288",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Mars Meadows Apartment , BEML layout, 5th stage, Rajarajeshwari Nagar,",
    "dropStop": "Mars Meadows Apartment , BEML layout, 5th stage, Rajarajeshwari Nagar,",
    "parentContact": "9686799333",
    "parentEmail": "parent.251p2288@transcend.org",
  },
  {
    "studentName": "M G Sahana",
    "studentId": "261P3746",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "mars meadows rr nagar",
    "dropStop": "mars meadows rr nagar",
    "parentContact": "7349085212",
    "parentEmail": "parent.261p3746@transcend.org",
  },
  {
    "studentName": "S Pranav",
    "studentId": "251P1899",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Near Ambrosia hotel, RR Nagar",
    "dropStop": "Near Ambrosia hotel, RR Nagar",
    "parentContact": "9677131895",
    "parentEmail": "parent.251p1899@transcend.org",
  },
  {
    "studentName": "Srilalitha S Kulkarni",
    "studentId": "261P3305",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Near mars meadows apartment Beml 5th satge . Rajarajeshwari Nagar",
    "dropStop": "Near mars meadows apartment Beml 5th satge . Rajarajeshwari Nagar",
    "parentContact": "9611366388",
    "parentEmail": "parent.261p3168@transcend.org",
  },
  {
    "studentName": "Nesara Vivek Chandrashekhariah",
    "studentId": "251P1572",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "NEETHI MAARGA, PANCHASHEELA BLOCK, BEML 3rd STAGE, R R Nager",
    "dropStop": "NEETHI MAARGA, PANCHASHEELA BLOCK, BEML 3rd STAGE, R R Nager",
    "parentContact": "9741127421",
    "parentEmail": "parent.251p1572@transcend.org",
  },
  {
    "studentName": "Gaayana Shree P",
    "studentId": "261P3451",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Next to S & S Platinum Apartments BEML V STAGE RRNAGAR(Prishudajalla)",
    "dropStop": "Next to S & S Platinum Apartments BEML V STAGE RRNAGAR(Prishudajalla)",
    "parentContact": "9741854545",
    "parentEmail": "parent.261p3451@transcend.org",
  },
  {
    "studentName": "Chinmaye Santosh",
    "studentId": "251P1610",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "no 306, 1st cross Bheml layout 4th stage, Raja Rajeshwari Nagar",
    "dropStop": "no 306, 1st cross Bheml layout 4th stage, Raja Rajeshwari Nagar",
    "parentContact": "9845186909",
    "parentEmail": "parent.251p1610@transcend.org",
  },
  {
    "studentName": "Aarav M",
    "studentId": "261P3324",
    "route": "Route 15",
    "bus": "KA-15-UV-0000",
    "pickupStop": "Opp. Baldwin Co Education Extension High School Gate No.4, RR nagar",
    "dropStop": "Opp. Baldwin Co Education Extension High School Gate No.4, RR nagar",
    "parentContact": "9742095000",
    "parentEmail": "parent.261p3324@transcend.org",
  },
  {
    "studentName": "Siri R Rao",
    "studentId": "261P4039",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Opposite shanmugam temple, KPTCL, Rajarajeshwri Nagar",
    "dropStop": "Opposite shanmugam temple, KPTCL, Rajarajeshwri Nagar",
    "parentContact": "8861986255",
    "parentEmail": "parent.261p4039@transcend.org",
  },
  {
    "studentName": "Advika Mythri Rao",
    "studentId": "261P3529",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Prasad medicals rr nagar(Cricket Grounds)",
    "dropStop": "Prasad medicals rr nagar(Cricket Grounds)",
    "parentContact": "9986012675",
    "parentEmail": "parent.261p3529@transcend.org",
  },
  {
    "studentName": "Poorvaj Sai Reddy",
    "studentId": "261P3317",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Rajarajeshwari Nagar, Bank of Baroda",
    "dropStop": "Rajarajeshwari Nagar, Bank of Baroda",
    "parentContact": "9900173771",
    "parentEmail": "parent.261p3317@transcend.org",
  },
  {
    "studentName": "Preksha P Kulkarni",
    "studentId": "251P1166",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Rajathadri Hotel, Uttarahalli",
    "dropStop": "Rajathadri Hotel, Uttarahalli",
    "parentContact": "9481482949",
    "parentEmail": "parent.251p1166@transcend.org",
  },
  {
    "studentName": "Anika Kashyap",
    "studentId": "261P3361",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "RR Nagar Kanthi Sweets",
    "dropStop": "RR Nagar Kanthi Sweets",
    "parentContact": "8095423266",
    "parentEmail": "parent.261p3361@transcend.org",
  },
  {
    "studentName": "Pratiksha Krishna",
    "studentId": "251P2098",
    "route": "Route 15",
    "bus": "KA-15-UV-0012",
    "pickupStop": "Sai Sadana building 5th stage rr nagar kalegowda layout R R nagar",
    "dropStop": "Sai Sadana building 5th stage rr nagar kalegowda layout R R nagar",
    "parentContact": "8197570683",
    "parentEmail": "parent.251p2098@transcend.org",
  },
  {
    "studentName": "Bhargav A",
    "studentId": "261P4206",
    "route": "Route 15",
    "bus": "KA-15-UV-0000",
    "pickupStop": "Shakthi Hills, RR Nagar nice road",
    "dropStop": "Shakthi Hills, RR Nagar nice road",
    "parentContact": "9611455599/8970272899",
    "parentEmail": "parent.261p4206@transcend.org",
  },
  {
    "studentName": "Samruddhi S",
    "studentId": "261P3104",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "shri Kalabhairaveshwara Swamy Temple (RR Nagar)",
    "dropStop": "shri Kalabhairaveshwara Swamy Temple (RR Nagar)",
    "parentContact": "9902006762",
    "parentEmail": "parent.261p3104@transcend.org",
  },
  {
    "studentName": "Siddarth Jayakumar",
    "studentId": "261P3956",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Shri Nimishamba Devi Temple, Ideal Homes Circle",
    "dropStop": "Shri Nimishamba Devi Temple, Ideal Homes Circle",
    "parentContact": "9379224750",
    "parentEmail": "parent.261p3956@transcend.org",
  },
  {
    "studentName": "Samarth S Balamkar",
    "studentId": "261P3086",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Shri Shanimahatma Swami Temple, RR Nagar",
    "dropStop": "Shri Shanimahatma Swami Temple, RR Nagar",
    "parentContact": "6364078619",
    "parentEmail": "parent.261p3086@transcend.org",
  },
  {
    "studentName": "Diyashri J",
    "studentId": "251P1312",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Suvarna Bhavana PP layout, Uttarahalli",
    "dropStop": "Suvarna Bhavana PP layout, Uttarahalli",
    "parentContact": "9448588118",
    "parentEmail": "parent.251p1312@transcend.org",
  },
  {
    "studentName": "Kirti Muchintaya",
    "studentId": "251P1790",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Suvarna Bhavana PP layout, Uttarahalli",
    "dropStop": "Suvarna Bhavana PP layout, Uttarahalli",
    "parentContact": "9916128364",
    "parentEmail": "parent.251p1790@transcend.org",
  },
  {
    "studentName": "Yashitha N Bhonsle",
    "studentId": "261P3117",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Swargarani School & PU College, Rajarajeshwari Nagar",
    "dropStop": "Swargarani School & PU College, Rajarajeshwari Nagar",
    "parentContact": "9844195398",
    "parentEmail": "parent.261p3117@transcend.org",
  },
  {
    "studentName": "Komal Gowda A",
    "studentId": "251P2116",
    "route": "Route 15",
    "bus": "KA-15-UV-0015",
    "pickupStop": "Sweet Home Layout, Shall Petrol Pump, Uttarahalli Main Road",
    "dropStop": "Sweet Home Layout, Shall Petrol Pump, Uttarahalli Main Road",
    "parentContact": "9880659864",
    "parentEmail": "parent.251p2116@transcend.org",
  },
  {
    "studentName": "Sanmita Vinya",
    "studentId": "251P1239",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "HM World City,Raghavana Palya, JP Nagar 9th Phase",
    "dropStop": "HM World City,Raghavana Palya, JP Nagar 9th Phase",
    "parentContact": "9901056542",
    "parentEmail": "parent.251p1239@transcend.org",
  },
  {
    "studentName": "Akshit Bhoi",
    "studentId": "251P1511",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "405 SLR Residency ,Gottigere Shell Petrol Pump",
    "dropStop": "405 SLR Residency ,Gottigere Shell Petrol Pump",
    "parentContact": "9008026644",
    "parentEmail": "parent.251p1511@transcend.org",
  },
  {
    "studentName": "Manoj S",
    "studentId": "251P1632",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "Bannerghatta road near Decathlon",
    "dropStop": "Bannerghatta road near Decathlon",
    "parentContact": "8546866655",
    "parentEmail": "parent.251p1632@transcend.org",
  },
  {
    "studentName": "Chimayi Sai Shambhukar",
    "studentId": "251P2338",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "BG Road, Police Station Gottiger",
    "dropStop": "BG Road, Police Station Gottiger",
    "parentContact": "9535203147",
    "parentEmail": "parent.251p2338@transcend.org",
  },
  {
    "studentName": "Immanuel Shobi Mathew",
    "studentId": "261P3254",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Brahmakumari Shivashram Amodha Apartment",
    "dropStop": "Brahmakumari Shivashram Amodha Apartment",
    "parentContact": "8147872960",
    "parentEmail": "parent.261p3254@transcend.org",
  },
  {
    "studentName": "SHLLOK K KUMAR",
    "studentId": "231S1007",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Bramhakumari",
    "dropStop": "Bramhakumari",
    "parentContact": "9900996981",
    "parentEmail": "parent.231s1007@transcend.org",
  },
  {
    "studentName": "Gautham Kumar V",
    "studentId": "261P3470",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "Brookes Haven, JP Nagar 8th phase",
    "dropStop": "Brookes Haven, JP Nagar 8th phase",
    "parentContact": "9731398744",
    "parentEmail": "parent.261p3470@transcend.org",
  },
  {
    "studentName": "JAISHREE",
    "studentId": "251P1971",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Chuchaghatta Circle, Udupi Garden Hotel",
    "dropStop": "Chuchaghatta Circle, Udupi Garden Hotel",
    "parentContact": "9036177016",
    "parentEmail": "parent.251p1971@transcend.org",
  },
  {
    "studentName": "Anushka Jain",
    "studentId": "251P1227",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "D306, Purva Panorama, Kalena Agrahara,(PICKUP)",
    "dropStop": "D306, Purva Panorama, Kalena Agrahara,(PICKUP)",
    "parentContact": "9686900224",
    "parentEmail": "parent.251p1227@transcend.org",
  },
  {
    "studentName": "Nithya Susan Aby",
    "studentId": "251P1152",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Decatalon, BG Road",
    "dropStop": "Decatalon, BG Road",
    "parentContact": "9741711288",
    "parentEmail": "parent.251p1152@transcend.org",
  },
  {
    "studentName": "Ananya Chandankeri",
    "studentId": "251P1261",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Decatalon, BG Road",
    "dropStop": "Decatalon, BG Road",
    "parentContact": "9845449001",
    "parentEmail": "parent.251p1261@transcend.org",
  },
  {
    "studentName": "R Adithya",
    "studentId": "261P4236",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "Gotigere bustop",
    "dropStop": "Gotigere bustop",
    "parentContact": "9845140010",
    "parentEmail": "parent.261p4236@transcend.org",
  },
  {
    "studentName": "Dhruv Shastri",
    "studentId": "261P3255",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "GR REGENT PARK, Gottigere lake",
    "dropStop": "GR REGENT PARK, Gottigere lake",
    "parentContact": "8095461677",
    "parentEmail": "parent.261p3255@transcend.org",
  },
  {
    "studentName": "Shourya Shrihari Shastry",
    "studentId": "251S1222",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "HM worlc city",
    "dropStop": "HM worlc city",
    "parentContact": "9663818237",
    "parentEmail": "parent.251s1222@transcend.org",
  },
  {
    "studentName": "Sanjana S",
    "studentId": "261P3619",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "HM World City Apartments, JP Nagar 9th Phase",
    "dropStop": "HM World City Apartments, JP Nagar 9th Phase",
    "parentContact": "9886109266",
    "parentEmail": "parent.261p3619@transcend.org",
  },
  {
    "studentName": "Siddharth Bulbule",
    "studentId": "261P3421",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "HM World City Indigo",
    "dropStop": "HM World City Indigo",
    "parentContact": "9845295768",
    "parentEmail": "parent.261p3421@transcend.org",
  },
  {
    "studentName": "Anika Teja Reddy",
    "studentId": "261P3796",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "KLV Layout",
    "dropStop": "KLV Layout",
    "parentContact": "9880124645",
    "parentEmail": "parent.261p3796@transcend.org",
  },
  {
    "studentName": "Sumedh Waldoddi",
    "studentId": "261P3798",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "KLV Layout",
    "dropStop": "KLV Layout",
    "parentContact": "9901211100",
    "parentEmail": "parent.261p3798@transcend.org",
  },
  {
    "studentName": "Aishwarya Doijode",
    "studentId": "251P2427",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "KLV layout kothnur",
    "dropStop": "KLV layout kothnur",
    "parentContact": "9886656041",
    "parentEmail": "parent.251p2427@transcend.org",
  },
  {
    "studentName": "Shraavani Karagudari",
    "studentId": "251P1310",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "KLV layout, 8th Phase",
    "dropStop": "KLV layout, 8th Phase",
    "parentContact": "9739266277",
    "parentEmail": "parent.251p1310@transcend.org",
  },
  {
    "studentName": "Yerramilli Naman Sahir",
    "studentId": "251P1695",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Lane opp to Decathlon Bannerghatta",
    "dropStop": "Lane opp to Decathlon Bannerghatta",
    "parentContact": "9686669232",
    "parentEmail": "parent.251p1695@transcend.org",
  },
  {
    "studentName": "B. Deekshana",
    "studentId": "251P1713",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Mantri Residency , near Meenakshi Temple",
    "dropStop": "Mantri Residency , near Meenakshi Temple",
    "parentContact": "9886036796",
    "parentEmail": "parent.251p1713@transcend.org",
  },
  {
    "studentName": "Manasvi S",
    "studentId": "251P2112",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Mantri Residency , near Meenakshi Temple",
    "dropStop": "Mantri Residency , near Meenakshi Temple",
    "parentContact": "9900213006",
    "parentEmail": "parent.251p2112@transcend.org",
  },
  {
    "studentName": "Sai Prabhat Atte",
    "studentId": "261P3644",
    "route": "Route 16",
    "bus": "KA-16-WX-0020",
    "pickupStop": "Near AECS Nursing college, Hulimavu",
    "dropStop": "Near AECS Nursing college, Hulimavu",
    "parentContact": "9945714553",
    "parentEmail": "parent.261p3644@transcend.org",
  },
  {
    "studentName": "Arnav sharma",
    "studentId": "261P3989",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Near Bangalore public school, Gottigere Lake Rd, off Bannerghatta Road, Phase 2, Kammanahalli",
    "dropStop": "Near Bangalore public school, Gottigere Lake Rd, off Bannerghatta Road, Phase 2, Kammanahalli",
    "parentContact": "9660191394",
    "parentEmail": "parent.261p3989@transcend.org",
  },
  {
    "studentName": "Tarun Sri Nishanth D",
    "studentId": "261P3547",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "Near Namma Cake Aramane JP Nagar 8th Phase( KLV Layout)",
    "dropStop": "Near Namma Cake Aramane JP Nagar 8th Phase( KLV Layout)",
    "parentContact": "9449834442",
    "parentEmail": "parent.261p3547@transcend.org",
  },
  {
    "studentName": "Vanshika Deepak Naik",
    "studentId": "261P3827",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Near RML Law College, Vijayashree Hospitals Gottigere",
    "dropStop": "Near RML Law College, Vijayashree Hospitals Gottigere",
    "parentContact": "7406050528",
    "parentEmail": "parent.261p3827@transcend.org",
  },
  {
    "studentName": "CHINMAY PRAVEEN NAIK",
    "studentId": "261P3828",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Near Vijayshree hospital Gottigere BG Road",
    "dropStop": "Near Vijayshree hospital Gottigere BG Road",
    "parentContact": "9902099929",
    "parentEmail": "parent.261p3828@transcend.org",
  },
  {
    "studentName": "Dhruvan Tayi",
    "studentId": "261P4081",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Nobo Nagar Doddakammanahalli road off Bannerghatta road",
    "dropStop": "Nobo Nagar Doddakammanahalli road off Bannerghatta road",
    "parentContact": "9740189080",
    "parentEmail": "parent.261p4081@transcend.org",
  },
  {
    "studentName": "Adya Mahesh Bhat",
    "studentId": "261P4248",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "Nydhile residency, near Gottigere police station",
    "dropStop": "Nydhile residency, near Gottigere police station",
    "parentContact": "9482133067",
    "parentEmail": "parent.261p4248@transcend.org",
  },
  {
    "studentName": "Medha Hemanth",
    "studentId": "261P3109",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Opposite Easy Shopping Mart, Raja Aristos Apartment",
    "dropStop": "Opposite Easy Shopping Mart, Raja Aristos Apartment",
    "parentContact": "9535159902",
    "parentEmail": "parent.261p3109@transcend.org",
  },
  {
    "studentName": "Pavani M S",
    "studentId": "251P2013",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Raja Aristos near B G Road",
    "dropStop": "Raja Aristos near B G Road",
    "parentContact": "9900144403",
    "parentEmail": "parent.251p2013@transcend.org",
  },
  {
    "studentName": "Virata Hadadi Vikrama",
    "studentId": "261P3755",
    "route": "Route 16",
    "bus": "KA-16-WX-0020",
    "pickupStop": "Road opposite to Meenakshi Temple. Bannerghatta Road.Dooda Kammanahalli road",
    "dropStop": "Road opposite to Meenakshi Temple. Bannerghatta Road.Dooda Kammanahalli road",
    "parentContact": "9632150946",
    "parentEmail": "parent.261p3755@transcend.org",
  },
  {
    "studentName": "Raghav Gururaj Kulkarni",
    "studentId": "251P1401",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "RV Institute of technology and management",
    "dropStop": "RV Institute of technology and management",
    "parentContact": "9731718718",
    "parentEmail": "parent.251p1401@transcend.org",
  },
  {
    "studentName": "Poorvi Hangal Mutt",
    "studentId": "261P3314",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Sai Nandana Gardenia, Gottigere Lake Rd",
    "dropStop": "Sai Nandana Gardenia, Gottigere Lake Rd",
    "parentContact": "9980388611",
    "parentEmail": "parent.261p3314@transcend.org",
  },
  {
    "studentName": "Disha Sunil Yadagiri",
    "studentId": "261P3988",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Sri Sai Paradise Next to Vinayaka theater",
    "dropStop": "Sri Sai Paradise Next to Vinayaka theater",
    "parentContact": "9886642909",
    "parentEmail": "parent.261p3988@transcend.org",
  },
  {
    "studentName": "Liana Elsa Fenny",
    "studentId": "261P4066",
    "route": "Route 16",
    "bus": "KA-16-WX-0016",
    "pickupStop": "Vijayashree Hospitals, Bannerghatta Rd",
    "dropStop": "Vijayashree Hospitals, Bannerghatta Rd",
    "parentContact": "9740062789",
    "parentEmail": "parent.261p4066@transcend.org",
  },
  {
    "studentName": "Sai Sinchana Sarode",
    "studentId": "251P1928",
    "route": "Route 17",
    "bus": "KA-17-YZ-0019",
    "pickupStop": "SHREE ENCLAVE LAYOUT, NYANAPPANAH DLF",
    "dropStop": "SHREE ENCLAVE LAYOUT, NYANAPPANAH DLF",
    "parentContact": "9739916482",
    "parentEmail": "parent.251p1928@transcend.org",
  },
  {
    "studentName": "Shreekara P Gundmi",
    "studentId": "251P2092",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "#12,Siri,9th main,Chamundeshwarinagar,Begur Bande park",
    "dropStop": "#12,Siri,9th main,Chamundeshwarinagar,Begur Bande park",
    "parentContact": "9880106277",
    "parentEmail": "parent.251p2092@transcend.org",
  },
  {
    "studentName": "Yash K Gupta",
    "studentId": "251P1331",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "A 2604, Queensgate, House of Hiranandani, Akshaynagar",
    "dropStop": "A 2604, Queensgate, House of Hiranandani, Akshaynagar",
    "parentContact": "9886262243",
    "parentEmail": "parent.251p1331@transcend.org",
  },
  {
    "studentName": "Nivaan Girish Anuga",
    "studentId": "231S1044",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Bharath petrol pump",
    "dropStop": "Bharath petrol pump",
    "parentContact": "9448086666",
    "parentEmail": "parent.231s1044@transcend.org",
  },
  {
    "studentName": "Nidhi Shivakumar",
    "studentId": "261P3416",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "BTM 4th stg. Next to Green Orchards apartment",
    "dropStop": "BTM 4th stg. Next to Green Orchards apartment",
    "parentContact": "9972000661",
    "parentEmail": "parent.261p3416@transcend.org",
  },
  {
    "studentName": "Vibhashree C",
    "studentId": "251P1450",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "DLF Union Bank Akshayanagara,Bangalore-",
    "dropStop": "DLF Union Bank Akshayanagara,Bangalore-",
    "parentContact": "9739932949",
    "parentEmail": "parent.251p1450@transcend.org",
  },
  {
    "studentName": "Pratyush Nair",
    "studentId": "261P3287",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "DLF Newtown, Akshayanagar",
    "dropStop": "DLF Newtown, Akshayanagar",
    "parentContact": "9900064810",
    "parentEmail": "parent.261p3287@transcend.org",
  },
  {
    "studentName": "Jyothirmayee G Kulkarni",
    "studentId": "251P2501",
    "route": "Route 17",
    "bus": "KA-17-YZ-0000",
    "pickupStop": "DLF Road Apollo Pharmacy",
    "dropStop": "DLF Road Apollo Pharmacy",
    "parentContact": "9845447595",
    "parentEmail": "parent.251p2501@transcend.org",
  },
  {
    "studentName": "Chirag S",
    "studentId": "261P4219",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Dlf town circle, begur hulimavu road",
    "dropStop": "Dlf town circle, begur hulimavu road",
    "parentContact": "9980543201",
    "parentEmail": "parent.261p4219@transcend.org",
  },
  {
    "studentName": "Samit Biswas",
    "studentId": "251P1521",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "DLF Westend Heights, DLF New Town, Akshaya Nag",
    "dropStop": "DLF Westend Heights, DLF New Town, Akshaya Nag",
    "parentContact": "9972999742",
    "parentEmail": "parent.251p1521@transcend.org",
  },
  {
    "studentName": "Dhatri Nadig",
    "studentId": "251P1123",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "G004, Niranjan Maxima Apt Sai Baba Road, Arekere,",
    "dropStop": "G004, Niranjan Maxima Apt Sai Baba Road, Arekere,",
    "parentContact": "9686861734",
    "parentEmail": "parent.251p1123@transcend.org",
  },
  {
    "studentName": "Siddhant Vinayak Patil",
    "studentId": "261P3151",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Hiranandani Hill Crest Rd, Akshaya Gardens, Akshayanagar, Bengaluru, Karnataka 560114",
    "dropStop": "Hiranandani Hill Crest Rd, Akshaya Gardens, Akshayanagar, Bengaluru, Karnataka 560114",
    "parentContact": "7406508844",
    "parentEmail": "parent.261p3151@transcend.org",
  },
  {
    "studentName": "Shubh Chopra",
    "studentId": "251P2443",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Hiranandani, Apartment",
    "dropStop": "Hiranandani, Apartment",
    "parentContact": "9958291212",
    "parentEmail": "parent.251p2443@transcend.org",
  },
  {
    "studentName": "Pramod Mudlapur",
    "studentId": "251S2105",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Hiranandani, Apartment",
    "dropStop": "Hiranandani, Apartment",
    "parentContact": "9845515313",
    "parentEmail": "parent.251s2105@transcend.org",
  },
  {
    "studentName": "Amitosh Kumar Rao K",
    "studentId": "251P2495",
    "route": "Route 17",
    "bus": "KA-17-YZ-0019",
    "pickupStop": "Hiranandhini Apartment",
    "dropStop": "Hiranandhini Apartment",
    "parentContact": "9940505506",
    "parentEmail": "parent.251p2495@transcend.org",
  },
  {
    "studentName": "Kushal V Joshi",
    "studentId": "261P3678",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Keya Springs, 80 ft road, Arekere Sai baba temple road",
    "dropStop": "Keya Springs, 80 ft road, Arekere Sai baba temple road",
    "parentContact": "9686663733",
    "parentEmail": "parent.261p3678@transcend.org",
  },
  {
    "studentName": "Risha Shetty",
    "studentId": "261P3044",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Near Arekere RTO",
    "dropStop": "Near Arekere RTO",
    "parentContact": "9880034317",
    "parentEmail": "parent.261p3044@transcend.org",
  },
  {
    "studentName": "Rehan Hasan",
    "studentId": "251P1562",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Near DLF Akshaynagar",
    "dropStop": "Near DLF Akshaynagar",
    "parentContact": "9448169870/7892554662",
    "parentEmail": "parent.251p1562@transcend.org",
  },
  {
    "studentName": "Anika shailesh",
    "studentId": "261P4301",
    "route": "Route 17",
    "bus": "KA-17-YZ-0000",
    "pickupStop": "Near KA51 RTO",
    "dropStop": "Near KA51 RTO",
    "parentContact": "9448511997",
    "parentEmail": "parent.261p4301@transcend.org",
  },
  {
    "studentName": "T Pranavi",
    "studentId": "261P3141",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Near Maruthi Enterprises (Kent Authorised dealer), Indira Gandhi Housing Colony, Arekere, Sai baba temple",
    "dropStop": "Near Maruthi Enterprises (Kent Authorised dealer), Indira Gandhi Housing Colony, Arekere, Sai baba temple",
    "parentContact": "9620800369",
    "parentEmail": "parent.261p3141@transcend.org",
  },
  {
    "studentName": "Samarth Pandey",
    "studentId": "261P3744",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Near RTO office, Devarachikkanahalli Rd",
    "dropStop": "Near RTO office, Devarachikkanahalli Rd",
    "parentContact": "9980098800",
    "parentEmail": "parent.261p3744@transcend.org",
  },
  {
    "studentName": "PURVIKANAG K MANASALI",
    "studentId": "261P3873",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Near Stone Park",
    "dropStop": "Near Stone Park",
    "parentContact": "9845380042",
    "parentEmail": "parent.261p3873@transcend.org",
  },
  {
    "studentName": "Dhruvanth B S",
    "studentId": "261P3612",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Opp Dominos Pizza, Nyanappana Halli, Hulimavu",
    "dropStop": "Opp Dominos Pizza, Nyanappana Halli, Hulimavu",
    "parentContact": "9900794500",
    "parentEmail": "parent.261p3612@transcend.org",
  },
  {
    "studentName": "Shrikar R Raikar",
    "studentId": "251P2250",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Opposite to Mayura Bakery Sai Baba Temple Road 80 Feet Road",
    "dropStop": "Opposite to Mayura Bakery Sai Baba Temple Road 80 Feet Road",
    "parentContact": "9164558777",
    "parentEmail": "parent.251p2250@transcend.org",
  },
  {
    "studentName": "K Suchitha",
    "studentId": "261P3106",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Opposite to Stone Park/playground",
    "dropStop": "Opposite to Stone Park/playground",
    "parentContact": "9900862019",
    "parentEmail": "parent.261p3106@transcend.org",
  },
  {
    "studentName": "Umaiza Shaik",
    "studentId": "261P3124",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Sai Baba Temple Road",
    "dropStop": "Sai Baba Temple Road",
    "parentContact": "9611097560",
    "parentEmail": "parent.261p3124@transcend.org",
  },
  {
    "studentName": "Jeevamurthy T",
    "studentId": "251P2326",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Sai Baba Temple Road,",
    "dropStop": "Sai Baba Temple Road,",
    "parentContact": "9980785274",
    "parentEmail": "parent.251p2326@transcend.org",
  },
  {
    "studentName": "Gundlapalli Venkata Adhiti",
    "studentId": "251P2390",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Sai Baba Temple Road,",
    "dropStop": "Sai Baba Temple Road,",
    "parentContact": "8105600223",
    "parentEmail": "parent.251p2390@transcend.org",
  },
  {
    "studentName": "Tanisha S",
    "studentId": "261P3458",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Saibaba temple road 80feet road hulimamu road, Suraksha Landmark Apartment",
    "dropStop": "Saibaba temple road 80feet road hulimamu road, Suraksha Landmark Apartment",
    "parentContact": "9986992040",
    "parentEmail": "parent.261p3458@transcend.org",
  },
  {
    "studentName": "Dev N Shetty",
    "studentId": "251P1139",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Saptagiri Splendor, Opp RTO , D.C. main road, Bangalore BTM 4th stage",
    "dropStop": "Saptagiri Splendor, Opp RTO , D.C. main road, Bangalore BTM 4th stage",
    "parentContact": "9880908575",
    "parentEmail": "parent.251p1139@transcend.org",
  },
  {
    "studentName": "Lakshmi Sumedha Gangisetty",
    "studentId": "251P2060",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "SHANTHINIKETAN LAYOUT Sai Baba Road ARAKERE BG ROAD",
    "dropStop": "SHANTHINIKETAN LAYOUT Sai Baba Road ARAKERE BG ROAD",
    "parentContact": "9980191908",
    "parentEmail": "parent.251p2060@transcend.org",
  },
  {
    "studentName": "SHRAVYA D BHAT",
    "studentId": "261P3823",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Stone Park, Devarachikkanahalli Main Road",
    "dropStop": "Stone Park, Devarachikkanahalli Main Road",
    "parentContact": "7204010107",
    "parentEmail": "parent.261p3823@transcend.org",
  },
  {
    "studentName": "Aditi R Koundinya",
    "studentId": "251P2020",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Stone park, Devarachikkanahalli",
    "dropStop": "Stone park, Devarachikkanahalli",
    "parentContact": "9845270705",
    "parentEmail": "parent.251p2020@transcend.org",
  },
  {
    "studentName": "Dhanu priya V",
    "studentId": "251P2468",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Stone park, Devarachikkanahalli",
    "dropStop": "Stone park, Devarachikkanahalli",
    "parentContact": "9886818749",
    "parentEmail": "parent.251p2468@transcend.org",
  },
  {
    "studentName": "Archana M K",
    "studentId": "251P1662",
    "route": "Route 17",
    "bus": "KA-17-YZ-0006",
    "pickupStop": "Yelenahalli Main Rd, DLF Newtown, Akshayanagar",
    "dropStop": "Yelenahalli Main Rd, DLF Newtown, Akshayanagar",
    "parentContact": "9380004725",
    "parentEmail": "parent.251p1662@transcend.org",
  },
  {
    "studentName": "Divya Karemuragi",
    "studentId": "261P3585",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Anjanapura Bus Depot, Adithya Garden Layout",
    "dropStop": "Anjanapura Bus Depot, Adithya Garden Layout",
    "parentContact": "9741633533",
    "parentEmail": "parent.261p3585@transcend.org",
  },
  {
    "studentName": "Sidhanth Ranganath",
    "studentId": "261P3345",
    "route": "Route 20",
    "bus": "KA-20-FG-0018",
    "pickupStop": "Behind Capitol public school, JP Nagar 6th Phase",
    "dropStop": "Behind Capitol public school, JP Nagar 6th Phase",
    "parentContact": "9739004832",
    "parentEmail": "parent.261p3345@transcend.org",
  },
  {
    "studentName": "Unnathi Raghavendra",
    "studentId": "261P3819",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "BK CIRCLE",
    "dropStop": "BK CIRCLE",
    "parentContact": "9980560362",
    "parentEmail": "parent.261p3819@transcend.org",
  },
  {
    "studentName": "Shivacharan Thumma",
    "studentId": "261P3247",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Brigade Gardenia ,JPNagar, 7th phase , RBI LAYOUT",
    "dropStop": "Brigade Gardenia ,JPNagar, 7th phase , RBI LAYOUT",
    "parentContact": "9845180068",
    "parentEmail": "parent.261p3247@transcend.org",
  },
  {
    "studentName": "Aditi Bhoopalam Ajay",
    "studentId": "261P3224",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "BRIGADE GARDENIA, Capitol School",
    "dropStop": "BRIGADE GARDENIA, Capitol School",
    "parentContact": "9900100650",
    "parentEmail": "parent.261p3224@transcend.org",
  },
  {
    "studentName": "Nithya Ashwin",
    "studentId": "261P4017",
    "route": "Route 20",
    "bus": "KA-20-FG-0018",
    "pickupStop": "Capitol Public School Main building opposite to RBI ground, next to SBI bank",
    "dropStop": "Capitol Public School Main building opposite to RBI ground, next to SBI bank",
    "parentContact": "9845432282",
    "parentEmail": "parent.261p4017@transcend.org",
  },
  {
    "studentName": "Urshita H K",
    "studentId": "251P1433",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "D mart",
    "dropStop": "D mart",
    "parentContact": "9886062020",
    "parentEmail": "parent.251p1433@transcend.org",
  },
  {
    "studentName": "Thrisha Gavimath",
    "studentId": "261P3513",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Dakshin cafe, Kothanur Road",
    "dropStop": "Dakshin cafe, Kothanur Road",
    "parentContact": "9900197944",
    "parentEmail": "parent.261p3513@transcend.org",
  },
  {
    "studentName": "Madhav Balakrishnan",
    "studentId": "261P3525",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Dakshin Cafe, Kothnur Main Rd",
    "dropStop": "Dakshin Cafe, Kothnur Main Rd",
    "parentContact": "9840971503",
    "parentEmail": "parent.261p3525@transcend.org",
  },
  {
    "studentName": "Vivaan Raju K",
    "studentId": "251S1270",
    "route": "Route 18",
    "bus": "KA-18-BC-0016",
    "pickupStop": "Decatalon, BG Road",
    "dropStop": "Decatalon, BG Road",
    "parentContact": "8095000015",
    "parentEmail": "parent.251s1270@transcend.org",
  },
  {
    "studentName": "Nakshatra Raghavendra",
    "studentId": "261P3965",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Fiton sports, Gottigere,pavamana nagar Kembathalli main road",
    "dropStop": "Fiton sports, Gottigere,pavamana nagar Kembathalli main road",
    "parentContact": "7795545164",
    "parentEmail": "parent.261p3965@transcend.org",
  },
  {
    "studentName": "Tejal S",
    "studentId": "251P1623",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Gavran Nagar",
    "dropStop": "Gavran Nagar",
    "parentContact": "9880762471",
    "parentEmail": "parent.251p1623@transcend.org",
  },
  {
    "studentName": "Soukhya S Bharadwaj",
    "studentId": "251P1830",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Gottigere,pavamana nagar Kembathalli main road",
    "dropStop": "Gottigere,pavamana nagar Kembathalli main road",
    "parentContact": "9880544331",
    "parentEmail": "parent.251p1830@transcend.org",
  },
  {
    "studentName": "Iciri Barsin",
    "studentId": "261P3229",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Gourav Nagara bus stop, Aramane Done Briyani",
    "dropStop": "Gourav Nagara bus stop, Aramane Done Briyani",
    "parentContact": "9845235953",
    "parentEmail": "parent.261p3229@transcend.org",
  },
  {
    "studentName": "Samanyu S Bangle",
    "studentId": "251P1850",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Gowravnagar bus stop",
    "dropStop": "Gowravnagar bus stop",
    "parentContact": "9844129979",
    "parentEmail": "parent.251p1850@transcend.org",
  },
  {
    "studentName": "Haasika muralikrishna",
    "studentId": "261P3640",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Jambu Savari dhinne water tank",
    "dropStop": "Jambu Savari dhinne water tank",
    "parentContact": "9844068576",
    "parentEmail": "parent.261p3640@transcend.org",
  },
  {
    "studentName": "Janani P",
    "studentId": "261P3815",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Jambusavari Dinee Bus stand",
    "dropStop": "Jambusavari Dinee Bus stand",
    "parentContact": "9886173885",
    "parentEmail": "parent.261p3815@transcend.org",
  },
  {
    "studentName": "Nakshatra Balakrishnan",
    "studentId": "251P2214",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Jambusavari Dinne Godhavari Hotel",
    "dropStop": "Jambusavari Dinne Godhavari Hotel",
    "parentContact": "8072690124",
    "parentEmail": "parent.251p2214@transcend.org",
  },
  {
    "studentName": "Adhokshaj Vadiraj Ashrit",
    "studentId": "251P1459",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "KEB Petrol Bunk Anjanapura, NPS School",
    "dropStop": "KEB Petrol Bunk Anjanapura, NPS School",
    "parentContact": "9676981188",
    "parentEmail": "parent.251p1459@transcend.org",
  },
  {
    "studentName": "Deeksha Praveen kumar",
    "studentId": "261P4014",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Keerthi convention hall, Kothnur BWSSB Water Tank",
    "dropStop": "Keerthi convention hall, Kothnur BWSSB Water Tank",
    "parentContact": "9902366006",
    "parentEmail": "parent.261p4014@transcend.org",
  },
  {
    "studentName": "Fathima Rida",
    "studentId": "261P3551",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Kembathalli Main Rd, South Avenue, Gottigere",
    "dropStop": "Kembathalli Main Rd, South Avenue, Gottigere",
    "parentContact": "8660032319",
    "parentEmail": "parent.261p3551@transcend.org",
  },
  {
    "studentName": "Poshitha M S",
    "studentId": "261P3808",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Kembathalli main road",
    "dropStop": "Kembathalli main road",
    "parentContact": "9731283437",
    "parentEmail": "parent.261p3808@transcend.org",
  },
  {
    "studentName": "A Daisy Carina",
    "studentId": "251P2386",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Kothanur Dinne Main Road",
    "dropStop": "Kothanur Dinne Main Road",
    "parentContact": "9742772914",
    "parentEmail": "parent.251p2386@transcend.org",
  },
  {
    "studentName": "Nihal M",
    "studentId": "261P3774",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Mangalya Apartment, Kolifarm Gate",
    "dropStop": "Mangalya Apartment, Kolifarm Gate",
    "parentContact": "9972252056",
    "parentEmail": "parent.261p3774@transcend.org",
  },
  {
    "studentName": "Kavita Choudhary",
    "studentId": "261P3870",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Mangalya Apartment, Kolifarm Gate",
    "dropStop": "Mangalya Apartment, Kolifarm Gate",
    "parentContact": "8884048400",
    "parentEmail": "parent.261p3870@transcend.org",
  },
  {
    "studentName": "Nikhil S Gowda",
    "studentId": "261P3017",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Nature pure cold pressed oil Coconut shop Anjanapur",
    "dropStop": "Nature pure cold pressed oil Coconut shop Anjanapur",
    "parentContact": "9972882653",
    "parentEmail": "parent.261p3017@transcend.org",
  },
  {
    "studentName": "Manasi Murali",
    "studentId": "251P1541",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Navodaya Nagar Bus Stop JP Nagar 7th phase Axis Aspira",
    "dropStop": "Navodaya Nagar Bus Stop JP Nagar 7th phase Axis Aspira",
    "parentContact": "9880638110",
    "parentEmail": "parent.251p1541@transcend.org",
  },
  {
    "studentName": "Deeksha Hegde",
    "studentId": "261P4169",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Navodaya Nagar Busstop, Kothanur Main Road",
    "dropStop": "Navodaya Nagar Busstop, Kothanur Main Road",
    "parentContact": "9945334399",
    "parentEmail": "parent.261p4169@transcend.org",
  },
  {
    "studentName": "Adithya Bharadwaj",
    "studentId": "261P3186",
    "route": "Route 20",
    "bus": "KA-20-FG-0018",
    "pickupStop": "Near BBMP office RBI layout, Full Address: No 50, Inchara, 6th A Main, 1st A Cross, Gaurav Nagar, SBI Bank",
    "dropStop": "Near BBMP office RBI layout, Full Address: No 50, Inchara, 6th A Main, 1st A Cross, Gaurav Nagar, SBI Bank",
    "parentContact": "9591664664",
    "parentEmail": "parent.261p3186@transcend.org",
  },
  {
    "studentName": "Nihal M",
    "studentId": "261P3415",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Near keerthi convention hall. Jp Nagar 8th phase",
    "dropStop": "Near keerthi convention hall. Jp Nagar 8th phase",
    "parentContact": "9611640931",
    "parentEmail": "parent.261p3415@transcend.org",
  },
  {
    "studentName": "Anagha Shashanka",
    "studentId": "261P3127",
    "route": "Route 20",
    "bus": "KA-20-FG-0018",
    "pickupStop": "Near Someshwara Sabha Bhavan, Kakal Kai Ruchi JP Nagar 7th Phase",
    "dropStop": "Near Someshwara Sabha Bhavan, Kakal Kai Ruchi JP Nagar 7th Phase",
    "parentContact": "9731916000",
    "parentEmail": "parent.261p3127@transcend.org",
  },
  {
    "studentName": "Uditi Desireddy",
    "studentId": "261P3265",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Opposite to BWSSB water tank, South Avenue, Gundappa layout",
    "dropStop": "Opposite to BWSSB water tank, South Avenue, Gundappa layout",
    "parentContact": "7760489999",
    "parentEmail": "parent.261p3265@transcend.org",
  },
  {
    "studentName": "Apoorva Yazhini Saranya Kathiresan",
    "studentId": "261P3210",
    "route": "Route 18",
    "bus": "KA-18-BC-0000",
    "pickupStop": "Prestige Park Square Apartment",
    "dropStop": "Prestige Park Square Apartment",
    "parentContact": "9731100884",
    "parentEmail": "parent.261p3210@transcend.org",
  },
  {
    "studentName": "Praneel Gaurav Manjesh",
    "studentId": "261P3657",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Revanker's Skin Clinic, Navodaya Nagar, JP Nagar 7th Phase",
    "dropStop": "Revanker's Skin Clinic, Navodaya Nagar, JP Nagar 7th Phase",
    "parentContact": "9886380779",
    "parentEmail": "parent.261p3657@transcend.org",
  },
  {
    "studentName": "Krithika N",
    "studentId": "261P3671",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Royal Serenity Apartment, Near godavari cafe",
    "dropStop": "Royal Serenity Apartment, Near godavari cafe",
    "parentContact": "6363311467",
    "parentEmail": "parent.261p3671@transcend.org",
  },
  {
    "studentName": "Kevin Solomon Roger",
    "studentId": "261P3146",
    "route": "Route 20",
    "bus": "KA-20-FG-0000",
    "pickupStop": "Shaolin Wushu Cultural Center, Dakshin Café JP Nagar(SBI BAnk)",
    "dropStop": "Shaolin Wushu Cultural Center, Dakshin Café JP Nagar(SBI BAnk)",
    "parentContact": "9481568167",
    "parentEmail": "parent.261p3146@transcend.org",
  },
  {
    "studentName": "Bhuvana Priya R",
    "studentId": "251P2545",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Sillicon Valley School, Kembathalli main raod,",
    "dropStop": "Sillicon Valley School, Kembathalli main raod,",
    "parentContact": "9036990739",
    "parentEmail": "parent.251p2545@transcend.org",
  },
  {
    "studentName": "Harsh Tulsiani",
    "studentId": "261P3717",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "South Avenue layout, Godavari Cafe",
    "dropStop": "South Avenue layout, Godavari Cafe",
    "parentContact": "9036974953",
    "parentEmail": "parent.261p3717@transcend.org",
  },
  {
    "studentName": "Rathi.s",
    "studentId": "251S1817",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Surabhi Nagar, jp nagar 8th phase above Maruti Suzuki Spare parts show room",
    "dropStop": "Surabhi Nagar, jp nagar 8th phase above Maruti Suzuki Spare parts show room",
    "parentContact": "8123030565",
    "parentEmail": "parent.251s1817@transcend.org",
  },
  {
    "studentName": "Pratham Baliga B",
    "studentId": "261P3467",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Texs Mart, Kothnur Main Rd, Navodaya Nagar, Bharath Petrol bunk Near",
    "dropStop": "Texs Mart, Kothnur Main Rd, Navodaya Nagar, Bharath Petrol bunk Near",
    "parentContact": "9902422522",
    "parentEmail": "parent.261p3467@transcend.org",
  },
  {
    "studentName": "Anushka R N",
    "studentId": "261P3462",
    "route": "Route 18",
    "bus": "KA-18-BC-0018",
    "pickupStop": "Varah Healthcare Speciality Clinic, Kothnur Main Rd",
    "dropStop": "Varah Healthcare Speciality Clinic, Kothnur Main Rd",
    "parentContact": "9886220315",
    "parentEmail": "parent.261p3462@transcend.org",
  },
  {
    "studentName": "Drishti S Kambali",
    "studentId": "261P3897",
    "route": "Route 18",
    "bus": "KA-18-BC-0016",
    "pickupStop": "Vinayaka temple, kothnoordinne main road",
    "dropStop": "Vinayaka temple, kothnoordinne main road",
    "parentContact": "9986698845",
    "parentEmail": "parent.261p3897@transcend.org",
  },
  {
    "studentName": "VIRAT NARAYAN",
    "studentId": "231S1043",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Akshaya Nagar, DLF Road Ganiesh Temple",
    "dropStop": "Akshaya Nagar, DLF Road Ganiesh Temple",
    "parentContact": "9620468882",
    "parentEmail": "parent.231s1043@transcend.org",
  },
  {
    "studentName": "Sneha Patil",
    "studentId": "251P1355",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Akshaya Nagar, DLF Road Ganiesh Temple",
    "dropStop": "Akshaya Nagar, DLF Road Ganiesh Temple",
    "parentContact": "9945160782",
    "parentEmail": "parent.251p1355@transcend.org",
  },
  {
    "studentName": "Sahana p",
    "studentId": "251P2429",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "DLF Road Ganiesh Temple",
    "dropStop": "DLF Road Ganiesh Temple",
    "parentContact": "7349245788/9972071600",
    "parentEmail": "parent.251p2429@transcend.org",
  },
  {
    "studentName": "SAMEEKSHA UNNIKRISHNA",
    "studentId": "221S1045",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "L and T South City, Arekere Mico Layout,",
    "dropStop": "L and T South City, Arekere Mico Layout,",
    "parentContact": "9902729949",
    "parentEmail": "parent.221s1045@transcend.org",
  },
  {
    "studentName": "Karan Jagga",
    "studentId": "251P1530",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "L and T South City, Arekere Mico Layout,",
    "dropStop": "L and T South City, Arekere Mico Layout,",
    "parentContact": "7899809366",
    "parentEmail": "parent.251p1530@transcend.org",
  },
  {
    "studentName": "Laksh Krishna Kumar",
    "studentId": "251P1871",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "L and T South City, Arekere Mico Layout,",
    "dropStop": "L and T South City, Arekere Mico Layout,",
    "parentContact": "6364565577",
    "parentEmail": "parent.251p1871@transcend.org",
  },
  {
    "studentName": "AADHYA BHARAT",
    "studentId": "251S1684",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "L and T South City, Arekere Mico Layout,",
    "dropStop": "L and T South City, Arekere Mico Layout,",
    "parentContact": "8144099766",
    "parentEmail": "parent.251s1684@transcend.org",
  },
  {
    "studentName": "Abhinav. A. Koushik",
    "studentId": "251P1638",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "32, opp. Janahavi shelters, yelenahalli, akshaynagar",
    "dropStop": "32, opp. Janahavi shelters, yelenahalli, akshaynagar",
    "parentContact": "8884469485",
    "parentEmail": "parent.251p1638@transcend.org",
  },
  {
    "studentName": "Kavana Paple",
    "studentId": "261P3521",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "71, 2nd Main, 5th Cross, Yelenahalli md, euro kids preschool",
    "dropStop": "71, 2nd Main, 5th Cross, Yelenahalli md, euro kids preschool",
    "parentContact": "9900509797",
    "parentEmail": "parent.261p3521@transcend.org",
  },
  {
    "studentName": "Kanksha Kasetty",
    "studentId": "261P3702",
    "route": "Route 19",
    "bus": "KA-19-DF-0000",
    "pickupStop": "Adjacent to Bochs Akshaya Apartments, Fullinfaws College Yelenahalli Main Rd",
    "dropStop": "Adjacent to Bochs Akshaya Apartments, Fullinfaws College Yelenahalli Main Rd",
    "parentContact": "7411945826",
    "parentEmail": "parent.261p3702@transcend.org",
  },
  {
    "studentName": "R Jainika",
    "studentId": "261P3329",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "B10-306, L and T southcity apartments, arekere mico layout, bangalore -560076",
    "dropStop": "B10-306, L and T southcity apartments, arekere mico layout, bangalore -560076",
    "parentContact": "9945401582",
    "parentEmail": "parent.261p3329@transcend.org",
  },
  {
    "studentName": "Siddharth Raghavendra Kamath",
    "studentId": "261P3383",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Between Ganesha Temple and Fullinfaws college",
    "dropStop": "Between Ganesha Temple and Fullinfaws college",
    "parentContact": "9886397071",
    "parentEmail": "parent.261p3383@transcend.org",
  },
  {
    "studentName": "Varnica Prasad",
    "studentId": "261P3290",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "BTM Meadows, Akshayanagar",
    "dropStop": "BTM Meadows, Akshayanagar",
    "parentContact": "9900174318",
    "parentEmail": "parent.261p3290@transcend.org",
  },
  {
    "studentName": "Annsh Patil",
    "studentId": "251P2148",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "C3-1008, SNN -Raj Serenity, Begur-koppa road, Yellenhalli",
    "dropStop": "C3-1008, SNN -Raj Serenity, Begur-koppa road, Yellenhalli",
    "parentContact": "8971933999/9972158775",
    "parentEmail": "parent.251p2148@transcend.org",
  },
  {
    "studentName": "Kaavyaa Sri Vt",
    "studentId": "261P3747",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Doddakammanahalli, near scout fitness, Bannerghatta road, TVS Showroom",
    "dropStop": "Doddakammanahalli, near scout fitness, Bannerghatta road, TVS Showroom",
    "parentContact": "9940081185",
    "parentEmail": "parent.261p3747@transcend.org",
  },
  {
    "studentName": "Mihir Hebbal Lohith",
    "studentId": "261P3403",
    "route": "Route 19",
    "bus": "KA-19-DF-0000",
    "pickupStop": "Dose Camp, Krishna Kutira",
    "dropStop": "Dose Camp, Krishna Kutira",
    "parentContact": "9964133735",
    "parentEmail": "parent.261p3403@transcend.org",
  },
  {
    "studentName": "Chivukula Apurva Tanmayee",
    "studentId": "251P1512",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "ICICI Bank Doddakammanahalli",
    "dropStop": "ICICI Bank Doddakammanahalli",
    "parentContact": "9886404989",
    "parentEmail": "parent.251p1512@transcend.org",
  },
  {
    "studentName": "Sneha Santhosh",
    "studentId": "251P1969",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Krishna Kutira hotel road , Hulimavu",
    "dropStop": "Krishna Kutira hotel road , Hulimavu",
    "parentContact": "9986026433/9611235273",
    "parentEmail": "parent.251p1969@transcend.org",
  },
  {
    "studentName": "Nibha Ravi",
    "studentId": "261P3570",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Kundapura coffee, yelenahalli main road",
    "dropStop": "Kundapura coffee, yelenahalli main road",
    "parentContact": "7760983985",
    "parentEmail": "parent.261p3570@transcend.org",
  },
  {
    "studentName": "Ganavi K Gowda",
    "studentId": "261P3669",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "L & T southcity apartments, Arekere",
    "dropStop": "L & T southcity apartments, Arekere",
    "parentContact": "9986161335",
    "parentEmail": "parent.261p3669@transcend.org",
  },
  {
    "studentName": "Ishaan Bhatwadekar",
    "studentId": "261P3291",
    "route": "Route 19",
    "bus": "KA-19-DF-0003",
    "pickupStop": "Lnt Southcity diagnally opp to Apollo pharmacy atekere",
    "dropStop": "Lnt Southcity diagnally opp to Apollo pharmacy atekere",
    "parentContact": "9819452542",
    "parentEmail": "parent.261p3291@transcend.org",
  },
  {
    "studentName": "Adhya Raj",
    "studentId": "261P3772",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Nandi Citadel Apartment, Nobel Residency Rd, Padma Clinic",
    "dropStop": "Nandi Citadel Apartment, Nobel Residency Rd, Padma Clinic",
    "parentContact": "9972920014",
    "parentEmail": "parent.261p3772@transcend.org",
  },
  {
    "studentName": "Narendra Jagdish Chou",
    "studentId": "261P4282",
    "route": "Route 19",
    "bus": "KA-19-DF-0000",
    "pickupStop": "Nandi Citadel,Nobel Residency Rd Padma Clinic",
    "dropStop": "Nandi Citadel,Nobel Residency Rd Padma Clinic",
    "parentContact": "9900921105",
    "parentEmail": "parent.261p4282@transcend.org",
  },
  {
    "studentName": "Rishika Rajesh",
    "studentId": "261P3332",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli",
    "dropStop": "Nandi Citadel,Nobel Residency Rd, Hulimavu, Doddakammanahalli",
    "parentContact": "8884201275",
    "parentEmail": "parent.261p3332@transcend.org",
  },
  {
    "studentName": "Abhineeth G U",
    "studentId": "251P1870",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Near D mart",
    "dropStop": "Near D mart",
    "parentContact": "9980122100",
    "parentEmail": "parent.251p1870@transcend.org",
  },
  {
    "studentName": "Mitha Bopanna N",
    "studentId": "261P3262",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Near Full in Faws College Akshayanagar, Davanagere Beene Dosa",
    "dropStop": "Near Full in Faws College Akshayanagar, Davanagere Beene Dosa",
    "parentContact": "9916978802",
    "parentEmail": "parent.261p3262@transcend.org",
  },
  {
    "studentName": "Aditi Doijode",
    "studentId": "261P3100",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Near Janvi Nivas Apts, Akshayanagar",
    "dropStop": "Near Janvi Nivas Apts, Akshayanagar",
    "parentContact": "9611244994",
    "parentEmail": "parent.261p3100@transcend.org",
  },
  {
    "studentName": "KAUSHIKI RAYCHAUDHURY",
    "studentId": "261P3896",
    "route": "Route 16",
    "bus": "KA-16-WX-0000",
    "pickupStop": "Near Nandi Deepa apartment, Doddakammanahalli Main Rd, Hulimavu",
    "dropStop": "Near Nandi Deepa apartment, Doddakammanahalli Main Rd, Hulimavu",
    "parentContact": "9742042392",
    "parentEmail": "parent.261p3896@transcend.org",
  },
  {
    "studentName": "AARTI PANDAY",
    "studentId": "261P3909",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Near Radiant Reshan, Yelenahalli, Akshayanagar, Prestige Sang Apartment",
    "dropStop": "Near Radiant Reshan, Yelenahalli, Akshayanagar, Prestige Sang Apartment",
    "parentContact": "9845982738",
    "parentEmail": "parent.261p3909@transcend.org",
  },
  {
    "studentName": "Anvitha Kethepalle",
    "studentId": "261P3592",
    "route": "Route 19",
    "bus": "KA-19-DF-0020",
    "pickupStop": "Near Suraksha Marvella Apartment, Hulimavu",
    "dropStop": "Near Suraksha Marvella Apartment, Hulimavu",
    "parentContact": "9886366775",
    "parentEmail": "parent.261p3592@transcend.org",
  },
  {
    "studentName": "Sumanth Sanganahal",
    "studentId": "251P1603",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "No 112, Sukruti , 2nd Main, 2nd Cr. Yelenahalli Post",
    "dropStop": "No 112, Sukruti , 2nd Main, 2nd Cr. Yelenahalli Post",
    "parentContact": "9945437237",
    "parentEmail": "parent.251p1603@transcend.org",
  },
  {
    "studentName": "Avni Meda",
    "studentId": "251P1058",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Nyanappanahalli Main BTM KRS Bakery",
    "dropStop": "Nyanappanahalli Main BTM KRS Bakery",
    "parentContact": "9945501437",
    "parentEmail": "parent.251p1058@transcend.org",
  },
  {
    "studentName": "Sai Kavin H",
    "studentId": "261P3006",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Opposite Nano Hospital, Arekere",
    "dropStop": "Opposite Nano Hospital, Arekere",
    "parentContact": "7338605577",
    "parentEmail": "parent.261p3006@transcend.org",
  },
  {
    "studentName": "Rohan N Kale",
    "studentId": "251P1891",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Prestige Song Of The South Yelenahalli Begur Koppa Road",
    "dropStop": "Prestige Song Of The South Yelenahalli Begur Koppa Road",
    "parentContact": "9980008827",
    "parentEmail": "parent.251p1891@transcend.org",
  },
  {
    "studentName": "Avantika Saneesh",
    "studentId": "261P3598",
    "route": "Route 19",
    "bus": "KA-19-DF-0019",
    "pickupStop": "Radiant redwood, Nobel Residency, Phase 2, Tejaswini Nagar",
    "dropStop": "Radiant redwood, Nobel Residency, Phase 2, Tejaswini Nagar",
    "parentContact": "7022653227",
    "parentEmail": "parent.261p3598@transcend.org",
  },
  {
    "studentName": "Shikha Pai",
    "studentId": "251P1024",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Samrat layout, Pick up Arekere Signal Drop BPL",
    "dropStop": "Samrat layout, Pick up Arekere Signal Drop BPL",
    "parentContact": "9945197775",
    "parentEmail": "parent.251p1024@transcend.org",
  },
  {
    "studentName": "Anushka R Bharadwaj",
    "studentId": "251P1330",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Samrat layout, Pick up Arekere Signal Drop BPL",
    "dropStop": "Samrat layout, Pick up Arekere Signal Drop BPL",
    "parentContact": "9901133553",
    "parentEmail": "parent.251p1330@transcend.org",
  },
  {
    "studentName": "Shreevardhini G",
    "studentId": "251P1016",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Tranquil Gardens Apt, SAI RAM HOSPITAL Hulimavu",
    "dropStop": "Tranquil Gardens Apt, SAI RAM HOSPITAL Hulimavu",
    "parentContact": "9742080954",
    "parentEmail": "parent.251p1016@transcend.org",
  },
  {
    "studentName": "B. Mithra Sri",
    "studentId": "251P1290",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Vijayashree Layout, Hulimavu, ICICI BANK Bannerghatta Road,",
    "dropStop": "Vijayashree Layout, Hulimavu, ICICI BANK Bannerghatta Road,",
    "parentContact": "9449238034",
    "parentEmail": "parent.251p1290@transcend.org",
  },
  {
    "studentName": "Harika N Reddy",
    "studentId": "251P1960",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "# 11A, Samruddhi, Hulimavu Gate, Bannerghatta road,",
    "dropStop": "# 11A, Samruddhi, Hulimavu Gate, Bannerghatta road,",
    "parentContact": "9341842929",
    "parentEmail": "parent.251p1960@transcend.org",
  },
  {
    "studentName": "Rachit Kakkar",
    "studentId": "261P3009",
    "route": "Route 20",
    "bus": "KA-20-FG-0024",
    "pickupStop": "arakere signal, BPL Bus Stop Esteem Park Apartment",
    "dropStop": "arakere signal, BPL Bus Stop Esteem Park Apartment",
    "parentContact": "7400000075",
    "parentEmail": "parent.261p3009@transcend.org",
  },
  {
    "studentName": "Shreeja K Bhat",
    "studentId": "261S1071",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Arekere shantiniketan layout, Kempamma temple road",
    "dropStop": "Arekere shantiniketan layout, Kempamma temple road",
    "parentContact": "9986503151",
    "parentEmail": "parent.261s1071@transcend.org",
  },
  {
    "studentName": "Aanyaa Naveen",
    "studentId": "251P1280",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "BASE Arekere Gate, Bannerghatta Road",
    "dropStop": "BASE Arekere Gate, Bannerghatta Road",
    "parentContact": "9845496924",
    "parentEmail": "parent.251p1280@transcend.org",
  },
  {
    "studentName": "Prahlad Ramakrishnan",
    "studentId": "261S1060",
    "route": "Route 20",
    "bus": "KA-20-FG-0000",
    "pickupStop": "Base pu college Arekere",
    "dropStop": "Base pu college Arekere",
    "parentContact": "9739291618",
    "parentEmail": "parent.261s1060@transcend.org",
  },
  {
    "studentName": "Pradyumn Ramakrishnan",
    "studentId": "261S1061",
    "route": "Route 20",
    "bus": "KA-20-FG-0000",
    "pickupStop": "Base pu college Arekere",
    "dropStop": "Base pu college Arekere",
    "parentContact": "9739291618",
    "parentEmail": "parent.261s1060@transcend.org",
  },
  {
    "studentName": "Sruthi Bandlamudi",
    "studentId": "261P3066",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Behind meenakshi temple or classic orchards arch , opp to loyala degree college",
    "dropStop": "Behind meenakshi temple or classic orchards arch , opp to loyala degree college",
    "parentContact": "9845950751",
    "parentEmail": "parent.261p3066@transcend.org",
  },
  {
    "studentName": "Naga Amrutha M",
    "studentId": "261P3133",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Behind Meenakshi temple, Bannerghatta Road.",
    "dropStop": "Behind Meenakshi temple, Bannerghatta Road.",
    "parentContact": "9916679799",
    "parentEmail": "parent.261p3133@transcend.org",
  },
  {
    "studentName": "Kaamna T R",
    "studentId": "251S1137",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "BPL B G Road",
    "dropStop": "BPL B G Road",
    "parentContact": "9448169390",
    "parentEmail": "parent.251s1137@transcend.org",
  },
  {
    "studentName": "Sai Praveen Kumar",
    "studentId": "251P1081",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Esteem Enclave Apt AREKERE BPL",
    "dropStop": "Esteem Enclave Apt AREKERE BPL",
    "parentContact": "9741598622",
    "parentEmail": "parent.251p1081@transcend.org",
  },
  {
    "studentName": "Poornachandra A",
    "studentId": "261P4280",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Hulimavu police station",
    "dropStop": "Hulimavu police station",
    "parentContact": "9844191319",
    "parentEmail": "parent.261p4280@transcend.org",
  },
  {
    "studentName": "Prithvi.s. Prakash",
    "studentId": "251P1171",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Kempamma temple hulimavu",
    "dropStop": "Kempamma temple hulimavu",
    "parentContact": "9845026052",
    "parentEmail": "parent.251p1171@transcend.org",
  },
  {
    "studentName": "G Prasanna",
    "studentId": "251P2417",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Kempamma temple hulimavu",
    "dropStop": "Kempamma temple hulimavu",
    "parentContact": "9740866933",
    "parentEmail": "parent.251p2417@transcend.org",
  },
  {
    "studentName": "Dhruvi Harapanahalli",
    "studentId": "261P3929",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Kempamma temple, Shantiniketan Layout, Hulimavu",
    "dropStop": "Kempamma temple, Shantiniketan Layout, Hulimavu",
    "parentContact": "9538782093",
    "parentEmail": "parent.261p3929@transcend.org",
  },
  {
    "studentName": "Siddharth Raju",
    "studentId": "251P1752",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Kotak Mahindra Bank, Arekere, BG Road",
    "dropStop": "Kotak Mahindra Bank, Arekere, BG Road",
    "parentContact": "9483503033",
    "parentEmail": "parent.251p1752@transcend.org",
  },
  {
    "studentName": "Aishwarya Balaji",
    "studentId": "251P1711",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Mantri Woodlands, Arakere, B P L Bannerghatta Road,",
    "dropStop": "Mantri Woodlands, Arakere, B P L Bannerghatta Road,",
    "parentContact": "9448542676",
    "parentEmail": "parent.251p1711@transcend.org",
  },
  {
    "studentName": "Chinmayee H R",
    "studentId": "251P1374",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Mithra siddi apartment, GF01, venugopal Reddy Arekere BPL",
    "dropStop": "Mithra siddi apartment, GF01, venugopal Reddy Arekere BPL",
    "parentContact": "8792135012",
    "parentEmail": "parent.251p1374@transcend.org",
  },
  {
    "studentName": "Sai Trinath Chakka",
    "studentId": "251P1706",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Opp. Hulimavu gate",
    "dropStop": "Opp. Hulimavu gate",
    "parentContact": "8884668447",
    "parentEmail": "parent.251p1706@transcend.org",
  },
  {
    "studentName": "Raksha Gopinathan",
    "studentId": "251P2530",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Opp. Hulimavu gate",
    "dropStop": "Opp. Hulimavu gate",
    "parentContact": "9845092647",
    "parentEmail": "parent.251p2530@transcend.org",
  },
  {
    "studentName": "Vishruth V",
    "studentId": "261P3035",
    "route": "Route 20",
    "bus": "KA-20-FG-0000",
    "pickupStop": "Opposite hulimavu police station",
    "dropStop": "Opposite hulimavu police station",
    "parentContact": "9845932623",
    "parentEmail": "parent.261p3035@transcend.org",
  },
  {
    "studentName": "Subhasri Lakshmi Narayanan",
    "studentId": "261P3221",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Opposite Hulimavu police station",
    "dropStop": "Opposite Hulimavu police station",
    "parentContact": "9900938938",
    "parentEmail": "parent.261p3221@transcend.org",
  },
  {
    "studentName": "Mayur Prasad",
    "studentId": "261P3878",
    "route": "Route 20",
    "bus": "KA-20-FG-0024",
    "pickupStop": "Opposite to AGN Kalyana mantapa, Arekere",
    "dropStop": "Opposite to AGN Kalyana mantapa, Arekere",
    "parentContact": "7349073436",
    "parentEmail": "parent.261p3878@transcend.org",
  },
  {
    "studentName": "Adya Bhalotia",
    "studentId": "261P3408",
    "route": "Route 20",
    "bus": "KA-20-FG-0024",
    "pickupStop": "Rose Garden Apartment, Arekere, BPL Bus Stop Madindar windchimes Apartment",
    "dropStop": "Rose Garden Apartment, Arekere, BPL Bus Stop Madindar windchimes Apartment",
    "parentContact": "9845451687",
    "parentEmail": "parent.261p3408@transcend.org",
  },
  {
    "studentName": "Hrishikesh Krishna H",
    "studentId": "261P3142",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "SBI Arekere Branch, Hulimavu Main Road",
    "dropStop": "SBI Arekere Branch, Hulimavu Main Road",
    "parentContact": "9886698802",
    "parentEmail": "parent.261p3142@transcend.org",
  },
  {
    "studentName": "Saanvi Uttangi",
    "studentId": "251P1289",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "The Marquise By Sparkle Realty, Beside Meenakshi Temple,",
    "dropStop": "The Marquise By Sparkle Realty, Beside Meenakshi Temple,",
    "parentContact": "8861519396",
    "parentEmail": "parent.251p1289@transcend.org",
  },
  {
    "studentName": "Raksha K Bhat",
    "studentId": "251P1119",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Vaibhav ApartmenShantiniketana,Hulimavu, KEMPAMMA TEMPLE",
    "dropStop": "Vaibhav ApartmenShantiniketana,Hulimavu, KEMPAMMA TEMPLE",
    "parentContact": "9663407457",
    "parentEmail": "parent.251p1119@transcend.org",
  },
  {
    "studentName": "Dontha Varshitha",
    "studentId": "251P2136",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Vedant Vihar Hulimavu Main Road",
    "dropStop": "Vedant Vihar Hulimavu Main Road",
    "parentContact": "9866461429",
    "parentEmail": "parent.251p2136@transcend.org",
  },
  {
    "studentName": "Avani N Bhushan",
    "studentId": "251P2354",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Vedant Vihar Hulimavu Main Road",
    "dropStop": "Vedant Vihar Hulimavu Main Road",
    "parentContact": "9620531990/99864478822",
    "parentEmail": "parent.251p2354@transcend.org",
  },
  {
    "studentName": "Avantika",
    "studentId": "251P1354",
    "route": "Route 20",
    "bus": "KA-20-FG-0020",
    "pickupStop": "Venugopal Reddy Layout, Opposite to BPL Softawares,",
    "dropStop": "Venugopal Reddy Layout, Opposite to BPL Softawares,",
    "parentContact": "9342167105/9496475722",
    "parentEmail": "parent.251p1354@transcend.org",
  },
  {
    "studentName": "Saanika V",
    "studentId": "251P1048",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "(Little Flower Public School Hoskerehalli,",
    "dropStop": "(Little Flower Public School Hoskerehalli,",
    "parentContact": "9740168239",
    "parentEmail": "parent.251p1048@transcend.org",
  },
  {
    "studentName": "Saanvi S A",
    "studentId": "251P1669",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "(Little Flower Public School Hoskerehalli,",
    "dropStop": "(Little Flower Public School Hoskerehalli,",
    "parentContact": "9886031344",
    "parentEmail": "parent.251p1669@transcend.org",
  },
  {
    "studentName": "Aradhya Kiran",
    "studentId": "261P3092",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "1) Nayandahalli Metro station. 2) Global Mall.",
    "dropStop": "1) Nayandahalli Metro station. 2) Global Mall.",
    "parentContact": "9482936898",
    "parentEmail": "parent.261p3092@transcend.org",
  },
  {
    "studentName": "Shriya Mahadev",
    "studentId": "261P3636",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Anand Diagnostics Centre near IndusInd Bank",
    "dropStop": "Anand Diagnostics Centre near IndusInd Bank",
    "parentContact": "9845240717",
    "parentEmail": "parent.261p3636@transcend.org",
  },
  {
    "studentName": "Vedika Ragini Parashar",
    "studentId": "261P3762",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Behind BDA Complex, Ramakrishna Hegde Park, Nagarabhavi",
    "dropStop": "Behind BDA Complex, Ramakrishna Hegde Park, Nagarabhavi",
    "parentContact": "9299155551",
    "parentEmail": "parent.261p3762@transcend.org",
  },
  {
    "studentName": "Sai Prathik",
    "studentId": "261P3225",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Brand factory, 100ft Ring Road",
    "dropStop": "Brand factory, 100ft Ring Road",
    "parentContact": "7019163799",
    "parentEmail": "parent.261p3225@transcend.org",
  },
  {
    "studentName": "Vinisha Mahesh",
    "studentId": "251P1579",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Brand Factory, taaza thindi, 100ft ringroad",
    "dropStop": "Brand Factory, taaza thindi, 100ft ringroad",
    "parentContact": "9845801362",
    "parentEmail": "parent.251p1579@transcend.org",
  },
  {
    "studentName": "Siddanth Santosh",
    "studentId": "261P3188",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Bus Stop under the Skywalk on Ring road near Nayandahalli; Opp. To Kailasheshwara Temple",
    "dropStop": "Bus Stop under the Skywalk on Ring road near Nayandahalli; Opp. To Kailasheshwara Temple",
    "parentContact": "9845746743",
    "parentEmail": "parent.261p3188@transcend.org",
  },
  {
    "studentName": "Vibha B Kumar",
    "studentId": "261P4208",
    "route": "Route 21",
    "bus": "KA-21-HJ-0000",
    "pickupStop": "Dr Ambedkar circle Nagarbhavi",
    "dropStop": "Dr Ambedkar circle Nagarbhavi",
    "parentContact": "8553030394",
    "parentEmail": "parent.261p4208@transcend.org",
  },
  {
    "studentName": "AASHRITHA MAKAM",
    "studentId": "221S1066",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "HDFC BANK",
    "dropStop": "HDFC BANK",
    "parentContact": "9886465200",
    "parentEmail": "parent.221s1066@transcend.org",
  },
  {
    "studentName": "Deeksha V",
    "studentId": "251P1272",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Hosakerehalli ( Near PESIT College)",
    "dropStop": "Hosakerehalli ( Near PESIT College)",
    "parentContact": "9739177342",
    "parentEmail": "parent.251p1272@transcend.org",
  },
  {
    "studentName": "Aarush Suraj",
    "studentId": "251S1661",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Ittamad Taaza Thindi",
    "dropStop": "Ittamad Taaza Thindi",
    "parentContact": "9611722778",
    "parentEmail": "parent.251s1661@transcend.org",
  },
  {
    "studentName": "Diganthnataraj",
    "studentId": "261P3664",
    "route": "Route 21",
    "bus": "KA-21-HJ-0000",
    "pickupStop": "Jantha bazar",
    "dropStop": "Jantha bazar",
    "parentContact": "9845141654",
    "parentEmail": "parent.261p3664@transcend.org",
  },
  {
    "studentName": "Vibha Teja Kumar",
    "studentId": "251P1032",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Janthabazzar",
    "dropStop": "Janthabazzar",
    "parentContact": "9986014547",
    "parentEmail": "parent.251p1032@transcend.org",
  },
  {
    "studentName": "Rishabh Rao",
    "studentId": "251P1078",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Janthabazzar",
    "dropStop": "Janthabazzar",
    "parentContact": "9986009718",
    "parentEmail": "parent.251p1078@transcend.org",
  },
  {
    "studentName": "Saanvi T",
    "studentId": "261P3164",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Jes public school, Naagarabhaavi",
    "dropStop": "Jes public school, Naagarabhaavi",
    "parentContact": "9945533633",
    "parentEmail": "parent.261p3164@transcend.org",
  },
  {
    "studentName": "Swathi Kallianpur",
    "studentId": "251P1033",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Kathriguppe Signal",
    "dropStop": "Kathriguppe Signal",
    "parentContact": "9483506912",
    "parentEmail": "parent.251p1033@transcend.org",
  },
  {
    "studentName": "Varsha R",
    "studentId": "251P2419",
    "route": "Route 21",
    "bus": "KA-21-HJ-0012",
    "pickupStop": "KATHRIGUPPE Water Tank Road",
    "dropStop": "KATHRIGUPPE Water Tank Road",
    "parentContact": "9448270858",
    "parentEmail": "parent.251p2419@transcend.org",
  },
  {
    "studentName": "Chirag Sai Ks",
    "studentId": "261P3519",
    "route": "Route 21",
    "bus": "KA-21-HJ-0000",
    "pickupStop": "KHB platinum apartments",
    "dropStop": "KHB platinum apartments",
    "parentContact": "7760876218",
    "parentEmail": "parent.261p3519@transcend.org",
  },
  {
    "studentName": "Vanshika V",
    "studentId": "251S1019",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Little Flower Public School Hoskerehalli",
    "dropStop": "Little Flower Public School Hoskerehalli",
    "parentContact": "9740168239/6360306586",
    "parentEmail": "parent.251s1019@transcend.org",
  },
  {
    "studentName": "Ummul Hasnat Kankudti",
    "studentId": "261P3566",
    "route": "Route 21",
    "bus": "KA-21-HJ-0015",
    "pickupStop": "Mahaveer Lakes, Dr.Vishnuvardhan Rd(shirke apartment)",
    "dropStop": "Mahaveer Lakes, Dr.Vishnuvardhan Rd(shirke apartment)",
    "parentContact": "9663378674",
    "parentEmail": "parent.261p3566@transcend.org",
  },
  {
    "studentName": "Jityaa Mohan",
    "studentId": "261P3775",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Malathalli lake road, parvigolden nest apartment",
    "dropStop": "Malathalli lake road, parvigolden nest apartment",
    "parentContact": "9886626405",
    "parentEmail": "parent.261p3775@transcend.org",
  },
  {
    "studentName": "Viha B Kumar",
    "studentId": "261P4217",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Mallathalli lake Road",
    "dropStop": "Mallathalli lake Road",
    "parentContact": "8553030394",
    "parentEmail": "parent.261p4208@transcend.org",
  },
  {
    "studentName": "Tasya Shetty",
    "studentId": "251S1627",
    "route": "Route 21",
    "bus": "KA-21-HJ-0012",
    "pickupStop": "Meghana shalini apartment, kadirenahallinpark",
    "dropStop": "Meghana shalini apartment, kadirenahallinpark",
    "parentContact": "8861302234",
    "parentEmail": "parent.251s1627@transcend.org",
  },
  {
    "studentName": "Siri Chandan",
    "studentId": "261P3907",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Muscle Factory gym - Doddabsdti msin road",
    "dropStop": "Muscle Factory gym - Doddabsdti msin road",
    "parentContact": "9986071029",
    "parentEmail": "parent.261p3907@transcend.org",
  },
  {
    "studentName": "Sharwari Ashwin",
    "studentId": "251P1434",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Nagarabhavi Circle",
    "dropStop": "Nagarabhavi Circle",
    "parentContact": "9845062089",
    "parentEmail": "parent.251p1434@transcend.org",
  },
  {
    "studentName": "Samarth prasad C N",
    "studentId": "251P1918",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Nagarbhavi",
    "dropStop": "Nagarbhavi",
    "parentContact": "9900199655",
    "parentEmail": "parent.251p1918@transcend.org",
  },
  {
    "studentName": "Nischal Mukund G",
    "studentId": "251P2272",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Nagarbhavi",
    "dropStop": "Nagarbhavi",
    "parentContact": "9980068448",
    "parentEmail": "parent.251p2272@transcend.org",
  },
  {
    "studentName": "Surabhi S",
    "studentId": "261P3159",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Nammoora Thindi, Nagarabhavi",
    "dropStop": "Nammoora Thindi, Nagarabhavi",
    "parentContact": "9845258156",
    "parentEmail": "parent.261p3159@transcend.org",
  },
  {
    "studentName": "Deepshikha Das",
    "studentId": "251P1792",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Brand Factory",
    "dropStop": "Near Brand Factory",
    "parentContact": "9886777023",
    "parentEmail": "parent.251p1792@transcend.org",
  },
  {
    "studentName": "Jiva S",
    "studentId": "261P3027",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Cycle world, Kathriguppe Circle, Thaja tindi",
    "dropStop": "Near Cycle world, Kathriguppe Circle, Thaja tindi",
    "parentContact": "9845118552",
    "parentEmail": "parent.261p3027@transcend.org",
  },
  {
    "studentName": "Purvika Satyajit",
    "studentId": "261P3911",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Ganesha temple, Bhuvaneshwara nagar(Kathigupe Circle)",
    "dropStop": "Near Ganesha temple, Bhuvaneshwara nagar(Kathigupe Circle)",
    "parentContact": "9945082493",
    "parentEmail": "parent.261p3911@transcend.org",
  },
  {
    "studentName": "Rohan M",
    "studentId": "261P3948",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Hotel Udupi Khaadya, Kamayaka Main road",
    "dropStop": "Near Hotel Udupi Khaadya, Kamayaka Main road",
    "parentContact": "9611812120",
    "parentEmail": "parent.261p3948@transcend.org",
  },
  {
    "studentName": "Pranita Bijalwan",
    "studentId": "261P3140",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Kamakhya theatre(Brand Factory)",
    "dropStop": "Near Kamakhya theatre(Brand Factory)",
    "parentContact": "9920764688",
    "parentEmail": "parent.261p3140@transcend.org",
  },
  {
    "studentName": "Dhrithi G Athreya",
    "studentId": "261P3439",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "Near Mallathahalli RTO",
    "dropStop": "Near Mallathahalli RTO",
    "parentContact": "9880305506",
    "parentEmail": "parent.261p3439@transcend.org",
  },
  {
    "studentName": "L Chinmay Chandrachooda",
    "studentId": "261P3787",
    "route": "Route 21",
    "bus": "KA-21-HJ-0000",
    "pickupStop": "Near NNSS Pickleball courts, Nagarbhavi",
    "dropStop": "Near NNSS Pickleball courts, Nagarbhavi",
    "parentContact": "9482430441",
    "parentEmail": "parent.261p3787@transcend.org",
  },
  {
    "studentName": "Anaisha Gautham Tumkur",
    "studentId": "251S1488",
    "route": "Route 21",
    "bus": "KA-21-HJ-0021",
    "pickupStop": "No 5073 prestige south ridge a Hoskeahalli",
    "dropStop": "No 5073 prestige south ridge a Hoskeahalli",
    "parentContact": "9739044066",
    "parentEmail": "parent.251s1488@transcend.org",
  },
  {
    "studentName": "Eemaan Ali",
    "studentId": "261P3811",
    "route": "Route 21",
    "bus": "KA-21-HJ-0001",
    "pickupStop": "Shopper's Choice, Shirke Apartment",
    "dropStop": "Shopper's Choice, Shirke Apartment",
    "parentContact": "9535722551",
    "parentEmail": "parent.261p3811@transcend.org",
  },
  {
    "studentName": "Preksha Anil N",
    "studentId": "251P1678",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Mantri Alpyne",
    "dropStop": "Mantri Alpyne",
    "parentContact": "9019668587",
    "parentEmail": "parent.251p1678@transcend.org",
  },
  {
    "studentName": "Lochan.s",
    "studentId": "251P1628",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "#877,34th cross poorna pragna layout",
    "dropStop": "#877,34th cross poorna pragna layout",
    "parentContact": "9448077334",
    "parentEmail": "parent.251p1628@transcend.org",
  },
  {
    "studentName": "Chetan S",
    "studentId": "251P1364",
    "route": "Route 22",
    "bus": "KA-22-JK-0000",
    "pickupStop": "Amma's Pastrie's, Guballala",
    "dropStop": "Amma's Pastrie's, Guballala",
    "parentContact": "9845666339",
    "parentEmail": "parent.251p1364@transcend.org",
  },
  {
    "studentName": "B Ananya Bhat",
    "studentId": "261P4266",
    "route": "Route 22",
    "bus": "KA-22-JK-0000",
    "pickupStop": "Amma's Pastrie's, Guballala",
    "dropStop": "Amma's Pastrie's, Guballala",
    "parentContact": "9986032023",
    "parentEmail": "parent.261p4266@transcend.org",
  },
  {
    "studentName": "MONISHA C",
    "studentId": "261P3997",
    "route": "Route 22",
    "bus": "KA-22-JK-0000",
    "pickupStop": "Back side brigade apartment ,Jayanagar housing socity",
    "dropStop": "Back side brigade apartment ,Jayanagar housing socity",
    "parentContact": "9353445163",
    "parentEmail": "parent.261p3997@transcend.org",
  },
  {
    "studentName": "Yashica V",
    "studentId": "251P1349",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Behind mantri alpyne , banashankari 5th stage",
    "dropStop": "Behind mantri alpyne , banashankari 5th stage",
    "parentContact": "9845922323",
    "parentEmail": "parent.251p1349@transcend.org",
  },
  {
    "studentName": "Amruta Chandrashekhar",
    "studentId": "261P3900",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Behind NPS school, near Brigade 7 Gardens",
    "dropStop": "Behind NPS school, near Brigade 7 Gardens",
    "parentContact": "9900016932",
    "parentEmail": "parent.261p3900@transcend.org",
  },
  {
    "studentName": "Adisha Pokale",
    "studentId": "261P3183",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Behind Santrupti Apartment, PP Layout",
    "dropStop": "Behind Santrupti Apartment, PP Layout",
    "parentContact": "9886425255",
    "parentEmail": "parent.261p3183@transcend.org",
  },
  {
    "studentName": "Bhoomika Naik",
    "studentId": "261P3180",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Brigade 7 garden apartment",
    "dropStop": "Brigade 7 garden apartment",
    "parentContact": "9483666244",
    "parentEmail": "parent.261p3180@transcend.org",
  },
  {
    "studentName": "Manasvi Kamath",
    "studentId": "261P3047",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Brigade 7 Gardens",
    "dropStop": "Brigade 7 Gardens",
    "parentContact": "9741490905",
    "parentEmail": "parent.261p3047@transcend.org",
  },
  {
    "studentName": "A Akshay Krishna",
    "studentId": "261P3618",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Brigade 7 Gardens",
    "dropStop": "Brigade 7 Gardens",
    "parentContact": "9986656756",
    "parentEmail": "parent.231s1083@transcend.org",
  },
  {
    "studentName": "Abhyuday Girish Managoli",
    "studentId": "261P3553",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Brigade 7 Gardens,Paduka Mandira Rd, Uttarahalli",
    "dropStop": "Brigade 7 Gardens,Paduka Mandira Rd, Uttarahalli",
    "parentContact": "9886558214",
    "parentEmail": "parent.261p3553@transcend.org",
  },
  {
    "studentName": "Lakshana Udhyakumar",
    "studentId": "231S1028",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Dhanlakshmi Store Brigade 7 Gardens roads(Only Drop)",
    "dropStop": "Dhanlakshmi Store Brigade 7 Gardens roads(Only Drop)",
    "parentContact": "9686201132",
    "parentEmail": "parent.231s1028@transcend.org",
  },
  {
    "studentName": "Manaswi Patre",
    "studentId": "261P3055",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Happy Valley Pearl Apartment, near brigade 7 Gardens",
    "dropStop": "Happy Valley Pearl Apartment, near brigade 7 Gardens",
    "parentContact": "9591425425",
    "parentEmail": "parent.261p3055@transcend.org",
  },
  {
    "studentName": "Vihaan Kamal Kalkunte",
    "studentId": "261P3322",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Karunadu Dum House, Brigade Omega",
    "dropStop": "Karunadu Dum House, Brigade Omega",
    "parentContact": "9916585291",
    "parentEmail": "parent.261p3322@transcend.org",
  },
  {
    "studentName": "Avni Gururaj Sorab",
    "studentId": "251P1781",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Lifecare Medicals, Near NPS Banashankari 6th stage",
    "dropStop": "Lifecare Medicals, Near NPS Banashankari 6th stage",
    "parentContact": "9886640044",
    "parentEmail": "parent.251p1781@transcend.org",
  },
  {
    "studentName": "Shriya Sudhanshu Karmarkar",
    "studentId": "251P1287",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Mantri Alpyne",
    "dropStop": "Mantri Alpyne",
    "parentContact": "9886650965",
    "parentEmail": "parent.251p1287@transcend.org",
  },
  {
    "studentName": "Bhoomika P Aathreas",
    "studentId": "261P3469",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Mantri Alpyne Apartment near Patalamma temple",
    "dropStop": "Mantri Alpyne Apartment near Patalamma temple",
    "parentContact": "9845499944",
    "parentEmail": "parent.261p3469@transcend.org",
  },
  {
    "studentName": "Manasi H",
    "studentId": "261P3379",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Mantri Alpyne Apartment, Near Patalamma temple",
    "dropStop": "Mantri Alpyne Apartment, Near Patalamma temple",
    "parentContact": "9880141861",
    "parentEmail": "parent.261p3379@transcend.org",
  },
  {
    "studentName": "Tanvi Amit Purna",
    "studentId": "251P1041",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Mantri Alypne",
    "dropStop": "Mantri Alypne",
    "parentContact": "9611800317/9945152968",
    "parentEmail": "parent.251p1041@transcend.org",
  },
  {
    "studentName": "UTKARSH PRATINIDHI",
    "studentId": "241S1850",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Nandini Milk Parlour, Poorna Pragna Layout",
    "dropStop": "Nandini Milk Parlour, Poorna Pragna Layout",
    "parentContact": "9972921611",
    "parentEmail": "parent.241s1850@transcend.org",
  },
  {
    "studentName": "Sanchita Nagesh",
    "studentId": "261P4076",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Near Paakashaala Heritage, Uttarahalli",
    "dropStop": "Near Paakashaala Heritage, Uttarahalli",
    "parentContact": "9845244443",
    "parentEmail": "parent.261p4076@transcend.org",
  },
  {
    "studentName": "Aditya Raghuram",
    "studentId": "261P3889",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Near Raghavendra Swamy Mutt, Poornapragna layout",
    "dropStop": "Near Raghavendra Swamy Mutt, Poornapragna layout",
    "parentContact": "9611832152",
    "parentEmail": "parent.261p3889@transcend.org",
  },
  {
    "studentName": "Shreeya Anoop",
    "studentId": "261P3085",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Near Venkateshwara water supply, near brigade 7 garden",
    "dropStop": "Near Venkateshwara water supply, near brigade 7 garden",
    "parentContact": "9900357111",
    "parentEmail": "parent.261p3085@transcend.org",
  },
  {
    "studentName": "Dhatri D Bharadwaj",
    "studentId": "251P1457",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "NPS School",
    "dropStop": "NPS School",
    "parentContact": "9886706350",
    "parentEmail": "parent.251p1457@transcend.org",
  },
  {
    "studentName": "Samprathi",
    "studentId": "261P3212",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Opposite of Happy valley school Happy valley layout",
    "dropStop": "Opposite of Happy valley school Happy valley layout",
    "parentContact": "9972597021",
    "parentEmail": "parent.261p3212@transcend.org",
  },
  {
    "studentName": "Bhashini Aradhya",
    "studentId": "261P3609",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Opposite to patallama temple",
    "dropStop": "Opposite to patallama temple",
    "parentContact": "9972315456",
    "parentEmail": "parent.261p3609@transcend.org",
  },
  {
    "studentName": "Drithi N",
    "studentId": "261P3715",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Paakashala Heritage Uttarahalli, Happy Valley Layout",
    "dropStop": "Paakashala Heritage Uttarahalli, Happy Valley Layout",
    "parentContact": "9535511951",
    "parentEmail": "parent.261p3715@transcend.org",
  },
  {
    "studentName": "Smaran Ramanujam",
    "studentId": "261P3288",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Paduka Mandir Main road, near brigade 7 garden",
    "dropStop": "Paduka Mandir Main road, near brigade 7 garden",
    "parentContact": "9686663202",
    "parentEmail": "parent.261p3288@transcend.org",
  },
  {
    "studentName": "Kruthi M",
    "studentId": "261P3082",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Pakashala Uttarahalli patalamma temple,Happy Valley Layout",
    "dropStop": "Pakashala Uttarahalli patalamma temple,Happy Valley Layout",
    "parentContact": "9980169494",
    "parentEmail": "parent.261p3082@transcend.org",
  },
  {
    "studentName": "ARNAV JENA",
    "studentId": "241S1652",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Pride Spring Field",
    "dropStop": "Pride Spring Field",
    "parentContact": "9742782408",
    "parentEmail": "parent.241s1652@transcend.org",
  },
  {
    "studentName": "K Aashna Pai",
    "studentId": "251S1127",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Pride Springfield Apartment",
    "dropStop": "Pride Springfield Apartment",
    "parentContact": "9538830222",
    "parentEmail": "parent.251s1127@transcend.org",
  },
  {
    "studentName": "Deshna C",
    "studentId": "261P3943",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "pride springfield apartment",
    "dropStop": "pride springfield apartment",
    "parentContact": "9945322800",
    "parentEmail": "parent.261p3943@transcend.org",
  },
  {
    "studentName": "Harini P Burly",
    "studentId": "261P3803",
    "route": "Route 6",
    "bus": "KA-06-CD-0002",
    "pickupStop": "Raja Gardenia Arch, Turahalli, Subramanyapura.",
    "dropStop": "Raja Gardenia Arch, Turahalli, Subramanyapura.",
    "parentContact": "9980526179",
    "parentEmail": "parent.261p3803@transcend.org",
  },
  {
    "studentName": "Maanvi R Vaasishta",
    "studentId": "261P3013",
    "route": "Route 6",
    "bus": "KA-06-CD-0022",
    "pickupStop": "Raja Gardenia opp Thurahalli Govt. School,goulk milk parlour",
    "dropStop": "Raja Gardenia opp Thurahalli Govt. School,goulk milk parlour",
    "parentContact": "9535833776",
    "parentEmail": "parent.261p3013@transcend.org",
  },
  {
    "studentName": "Anagha B V",
    "studentId": "261P3704",
    "route": "Route 22",
    "bus": "KA-22-JK-0012",
    "pickupStop": "Sri Raghavendra Swamy Mutt Thurahalli, Brigade 7 gardena",
    "dropStop": "Sri Raghavendra Swamy Mutt Thurahalli, Brigade 7 gardena",
    "parentContact": "9008568776",
    "parentEmail": "parent.261p3704@transcend.org",
  },
  {
    "studentName": "Sinchana S Jois",
    "studentId": "251P1134",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Srivara Vistara Apartment, Poornapragna Layout",
    "dropStop": "Srivara Vistara Apartment, Poornapragna Layout",
    "parentContact": "9945252400",
    "parentEmail": "parent.251p1134@transcend.org",
  },
  {
    "studentName": "Sanchith K",
    "studentId": "261P3268",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Srivari forest breeze, National Public School, Banashankari",
    "dropStop": "Srivari forest breeze, National Public School, Banashankari",
    "parentContact": "9008115115",
    "parentEmail": "parent.261p3268@transcend.org",
  },
  {
    "studentName": "Prathyush S Kashyap",
    "studentId": "261P3307",
    "route": "Route 22",
    "bus": "KA-22-JK-0000",
    "pickupStop": "V2 men’s salon Poornapragna Housing Society Layout",
    "dropStop": "V2 men’s salon Poornapragna Housing Society Layout",
    "parentContact": "9845123011",
    "parentEmail": "parent.261p3307@transcend.org",
  },
  {
    "studentName": "Jaanvi Nallode",
    "studentId": "261P4084",
    "route": "Route 23",
    "bus": "KA-23-LM-0000",
    "pickupStop": "Attiguppe metrostation",
    "dropStop": "Attiguppe metrostation",
    "parentContact": "9845621583",
    "parentEmail": "parent.261p4084@transcend.org",
  },
  {
    "studentName": "Mansi R Manavalli",
    "studentId": "261P3128",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Attiguppe, Chord Road",
    "dropStop": "Attiguppe, Chord Road",
    "parentContact": "9845888330",
    "parentEmail": "parent.261p3128@transcend.org",
  },
  {
    "studentName": "Yukthi S Shivani",
    "studentId": "261P4013",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Attiguppe, Hampi Nagar, RPC Layout, Vijayanagar, Bengaluru, Karnataka 560040",
    "dropStop": "Attiguppe, Hampi Nagar, RPC Layout, Vijayanagar, Bengaluru, Karnataka 560040",
    "parentContact": "8618007937",
    "parentEmail": "parent.261p4013@transcend.org",
  },
  {
    "studentName": "Goutham P",
    "studentId": "251P1727",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Avalahalli BDA Bangalore one Girinagar",
    "dropStop": "Avalahalli BDA Bangalore one Girinagar",
    "parentContact": "9343151212",
    "parentEmail": "parent.251p1727@transcend.org",
  },
  {
    "studentName": "M P Srinithi",
    "studentId": "251P1383",
    "route": "Route 23",
    "bus": "KA-23-LM-0012",
    "pickupStop": "Big Bazaar Road Kathirgupee",
    "dropStop": "Big Bazaar Road Kathirgupee",
    "parentContact": "9886462406",
    "parentEmail": "parent.251p1383@transcend.org",
  },
  {
    "studentName": "L Chinmay Krishna",
    "studentId": "251P1510",
    "route": "Route 23",
    "bus": "KA-23-LM-0012",
    "pickupStop": "Big Bazaar Road Kathirgupee",
    "dropStop": "Big Bazaar Road Kathirgupee",
    "parentContact": "9845902683",
    "parentEmail": "parent.251p1510@transcend.org",
  },
  {
    "studentName": "Saindhavi Mithun",
    "studentId": "251S1350",
    "route": "Route 23",
    "bus": "KA-23-LM-0012",
    "pickupStop": "Big Bazar",
    "dropStop": "Big Bazar",
    "parentContact": "9886150092",
    "parentEmail": "parent.251s1350@transcend.org",
  },
  {
    "studentName": "TAPASYA KARUPAKULA",
    "studentId": "201S1041",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Cake of the day bakery,",
    "dropStop": "Cake of the day bakery,",
    "parentContact": "9844487373",
    "parentEmail": "parent.201s1041@transcend.org",
  },
  {
    "studentName": "Varshini S N",
    "studentId": "261P4181",
    "route": "Route 23",
    "bus": "KA-23-LM-0000",
    "pickupStop": "fashion factory, near kamakya theatre",
    "dropStop": "fashion factory, near kamakya theatre",
    "parentContact": "9845072551",
    "parentEmail": "parent.261p4181@transcend.org",
  },
  {
    "studentName": "KRIYANSH JAIN",
    "studentId": "241S1482",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Girinagar Circle, Narayan School",
    "dropStop": "Girinagar Circle, Narayan School",
    "parentContact": "8095780335",
    "parentEmail": "parent.241s1482@transcend.org",
  },
  {
    "studentName": "DEVANSH JAIN",
    "studentId": "241S1483",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Girinagar Circle, Narayan School",
    "dropStop": "Girinagar Circle, Narayan School",
    "parentContact": "8095780335",
    "parentEmail": "parent.241s1482@transcend.org",
  },
  {
    "studentName": "Kalpitha R",
    "studentId": "261P3249",
    "route": "Route 23",
    "bus": "KA-23-LM-0021",
    "pickupStop": "Kamakaya Theater",
    "dropStop": "Kamakaya Theater",
    "parentContact": "9845746290",
    "parentEmail": "parent.261p3249@transcend.org",
  },
  {
    "studentName": "Laksha D",
    "studentId": "261P3131",
    "route": "Route 23",
    "bus": "KA-23-LM-0021",
    "pickupStop": "Kamakhya Theater",
    "dropStop": "Kamakhya Theater",
    "parentContact": "9448516693",
    "parentEmail": "parent.261p3131@transcend.org",
  },
  {
    "studentName": "Vaishnavi Sk",
    "studentId": "261P3433",
    "route": "Route 23",
    "bus": "KA-23-LM-0021",
    "pickupStop": "kamakya brand factory",
    "dropStop": "kamakya brand factory",
    "parentContact": "9845110307",
    "parentEmail": "parent.261p3433@transcend.org",
  },
  {
    "studentName": "Snigdha Shree L",
    "studentId": "251S1761",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Karur Vysya bank kathirguppe",
    "dropStop": "Karur Vysya bank kathirguppe",
    "parentContact": "9845902683",
    "parentEmail": "parent.251p1510@transcend.org",
  },
  {
    "studentName": "Lakshya S",
    "studentId": "261P3237",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Marriyaama Park Near Nilakhanteshwar Temple, Banashankari 3rd Stage, Kathriguppe Main Rd",
    "dropStop": "Marriyaama Park Near Nilakhanteshwar Temple, Banashankari 3rd Stage, Kathriguppe Main Rd",
    "parentContact": "9880166544",
    "parentEmail": "parent.261p3237@transcend.org",
  },
  {
    "studentName": "Saanvi Nagaragadde Srinidhi",
    "studentId": "251P1398",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Nayara's petrol Pump, Avalahalli",
    "dropStop": "Nayara's petrol Pump, Avalahalli",
    "parentContact": "7620984876",
    "parentEmail": "parent.251p1398@transcend.org",
  },
  {
    "studentName": "Nihal P Jain",
    "studentId": "251P1804",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Nayara's petrol Pump, Avalahalli",
    "dropStop": "Nayara's petrol Pump, Avalahalli",
    "parentContact": "9880758818",
    "parentEmail": "parent.251p1804@transcend.org",
  },
  {
    "studentName": "Dharshith L",
    "studentId": "261P3349",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Aithalmitrakoota hotel Girinagar",
    "dropStop": "Near Aithalmitrakoota hotel Girinagar",
    "parentContact": "9535247388",
    "parentEmail": "parent.261p3349@transcend.org",
  },
  {
    "studentName": "Ishita A",
    "studentId": "261P3097",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near bangalore one center, Avalahalli park",
    "dropStop": "Near bangalore one center, Avalahalli park",
    "parentContact": "9980146693",
    "parentEmail": "parent.261p3097@transcend.org",
  },
  {
    "studentName": "Vishnu V",
    "studentId": "251P2579",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Bangalore one or Nayara petrol bunk girinagar",
    "dropStop": "Near Bangalore one or Nayara petrol bunk girinagar",
    "parentContact": "9980775247",
    "parentEmail": "parent.251p2579@transcend.org",
  },
  {
    "studentName": "Sthuthi S Kasaravalli",
    "studentId": "261P3244",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Girinagar last Busstop",
    "dropStop": "Near Girinagar last Busstop",
    "parentContact": "9845649698",
    "parentEmail": "parent.261p3244@transcend.org",
  },
  {
    "studentName": "S V Pooja",
    "studentId": "261P4133",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Kamakaya theater",
    "dropStop": "Near Kamakaya theater",
    "parentContact": "9036092760",
    "parentEmail": "parent.261p4133@transcend.org",
  },
  {
    "studentName": "Pranavi R Thanki",
    "studentId": "261P3025",
    "route": "Route 23",
    "bus": "KA-23-LM-0021",
    "pickupStop": "Near Kamakhya bus depot",
    "dropStop": "Near Kamakhya bus depot",
    "parentContact": "9845824951",
    "parentEmail": "parent.261p3025@transcend.org",
  },
  {
    "studentName": "Arya Veer",
    "studentId": "261S1019",
    "route": "Route 23",
    "bus": "KA-23-LM-0021",
    "pickupStop": "near kamyaka theather",
    "dropStop": "near kamyaka theather",
    "parentContact": "9964473024",
    "parentEmail": "parent.261s1019@transcend.org",
  },
  {
    "studentName": "Rivan Hari",
    "studentId": "261P3334",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Mitra koota hotel, BDA Layout, Avalahalli",
    "dropStop": "Near Mitra koota hotel, BDA Layout, Avalahalli",
    "parentContact": "9972001300",
    "parentEmail": "parent.261p3334@transcend.org",
  },
  {
    "studentName": "Dattaprasad S",
    "studentId": "261S1010",
    "route": "Route 23",
    "bus": "KA-23-LM-0012",
    "pickupStop": "Near Padmanabha ayurvedic clinic, Kathriguppe water tank down",
    "dropStop": "Near Padmanabha ayurvedic clinic, Kathriguppe water tank down",
    "parentContact": "9886393039",
    "parentEmail": "parent.261s1010@transcend.org",
  },
  {
    "studentName": "Neel Datta R",
    "studentId": "261P3304",
    "route": "Route 12",
    "bus": "KA-12-OP-0012",
    "pickupStop": "Near Pai International BSK 3rd Stage",
    "dropStop": "Near Pai International BSK 3rd Stage",
    "parentContact": "9845431227",
    "parentEmail": "parent.261p3304@transcend.org",
  },
  {
    "studentName": "Likhith Hegde",
    "studentId": "261P3263",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Near Radhakrishna Hospital, Girinagar",
    "dropStop": "Near Radhakrishna Hospital, Girinagar",
    "parentContact": "9845659430",
    "parentEmail": "parent.261p3263@transcend.org",
  },
  {
    "studentName": "Sanvi D",
    "studentId": "261P3863",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Pai International, Kathriguppe Main Rd",
    "dropStop": "Pai International, Kathriguppe Main Rd",
    "parentContact": "9738538852",
    "parentEmail": "parent.261p3863@transcend.org",
  },
  {
    "studentName": "Bhoopati Sujana",
    "studentId": "251P1499",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Raghavendra Mutta Girinagar Circle,",
    "dropStop": "Raghavendra Mutta Girinagar Circle,",
    "parentContact": "9886844479",
    "parentEmail": "parent.251p1499@transcend.org",
  },
  {
    "studentName": "Jayani P Chowdary",
    "studentId": "251P1092",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Saligrama Party hall, Near Sita Circle",
    "dropStop": "Saligrama Party hall, Near Sita Circle",
    "parentContact": "9916696305",
    "parentEmail": "parent.251p1092@transcend.org",
  },
  {
    "studentName": "Saanvi Shivashankar",
    "studentId": "261P3947",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Seetha Circle Srinivasnagar",
    "dropStop": "Seetha Circle Srinivasnagar",
    "parentContact": "9901945182",
    "parentEmail": "parent.261p3947@transcend.org",
  },
  {
    "studentName": "Aayush Bhargav",
    "studentId": "251P1164",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Sita Circle Vinayaka hospital Girinagar",
    "dropStop": "Sita Circle Vinayaka hospital Girinagar",
    "parentContact": "9845029728",
    "parentEmail": "parent.251p1164@transcend.org",
  },
  {
    "studentName": "Anvitha R Bhat",
    "studentId": "251P2089",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Sita Circle Vinayaka hospital Girinagar",
    "dropStop": "Sita Circle Vinayaka hospital Girinagar",
    "parentContact": "9880064543",
    "parentEmail": "parent.251p2089@transcend.org",
  },
  {
    "studentName": "Hitha M",
    "studentId": "251P2109",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Sita Circle Vinayaka hospital Girinagar",
    "dropStop": "Sita Circle Vinayaka hospital Girinagar",
    "parentContact": "9845092662",
    "parentEmail": "parent.251p2109@transcend.org",
  },
  {
    "studentName": "Dhanush Santosh Vemala",
    "studentId": "261P4043",
    "route": "Route 23",
    "bus": "KA-23-LM-0023",
    "pickupStop": "Sri Sundar Mahal, girinagar, Raghavendra matt",
    "dropStop": "Sri Sundar Mahal, girinagar, Raghavendra matt",
    "parentContact": "9341214493",
    "parentEmail": "parent.261p4043@transcend.org",
  },
  {
    "studentName": "Snigdha Rajith",
    "studentId": "251P1494",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "AARAMA SUITES, Sarvabowmanagar, Bhnd HSBC,",
    "dropStop": "AARAMA SUITES, Sarvabowmanagar, Bhnd HSBC,",
    "parentContact": "9886633619",
    "parentEmail": "parent.251p1494@transcend.org",
  },
  {
    "studentName": "Anagha A Suvarna",
    "studentId": "261P3158",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Aditi Nursing Home, Omkar Nagar, Arekere",
    "dropStop": "Aditi Nursing Home, Omkar Nagar, Arekere",
    "parentContact": "9972311119",
    "parentEmail": "parent.261p3158@transcend.org",
  },
  {
    "studentName": "Rakshitha S",
    "studentId": "261P3783",
    "route": "Route 24",
    "bus": "KA-24-NP-0000",
    "pickupStop": "Arekere micolayout near forest gate",
    "dropStop": "Arekere micolayout near forest gate",
    "parentContact": "9845467633",
    "parentEmail": "parent.261p3783@transcend.org",
  },
  {
    "studentName": "Satvik Alevooraya",
    "studentId": "251P2438",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Ayyaapa swamy Temple, Namana Hotel Road",
    "dropStop": "Ayyaapa swamy Temple, Namana Hotel Road",
    "parentContact": "7411529065",
    "parentEmail": "parent.251p2438@transcend.org",
  },
  {
    "studentName": "Thushar Shetty",
    "studentId": "261P3313",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Behind IIMB, Vijaya enclave , vijaya bank layout",
    "dropStop": "Behind IIMB, Vijaya enclave , vijaya bank layout",
    "parentContact": "9900212212",
    "parentEmail": "parent.261p3313@transcend.org",
  },
  {
    "studentName": "Prisha Banerjee",
    "studentId": "251P1093",
    "route": "Route 24",
    "bus": "KA-24-NP-0020",
    "pickupStop": "Brigade Millennium,",
    "dropStop": "Brigade Millennium,",
    "parentContact": "9448040099",
    "parentEmail": "parent.251p1093@transcend.org",
  },
  {
    "studentName": "Vaibhav Alur",
    "studentId": "251P1833",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Ganesha Temple",
    "dropStop": "Ganesha Temple",
    "parentContact": "9945547351",
    "parentEmail": "parent.251p1833@transcend.org",
  },
  {
    "studentName": "Samsrita Badri",
    "studentId": "261P3804",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "HDFC Bank Arakere HSBC Road",
    "dropStop": "HDFC Bank Arakere HSBC Road",
    "parentContact": "9886272931",
    "parentEmail": "parent.261p3804@transcend.org",
  },
  {
    "studentName": "Lakshana Gokulakrishnan",
    "studentId": "261P3480",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "HDFC Bank, HSBC Road Arekere",
    "dropStop": "HDFC Bank, HSBC Road Arekere",
    "parentContact": "9886088892",
    "parentEmail": "parent.261p3480@transcend.org",
  },
  {
    "studentName": "Laasya Priya M",
    "studentId": "261P3057",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Hellokids Bright, Nayara petrol bunk Puttanahalli lake",
    "dropStop": "Hellokids Bright, Nayara petrol bunk Puttanahalli lake",
    "parentContact": "9880047827",
    "parentEmail": "parent.261p3057@transcend.org",
  },
  {
    "studentName": "Yashritha J K",
    "studentId": "251P2460",
    "route": "Route 24",
    "bus": "KA-24-NP-0006",
    "pickupStop": "Kodichikkanahalli Main Rd, Someswar Layout, Ramanashree Enclave",
    "dropStop": "Kodichikkanahalli Main Rd, Someswar Layout, Ramanashree Enclave",
    "parentContact": "9945640444",
    "parentEmail": "parent.251p2460@transcend.org",
  },
  {
    "studentName": "Advaith Vudhya",
    "studentId": "261P3275",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Lane Next to Kabab Zone, 9th Main, Vijayabank Layout, Bangalore - 560076",
    "dropStop": "Lane Next to Kabab Zone, 9th Main, Vijayabank Layout, Bangalore - 560076",
    "parentContact": "9632225985",
    "parentEmail": "parent.261p3275@transcend.org",
  },
  {
    "studentName": "Ruha Vadakattu",
    "studentId": "261P4243",
    "route": "Route 24",
    "bus": "KA-24-NP-0000",
    "pickupStop": "Mahaveer Glacier Apartments, HDFC Bank Arekere",
    "dropStop": "Mahaveer Glacier Apartments, HDFC Bank Arekere",
    "parentContact": "9980134352",
    "parentEmail": "parent.261p4243@transcend.org",
  },
  {
    "studentName": "Divya Hegdekatte",
    "studentId": "261P3220",
    "route": "Route 24",
    "bus": "KA-24-NP-0003",
    "pickupStop": "Near ayyappa swamy temple",
    "dropStop": "Near ayyappa swamy temple",
    "parentContact": "9945293410",
    "parentEmail": "parent.261p3220@transcend.org",
  },
  {
    "studentName": "Subhasrivarshan",
    "studentId": "261P3877",
    "route": "Route 24",
    "bus": "KA-24-NP-0020",
    "pickupStop": "Near brigade millenium",
    "dropStop": "Near brigade millenium",
    "parentContact": "9886381677",
    "parentEmail": "parent.261p3877@transcend.org",
  },
  {
    "studentName": "Jahnavi H Venkataraman",
    "studentId": "251P1858",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Near Presidency School, Anugraha layout, Bilekahalli",
    "dropStop": "Near Presidency School, Anugraha layout, Bilekahalli",
    "parentContact": "8147078076",
    "parentEmail": "parent.251p1858@transcend.org",
  },
  {
    "studentName": "Nidhi Koppad",
    "studentId": "261P4260",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Ranka colony",
    "dropStop": "Ranka colony",
    "parentContact": "9845563283",
    "parentEmail": "parent.261p4260@transcend.org",
  },
  {
    "studentName": "Lakshya",
    "studentId": "261P3779",
    "route": "Route 24",
    "bus": "KA-24-NP-0000",
    "pickupStop": "Sarvabhouma Nagar, Arekere, HSBC Road.",
    "dropStop": "Sarvabhouma Nagar, Arekere, HSBC Road.",
    "parentContact": "9899624304",
    "parentEmail": "parent.261p3779@transcend.org",
  },
  {
    "studentName": "Prasad R K",
    "studentId": "261P3683",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Shree homes elegance",
    "dropStop": "Shree homes elegance",
    "parentContact": "9448712904",
    "parentEmail": "parent.261p3683@transcend.org",
  },
  {
    "studentName": "Lakshmi S L",
    "studentId": "261P3752",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Shri Siddhi Vinayaka Temple Arakere Mico Layout",
    "dropStop": "Shri Siddhi Vinayaka Temple Arakere Mico Layout",
    "parentContact": "9972288268",
    "parentEmail": "parent.261p3752@transcend.org",
  },
  {
    "studentName": "Dhruva Kanchi",
    "studentId": "261P4258",
    "route": "Route 24",
    "bus": "KA-24-NP-0000",
    "pickupStop": "SNN Raj Lake View Phase 2, Ranka Colony",
    "dropStop": "SNN Raj Lake View Phase 2, Ranka Colony",
    "parentContact": "9845894303",
    "parentEmail": "parent.261p4258@transcend.org",
  },
  {
    "studentName": "Haripriya S",
    "studentId": "251P2355",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Srinivas Marriage Hall",
    "dropStop": "Srinivas Marriage Hall",
    "parentContact": "9845508723",
    "parentEmail": "parent.251p2355@transcend.org",
  },
  {
    "studentName": "Jayani R",
    "studentId": "261P3423",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Surabhi Apartment, Ranka colony",
    "dropStop": "Surabhi Apartment, Ranka colony",
    "parentContact": "9663099005",
    "parentEmail": "parent.261p3423@transcend.org",
  },
  {
    "studentName": "Tanvi Deepak Alur",
    "studentId": "251P1604",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Surabhi apartments, Ranka Colony",
    "dropStop": "Surabhi apartments, Ranka Colony",
    "parentContact": "9980921451",
    "parentEmail": "parent.251p1604@transcend.org",
  },
  {
    "studentName": "Pradhnya Kg",
    "studentId": "251P1648",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Surabhi apartments, Ranka Colony",
    "dropStop": "Surabhi apartments, Ranka Colony",
    "parentContact": "9731111882",
    "parentEmail": "parent.251p1648@transcend.org",
  },
  {
    "studentName": "Srishti Nadagouda",
    "studentId": "251P1655",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Surabhi apartments, Ranka Colony",
    "dropStop": "Surabhi apartments, Ranka Colony",
    "parentContact": "9449897662",
    "parentEmail": "parent.251p1655@transcend.org",
  },
  {
    "studentName": "Chinmay Anand",
    "studentId": "261P3245",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Surabhi Apartments, Ranka Colony, Bilekahalli",
    "dropStop": "Surabhi Apartments, Ranka Colony, Bilekahalli",
    "parentContact": "9986218513",
    "parentEmail": "parent.261p3245@transcend.org",
  },
  {
    "studentName": "Tanya",
    "studentId": "261P3315",
    "route": "Route 24",
    "bus": "KA-24-NP-0003",
    "pickupStop": "vijaya bank layout ayyappa temple(Pickup)",
    "dropStop": "vijaya bank layout ayyappa temple(Pickup)",
    "parentContact": "9845269691",
    "parentEmail": "parent.261p3315@transcend.org",
  },
  {
    "studentName": "Sharanya Sundaram",
    "studentId": "251P1110",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Vijaya Bank Layout signal",
    "dropStop": "Vijaya Bank Layout signal",
    "parentContact": "9686699221",
    "parentEmail": "parent.251p1110@transcend.org",
  },
  {
    "studentName": "Bikram Maity",
    "studentId": "251P2373",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Vijaya Bank Layout signal",
    "dropStop": "Vijaya Bank Layout signal",
    "parentContact": "9836195558",
    "parentEmail": "parent.251p2373@transcend.org",
  },
  {
    "studentName": "Aarav Khandelwal",
    "studentId": "261P3325",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Vijaya Bank Layout, Bilekahalli",
    "dropStop": "Vijaya Bank Layout, Bilekahalli",
    "parentContact": "9717000902",
    "parentEmail": "parent.261p3325@transcend.org",
  },
  {
    "studentName": "Hemanti Bhatt",
    "studentId": "261P4053",
    "route": "Route 24",
    "bus": "KA-24-NP-0003",
    "pickupStop": "Vijaya Bank Signal",
    "dropStop": "Vijaya Bank Signal",
    "parentContact": "9945878781",
    "parentEmail": "parent.261p4053@transcend.org",
  },
  {
    "studentName": "Saanvi V Shetty",
    "studentId": "261P3095",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Vijaya Enclave Kumaradhara Block",
    "dropStop": "Vijaya Enclave Kumaradhara Block",
    "parentContact": "8197373155",
    "parentEmail": "parent.261p3095@transcend.org",
  },
  {
    "studentName": "Rohit Kulkarni",
    "studentId": "261P3112",
    "route": "Route 24",
    "bus": "KA-24-NP-0024",
    "pickupStop": "Vijaya Enclave,vijayabank layout, banneraghatta roa",
    "dropStop": "Vijaya Enclave,vijayabank layout, banneraghatta roa",
    "parentContact": "8105379226",
    "parentEmail": "parent.261p3112@transcend.org",
  },
  {
    "studentName": "Adruth Vijay M A",
    "studentId": "251P2281",
    "route": "Route 24",
    "bus": "KA-24-NP-0003",
    "pickupStop": "Vijaya Vittala Praseeda , Arekere Main Road",
    "dropStop": "Vijaya Vittala Praseeda , Arekere Main Road",
    "parentContact": "9845090042",
    "parentEmail": "parent.251p2281@transcend.org",
  },
  {
    "studentName": "Dhanush H",
    "studentId": "251P2120",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "deverachikknahalli pariwar Place Apartment Gangama Temple",
    "dropStop": "deverachikknahalli pariwar Place Apartment Gangama Temple",
    "parentContact": "9845065285",
    "parentEmail": "parent.251p2120@transcend.org",
  },
  {
    "studentName": "Advaith Pisharody",
    "studentId": "251P1172",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "439 B BLOCKkodichikanahalli",
    "dropStop": "439 B BLOCKkodichikanahalli",
    "parentContact": "9880091931",
    "parentEmail": "parent.251p1172@transcend.org",
  },
  {
    "studentName": "Sarvesh S",
    "studentId": "261P4171",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "Ayyapa bakery kodichiknahalli",
    "dropStop": "Ayyapa bakery kodichiknahalli",
    "parentContact": "9886951668",
    "parentEmail": "parent.261p4171@transcend.org",
  },
  {
    "studentName": "Unmayi Jayaraj",
    "studentId": "261P3637",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Ayyappa bakery, Kodichikkanahalli",
    "dropStop": "Ayyappa bakery, Kodichikkanahalli",
    "parentContact": "9449836789",
    "parentEmail": "parent.261p3637@transcend.org",
  },
  {
    "studentName": "Mayuka",
    "studentId": "261P4007",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "chowdeshwari temple, Ayyappa bakery, Kodichikkanahalli",
    "dropStop": "chowdeshwari temple, Ayyappa bakery, Kodichikkanahalli",
    "parentContact": "9591491115",
    "parentEmail": "parent.261p4007@transcend.org",
  },
  {
    "studentName": "Aryan Harikrishnan",
    "studentId": "261P3497",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "Devarachikanahalli Bus stop, Arali mara",
    "dropStop": "Devarachikanahalli Bus stop, Arali mara",
    "parentContact": "8861267692",
    "parentEmail": "parent.261p3497@transcend.org",
  },
  {
    "studentName": "Jaivant A D",
    "studentId": "251P1882",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Devarachikkana halli bus stop",
    "dropStop": "Devarachikkana halli bus stop",
    "parentContact": "9790004090",
    "parentEmail": "parent.251p1882@transcend.org",
  },
  {
    "studentName": "Harisrushti Kolluri",
    "studentId": "261P3588",
    "route": "Route 25",
    "bus": "KA-25-PR-0020",
    "pickupStop": "Elita Promenade Apartments",
    "dropStop": "Elita Promenade Apartments",
    "parentContact": "9945695215",
    "parentEmail": "parent.261p3588@transcend.org",
  },
  {
    "studentName": "Aarav A Kulkarni",
    "studentId": "251P1021",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Elita Promenade, Brigade Millenium",
    "dropStop": "Elita Promenade, Brigade Millenium",
    "parentContact": "9845902599",
    "parentEmail": "parent.251p1021@transcend.org",
  },
  {
    "studentName": "Vyomini Ramesha",
    "studentId": "251P1257",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Elita Promenade, Brigade Millenium",
    "dropStop": "Elita Promenade, Brigade Millenium",
    "parentContact": "9845640464",
    "parentEmail": "parent.251p1257@transcend.org",
  },
  {
    "studentName": "Sanjeevini Shetty",
    "studentId": "251P1599",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Elita Promenade, Brigade Millenium",
    "dropStop": "Elita Promenade, Brigade Millenium",
    "parentContact": "9742270036",
    "parentEmail": "parent.251p1599@transcend.org",
  },
  {
    "studentName": "Bhanvi R",
    "studentId": "231S1054",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Elita Promenade, Brigade Millenium Road",
    "dropStop": "Elita Promenade, Brigade Millenium Road",
    "parentContact": "9731547795",
    "parentEmail": "parent.231s1054@transcend.org",
  },
  {
    "studentName": "LIARA KAVERAMMA K B",
    "studentId": "241S1128",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Elita Promenade, Brigade Millenium Road",
    "dropStop": "Elita Promenade, Brigade Millenium Road",
    "parentContact": "9900085373",
    "parentEmail": "parent.241s1128@transcend.org",
  },
  {
    "studentName": "Yuvaan K B",
    "studentId": "251S1211",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "Elita Promenade, Brigade Millenium Road",
    "dropStop": "Elita Promenade, Brigade Millenium Road",
    "parentContact": "9986039490",
    "parentEmail": "parent.251s1211@transcend.org",
  },
  {
    "studentName": "Praneel Karthik Vuyyuru",
    "studentId": "261P3301",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Elita prominade Apartment",
    "dropStop": "Elita prominade Apartment",
    "parentContact": "9008490485",
    "parentEmail": "parent.261p3301@transcend.org",
  },
  {
    "studentName": "Joanna Manoj Thomas",
    "studentId": "251P2066",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "FLAT A-302, ROYAL LEGEND APARTMENT, BOMMANAHALLI,",
    "dropStop": "FLAT A-302, ROYAL LEGEND APARTMENT, BOMMANAHALLI,",
    "parentContact": "9606015884",
    "parentEmail": "parent.251p2066@transcend.org",
  },
  {
    "studentName": "Sanika Bangera",
    "studentId": "251P1149",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Janapriya Lake view apartment Kodichikkanahalli",
    "dropStop": "Janapriya Lake view apartment Kodichikkanahalli",
    "parentContact": "9886291691",
    "parentEmail": "parent.251p1149@transcend.org",
  },
  {
    "studentName": "Poorvichandra B",
    "studentId": "241S1231",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Janhavi Enclave, Next RMR Park",
    "dropStop": "Janhavi Enclave, Next RMR Park",
    "parentContact": "9591199522",
    "parentEmail": "parent.241s1231@transcend.org",
  },
  {
    "studentName": "Akul P",
    "studentId": "261P3732",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "Kodichickanalli Main Road, KFC",
    "dropStop": "Kodichickanalli Main Road, KFC",
    "parentContact": "7760123101",
    "parentEmail": "parent.261p3732@transcend.org",
  },
  {
    "studentName": "Hashica Yalla",
    "studentId": "251P1822",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Kodichiknahalli, Sri Abhaya Anjaneya Temple",
    "dropStop": "Kodichiknahalli, Sri Abhaya Anjaneya Temple",
    "parentContact": "9900833990",
    "parentEmail": "parent.251p1822@transcend.org",
  },
  {
    "studentName": "Sai Priya S V",
    "studentId": "251P1509",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Nadamma Layout, Virat Nagar Kodichikkanahalli",
    "dropStop": "Nadamma Layout, Virat Nagar Kodichikkanahalli",
    "parentContact": "9845503709",
    "parentEmail": "parent.251p1509@transcend.org",
  },
  {
    "studentName": "Avyay Murali",
    "studentId": "261P3191",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Near Ayyappa Bakery, Jahnvi apartments",
    "dropStop": "Near Ayyappa Bakery, Jahnvi apartments",
    "parentContact": "9886086560",
    "parentEmail": "parent.261p3191@transcend.org",
  },
  {
    "studentName": "Abhay Srivatsa K",
    "studentId": "261P4185",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Near vaikunta narayana swamy temple",
    "dropStop": "Near vaikunta narayana swamy temple",
    "parentContact": "9900164205",
    "parentEmail": "parent.261p4185@transcend.org",
  },
  {
    "studentName": "Rishita Addanki",
    "studentId": "261P3135",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Near Vaikunta Narayana Swamy Temple, Vijaya Bank Layout",
    "dropStop": "Near Vaikunta Narayana Swamy Temple, Vijaya Bank Layout",
    "parentContact": "9036029215",
    "parentEmail": "parent.261p3135@transcend.org",
  },
  {
    "studentName": "Advaith A Nair",
    "studentId": "251P1107",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Opposite to kodichikkanahalli HP petrol pump",
    "dropStop": "Opposite to kodichikkanahalli HP petrol pump",
    "parentContact": "9743776622",
    "parentEmail": "parent.251p1107@transcend.org",
  },
  {
    "studentName": "Darshini Ranganathan",
    "studentId": "261P3048",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Pariwar Prince apartment Kodichikanahalli Main Road, Anugraha Layout",
    "dropStop": "Pariwar Prince apartment Kodichikanahalli Main Road, Anugraha Layout",
    "parentContact": "9686322766",
    "parentEmail": "parent.261p3048@transcend.org",
  },
  {
    "studentName": "Godavarthi Sai Harini",
    "studentId": "251P1118",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Rajram Prak Kodichikkanahalli",
    "dropStop": "Rajram Prak Kodichikkanahalli",
    "parentContact": "8179968644",
    "parentEmail": "parent.251p1118@transcend.org",
  },
  {
    "studentName": "SARANYA PERUMALLA",
    "studentId": "261P3935",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "RMR Park",
    "dropStop": "RMR Park",
    "parentContact": "9360398992",
    "parentEmail": "parent.261p3935@transcend.org",
  },
  {
    "studentName": "Nirvan Kumar",
    "studentId": "261P3599",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Royal Legend ApartmentsDevarachikkanahalli Main Rd",
    "dropStop": "Royal Legend ApartmentsDevarachikkanahalli Main Rd",
    "parentContact": "9886163435",
    "parentEmail": "parent.261p3599@transcend.org",
  },
  {
    "studentName": "Nishitaa Krishna Kumar",
    "studentId": "251P1591",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Royal Legend Apt, 60 Kodichikanahalli Main Road, Bommanahalli,",
    "dropStop": "Royal Legend Apt, 60 Kodichikanahalli Main Road, Bommanahalli,",
    "parentContact": "8792232677",
    "parentEmail": "parent.251p1591@transcend.org",
  },
  {
    "studentName": "Arshia Vijaykumar",
    "studentId": "251P1112",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "S5 Vintage Elite Visweswarayya marg Indian Petol Bank Kodichikkanahalli,",
    "dropStop": "S5 Vintage Elite Visweswarayya marg Indian Petol Bank Kodichikkanahalli,",
    "parentContact": "9019353174",
    "parentEmail": "parent.251p1112@transcend.org",
  },
  {
    "studentName": "Disha Jain",
    "studentId": "261P4200",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "Sana super market, vijaya bank layout",
    "dropStop": "Sana super market, vijaya bank layout",
    "parentContact": "9845574748",
    "parentEmail": "parent.261p4200@transcend.org",
  },
  {
    "studentName": "Sonith C",
    "studentId": "251P2345",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Shanimahatma temple, Kodichikkanahalli",
    "dropStop": "Shanimahatma temple, Kodichikkanahalli",
    "parentContact": "8971965825",
    "parentEmail": "parent.251p2345@transcend.org",
  },
  {
    "studentName": "Rahul Nayak",
    "studentId": "251P1325",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Shiva Shakit Temple, Chunchaghatta Road",
    "dropStop": "Shiva Shakit Temple, Chunchaghatta Road",
    "parentContact": "9986018397",
    "parentEmail": "parent.251p1325@transcend.org",
  },
  {
    "studentName": "Shivya Patial",
    "studentId": "251S1236",
    "route": "Route 25",
    "bus": "KA-25-PR-0006",
    "pickupStop": "Sreenidhi Lak SHIVA SHAKTHI TEMPLE Eswara Layout",
    "dropStop": "Sreenidhi Lak SHIVA SHAKTHI TEMPLE Eswara Layout",
    "parentContact": "7259254000",
    "parentEmail": "parent.251s1236@transcend.org",
  },
  {
    "studentName": "Deepta Reji",
    "studentId": "251P1406",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Vijaya Bank Layout signal",
    "dropStop": "Vijaya Bank Layout signal",
    "parentContact": "9845224701",
    "parentEmail": "parent.251p1406@transcend.org",
  },
  {
    "studentName": "Deetya Reji",
    "studentId": "251P1407",
    "route": "Route 25",
    "bus": "KA-25-PR-0024",
    "pickupStop": "Vijaya Bank Layout signal",
    "dropStop": "Vijaya Bank Layout signal",
    "parentContact": "9845224701",
    "parentEmail": "parent.251p1406@transcend.org",
  },
  {
    "studentName": "Gutti Sai Shresta Reddy",
    "studentId": "251P2307",
    "route": "Route 25",
    "bus": "KA-25-PR-0008",
    "pickupStop": "Vijaya Bank Layout, Indian oil Petrol Bunk",
    "dropStop": "Vijaya Bank Layout, Indian oil Petrol Bunk",
    "parentContact": "9886398146",
    "parentEmail": "parent.251p2307@transcend.org",
  },
  {
    "studentName": "Pavani A",
    "studentId": "261P3187",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Bharath housing society, Opp Turahalli forest, Brigade Omega",
    "dropStop": "Bharath housing society, Opp Turahalli forest, Brigade Omega",
    "parentContact": "9108006731",
    "parentEmail": "parent.261p3187@transcend.org",
  },
  {
    "studentName": "Nishka Girish",
    "studentId": "251P1015",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Chartered Beverly Hills Apartment Gubbalala",
    "dropStop": "Chartered Beverly Hills Apartment Gubbalala",
    "parentContact": "9972328328",
    "parentEmail": "parent.251p1015@transcend.org",
  },
  {
    "studentName": "Sumadhva G P",
    "studentId": "251P1741",
    "route": "Route 26",
    "bus": "KA-26-RS-0009",
    "pickupStop": "Chikkegowdanpalya shri krishna dwarak hotel",
    "dropStop": "Chikkegowdanpalya shri krishna dwarak hotel",
    "parentContact": "9865416108",
    "parentEmail": "parent.251p1741@transcend.org",
  },
  {
    "studentName": "Samaira Arun",
    "studentId": "221S1039",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Golden panorama apartments, Golden Panorama Road, 80 Feet Rd, Gubbalala",
    "dropStop": "Golden panorama apartments, Golden Panorama Road, 80 Feet Rd, Gubbalala",
    "parentContact": "9986187002",
    "parentEmail": "parent.221s1039@transcend.org",
  },
  {
    "studentName": "Agastya Murti",
    "studentId": "241S1389",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Jain Swadesh Apartment, Gubalala",
    "dropStop": "Jain Swadesh Apartment, Gubalala",
    "parentContact": "9599794002",
    "parentEmail": "parent.241s1389@transcend.org",
  },
  {
    "studentName": "Dhruti S Murti",
    "studentId": "241S1390",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Jain Swadesh Apartment, Gubalala",
    "dropStop": "Jain Swadesh Apartment, Gubalala",
    "parentContact": "9599794002",
    "parentEmail": "parent.241s1389@transcend.org",
  },
  {
    "studentName": "R Hemant Kumar",
    "studentId": "251P1441",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Jain Swadesh apartment, Gubbalala",
    "dropStop": "Jain Swadesh apartment, Gubbalala",
    "parentContact": "9620890278",
    "parentEmail": "parent.251p1441@transcend.org",
  },
  {
    "studentName": "Shiven Lohith",
    "studentId": "261P3235",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Karishma Hills, near to Vidhyashilp School, Gubbalala",
    "dropStop": "Karishma Hills, near to Vidhyashilp School, Gubbalala",
    "parentContact": "9900049795",
    "parentEmail": "parent.261p3235@transcend.org",
  },
  {
    "studentName": "Mahati Mahesha Inamdar",
    "studentId": "251P2396",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil",
    "dropStop": "Mantri Tranquil",
    "parentContact": "9900199596",
    "parentEmail": "parent.251p2396@transcend.org",
  },
  {
    "studentName": "Anay Nayak",
    "studentId": "261P3533",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri tranquil apartment",
    "dropStop": "Mantri tranquil apartment",
    "parentContact": "9880712076",
    "parentEmail": "parent.261p3533@transcend.org",
  },
  {
    "studentName": "Maitreyo Bandyopadhyay",
    "studentId": "261P4231",
    "route": "Route 26",
    "bus": "KA-26-RS-0000",
    "pickupStop": "Mantri tranquil gubbalala",
    "dropStop": "Mantri tranquil gubbalala",
    "parentContact": "6360699450",
    "parentEmail": "parent.261p4231@transcend.org",
  },
  {
    "studentName": "Daniya Shaikh",
    "studentId": "251P2521",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil Rd, Gubbalala",
    "dropStop": "Mantri Tranquil Rd, Gubbalala",
    "parentContact": "9886785813",
    "parentEmail": "parent.251p2521@transcend.org",
  },
  {
    "studentName": "Ansh Darshan Thambi",
    "studentId": "261P3089",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil, Gubbalal",
    "dropStop": "Mantri Tranquil, Gubbalal",
    "parentContact": "9902070770",
    "parentEmail": "parent.261p3089@transcend.org",
  },
  {
    "studentName": "NISHVIKA NAYANA GOWDA",
    "studentId": "221S1023",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil, Gubbalala",
    "dropStop": "Mantri Tranquil, Gubbalala",
    "parentContact": "9845072798",
    "parentEmail": "parent.221s1023@transcend.org",
  },
  {
    "studentName": "Vihaan Rao",
    "studentId": "251P1128",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil, Gubbalala",
    "dropStop": "Mantri Tranquil, Gubbalala",
    "parentContact": "9886599246",
    "parentEmail": "parent.251p1128@transcend.org",
  },
  {
    "studentName": "Aakash Jeethendra Rao",
    "studentId": "251S1018",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Mantri Tranquil, Gubbalala",
    "dropStop": "Mantri Tranquil, Gubbalala",
    "parentContact": "7338600231",
    "parentEmail": "parent.251s1018@transcend.org",
  },
  {
    "studentName": "Chandana S",
    "studentId": "261P3648",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Near anjenya temple, Gubbalala Main Rd",
    "dropStop": "Near anjenya temple, Gubbalala Main Rd",
    "parentContact": "9845783724",
    "parentEmail": "parent.261p3648@transcend.org",
  },
  {
    "studentName": "Mukul Srivatsa P",
    "studentId": "261P3721",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Near Bosch service centre gubbalala",
    "dropStop": "Near Bosch service centre gubbalala",
    "parentContact": "9483503230",
    "parentEmail": "parent.261p3721@transcend.org",
  },
  {
    "studentName": "Laasya Mallick",
    "studentId": "251P1067",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Near Thurahalli forest",
    "dropStop": "Near Thurahalli forest",
    "parentContact": "8792782232",
    "parentEmail": "parent.251p1067@transcend.org",
  },
  {
    "studentName": "Pritish Sabari",
    "studentId": "241S1626",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Near to Jain Swadeshi Apartment",
    "dropStop": "Near to Jain Swadeshi Apartment",
    "parentContact": "9980626995",
    "parentEmail": "parent.241s1626@transcend.org",
  },
  {
    "studentName": "K Veda",
    "studentId": "261P3306",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Near V6 enclaves apartment",
    "dropStop": "Near V6 enclaves apartment",
    "parentContact": "9972398275",
    "parentEmail": "parent.261p3306@transcend.org",
  },
  {
    "studentName": "Srujana V Mahesh",
    "studentId": "251P1274",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Next to Pratyangiri temple",
    "dropStop": "Next to Pratyangiri temple",
    "parentContact": "9731927771",
    "parentEmail": "parent.251p1274@transcend.org",
  },
  {
    "studentName": "Nandna Kumar",
    "studentId": "261P3028",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Next to Singapore Gardens, Gubbalala",
    "dropStop": "Next to Singapore Gardens, Gubbalala",
    "parentContact": "9880524373",
    "parentEmail": "parent.261p3028@transcend.org",
  },
  {
    "studentName": "Richa Vadapalli",
    "studentId": "261P3070",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Next to srichaitanya techno school, Mantri Tranquil Rd, Gubbalala",
    "dropStop": "Next to srichaitanya techno school, Mantri Tranquil Rd, Gubbalala",
    "parentContact": "9611665544",
    "parentEmail": "parent.261p3070@transcend.org",
  },
  {
    "studentName": "Pragna Karanam",
    "studentId": "261P3375",
    "route": "Route 7",
    "bus": "KA-07-EF-0007",
    "pickupStop": "Nitesh Ceaser palace, Opp KSIT",
    "dropStop": "Nitesh Ceaser palace, Opp KSIT",
    "parentContact": "9980144866",
    "parentEmail": "parent.261p3375@transcend.org",
  },
  {
    "studentName": "Surabhi Raghava",
    "studentId": "261S1008",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Opposite Rohan Akriti Apartment, Charterd Bevarya",
    "dropStop": "Opposite Rohan Akriti Apartment, Charterd Bevarya",
    "parentContact": "7259766899",
    "parentEmail": "parent.261s1008@transcend.org",
  },
  {
    "studentName": "Suchit K Iyer",
    "studentId": "261S1103",
    "route": "Route 26",
    "bus": "KA-26-RS-0000",
    "pickupStop": "Pick up: V6 Enclave apartment Drop: Shivaganga Bliss, 1st crs, 1st mn, Harsha Layout, Yelchenahall",
    "dropStop": "Pick up: V6 Enclave apartment Drop: Shivaganga Bliss, 1st crs, 1st mn, Harsha Layout, Yelchenahall",
    "parentContact": "8147993088",
    "parentEmail": "parent.261s1103@transcend.org",
  },
  {
    "studentName": "Shraddha S Dhanvantri",
    "studentId": "261P3318",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Rajathadri Royal Inn, near Brigade Omega",
    "dropStop": "Rajathadri Royal Inn, near Brigade Omega",
    "parentContact": "9886740217",
    "parentEmail": "parent.261p3318@transcend.org",
  },
  {
    "studentName": "Vihana",
    "studentId": "241S1002",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Rohan Akriti",
    "dropStop": "Rohan Akriti",
    "parentContact": "7987468650",
    "parentEmail": "parent.241s1002@transcend.org",
  },
  {
    "studentName": "Preksha Bharadwaj",
    "studentId": "251P1382",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Rohan Akriti apartments",
    "dropStop": "Rohan Akriti apartments",
    "parentContact": "9886656041",
    "parentEmail": "parent.251p2427@transcend.org",
  },
  {
    "studentName": "Nayan Sai S G",
    "studentId": "241S1514",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Rohan Akriti Gubbalala",
    "dropStop": "Rohan Akriti Gubbalala",
    "parentContact": "9880038145",
    "parentEmail": "parent.241s1514@transcend.org",
  },
  {
    "studentName": "ISHAAN SUDHEENDRA MOUDGAL",
    "studentId": "221S1054",
    "route": "Route 26",
    "bus": "KA-26-RS-0000",
    "pickupStop": "Rohan Akriti, Gubblala",
    "dropStop": "Rohan Akriti, Gubblala",
    "parentContact": "9538963706",
    "parentEmail": "parent.221s1054@transcend.org",
  },
  {
    "studentName": "Saanvi Prasannakumar",
    "studentId": "261P3264",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "The Valley by Essem18 back gate(Mantri Tranquil)",
    "dropStop": "The Valley by Essem18 back gate(Mantri Tranquil)",
    "parentContact": "9980524604",
    "parentEmail": "parent.261p3264@transcend.org",
  },
  {
    "studentName": "DS BHARGAV",
    "studentId": "231S1009",
    "route": "Route 26",
    "bus": "KA-26-RS-0012",
    "pickupStop": "Trinco Shanthivana Layout",
    "dropStop": "Trinco Shanthivana Layout",
    "parentContact": "9900280500",
    "parentEmail": "parent.231s1009@transcend.org",
  },
  {
    "studentName": "Sreemantha K M",
    "studentId": "261P3042",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Agastya Vana, Royal Park Residency Layout",
    "dropStop": "Agastya Vana, Royal Park Residency Layout",
    "parentContact": "9945054739",
    "parentEmail": "parent.261p3042@transcend.org",
  },
  {
    "studentName": "Akarsh Sanjay Vajru",
    "studentId": "261P3276",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Anjanapura 80 Feet Rd, Vajarmuni Home",
    "dropStop": "Anjanapura 80 Feet Rd, Vajarmuni Home",
    "parentContact": "9945545444",
    "parentEmail": "parent.261p3276@transcend.org",
  },
  {
    "studentName": "Vrishank S G",
    "studentId": "261S1018",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "anjanapura post office",
    "dropStop": "anjanapura post office",
    "parentContact": "9036825322",
    "parentEmail": "parent.261s1018@transcend.org",
  },
  {
    "studentName": "Devaprasath A",
    "studentId": "261P3866",
    "route": "Route 27",
    "bus": "KA-27-TV-0016",
    "pickupStop": "Arka hardware near bbmp tank, RV College Road",
    "dropStop": "Arka hardware near bbmp tank, RV College Road",
    "parentContact": "9611103092",
    "parentEmail": "parent.261p3866@transcend.org",
  },
  {
    "studentName": "Samanvita Madhusudhan",
    "studentId": "261P3178",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Holiday Village Road",
    "dropStop": "Holiday Village Road",
    "parentContact": "9740372650",
    "parentEmail": "parent.261p3178@transcend.org",
  },
  {
    "studentName": "Rithvin A",
    "studentId": "241S1832",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Holiday Village Road, Venkataramana temple, vajarahalli",
    "dropStop": "Holiday Village Road, Venkataramana temple, vajarahalli",
    "parentContact": "8861365298",
    "parentEmail": "parent.241s1832@transcend.org",
  },
  {
    "studentName": "S Chaithra",
    "studentId": "261P4222",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "In front of Mahaveer meredian apartment, Maruthi School",
    "dropStop": "In front of Mahaveer meredian apartment, Maruthi School",
    "parentContact": "9632595962",
    "parentEmail": "parent.261p4222@transcend.org",
  },
  {
    "studentName": "Dheeraj M Naik",
    "studentId": "261P3662",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "Janavikas school 8th phase jpnagar, Rao Party Hall",
    "dropStop": "Janavikas school 8th phase jpnagar, Rao Party Hall",
    "parentContact": "9900173746",
    "parentEmail": "parent.261p3662@transcend.org",
  },
  {
    "studentName": "Mohammed Farzain Pathan",
    "studentId": "261P4156",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "MAANGALYA SIGNATURE, Royal Park residency Layout 1, JP Nagar 9th Phase",
    "dropStop": "MAANGALYA SIGNATURE, Royal Park residency Layout 1, JP Nagar 9th Phase",
    "parentContact": "9845954170",
    "parentEmail": "parent.261p4156@transcend.org",
  },
  {
    "studentName": "Daiwik Krishnamurthy Naik",
    "studentId": "261P3751",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Mangalya Prosper apartment, Royal Park residency Layout 1, JP Nagar 9th Phase",
    "dropStop": "Mangalya Prosper apartment, Royal Park residency Layout 1, JP Nagar 9th Phase",
    "parentContact": "9821428099",
    "parentEmail": "parent.261p3751@transcend.org",
  },
  {
    "studentName": "Vaishnavi R",
    "studentId": "251P1815",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Maruthi School",
    "dropStop": "Maruthi School",
    "parentContact": "7760513295",
    "parentEmail": "parent.251p1815@transcend.org",
  },
  {
    "studentName": "Guttikonda Navya shree",
    "studentId": "251P2022",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Maruthi School, Kothanoor",
    "dropStop": "Maruthi School, Kothanoor",
    "parentContact": "9620511227",
    "parentEmail": "parent.251p2022@transcend.org",
  },
  {
    "studentName": "Samana V",
    "studentId": "261S1104",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "Maruthi School, Kothanoor",
    "dropStop": "Maruthi School, Kothanoor",
    "parentContact": "9110280906",
    "parentEmail": "parent.261s1104@transcend.org",
  },
  {
    "studentName": "Disha B Praveen",
    "studentId": "261P4008",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Nandhi Garden Rd, J. P. Nagar, Bengaluru, Karnataka",
    "dropStop": "Nandhi Garden Rd, J. P. Nagar, Bengaluru, Karnataka",
    "parentContact": "9845584324",
    "parentEmail": "parent.261p4008@transcend.org",
  },
  {
    "studentName": "Maina Parla",
    "studentId": "261P3068",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Nandi Garden Phase 2",
    "dropStop": "Nandi Garden Phase 2",
    "parentContact": "9900710101",
    "parentEmail": "parent.261p3068@transcend.org",
  },
  {
    "studentName": "Yatiraj Vinaya Bhat",
    "studentId": "261P3688",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near by the grarrage raghavana palya J p nager 9th phase",
    "dropStop": "Near by the grarrage raghavana palya J p nager 9th phase",
    "parentContact": "9845500128",
    "parentEmail": "parent.261p3688@transcend.org",
  },
  {
    "studentName": "Pavithra Pari",
    "studentId": "251P1744",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near holiday village resort",
    "dropStop": "Near holiday village resort",
    "parentContact": "9591491074",
    "parentEmail": "parent.251p1744@transcend.org",
  },
  {
    "studentName": "Khushi Jain",
    "studentId": "261P3197",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near last bus stop Anjanapura(Post Office)",
    "dropStop": "Near last bus stop Anjanapura(Post Office)",
    "parentContact": "9880077994",
    "parentEmail": "parent.261p3197@transcend.org",
  },
  {
    "studentName": "Bhargav Ravi",
    "studentId": "251P1036",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near Manglyam Apartment Anjanapura",
    "dropStop": "Near Manglyam Apartment Anjanapura",
    "parentContact": "9845417672",
    "parentEmail": "parent.251p1036@transcend.org",
  },
  {
    "studentName": "Indu R",
    "studentId": "261P3156",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near Nandi Gardens, Agasthya Wellness Center JP Nagar 9th Phase",
    "dropStop": "Near Nandi Gardens, Agasthya Wellness Center JP Nagar 9th Phase",
    "parentContact": "9845051271",
    "parentEmail": "parent.261p3156@transcend.org",
  },
  {
    "studentName": "Anagha Lakshminarayana",
    "studentId": "261P3946",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Near Skypool fitness centre, JP nagar 8th Phase",
    "dropStop": "Near Skypool fitness centre, JP nagar 8th Phase",
    "parentContact": "9964425142",
    "parentEmail": "parent.261p3946@transcend.org",
  },
  {
    "studentName": "Shraddha Narayanan",
    "studentId": "261P4077",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "Near yogitha chats, Mahaveer meredian apartment",
    "dropStop": "Near yogitha chats, Mahaveer meredian apartment",
    "parentContact": "9845036569",
    "parentEmail": "parent.261p4077@transcend.org",
  },
  {
    "studentName": "Aneek Banerjee",
    "studentId": "261P3382",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Next to Real house apartment, Anjanapura",
    "dropStop": "Next to Real house apartment, Anjanapura",
    "parentContact": "8310322582",
    "parentEmail": "parent.261p3382@transcend.org",
  },
  {
    "studentName": "Tishika Ramineni",
    "studentId": "261P3595",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Opp Platinum Lifestyle Apartment, JP Nagar 8th phase",
    "dropStop": "Opp Platinum Lifestyle Apartment, JP Nagar 8th phase",
    "parentContact": "9916104207",
    "parentEmail": "parent.261p3595@transcend.org",
  },
  {
    "studentName": "Meghana Hiremath",
    "studentId": "241S1618",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Pearl Gardens Holiday village Road",
    "dropStop": "Pearl Gardens Holiday village Road",
    "parentContact": "9845981019",
    "parentEmail": "parent.241s1618@transcend.org",
  },
  {
    "studentName": "Mahima Bhoomika",
    "studentId": "261P3120",
    "route": "Route 27",
    "bus": "KA-27-TV-0003",
    "pickupStop": "Platinum life Stile Apartment",
    "dropStop": "Platinum life Stile Apartment",
    "parentContact": "9845266566",
    "parentEmail": "parent.261p3120@transcend.org",
  },
  {
    "studentName": "Mohamed Faheem",
    "studentId": "261P3417",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Purva Highland Apt,Near Kumarans school, Holiday village Road,",
    "dropStop": "Purva Highland Apt,Near Kumarans school, Holiday village Road,",
    "parentContact": "9620563052",
    "parentEmail": "parent.261p3417@transcend.org",
  },
  {
    "studentName": "Vivan Makam",
    "studentId": "241S1284",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Purva Highland, Mallasandra",
    "dropStop": "Purva Highland, Mallasandra",
    "parentContact": "9739317701",
    "parentEmail": "parent.241s1284@transcend.org",
  },
  {
    "studentName": "Mikhael David Kshirsagar",
    "studentId": "261P4161",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Rao Party Hall, Kothnoor Dinne, 8th Phase, J. P. Nagar",
    "dropStop": "Rao Party Hall, Kothnoor Dinne, 8th Phase, J. P. Nagar",
    "parentContact": "6364371493",
    "parentEmail": "parent.261p4161@transcend.org",
  },
  {
    "studentName": "Parnita R",
    "studentId": "261P3505",
    "route": "Route 27",
    "bus": "KA-27-TV-0016",
    "pickupStop": "Royal County Bus stop",
    "dropStop": "Royal County Bus stop",
    "parentContact": "9886909932",
    "parentEmail": "parent.261p3505@transcend.org",
  },
  {
    "studentName": "Gautam Narayana Pattipati",
    "studentId": "261P3514",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "Royal Lakefront Layout phase 2 central park in the opposite road of KLV Layout entrance",
    "dropStop": "Royal Lakefront Layout phase 2 central park in the opposite road of KLV Layout entrance",
    "parentContact": "9740656807",
    "parentEmail": "parent.261p3514@transcend.org",
  },
  {
    "studentName": "Vihaan Sandhya Nagendra",
    "studentId": "251P1594",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "RV Institute",
    "dropStop": "RV Institute",
    "parentContact": "9620019789",
    "parentEmail": "parent.251p1594@transcend.org",
  },
  {
    "studentName": "DEEKSHA T",
    "studentId": "251P1190",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "RV Institute Opp",
    "dropStop": "RV Institute Opp",
    "parentContact": "9980178780",
    "parentEmail": "parent.251p1190@transcend.org",
  },
  {
    "studentName": "Sahishnu Dharwad",
    "studentId": "251P1748",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "SADGURU TAPOVANA, ROYAL PARK RESIDENCY,",
    "dropStop": "SADGURU TAPOVANA, ROYAL PARK RESIDENCY,",
    "parentContact": "9448453590",
    "parentEmail": "parent.251p1748@transcend.org",
  },
  {
    "studentName": "Vijval T G",
    "studentId": "241S1107",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Sattva Misty Charm, Holiday Village",
    "dropStop": "Sattva Misty Charm, Holiday Village",
    "parentContact": "9008569569",
    "parentEmail": "parent.241s1107@transcend.org",
  },
  {
    "studentName": "Sinchana M Bhat",
    "studentId": "261P4059",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "Silicon City Academy of Secondary Education, Chunchaghatta Main Road",
    "dropStop": "Silicon City Academy of Secondary Education, Chunchaghatta Main Road",
    "parentContact": "9964740252",
    "parentEmail": "parent.261p4059@transcend.org",
  },
  {
    "studentName": "Trisha Prabhu",
    "studentId": "261P3155",
    "route": "Route 16",
    "bus": "KA-16-WX-0017",
    "pickupStop": "Soudhamini Convention Hall",
    "dropStop": "Soudhamini Convention Hall",
    "parentContact": "9845706517",
    "parentEmail": "parent.261p3155@transcend.org",
  },
  {
    "studentName": "B A Adeep Simha",
    "studentId": "241S1451",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Soudhamini Kalyana mantapa",
    "dropStop": "Soudhamini Kalyana mantapa",
    "parentContact": "9986082070",
    "parentEmail": "parent.241s1451@transcend.org",
  },
  {
    "studentName": "B A Anil Simha",
    "studentId": "241S1452",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Soudhamini Kalyana mantapa",
    "dropStop": "Soudhamini Kalyana mantapa",
    "parentContact": "9986082070",
    "parentEmail": "parent.241s1451@transcend.org",
  },
  {
    "studentName": "Naga Stavya V",
    "studentId": "251P1115",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Srinidhi Layout, 9th Cross",
    "dropStop": "Srinidhi Layout, 9th Cross",
    "parentContact": "9844833085",
    "parentEmail": "parent.251p1115@transcend.org",
  },
  {
    "studentName": "Maanasa Vivek",
    "studentId": "251P1158",
    "route": "Route 27",
    "bus": "KA-27-TV-0017",
    "pickupStop": "Swapnam Royal Park residency, Jp nagar 9th phase",
    "dropStop": "Swapnam Royal Park residency, Jp nagar 9th phase",
    "parentContact": "9845008167",
    "parentEmail": "parent.251p1158@transcend.org",
  },
  {
    "studentName": "Manya A",
    "studentId": "261P3448",
    "route": "Route 22",
    "bus": "KA-22-JK-0022",
    "pickupStop": "Poornapragna, nandini booth",
    "dropStop": "Poornapragna, nandini booth",
    "parentContact": "9448247803",
    "parentEmail": "parent.261p3448@transcend.org",
  },
  {
    "studentName": "Shrishti S T",
    "studentId": "261S1001",
    "route": "Route Car",
    "bus": "KA-99-CAR-0001",
    "pickupStop": "Sobha Dewflower Apartments",
    "dropStop": "Sobha Dewflower Apartments",
    "parentContact": "9945546701",
    "parentEmail": "parent.241s1127@transcend.org",
  },
  {
    "studentName": "Misha N Aaradhya",
    "studentId": "261S1062",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "(Old water tank road) near sangam textiles Uttarahalli",
    "dropStop": "(Old water tank road) near sangam textiles Uttarahalli",
    "parentContact": "9071136789",
    "parentEmail": "parent.261s1062@transcend.org",
  },
  {
    "studentName": "Avni Pobbathi",
    "studentId": "241S1006",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Appolo Pharmacy, Kumarswamy Layout",
    "dropStop": "Appolo Pharmacy, Kumarswamy Layout",
    "parentContact": "9900359966",
    "parentEmail": "parent.241s1006@transcend.org",
  },
  {
    "studentName": "Yadhavi",
    "studentId": "261S1039",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Bhuvaneshwari Nagara Park Back Gate BSK 3rd Stage(Drop)",
    "dropStop": "Bhuvaneshwari Nagara Park Back Gate BSK 3rd Stage(Drop)",
    "parentContact": "8867286648",
    "parentEmail": "parent.261s1039@transcend.org",
  },
  {
    "studentName": "Shrikari",
    "studentId": "261S1043",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Brightway school road, next to vvr paradise",
    "dropStop": "Brightway school road, next to vvr paradise",
    "parentContact": "9980523248",
    "parentEmail": "parent.261s1043@transcend.org",
  },
  {
    "studentName": "Leher Dugar",
    "studentId": "241S1019",
    "route": "Route Ecco",
    "bus": "KA-99-ECCO-0001",
    "pickupStop": "Dolor's Colony JP Nagar",
    "dropStop": "Dolor's Colony JP Nagar",
    "parentContact": "9620944577",
    "parentEmail": "parent.241s1019@transcend.org",
  },
  {
    "studentName": "Aarika Deepak Guptha",
    "studentId": "251S1736",
    "route": "Route Ecco",
    "bus": "KA-99-ECCO-0001",
    "pickupStop": "J P Nagar 1st phase , Behind RV Dental college",
    "dropStop": "J P Nagar 1st phase , Behind RV Dental college",
    "parentContact": "9886430859",
    "parentEmail": "parent.251s1736@transcend.org",
  },
  {
    "studentName": "Dhruvi Bysani",
    "studentId": "251S1640",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "nanjappa layout, opposite asha apartment, yelchenhalli",
    "dropStop": "nanjappa layout, opposite asha apartment, yelchenhalli",
    "parentContact": "8197301374",
    "parentEmail": "parent.251s1640@transcend.org",
  },
  {
    "studentName": "Charvik S Kulal",
    "studentId": "251S1324",
    "route": "Route 4",
    "bus": "KA-04-XX-0011",
    "pickupStop": "Near appolo pharmacy kumarswamy layout",
    "dropStop": "Near appolo pharmacy kumarswamy layout",
    "parentContact": "8971640989",
    "parentEmail": "parent.251s1324@transcend.org",
  },
  {
    "studentName": "Avyan Lohith",
    "studentId": "251S1338",
    "route": "Route 7",
    "bus": "KA-07-EF-0000",
    "pickupStop": "Manjunatha Medical Shop",
    "dropStop": "Manjunatha Medical Shop",
    "parentContact": "9741299367",
    "parentEmail": "parent.251s1338@transcend.org",
  },
  {
    "studentName": "ANAYRA PREETHAM",
    "studentId": "261S1029",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Opposite to Drug house 2 ,near ambica Medicals ,above Kanasu Collection Shop",
    "dropStop": "Opposite to Drug house 2 ,near ambica Medicals ,above Kanasu Collection Shop",
    "parentContact": "9538454637",
    "parentEmail": "parent.261s1029@transcend.org",
  },
  {
    "studentName": "Meenakshi M A",
    "studentId": "261S1045",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Prarthana School",
    "dropStop": "Prarthana School",
    "parentContact": "9742640011",
    "parentEmail": "parent.261s1045@transcend.org",
  },
  {
    "studentName": "Tanmay Bhat A",
    "studentId": "261S1091",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Prestige folcon city, building 4",
    "dropStop": "Prestige folcon city, building 4",
    "parentContact": "9880578232",
    "parentEmail": "parent.261s1091@transcend.org",
  },
  {
    "studentName": "Bhavith Pirgal",
    "studentId": "251S1925",
    "route": "Route Ecco",
    "bus": "KA-99-ECCO-0001",
    "pickupStop": "Rama Iyengar Road, Lal Bagh West Gate, VV Puram",
    "dropStop": "Rama Iyengar Road, Lal Bagh West Gate, VV Puram",
    "parentContact": "9483824767",
    "parentEmail": "parent.251s1925@transcend.org",
  },
  {
    "studentName": "Dhriti Rs",
    "studentId": "261P3627",
    "route": "Route 9",
    "bus": "KA-09-IJ-0000",
    "pickupStop": "Near abbayi naidu studio, chikkalasandra",
    "dropStop": "Near abbayi naidu studio, chikkalasandra",
    "parentContact": "9900755277",
    "parentEmail": "parent.261p3627@transcend.org",
  },
  {
    "studentName": "Vihaan Raj S V",
    "studentId": "261P4270",
    "route": "Route 13",
    "bus": "KA-13-QR-0000",
    "pickupStop": "Byrasandra halsinanna mara nimhans road",
    "dropStop": "Byrasandra halsinanna mara nimhans road",
    "parentContact": "9538261246",
    "parentEmail": "parent.261s1105@transcend.org",
  },
  {
    "studentName": "Nikita Abhi",
    "studentId": "261P3768",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "The magic faraway tree near Silk Institute metro station, Kanakapura Road",
    "dropStop": "The magic faraway tree near Silk Institute metro station, Kanakapura Road",
    "parentContact": "8884400543",
    "parentEmail": "parent.261p3768@transcend.org",
  },
  {
    "studentName": "Chirag G",
    "studentId": "261S1028",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Ganpathipura",
    "dropStop": "Ganpathipura",
    "parentContact": "9986334528",
    "parentEmail": "parent.261s1028@transcend.org",
  },
  {
    "studentName": "Satyavijay S Harapanahalli",
    "studentId": "241S1253",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Vajarahalli metro station",
    "dropStop": "Vajarahalli metro station",
    "parentContact": "8800660647",
    "parentEmail": "parent.241s1253@transcend.org",
  },
  {
    "studentName": "Satyadharma S Harapanahalli",
    "studentId": "241S1248",
    "route": "Route 11",
    "bus": "KA-11-MN-0000",
    "pickupStop": "Vajarahalli metro station",
    "dropStop": "Vajarahalli metro station",
    "parentContact": "8800660647",
    "parentEmail": "parent.241s1253@transcend.org",
  },
  {
    "studentName": "Darshan Hooli",
    "studentId": "261P3884",
    "route": "Route 6",
    "bus": "KA-06-CD-0000",
    "pickupStop": "Mantri Serenity Doddakallasandra",
    "dropStop": "Mantri Serenity Doddakallasandra",
    "parentContact": "9527850860",
    "parentEmail": "parent.261p3884@transcend.org",
  },
  {
    "studentName": "ROHAN M M",
    "studentId": "261S1072",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "PICKUP - Apollo pharmacy, kumaraswamy layout, DROP - Podar jumbo kids preschool, ISRO layout",
    "dropStop": "PICKUP - Apollo pharmacy, kumaraswamy layout, DROP - Podar jumbo kids preschool, ISRO layout",
    "parentContact": "9916551953/9886399249",
    "parentEmail": "parent.261s1072@transcend.org",
  },
  {
    "studentName": "Avyay Vikram",
    "studentId": "261P3339",
    "route": "Route 7",
    "bus": "KA-07-EF-0000",
    "pickupStop": "Friendly Tails Pet Clinic, iberty Square Apartment, Raghunalli",
    "dropStop": "Friendly Tails Pet Clinic, iberty Square Apartment, Raghunalli",
    "parentContact": "9686860501",
    "parentEmail": "parent.261p3339@transcend.org",
  },
  {
    "studentName": "Charvi S Gowda",
    "studentId": "261P4117",
    "route": "Route 27",
    "bus": "KA-27-TV-0000",
    "pickupStop": "Anjanapura, Post Office",
    "dropStop": "Anjanapura, Post Office",
    "parentContact": "9611555556",
    "parentEmail": "parent.261p4117@transcend.org",
  },
  {
    "studentName": "Tanushree S",
    "studentId": "261P4307",
    "route": "Route 24",
    "bus": "KA-24-NP-0000",
    "pickupStop": "Sarvabhoumanagar Near chaavdi hotel",
    "dropStop": "Sarvabhoumanagar Near chaavdi hotel",
    "parentContact": "9740221155",
    "parentEmail": "parent.261p4307@transcend.org",
  },
  {
    "studentName": "Kushal G",
    "studentId": "261P3820",
    "route": "Route 25",
    "bus": "KA-25-PR-0000",
    "pickupStop": "KVR IRIS Apartment, Near Someshwara Temple",
    "dropStop": "KVR IRIS Apartment, Near Someshwara Temple",
    "parentContact": "9916466766",
    "parentEmail": "parent.261p3820@transcend.org",
  },
  {
    "studentName": "Tanvi Patel",
    "studentId": "261P3654",
    "route": "Route 19",
    "bus": "KA-19-DF-0000",
    "pickupStop": "L & T SOUTH CITY",
    "dropStop": "L & T SOUTH CITY",
    "parentContact": "9739133250",
    "parentEmail": "parent.261p3654@transcend.org",
  },
  {
    "studentName": "Maharth Gowda R",
    "studentId": "261S1076",
    "route": "Route 4",
    "bus": "KA-04-XX-0000",
    "pickupStop": "Dheen Dhayal badminton court or Pranitha condiments",
    "dropStop": "Dheen Dhayal badminton court or Pranitha condiments",
    "parentContact": "8951240187",
    "parentEmail": "parent.261s1076@transcend.org",
  },
  {
    "studentName": "Deepti H A",
    "studentId": "241S1486",
    "route": "Route 6",
    "bus": "KA-06-CD-0000",
    "pickupStop": "Elegant Embassey near Subramanyapura lake on Turahalli Road",
    "dropStop": "Elegant Embassey near Subramanyapura lake on Turahalli Road",
    "parentContact": "9449622361",
    "parentEmail": "parent.241s1486@transcend.org",
  },
  {
    "studentName": "Dhriti Raj",
    "studentId": "261P4075",
    "route": "Route 22",
    "bus": "KA-22-JK-0000",
    "pickupStop": "Brigade 7 Gardens, Paduka Mandira Road",
    "dropStop": "Brigade 7 Gardens, Paduka Mandira Road",
    "parentContact": "9844217182",
    "parentEmail": "parent.261p4075@transcend.org",
  },
  {
    "studentName": "SAI RUTHVI",
    "studentId": "251S1982",
    "route": "Route 14",
    "bus": "KA-14-ST-0000",
    "pickupStop": "Jarganahalli Arch",
    "dropStop": "Jarganahalli Arch",
    "parentContact": "undefined",
    "parentEmail": "parent.251s1982@transcend.org",
  },
  {
    "studentName": "Shamith G C",
    "studentId": "261P3356",
    "route": "Route 15",
    "bus": "KA-15-UV-0000",
    "pickupStop": "Shanmuga temple RR nagar",
    "dropStop": "Shanmuga temple RR nagar",
    "parentContact": "9845266881",
    "parentEmail": "parent.261p3356@transcend.org",
  },
  {
    "studentName": "Mayur M",
    "studentId": "261P4313",
    "route": "Route 12",
    "bus": "KA-12-OP-0000",
    "pickupStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "dropStop": "Century Indus Apartments, Rajarajeshwari Nagar",
    "parentContact": "9901100007",
    "parentEmail": "parent.261p4313@transcend.org",
  }
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
      let status: 'Boarded' | 'Absent' | 'Dropped' = 'Dropped';
      if ((idx + i) % 7 === 0) {
        status = 'Absent';
      } else if (i === 0) {
        status = 'Boarded';
      }

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

const DEFAULT_FASTAG_LOGS: FastagLog[] = [
  {
    id: 'FT-001',
    vehicleNumber: 'KA-53-F-1234',
    gateName: 'North Main Gate',
    direction: 'Entry',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Valid'
  },
  {
    id: 'FT-002',
    vehicleNumber: 'KA-01-XX-0020',
    gateName: 'South Gate 2',
    direction: 'Exit',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    status: 'Valid'
  },
  {
    id: 'FT-003',
    vehicleNumber: 'KA-53-F-1234',
    gateName: 'North Main Gate',
    direction: 'Exit',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'Valid'
  }
];

const DEFAULT_SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: 'SA-001',
    vehicleNumber: 'KA-53-F-1234',
    type: 'Driver Distraction',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    resolved: false
  },
  {
    id: 'SA-002',
    vehicleNumber: 'KA-01-XX-0020',
    type: 'Speeding',
    severity: 'Warning',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    resolved: false
  }
];

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
  localStorage.setItem('transport_fastag_logs', JSON.stringify(DEFAULT_FASTAG_LOGS));
  localStorage.setItem('transport_safety_alerts', JSON.stringify(DEFAULT_SAFETY_ALERTS));
  localStorage.setItem('transport_db_version', DB_VERSION);
}

export function readTable<T>(tableName: string): T[] {
  initLocalStorageDB();
  const rawData = localStorage.getItem(tableName);
  return rawData ? JSON.parse(rawData) : [];
}

export function writeTable<T>(tableName: string, data: T[]) {
  localStorage.setItem(tableName, JSON.stringify(data));
}

export const dbService = {
  getUsers: (): User[] => readTable<User>('transport_users'),
  saveUsers: (users: User[]) => writeTable<User>('transport_users', users),
  getDrivers: (): Driver[] => readTable<Driver>('transport_drivers'),
  saveDrivers: (drivers: Driver[]) => writeTable<Driver>('transport_drivers', drivers),
  getVehicles: (): Vehicle[] => readTable<Vehicle>('transport_vehicles'),
  saveVehicles: (vehicles: Vehicle[]) => writeTable<Vehicle>('transport_vehicles', vehicles),
  getRoutes: (): Route[] => readTable<Route>('transport_routes'),
  saveRoutes: (routes: Route[]) => writeTable<Route>('transport_routes', routes),
  getStudents: (): Student[] => readTable<Student>('transport_students'),
  saveStudents: (students: Student[]) => writeTable<Student>('transport_students', students),
  getNotifications: (): Notification[] => readTable<Notification>('transport_notifications'),
  saveNotifications: (notifications: Notification[]) => writeTable<Notification>('transport_notifications', notifications),
  getAttendance: (): Attendance[] => {
    const attendance = readTable<Attendance>('transport_attendance');
    const students = readTable<Student>('transport_students');
    const now = new Date();
    
    // Helper to format date in YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    
    const todayStr = formatDate(now);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = formatDate(tomorrow);
    
    const datesToCheck = [todayStr, tomorrowStr];
    let changed = false;
    
    datesToCheck.forEach(dateStr => {
      // Check if we are past 8:00 PM of the previous day of dateStr
      const targetDate = new Date(dateStr + 'T00:00:00');
      const prevDay = new Date(targetDate);
      prevDay.setDate(targetDate.getDate() - 1);
      prevDay.setHours(20, 0, 0, 0);
      
      if (now >= prevDay) {
        const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Auto-accept is active Monday to Saturday (1 to 6)
        if (dayOfWeek >= 1 && dayOfWeek <= 6) {
          const defaultDropTime = dayOfWeek === 6 ? '12:30 PM' : '3:30 PM';
          
          students.forEach(student => {
            if (student.route && student.route !== 'None' && student.bus && student.bus !== 'None') {
              const recordId = `ATT-${student.studentId}-${dateStr}`;
              const exists = attendance.some(a => a.id === recordId);
              if (!exists) {
                attendance.push({
                  id: recordId,
                  date: dateStr,
                  studentId: student.studentId,
                  studentName: student.studentName,
                  route: student.route,
                  bus: student.bus,
                  status: 'Present',
                  parentDeclaration: 'Present',
                  updatedBy: 'System (Auto-Accepted)',
                  dropOffTime: defaultDropTime
                });
                changed = true;
              }
            }
          });
        }
      }
    });
    
    if (changed) {
      writeTable<Attendance>('transport_attendance', attendance);
    }
    
    return attendance;
  },
  saveAttendance: (attendance: Attendance[]) => writeTable<Attendance>('transport_attendance', attendance),
  getFastagLogs: (): FastagLog[] => readTable<FastagLog>('transport_fastag_logs'),
  saveFastagLogs: (logs: FastagLog[]) => writeTable<FastagLog>('transport_fastag_logs', logs),
  getSafetyAlerts: (): SafetyAlert[] => readTable<SafetyAlert>('transport_safety_alerts'),
  saveSafetyAlerts: (alerts: SafetyAlert[]) => writeTable<SafetyAlert>('transport_safety_alerts', alerts),
};
