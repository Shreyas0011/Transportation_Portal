import { User } from '../src/models/User.model.js';
import { Vehicle } from '../src/models/Vehicle.model.js';
import { Driver } from '../src/models/Driver.model.js';
import { Route } from '../src/models/Route.model.js';
import { Student } from '../src/models/Student.model.js';
import { logger } from '../src/utils/logger.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      logger.info('Seeding initial MongoDB collections...');

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

      logger.info('Database seeding completed successfully!');
    }
  } catch (err) {
    logger.error('Error seeding database:', err.message);
  }
};
