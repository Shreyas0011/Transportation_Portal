import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://shreyas777999_db_user:Shreyas123@cluster0.fcmr5e2.mongodb.net/transportation_portal?retryWrites=true&w=majority';

// ── CONNECT TO MONGODB ──
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas cluster.');
    seedDatabase();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err.message);
  });

// ── MONGOOSE SCHEMAS & MODELS ──

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  employeeId: { type: String },
  studentId: { type: String },
  isActive: { type: Boolean, default: true }
});
const User = mongoose.model('User', UserSchema);

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  registrationNumber: { type: String },
  vehicleModel: { type: String },
  seatingCapacity: { type: Number },
  driverAssigned: { type: String },
  routeAssigned: { type: String },
  status: { type: String }
});
const Vehicle = mongoose.model('Vehicle', VehicleSchema);

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  assignedVehicle: { type: String },
  assignedRoute: { type: String },
  status: { type: String }
});
const Driver = mongoose.model('Driver', DriverSchema);

const StopSchema = new mongoose.Schema({
  stopName: { type: String },
  arrivalTime: { type: String },
  dropTime: { type: String }
});

const RouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true, unique: true },
  startingPoint: { type: String },
  destination: { type: String },
  assignedVehicle: { type: String },
  assignedDriver: { type: String },
  stops: [StopSchema]
});
const Route = mongoose.model('Route', RouteSchema);

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  route: { type: String },
  bus: { type: String },
  pickupStop: { type: String },
  dropStop: { type: String },
  parentContact: { type: String, required: true },
  parentEmail: { type: String },
  healthRecord: { type: String }
});
const Student = mongoose.model('Student', StudentSchema);

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  route: { type: String },
  bus: { type: String },
  status: { type: String, required: true },
  parentDeclaration: { type: String },
  actualBoarding: { type: String },
  accountabilityStatus: { type: String },
  accountabilityNote: { type: String },
  updatedBy: { type: String },
  dropOffTime: { type: String }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  sentBy: { type: String, required: true }
});
const Notification = mongoose.model('Notification', NotificationSchema);

const FastagLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  gateName: { type: String },
  direction: { type: String },
  timestamp: { type: String },
  status: { type: String }
});
const FastagLog = mongoose.model('FastagLog', FastagLogSchema);

const SafetyAlertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  vehicleNumber: { type: String, required: true },
  type: { type: String },
  severity: { type: String },
  timestamp: { type: String },
  resolved: { type: Boolean, default: false }
});
const SafetyAlert = mongoose.model('SafetyAlert', SafetyAlertSchema);

// ── SEEDING HELPERS ──
const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial system collections in MongoDB...');
      
      const driversData = [
        { slNo: 1, mode: "Ecco Car", plate: "KA05AL8080", name: "Devmanjunath M", phone: "9972444550", empId: "EMP-DRV-001", route: "Route Ecco Car" },
        { slNo: 2, mode: "Route No 01", plate: "KA05AL1642", name: "Raghavendra R", phone: "8861446172", empId: "EMP-DRV-002", route: "Route 01" },
        { slNo: 3, mode: "Route No 02", plate: "KA05AL1645", name: "Manjunath HR", phone: "9900565365", empId: "EMP-DRV-003", route: "Route 02" },
        { slNo: 4, mode: "Route No 03", plate: "KA05AL1646", name: "Rajumon", phone: "9620834936", empId: "EMP-DRV-004", route: "Route 03" },
        { slNo: 5, mode: "Route No 04", plate: "KA05AL1890", name: "Raja K C", phone: "9901666746", empId: "EMP-DRV-005", route: "Route 04" },
        { slNo: 6, mode: "Route No 05", plate: "KA05AL3112", name: "Bharath Raj N", phone: "7708350151", empId: "EMP-DRV-006", route: "Route 05" },
        { slNo: 7, mode: "Route No 06", plate: "KA05AM3317", name: "Soma Naik", phone: "9972337542", empId: "EMP-DRV-007", route: "Route 06" },
        { slNo: 8, mode: "Route No 07", plate: "KA05AM3318", name: "Muni Choodaiah B M", phone: "9972133327", empId: "EMP-DRV-008", route: "Route 07" },
        { slNo: 9, mode: "Route No 08", plate: "KA05AM4927", name: "Saibanna", phone: "9164926837", empId: "EMP-DRV-009", route: "Route 08" },
        { slNo: 10, mode: "Route No 09", plate: "KA05AM3881", name: "Srinivasa", phone: "9739539233", empId: "EMP-DRV-010", route: "Route 09" },
        { slNo: 11, mode: "Route No 10", plate: "KA05AM5541", name: "Sumanth G C", phone: "8296801580", empId: "EMP-DRV-011", route: "Route 10" },
        { slNo: 12, mode: "Route No 11", plate: "KA05AM8222", name: "Nagaraju N", phone: "9535085330", empId: "EMP-DRV-012", route: "Route 11" },
        { slNo: 13, mode: "Route No 12", plate: "KA05AP0787", name: "Parthasarathi", phone: "7406050424", empId: "EMP-DRV-013", route: "Route 12" },
        { slNo: 14, mode: "Route No 13", plate: "KA05AP0786", name: "Raju B", phone: "9980957119", empId: "EMP-DRV-014", route: "Route 13" },
        { slNo: 15, mode: "Route No 14", plate: "KA05AP0785", name: "Manjunatha K", phone: "8105980947", empId: "EMP-DRV-015", route: "Route 14" },
        { slNo: 16, mode: "Route No 15", plate: "KA05AP0788", name: "Naveen M", phone: "9481845727", empId: "EMP-DRV-016", route: "Route 15" },
        { slNo: 17, mode: "Route No 16", plate: "KA05AP1551", name: "Umesh N", phone: "9738447755", empId: "EMP-DRV-017", route: "Route 16" },
        { slNo: 18, mode: "Route No 17", plate: "KA05AP1550", name: "Venkateshreddy", phone: "9886231563", empId: "EMP-DRV-018", route: "Route 17" },
        { slNo: 19, mode: "Route No 18", plate: "KA05AP1725", name: "Santhosh Kumar C", phone: "9980908010", empId: "EMP-DRV-019", route: "Route 18" },
        { slNo: 20, mode: "Route No 19", plate: "KA05AQ6799", name: "Jai Kumar", phone: "7760832939", empId: "EMP-DRV-020", route: "Route 19" },
        { slNo: 21, mode: "Route No 20", plate: "KA05AQ6798", name: "Ananda M", phone: "9741605925", empId: "EMP-DRV-021", route: "Route 20" },
        { slNo: 22, mode: "Route No 21", plate: "KA05AQ6625", name: "Deepak S", phone: "8073493899", empId: "EMP-DRV-022", route: "Route 21" },
        { slNo: 23, mode: "Route No 22", plate: "KA05AQ6624", name: "Vinod I D", phone: "8197225717", empId: "EMP-DRV-023", route: "Route 22" },
        { slNo: 24, mode: "Route No 23", plate: "KA05AQ7289", name: "Girish D R", phone: "8197679255", empId: "EMP-DRV-024", route: "Route 23" },
        { slNo: 25, mode: "Route No 24", plate: "KA05AQ7927", name: "Sudhakara C", phone: "8088077759", empId: "EMP-DRV-025", route: "Route 24" },
        { slNo: 26, mode: "Route No 25", plate: "KA05AS3154", name: "Mahalinga N", phone: "6361762727", empId: "EMP-DRV-026", route: "Route 25" },
        { slNo: 27, mode: "Route No 26", plate: "KA05AS3155", name: "Shivakumar T M", phone: "9019055383", empId: "EMP-DRV-027", route: "Route 26" },
        { slNo: 28, mode: "Route No 27", plate: "KA05AS4439", name: "Tejas Kumar K S", phone: "7338319603", empId: "EMP-DRV-028", route: "Route 27" }
      ];

      const usersToInsert = [
        { email: "head@transcend.org", password: "head123", role: "Transport Head", name: "Rajesh Nair", employeeId: "EMP-HEAD-001", isActive: true },
        { email: "superadmin@transcend.org", password: "super123", role: "Super Admin", name: "Siddharth K T", employeeId: "EMP-SAD-001", isActive: true },
        { email: "parent001@transcend.org", password: "parent123", role: "Parent", name: "Shreyas K S", studentId: "251P2474", isActive: true }
      ];

      const vehiclesToInsert = [];
      const driversToInsert = [];
      const routesToInsert = [];

      driversData.forEach(d => {
        usersToInsert.push({
          email: `driver${String(d.slNo).padStart(3, '0')}@transcend.org`,
          password: "driver123",
          role: "Driver",
          name: d.name,
          employeeId: d.empId,
          isActive: true
        });

        vehiclesToInsert.push({
          vehicleNumber: d.plate,
          registrationNumber: `REG-${d.plate}`,
          vehicleModel: d.mode === "Ecco Car" ? "Maruti Eeco" : "School Bus 2024",
          seatingCapacity: d.mode === "Ecco Car" ? 7 : 40,
          driverAssigned: d.name,
          routeAssigned: d.route,
          status: "Active"
        });

        driversToInsert.push({
          name: d.name,
          employeeId: d.empId,
          phone: `+91 ${d.phone}`,
          assignedVehicle: d.plate,
          assignedRoute: d.route,
          status: "Active"
        });

        routesToInsert.push({
          routeName: d.route,
          startingPoint: "Depot Campus",
          destination: "Transcend Academy Campus",
          assignedVehicle: d.plate,
          assignedDriver: d.name,
          stops: [
            { stopName: "Main Depot", arrivalTime: "07:00 AM", dropTime: "05:00 PM" },
            { stopName: "Transcend School Hub", arrivalTime: "08:30 AM", dropTime: "03:30 PM" }
          ]
        });
      });

      await User.insertMany(usersToInsert);
      await Vehicle.insertMany(vehiclesToInsert);
      await Driver.insertMany(driversToInsert);
      await Route.insertMany(routesToInsert);

      await Student.insertMany([
        { studentName: "Triveni T S", studentId: "251P2474", route: "Route 14", bus: "KA05AP0785", pickupStop: "HSR Layout 14th Main", dropStop: "HSR Layout 14th Main", parentContact: "+91 98450 12345", parentEmail: "parent001@transcend.org" }
      ]);

      console.log('MongoDB seeding finished successfully with 28 real drivers!');
    }
  } catch (err) {
    console.error('Error seeding MongoDB collections:', err.message);
  }
};

// ── REST ENDPOINTS ──

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: 'mock-jwt-token-xyz', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/vehicles', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/vehicles', async (req, res) => {
  try {
    const updated = await Vehicle.findOneAndUpdate(
      { vehicleNumber: req.body.vehicleNumber },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Drivers
app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/drivers', async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/drivers', async (req, res) => {
  try {
    const updated = await Driver.findOneAndUpdate(
      { employeeId: req.body.employeeId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Driver not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes
app.get('/api/routes', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/routes', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/routes', async (req, res) => {
  try {
    const updated = await Route.findOneAndUpdate(
      { routeName: req.body.routeName },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Route not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/students', async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate(
      { studentId: req.body.studentId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const list = await Attendance.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/attendance', async (req, res) => {
  const records = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (const rec of records) {
      await Attendance.findOneAndUpdate(
        { id: rec.id },
        rec,
        { upsert: true, new: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const list = await Notification.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/notifications', async (req, res) => {
  try {
    const notif = new Notification(req.body);
    await notif.save();
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FastagLogs
app.get('/api/fastag', async (req, res) => {
  try {
    const list = await FastagLog.find().sort({ timestamp: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/fastag', async (req, res) => {
  const logs = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (const log of logs) {
      const newLog = new FastagLog(log);
      await newLog.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SafetyAlerts
app.get('/api/safety', async (req, res) => {
  try {
    const list = await SafetyAlert.find().sort({ timestamp: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/api/safety', async (req, res) => {
  const alerts = Array.isArray(req.body) ? req.body : [req.body];
  try {
    for (const alert of alerts) {
      const newAlert = new SafetyAlert(alert);
      await newAlert.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
