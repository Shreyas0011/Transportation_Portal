// src/pages/head/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bus, Users, ClipboardList, Bell, Search, Plus, 
  Edit, Trash2, AlertCircle, RefreshCw, X, MapPin, Heart
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { Vehicle, Driver, Student, Attendance, Notification, Route, Stop } from '../../utils/db';

interface DashboardProps {
  activeTab: string;
  user: any;
}

export const TransportHeadDashboard: React.FC<DashboardProps> = ({ activeTab, user }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // Database States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  
  // Attendance Filter States
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceBus, setAttendanceBus] = useState('');
  const [attendanceRoute, setAttendanceRoute] = useState('');

  // Dialog & Form States
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; type: string; id: string }>({
    open: false,
    type: '',
    id: '',
  });

  const [modalOpen, setModalOpen] = useState<{ open: boolean; type: string; mode: 'add' | 'edit'; data?: any }>({
    open: false,
    type: '',
    mode: 'add',
  });

  // Manage Stops States
  const [stopsModal, setStopsModal] = useState<{ open: boolean; route: Route | null }>({
    open: false,
    route: null
  });
  const [localStops, setLocalStops] = useState<Stop[]>([]);

  // Selected Route state during student allocation form reactiveness
  const [selectedAllocRoute, setSelectedAllocRoute] = useState<string>('None');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, dData, sData, aData, nData, rData] = await Promise.all([
        transportApi.getVehicles(),
        transportApi.getDrivers(),
        transportApi.getStudents(),
        transportApi.getAttendance(),
        transportApi.getNotifications(),
        transportApi.getRoutes(),
      ]);
      setVehicles(vData);
      setDrivers(dData);
      setStudents(sData);
      setAttendance(aData);
      setNotifications(nData);
      setRoutes(rData);
    } catch (err: any) {
      toast.error('Failed to retrieve system records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Clean form search on tab switch
  useEffect(() => {
    setSearchTerm('');
    setStatusFilter('');
    setVehicleFilter('');
    setRouteFilter('');
    setAttendanceBus('');
    setAttendanceRoute('');
  }, [activeTab]);

  // Action: Add/Edit Vehicle
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const vehicleNumber = formData.get('vehicleNumber') as string;
    const registrationNumber = formData.get('registrationNumber') as string;
    const vehicleModel = formData.get('vehicleModel') as string;
    const seatingCapacity = parseInt(formData.get('seatingCapacity') as string);
    const driverAssigned = formData.get('driverAssigned') as string;
    const routeAssigned = formData.get('routeAssigned') as string || 'None';
    const status = formData.get('status') as Vehicle['status'];

    if (!vehicleNumber || !registrationNumber || !vehicleModel || !seatingCapacity) {
      toast.error('All fields are required');
      return;
    }

    const payload: Vehicle = {
      vehicleNumber,
      registrationNumber,
      vehicleModel,
      seatingCapacity,
      driverAssigned,
      routeAssigned,
      status,
    };

    setLoading(true);
    try {
      if (modalOpen.mode === 'add') {
        await transportApi.addVehicle(payload);
        toast.success(`Vehicle ${vehicleNumber} registered successfully`);
      } else {
        await transportApi.updateVehicle(payload);
        toast.success(`Vehicle ${vehicleNumber} details updated`);
      }
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Add/Edit Driver
  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const employeeId = formData.get('employeeId') as string;
    const phone = formData.get('phone') as string;
    const assignedVehicle = formData.get('assignedVehicle') as string;
    const assignedRoute = formData.get('assignedRoute') as string || 'None';
    const status = formData.get('status') as Driver['status'];

    if (!name || !employeeId || !phone) {
      toast.error('All fields are required');
      return;
    }

    const payload: Driver = {
      name,
      employeeId,
      phone,
      assignedVehicle,
      assignedRoute,
      status,
    };

    setLoading(true);
    try {
      if (modalOpen.mode === 'add') {
        await transportApi.addDriver(payload);
        toast.success(`Driver ${name} profile created`);
      } else {
        await transportApi.updateDriver(payload);
        toast.success(`Driver ${name} details modified`);
      }
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Add/Edit Route
  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const routeName = formData.get('routeName') as string;
    const startingPoint = formData.get('startingPoint') as string;
    const destination = formData.get('destination') as string;
    const assignedVehicle = formData.get('assignedVehicle') as string || 'None';
    const assignedDriver = formData.get('assignedDriver') as string || 'None';

    if (!routeName || !startingPoint || !destination) {
      toast.error('All fields are required');
      return;
    }

    const existingStops = modalOpen.data?.stops || [];

    const payload: Route = {
      routeName,
      startingPoint,
      destination,
      stops: existingStops,
      assignedVehicle,
      assignedDriver,
    };

    setLoading(true);
    try {
      if (modalOpen.mode === 'add') {
        await transportApi.addRoute(payload);
        toast.success(`Route ${routeName} created successfully`);
      } else {
        await transportApi.updateRoute(payload);
        toast.success(`Route ${routeName} details updated`);
      }
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Student Allocation Adjustments
  const handleAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const studentId = formData.get('studentId') as string;
    const bus = formData.get('bus') as string;
    const route = formData.get('route') as string || 'None';
    const pickupStop = formData.get('pickupStop') as string || 'None';
    const dropStop = formData.get('dropStop') as string || 'None';

    if (!studentId || bus === 'None') {
      toast.error('Please select a Bus');
      return;
    }

    setLoading(true);
    try {
      await transportApi.allocateStudent({ studentId, route, bus, pickupStop, dropStop });
      toast.success('Student transport allocation updated');
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeallocateStudent = async (studentId: string) => {
    setLoading(true);
    try {
      await transportApi.deallocateStudent(studentId);
      toast.success('Transport allocation removed');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const studentName = formData.get('studentName') as string;
    const studentId = formData.get('studentId') as string;
    const parentContact = formData.get('parentContact') as string;
    const parentEmail = formData.get('parentEmail') as string || '';
    const route = formData.get('route') as string || 'None';
    const bus = formData.get('bus') as string || 'None';
    const pickupStop = formData.get('pickupStop') as string || 'None';
    const dropStop = formData.get('dropStop') as string || 'None';

    if (!studentName || !studentId || !parentContact) {
      toast.error('All fields marked * are required');
      return;
    }

    const payload: Student = {
      studentId,
      studentName,
      route,
      bus,
      pickupStop,
      dropStop,
      parentContact,
      parentEmail,
    };

    setLoading(true);
    try {
      if (modalOpen.mode === 'add') {
        await transportApi.addStudent(payload);
        toast.success(`Student ${studentName} registered successfully`);
      } else {
        await transportApi.updateStudent(payload);
        toast.success(`Student ${studentName} details modified`);
      }
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Create Notification Announcement
  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const category = formData.get('category') as Notification['category'];
    const message = formData.get('message') as string;

    if (!title || !message) {
      toast.error('Enter a notification title and description');
      return;
    }

    setLoading(true);
    try {
      await transportApi.addNotification({
        title,
        category,
        message,
        sentBy: `${user.name} (Transport Head)`,
      });
      toast.success('Announcement dispatched to parents');
      setModalOpen({ open: false, type: '', mode: 'add' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Action: Trigger Deletions
  const triggerDelete = (type: string, id: string) => {
    setConfirmDelete({ open: true, type, id });
  };

  const executeDeletion = async () => {
    const { type, id } = confirmDelete;
    setConfirmDelete({ open: false, type: '', id: '' });
    setLoading(true);
    try {
      if (type === 'vehicle') {
        await transportApi.deleteVehicle(id);
        toast.success(`Vehicle record ${id} removed`);
      } else if (type === 'driver') {
        await transportApi.deleteDriver(id);
        toast.success(`Driver profile ${id} deleted`);
      } else if (type === 'route') {
        await transportApi.deleteRoute(id);
        toast.success(`Route ${id} deleted`);
      }
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete resource');
    } finally {
      setLoading(false);
    }
  };

  // Action: Add local stop
  const handleAddLocalStop = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const stopName = formData.get('stopName') as string;
    const pickupTime = formData.get('pickupTime') as string;
    const dropTime = formData.get('dropTime') as string;

    if (!stopName || !pickupTime || !dropTime) {
      toast.error('All stop fields are required');
      return;
    }

    const newStop: Stop = { stopName, arrivalTime: pickupTime, dropTime };
    setLocalStops([...localStops, newStop]);
    form.reset();
  };

  // Action: Remove local stop
  const handleRemoveLocalStop = (index: number) => {
    const updated = localStops.filter((_, idx) => idx !== index);
    setLocalStops(updated);
  };

  // Action: Save stops to DB
  const handleSaveStops = async () => {
    if (!stopsModal.route) return;
    setLoading(true);
    try {
      const updatedRoute: Route = {
        ...stopsModal.route,
        stops: localStops,
      };
      await transportApi.updateRoute(updatedRoute);
      toast.success('Route stops saved successfully');
      setStopsModal({ open: false, route: null });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Setup stop list selection when route option changes in Student Allocation

  // Filter lists based on search
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.driverAssigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.routeAssigned.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.assignedRoute.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.phone.includes(searchTerm);
    const matchesStatus = statusFilter === '' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRoutes = routes.filter((r) => {
    return r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.startingPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
           r.destination.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVehicle = vehicleFilter === '' || s.bus === vehicleFilter;
    const matchesRoute = routeFilter === '' || s.route === routeFilter;
    return matchesSearch && matchesVehicle && matchesRoute;
  });

  // Attendance filter
  const filteredAttendance = attendance.filter((a) => {
    const matchesDate = a.date === attendanceDate;
    const matchesBus = attendanceBus === '' || a.bus === attendanceBus;
    const matchesRoute = attendanceRoute === '' || a.route === attendanceRoute;
    return matchesDate && matchesBus && matchesRoute;
  });

  // Calculate active transport counts
  const totalVehiclesCount = vehicles.length;
  const totalDriversCount = drivers.length;
  const totalRoutesCount = routes.length;
  const allocatedStudentsCount = students.filter((s) => s.bus !== 'None').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'Under Maintenance').length;
  const notificationsCount = notifications.length;

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${confirmDelete.type} (${confirmDelete.id})? This will automatically de-allocate all associated routes and drivers.`}
        onConfirm={executeDeletion}
        onCancel={() => setConfirmDelete({ open: false, type: '', id: '' })}
      />

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary"><Bus /></div>
              <div className="stat-details">
                <span className="stat-label">Total Vehicles</span>
                <span className="stat-value">{totalVehiclesCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success"><Users /></div>
              <div className="stat-details">
                <span className="stat-label">Total Drivers</span>
                <span className="stat-value">{totalDriversCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}><MapPin size={24} /></div>
              <div className="stat-details">
                <span className="stat-label">Active Routes</span>
                <span className="stat-value">{totalRoutesCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info"><ClipboardList /></div>
              <div className="stat-details">
                <span className="stat-label">Allocated Students</span>
                <span className="stat-value">{allocatedStudentsCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger"><AlertCircle /></div>
              <div className="stat-details">
                <span className="stat-label">In Maintenance</span>
                <span className="stat-value">{maintenanceCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon accent"><Bell /></div>
              <div className="stat-details">
                <span className="stat-label">Announcements</span>
                <span className="stat-value">{notificationsCount}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <RefreshCw size={18} style={{ marginRight: '6px' }} />
                <span>Recent Transport Operations & Activity Feed</span>
              </h2>
              <button className="btn-add" onClick={fetchData} style={{ padding: '8px 12px' }}>
                Refresh Feed
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Fleet Operations Greenlit</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>TODAY</span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569' }}>Both the North Route and South-East Route fleets have started their morning shifts. GPS connectivity is fully operational.</p>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Weekly Maintenance Scheduled</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>YESTERDAY</span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569' }}>Vehicle KA-51-AB-9999 has been logged for scheduled maintenance on July 2. No replacement vehicles needed.</p>
              </div>

              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>New Stop Addition Completed</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>3 DAYS AGO</span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569' }}>Added stop 'Manyata Tech Park' to North Route. Assigned timings: 07:45 AM arrival, 04:35 PM departure.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── VEHICLE MANAGEMENT TAB ── */}
      {activeTab === 'vehicles' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by vehicle model, plate, or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-group">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button 
                className="btn-add"
                onClick={() => setModalOpen({ open: true, type: 'vehicle', mode: 'add' })}
              >
                <Plus size={18} />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle Number</th>
                  <th>Model / Model Year</th>
                  <th>Reg Number</th>
                  <th>Seat Capacity</th>
                  <th>Assigned Driver</th>
                  <th>Assigned Route</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No vehicles matching the filters were found.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((v) => (
                    <tr key={v.vehicleNumber}>
                      <td style={{ fontWeight: 700 }}>{v.vehicleNumber}</td>
                      <td>{v.vehicleModel}</td>
                      <td>{v.registrationNumber}</td>
                      <td style={{ fontWeight: 600 }}>{v.seatingCapacity} Seats</td>
                      <td style={{ fontWeight: 500 }}>{v.driverAssigned}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{v.routeAssigned}</td>
                      <td>
                        <span className={`badge ${v.status}`}>{v.status}</span>
                      </td>
                      <td>
                        <div className="btn-action-group">
                          <button 
                            className="btn-icon edit"
                            onClick={() => setModalOpen({ open: true, type: 'vehicle', mode: 'edit', data: v })}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => triggerDelete('vehicle', v.vehicleNumber)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Vehicle Form Modal */}
          {modalOpen.open && modalOpen.type === 'vehicle' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{modalOpen.mode === 'add' ? 'Register New Vehicle' : 'Modify Vehicle Details'}</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleVehicleSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Vehicle Number</label>
                        <input
                          name="vehicleNumber"
                          type="text"
                          className="form-input"
                          placeholder="e.g. KA-53-F-1234"
                          defaultValue={modalOpen.data?.vehicleNumber || ''}
                          readOnly={modalOpen.mode === 'edit'}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Registration Number</label>
                        <input
                          name="registrationNumber"
                          type="text"
                          className="form-input"
                          placeholder="e.g. REG88762"
                          defaultValue={modalOpen.data?.registrationNumber || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Model Name</label>
                        <input
                          name="vehicleModel"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Tata Winger 15-Seater"
                          defaultValue={modalOpen.data?.vehicleModel || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Seating Capacity</label>
                        <input
                          name="seatingCapacity"
                          type="number"
                          className="form-input"
                          placeholder="e.g. 15"
                          defaultValue={modalOpen.data?.seatingCapacity || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign Driver</label>
                        <select name="driverAssigned" className="form-select" defaultValue={modalOpen.data?.driverAssigned || 'None'}>
                          <option value="None">None</option>
                          {drivers.map((d) => (
                            <option key={d.employeeId} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign Route</label>
                        <select name="routeAssigned" className="form-select" defaultValue={modalOpen.data?.routeAssigned || 'None'}>
                          <option value="None">None</option>
                          {routes.map((r) => (
                            <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group form-group-full">
                        <label className="form-label">Status</label>
                        <select name="status" className="form-select" defaultValue={modalOpen.data?.status || 'Active'}>
                          <option value="Active">Active</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {modalOpen.mode === 'add' ? 'Register Vehicle' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── DRIVER MANAGEMENT TAB ── */}
      {activeTab === 'drivers' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search drivers by name, employee ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-group">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
              <button 
                className="btn-add"
                onClick={() => setModalOpen({ open: true, type: 'driver', mode: 'add' })}
              >
                <Plus size={18} />
                <span>Add Driver</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Driver Name</th>
                  <th>Employee ID</th>
                  <th>Phone Number</th>
                  <th>Assigned Vehicle</th>
                  <th>Assigned Route</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No drivers matching the search parameters were found.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((d) => (
                    <tr key={d.employeeId}>
                      <td style={{ fontWeight: 700 }}>{d.name}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{d.employeeId}</td>
                      <td>{d.phone}</td>
                      <td style={{ fontWeight: 600 }}>{d.assignedVehicle}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{d.assignedRoute}</td>
                      <td>
                        <span className={`badge ${d.status}`}>{d.status}</span>
                      </td>
                      <td>
                        <div className="btn-action-group">
                          <button 
                            className="btn-icon edit"
                            onClick={() => setModalOpen({ open: true, type: 'driver', mode: 'edit', data: d })}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => triggerDelete('driver', d.employeeId)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Driver Form Modal */}
          {modalOpen.open && modalOpen.type === 'driver' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{modalOpen.mode === 'add' ? 'Add Driver Record' : 'Modify Driver Profile'}</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleDriverSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Driver Name</label>
                        <input
                          name="name"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Manjunath Gowda"
                          defaultValue={modalOpen.data?.name || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Employee ID</label>
                        <input
                          name="employeeId"
                          type="text"
                          className="form-input"
                          placeholder="e.g. EMP-DRV-004"
                          defaultValue={modalOpen.data?.employeeId || ''}
                          readOnly={modalOpen.mode === 'edit'}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          name="phone"
                          type="text"
                          className="form-input"
                          placeholder="e.g. +91 99887 76655"
                          defaultValue={modalOpen.data?.phone || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign Vehicle</label>
                        <select name="assignedVehicle" className="form-select" defaultValue={modalOpen.data?.assignedVehicle || 'None'}>
                          <option value="None">None</option>
                          {vehicles.map((v) => (
                            <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign Route</label>
                        <select name="assignedRoute" className="form-select" defaultValue={modalOpen.data?.assignedRoute || 'None'}>
                          <option value="None">None</option>
                          {routes.map((r) => (
                            <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select name="status" className="form-select" defaultValue={modalOpen.data?.status || 'Active'}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {modalOpen.mode === 'add' ? 'Add Driver' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ROUTES MANAGEMENT TAB ── */}
      {activeTab === 'routes' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search routes by name, start point, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-group">
              <button 
                className="btn-add"
                onClick={() => setModalOpen({ open: true, type: 'route', mode: 'add' })}
              >
                <Plus size={18} />
                <span>Create Route</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Starting Point</th>
                  <th>Destination</th>
                  <th>Stops Count</th>
                  <th>Assigned Vehicle</th>
                  <th>Assigned Driver</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No routes registered in the system.
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((r) => (
                    <tr key={r.routeName}>
                      <td style={{ fontWeight: 700 }}>{r.routeName}</td>
                      <td>{r.startingPoint}</td>
                      <td>{r.destination}</td>
                      <td style={{ fontWeight: 600 }}>{r.stops.length} Stops</td>
                      <td style={{ fontWeight: 500 }}>{r.assignedVehicle}</td>
                      <td style={{ fontWeight: 500 }}>{r.assignedDriver}</td>
                      <td>
                        <div className="btn-action-group">
                          <button
                            className="btn-add"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={() => {
                              setStopsModal({ open: true, route: r });
                              setLocalStops([...r.stops]);
                            }}
                          >
                            Manage Stops
                          </button>
                          <button 
                            className="btn-icon edit"
                            onClick={() => setModalOpen({ open: true, type: 'route', mode: 'edit', data: r })}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => triggerDelete('route', r.routeName)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Route Form Modal */}
          {modalOpen.open && modalOpen.type === 'route' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>{modalOpen.mode === 'add' ? 'Create Transport Route' : 'Edit Route Details'}</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleRouteSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Route Name</label>
                        <input
                          name="routeName"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Route North"
                          defaultValue={modalOpen.data?.routeName || ''}
                          readOnly={modalOpen.mode === 'edit'}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Starting Point</label>
                        <input
                          name="startingPoint"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Transcend Campus"
                          defaultValue={modalOpen.data?.startingPoint || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Destination</label>
                        <input
                          name="destination"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Manyata / Hebbal"
                          defaultValue={modalOpen.data?.destination || ''}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assign Vehicle</label>
                        <select name="assignedVehicle" className="form-select" defaultValue={modalOpen.data?.assignedVehicle || 'None'}>
                          <option value="None">None</option>
                          {vehicles.map((v) => (
                            <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group form-group-full">
                        <label className="form-label">Assign Driver</label>
                        <select name="assignedDriver" className="form-select" defaultValue={modalOpen.data?.assignedDriver || 'None'}>
                          <option value="None">None</option>
                          {drivers.map((d) => (
                            <option key={d.employeeId} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {modalOpen.mode === 'add' ? 'Create Route' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── STUDENT TRANSPORT ALLOCATION TAB ── */}
      {activeTab === 'students' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <Search className="search-input-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search registered students by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-group">
              <select
                className="filter-select"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="">All Buses</option>
                {vehicles.map((v) => (
                  <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
              >
                <option value="">All Routes</option>
                {routes.map((r) => (
                  <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                ))}
              </select>
              <button 
                className="btn-add"
                onClick={() => setModalOpen({ open: true, type: 'student', mode: 'add' })}
              >
                <Plus size={18} />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table student-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Route</th>
                  <th>Bus Plate</th>
                  <th>Pickup Stop</th>
                  <th>Drop Stop</th>
                  <th>Parent Contact</th>
                  <th>Health & Medical Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No student records found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.studentId}>
                      <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{s.route === 'None' ? '-' : s.route}</td>
                      <td style={{ fontWeight: 600 }}>{s.bus === 'None' ? '-' : s.bus}</td>
                      <td>{s.pickupStop === 'None' ? '-' : s.pickupStop}</td>
                      <td>{s.dropStop === 'None' ? '-' : s.dropStop}</td>
                      <td>{s.parentContact}</td>
                      <td>
                        {s.healthRecord ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, width: 'fit-content' }}>
                            <Heart size={12} style={{ fill: '#ef4444', color: '#ef4444', flexShrink: 0 }} />
                            <span>{s.healthRecord}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>None</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-action-group student-actions">
                          <button
                            className="btn-add"
                            onClick={() => {
                              setModalOpen({ open: true, type: 'allocate', mode: 'edit', data: s });
                              setSelectedAllocRoute(s.route || 'None');
                            }}
                          >
                            Assign / Edit
                          </button>
                          <button
                            className="btn-add"
                            onClick={() => {
                              setModalOpen({ open: true, type: 'student', mode: 'edit', data: s });
                            }}
                            style={{ background: '#f59e0b', color: '#fff', border: 'none', marginLeft: '6px' }}
                          >
                            Edit Profile
                          </button>
                          {s.bus !== 'None' && (
                            <button
                              className="btn-danger"
                              onClick={() => handleDeallocateStudent(s.studentId)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Allocation form modal */}
          {modalOpen.open && modalOpen.type === 'allocate' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Transport Allocation: {modalOpen.data?.studentName}</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAllocationSubmit}>
                  <div className="modal-body">
                    <input type="hidden" name="studentId" value={modalOpen.data?.studentId} />
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Select Route</label>
                        <select 
                          name="route" 
                          className="form-select" 
                          defaultValue={modalOpen.data?.route || 'None'}
                          onChange={(e) => setSelectedAllocRoute(e.target.value)}
                        >
                          <option value="None">None</option>
                          {routes.map((r) => (
                            <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Select Bus</label>
                        <select name="bus" className="form-select" defaultValue={modalOpen.data?.bus || 'None'}>
                          <option value="None">None</option>
                          {vehicles.filter((v) => v.status === 'Active').map((v) => (
                            <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleModel})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pickup Stop</label>
                        <select name="pickupStop" className="form-select" defaultValue={modalOpen.data?.pickupStop || 'None'}>
                          <option value="None">None</option>
                          {routes.find((r) => r.routeName === selectedAllocRoute)?.stops.map((stop) => (
                            <option key={stop.stopName} value={stop.stopName}>{stop.stopName} ({stop.arrivalTime})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Drop Stop</label>
                        <select name="dropStop" className="form-select" defaultValue={modalOpen.data?.dropStop || 'None'}>
                          <option value="None">None</option>
                          {routes.find((r) => r.routeName === selectedAllocRoute)?.stops.map((stop) => (
                            <option key={stop.stopName} value={stop.stopName}>{stop.stopName} ({stop.dropTime})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Save Allocation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Student profile form modal */}
          {modalOpen.open && modalOpen.type === 'student' && (
            <div className="modal-overlay">
              <div className="modal" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h3>{modalOpen.mode === 'add' ? 'Register New Student Passenger' : 'Modify Student Passenger'}</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleStudentSubmit}>
                  <div className="modal-body">
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Student Name *</label>
                      <input
                        type="text"
                        name="studentName"
                        className="form-input"
                        required
                        defaultValue={modalOpen.data?.studentName || ''}
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Student ID *</label>
                      <input
                        type="text"
                        name="studentId"
                        className="form-input"
                        required
                        defaultValue={modalOpen.data?.studentId || ''}
                        readOnly={modalOpen.mode === 'edit'}
                        placeholder="e.g. 251P2474"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Parent Contact Number *</label>
                      <input
                        type="text"
                        name="parentContact"
                        className="form-input"
                        required
                        defaultValue={modalOpen.data?.parentContact || ''}
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Parent Email (Optional)</label>
                      <input
                        type="email"
                        name="parentEmail"
                        className="form-input"
                        defaultValue={modalOpen.data?.parentEmail || ''}
                        placeholder="e.g. parent@example.com"
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Assigned Route</label>
                      <select name="route" className="form-select" defaultValue={modalOpen.data?.route || 'None'}>
                        <option value="None">None (Unassigned)</option>
                        {routes.map((r) => (
                          <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Assigned Bus</label>
                      <select name="bus" className="form-select" defaultValue={modalOpen.data?.bus || 'None'}>
                        <option value="None">None (Unassigned)</option>
                        {vehicles.map((v) => (
                          <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber} - {v.vehicleModel}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Pickup Stop</label>
                      <input
                        type="text"
                        name="pickupStop"
                        className="form-input"
                        defaultValue={modalOpen.data?.pickupStop || 'None'}
                        placeholder="e.g. Sector 4 Gate"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Drop Stop</label>
                      <input
                        type="text"
                        name="dropStop"
                        className="form-input"
                        defaultValue={modalOpen.data?.dropStop || 'None'}
                        placeholder="e.g. Sector 4 Gate"
                      />
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {modalOpen.mode === 'add' ? 'Register Student' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── HEALTH ALERTS / MEDICAL BOARD TAB ── */}
      {activeTab === 'health' && (
        <>
          <div className="search-filter-container">
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                <span>Student Health Records</span>
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                List of student users with registered health conditions.
              </p>
            </div>
            <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Assigned Route</th>
                  <th>Assigned Bus</th>
                  <th>Pickup Stop</th>
                  <th>Drop Stop</th>
                  <th>Parent Contact</th>
                  <th>Medical Records & Health Complications</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const complications = students.filter(
                    (s) => s.healthRecord && s.healthRecord.trim() !== '' && s.healthRecord.toLowerCase() !== 'none'
                  );
                  const filtered = complications.filter(
                    (s) =>
                      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                          No students found with active health complications matching search.
                        </td>
                      </tr>
                    );
                  }

                  return filtered.map((s) => (
                    <tr key={s.studentId}>
                      <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.studentId}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{s.route === 'None' ? '-' : s.route}</td>
                      <td style={{ fontWeight: 600 }}>{s.bus === 'None' ? '-' : s.bus}</td>
                      <td>{s.pickupStop === 'None' ? '-' : s.pickupStop}</td>
                      <td>{s.dropStop === 'None' ? '-' : s.dropStop}</td>
                      <td>{s.parentContact}</td>
                      <td style={{ color: '#991b1b', fontWeight: 600 }}>
                        {s.healthRecord}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ATTENDANCE MANAGEMENT TAB ── */}
      {activeTab === 'attendance' && (
        <>
          <div className="search-filter-container">
            <div className="filters-group" style={{ flexGrow: 1, justifyContent: 'flex-start' }}>
              <div className="form-group" style={{ minWidth: '150px' }}>
                <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Date Filter</label>
                <input
                  type="date"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ minWidth: '150px' }}>
                <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Route Filter</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={attendanceRoute}
                  onChange={(e) => setAttendanceRoute(e.target.value)}
                >
                  <option value="">All Routes</option>
                  {routes.map((r) => (
                    <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ minWidth: '150px' }}>
                <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Bus Filter</label>
                <select
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={attendanceBus}
                  onChange={(e) => setAttendanceBus(e.target.value)}
                >
                  <option value="">All Buses</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Route</th>
                  <th>Bus plate</th>
                  <th>Attendance status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No attendance records logged for the selected criteria on this date.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 700 }}>{a.studentName}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.studentId}</td>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{a.route || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{a.bus}</td>
                      <td>
                        <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
                        {a.dropOffTime && a.status !== 'Absent' && (
                          <span style={{ display: 'block', fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>
                            Drop-off: {a.dropOffTime}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ANNOUNCEMENTS / NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <>
          <div className="search-filter-container" style={{ justifyContent: 'flex-end' }}>
            <button
              className="btn-add"
              onClick={() => setModalOpen({ open: true, type: 'announcement', mode: 'add' })}
            >
              <Plus size={18} />
              <span>Broadcast Announcement</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {notifications.length === 0 ? (
              <div className="dashboard-panel" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No announcements broadcasted yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="dashboard-panel" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{notif.title}</h3>
                      <span className="badge warning" style={{ marginTop: '6px', fontSize: '10px', textTransform: 'uppercase' }}>
                        {notif.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{notif.date}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                    Sent By: {notif.sentBy}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Announcement Form Modal */}
          {modalOpen.open && modalOpen.type === 'announcement' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Broadcast Announcement to Parents</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAnnouncementSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group form-group-full">
                        <label className="form-label">Announcement Title</label>
                        <input
                          name="title"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Route North Morning Delay"
                        />
                      </div>
                      <div className="form-group form-group-full">
                        <label className="form-label">Category</label>
                        <select name="category" className="form-select">
                          <option value="Bus delay">Bus delay</option>
                          <option value="Route change">Route change</option>
                          <option value="Vehicle maintenance">Vehicle maintenance</option>
                          <option value="Holiday notification">Holiday notification</option>
                          <option value="Emergency announcement">Emergency announcement</option>
                        </select>
                      </div>
                      <div className="form-group form-group-full">
                        <label className="form-label">Announcement Description</label>
                        <textarea
                          name="message"
                          className="form-textarea"
                          placeholder="Provide description for the parents..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: '', mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Broadcast Alert
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stops Management Modal */}
          {stopsModal.open && stopsModal.route && (
            <div className="modal-overlay">
              <div className="modal" style={{ maxWidth: '650px', width: '100%' }}>
                <div className="modal-header">
                  <h3>Manage Stops: {stopsModal.route.routeName}</h3>
                  <button className="modal-close" onClick={() => setStopsModal({ open: false, route: null })}>
                    <X size={18} />
                  </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Add Stop Form */}
                  <form onSubmit={handleAddLocalStop} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Add Stop</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Stop Name</label>
                        <input name="stopName" type="text" className="form-input" placeholder="e.g. Manyata Tech Park" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pickup Time</label>
                        <input name="pickupTime" type="text" className="form-input" placeholder="e.g. 07:45 AM" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Drop Time</label>
                        <input name="dropTime" type="text" className="form-input" placeholder="e.g. 04:35 PM" required />
                      </div>
                      <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn-add" style={{ width: '100%', height: '42px', justifyContent: 'center' }}>
                          <Plus size={16} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Stops List */}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Current Stops Sequence</h4>
                    {localStops.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                        No stops configured for this route yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                        {localStops.map((stop, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#e2e8f0', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {idx + 1}
                              </span>
                              <div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{stop.stopName}</span>
                                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '12px' }}>
                                  Pickup: {stop.arrivalTime} | Drop: {stop.dropTime}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn-icon delete"
                              onClick={() => handleRemoveLocalStop(idx)}
                              style={{ padding: '4px' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                  <button type="button" className="btn-cancel" onClick={() => setStopsModal({ open: false, route: null })}>
                    Cancel
                  </button>
                  <button type="button" className="btn-submit" onClick={handleSaveStops}>
                    Save Config
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default TransportHeadDashboard;
