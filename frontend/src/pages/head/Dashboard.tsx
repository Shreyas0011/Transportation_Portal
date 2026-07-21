// src/pages/head/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Bus, Users, ClipboardList, UserCheck, Search, Plus, 
  Edit, Trash2, AlertCircle, RefreshCw, X, MapPin, Shield, Upload
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { BulkStudentUploadModal } from '../../components/BulkStudentUploadModal';
import { AdminNotifications } from '../admin/AdminNotifications';
import type { Vehicle, Driver, Student, Attendance, Notification, Route, Stop, FastagLog, SafetyAlert } from '../../utils/db';

interface DashboardProps {
  activeTab: string;
  user: any;
}

export const TransportHeadDashboard: React.FC<DashboardProps> = ({ activeTab, user }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Database States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fastag & Safety Telematics States
  const [fastagLogs, setFastagLogs] = useState<FastagLog[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [selectedTelematicsVehicle, setSelectedTelematicsVehicle] = useState<string>('');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  
  // Attendance Filter States
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceBus, setAttendanceBus] = useState('');
  const [attendanceRoute, setAttendanceRoute] = useState('');
  const [viewDiscrepanciesOnly, setViewDiscrepanciesOnly] = useState(false);

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
  const [isBulkStudentModalOpen, setIsBulkStudentModalOpen] = useState(false);

  // Manage Stops States
  const [stopsModal, setStopsModal] = useState<{ open: boolean; route: Route | null }>({
    open: false,
    route: null
  });
  const [localStops, setLocalStops] = useState<Stop[]>([]);

  // Selected Route state during student allocation form reactiveness
  const [selectedAllocRoute, setSelectedAllocRoute] = useState<string>('None');
  const [selectedAllocBus, setSelectedAllocBus] = useState<string>('None');
  const [selectedPickupStop, setSelectedPickupStop] = useState<string>('None');
  const [selectedDropStop, setSelectedDropStop] = useState<string>('None');

  // Discrepancy warning modal state
  const [warningModal, setWarningModal] = useState<{ open: boolean; recordId: string; studentName: string } | null>(null);
  const [warningNote, setWarningNote] = useState('');

  // Resolve discrepancy or warning logic
  const handleUpdateDiscrepancy = async (recordId: string, action: 'warn' | 'resolve', note?: string) => {
    setLoading(true);
    try {
      // Refresh current attendance list first to ensure no stale data overwrite
      const latestAttendance = await transportApi.getAttendance();
      const recIndex = latestAttendance.findIndex((r) => r.id === recordId);
      if (recIndex === -1) {
        toast.error('Attendance record not found.');
        setLoading(false);
        return;
      }

      const updatedRec = { ...latestAttendance[recIndex] };
      if (action === 'warn') {
        updatedRec.accountabilityStatus = 'Warned';
        updatedRec.accountabilityNote = note || 'Failure to board after declaring present.';
        
        // Push warning notice to announcement feed
        await transportApi.addNotification({
          title: `Transit Notice: Boarding Discrepancy Alert (${updatedRec.studentName})`,
          category: 'Emergency announcement',
          message: `Official Notice: Student ${updatedRec.studentName} (${updatedRec.studentId}) was logged as 'Present' by parent, but failed to board vehicle ${updatedRec.bus}.\n\nOffice Note: ${updatedRec.accountabilityNote}`,
          sentBy: `${user.name} (Transport Head)`,
        });
      } else {
        updatedRec.accountabilityStatus = 'Resolved';
        updatedRec.accountabilityNote = note || 'Resolved & excused by operator control.';
      }

      await transportApi.saveAttendance(updatedRec);
      toast.success(`Discrepancy ${action === 'warn' ? 'Official Warning Dispatched' : 'Resolved & Excused'}`);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to update accountability record');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFastagScan = async (vNum: string, gate: string, dir: 'Entry' | 'Exit') => {
    setLoading(true);
    try {
      await transportApi.addFastagLog({
        vehicleNumber: vNum,
        gateName: gate,
        direction: dir,
        status: 'Valid'
      });
      toast.success(`Fastag ${dir} Scan Logged successfully for ${vNum}`);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to trigger Fastag scan simulation.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSafetyAlert = async (alertId: string) => {
    setLoading(true);
    try {
      await transportApi.resolveSafetyAlert(alertId);
      toast.success('Safety Alert resolved successfully.');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to resolve safety alert.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, dData, sData, aData, nData, rData, ftData, saData] = await Promise.all([
        transportApi.getVehicles(),
        transportApi.getDrivers(),
        transportApi.getStudents(),
        transportApi.getAttendance(),
        transportApi.getNotifications(),
        transportApi.getRoutes(),
        transportApi.getFastagLogs(),
        transportApi.getSafetyAlerts(),
      ]);
      setVehicles(vData);
      setDrivers(dData);
      setStudents(sData);
      setAttendance(aData);
      setNotifications(nData);
      setRoutes(rData);
      setFastagLogs(ftData);
      setSafetyAlerts(saData);

      if (vData.length > 0 && !selectedTelematicsVehicle) {
        setSelectedTelematicsVehicle(vData[0].vehicleNumber);
      }
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
    setViewDiscrepanciesOnly(false);
  }, [activeTab]);

  // Dashcam Canvas road animation effect
  useEffect(() => {
    if (activeTab !== 'telematics' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let offset = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Asphalt
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Horizon line
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, 50);
      
      // Sky Sunset Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 50);
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(1, '#312e81');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 50);
      
      const centerX = canvas.width / 2;
      const horizonY = 50;
      
      // Draw road borders
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      
      // Left border
      ctx.beginPath();
      ctx.moveTo(centerX - 10, horizonY);
      ctx.lineTo(20, canvas.height);
      ctx.stroke();
      
      // Right border
      ctx.beginPath();
      ctx.moveTo(centerX + 10, horizonY);
      ctx.lineTo(canvas.width - 20, canvas.height);
      ctx.stroke();
      
      // Lane markings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 18]);
      ctx.lineDashOffset = -offset;
      
      ctx.beginPath();
      ctx.moveTo(centerX, horizonY);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Hills background
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(centerX - 10, horizonY);
      ctx.lineTo(0, horizonY + 15);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(canvas.width, horizonY);
      ctx.lineTo(centerX + 10, horizonY);
      ctx.lineTo(canvas.width, horizonY + 15);
      ctx.fill();
      
      // HUD Overlay Panel
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(10, 10, 140, 75);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, 140, 75);
      
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`CAM-01: FRONT ROAD`, 15, 22);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      const selectedVehicleRecord = vehicles.find(v => v.vehicleNumber === selectedTelematicsVehicle);
      const currentSpeed = selectedVehicleRecord ? (selectedVehicleRecord.status === 'Active' ? '48 km/h' : '0 km/h') : '0 km/h';
      ctx.fillText(`VEHICLE : ${selectedTelematicsVehicle || 'None'}`, 15, 34);
      ctx.fillText(`SPEED   : ${currentSpeed}`, 15, 44);
      ctx.fillText(`ROUTE   : ${selectedVehicleRecord?.routeAssigned || 'None'}`, 15, 54);
      ctx.fillText(`GPS     : 12.9716, 77.5946`, 15, 64);
      ctx.fillText(`STATUS  : TELEMETRY OK`, 15, 74);
      
      // REC blinking dot
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(canvas.width - 20, 20, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('REC', canvas.width - 42, 23);
      }
      
      offset = (offset + 1.8) % 30;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeTab, selectedTelematicsVehicle, vehicles]);

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
    const matchesDiscrepancy = !viewDiscrepanciesOnly || a.status === 'No-Show';
    return matchesDate && matchesBus && matchesRoute && matchesDiscrepancy;
  });

  // Calculate active transport counts
  const totalVehiclesCount = vehicles.length;
  const totalDriversCount = drivers.length;
  const totalRoutesCount = routes.length;
  const allocatedStudentsCount = students.filter((s) => s.bus !== 'None').length;

  // --- PREMIUM ANALYTICS & ACCOUNTABILITY CALCULATIONS ---
  const todayStr = new Date().toISOString().split('T')[0];
  
  // All logged attendance records for today
  const todayAttendance = attendance.filter((a) => a.date === todayStr);

  // No-Show discrepancy records (marked present by parent but driver verified as did not board)
  const noShowRecords = todayAttendance.filter((a) => a.status === 'No-Show');
  const activeNoShows = noShowRecords.filter((a) => a.accountabilityStatus !== 'Resolved');

  // Fleet capacity & utilization
  const totalActiveCapacity = vehicles
    .filter((v) => v.status === 'Active')
    .reduce((sum, v) => sum + v.seatingCapacity, 0);
  const fleetUtilizationRate = totalActiveCapacity > 0 
    ? Math.round((allocatedStudentsCount / totalActiveCapacity) * 100) 
    : 0;

  // Boarding funnel breakdown counts
  const parentPresentCount = todayAttendance.filter((a) => a.parentDeclaration === 'Present').length;
  const parentAbsentCount = todayAttendance.filter((a) => a.parentDeclaration === 'Absent').length;
  const confirmedBoardedCount = todayAttendance.filter((a) => a.status === 'Boarded' || a.status === 'Dropped').length;
  
  // Boarding accuracy (Accountability score)
  const boardingAccuracyRate = parentPresentCount > 0 
    ? Math.round(((parentPresentCount - noShowRecords.length) / parentPresentCount) * 100)
    : 100;

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

      {/* WARNING NOTE CUSTOM MODAL FOR ACCOUNTABILITY DISPATCH */}
      {warningModal?.open && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Issue Boarding Discrepancy Notice</h3>
              <button 
                className="modal-close" 
                onClick={() => {
                  setWarningModal(null);
                  setWarningNote('');
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                You are dispatching an official warning notice to the parents of <strong>{warningModal.studentName}</strong> due to a verified transit no-show today.
              </p>
              <div className="form-group form-group-full">
                <label className="form-label">Warning Reason / Directive Note</label>
                <textarea
                  className="form-textarea"
                  value={warningNote}
                  onChange={(e) => setWarningNote(e.target.value)}
                  placeholder="e.g. Ward did not board the bus despite parent present declaration. Please coordinate boarding changes in advance."
                  style={{ minHeight: '90px' }}
                />
              </div>
            </div>
            <div className="form-actions" style={{ padding: '0 24px 24px' }}>
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => {
                  setWarningModal(null);
                  setWarningNote('');
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-submit"
                onClick={() => {
                  handleUpdateDiscrepancy(warningModal.recordId, 'warn', warningNote);
                  setWarningModal(null);
                  setWarningNote('');
                }}
              >
                Dispatch Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {/* Visual Dashboard Highlights */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary"><Bus /></div>
              <div className="stat-details">
                <span className="stat-label">Total Vehicles</span>
                <span className="stat-value">{totalVehiclesCount} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>({vehicles.filter(v => v.status === 'Active').length} Active)</span></span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Users /></div>
              <div className="stat-details">
                <span className="stat-label">Active Drivers</span>
                <span className="stat-value">{totalDriversCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><MapPin size={24} /></div>
              <div className="stat-details">
                <span className="stat-label">Active Routes</span>
                <span className="stat-value">{totalRoutesCount}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}><ClipboardList /></div>
              <div className="stat-details">
                <span className="stat-label">Fleet Load Rate</span>
                <span className="stat-value">{fleetUtilizationRate}% <span style={{ fontSize: '12px', fontWeight: 600, color: '#a1a1aa' }}>({allocatedStudentsCount} / {totalActiveCapacity} seats)</span></span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}><AlertCircle /></div>
              <div className="stat-details">
                <span className="stat-label">No-Show Alerts</span>
                <span className="stat-value" style={{ color: activeNoShows.length > 0 ? '#ef4444' : 'inherit' }}>
                  {activeNoShows.length} <span style={{ fontSize: '11px', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase' }}>{activeNoShows.length > 0 ? 'Action Reqd' : ''}</span>
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon accent" style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}><UserCheck /></div>
              <div className="stat-details">
                <span className="stat-label">Boarding Accuracy</span>
                <span className="stat-value" style={{ color: boardingAccuracyRate < 90 ? '#ca8a04' : '#10b981' }}>{boardingAccuracyRate}%</span>
              </div>
            </div>
          </div>

          {/* Today's Transit Funnel Visual */}
          <div className="dashboard-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} style={{ color: '#2563eb' }} />
              <span>Today's Transit Boarding & Verification Funnel</span>
            </h3>
            
            <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '16px' }}>
              {/* Confirmed Boarded */}
              {confirmedBoardedCount > 0 && (
                <div 
                  style={{ width: `${(confirmedBoardedCount / (allocatedStudentsCount || 1)) * 100}%`, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                  title={`Boarded: ${confirmedBoardedCount}`}
                >
                  {confirmedBoardedCount} Boarded
                </div>
              )}
              {/* Declared but Pending Driver Verification */}
              {Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecords.length) > 0 && (
                <div 
                  style={{ width: `${(Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecords.length) / (allocatedStudentsCount || 1)) * 100}%`, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                  title={`Declared Present, Pending Boarding: ${Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecords.length)}`}
                >
                  {Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecords.length)} Pending
                </div>
              )}
              {/* Verified No-Shows */}
              {noShowRecords.length > 0 && (
                <div 
                  style={{ width: `${(noShowRecords.length / (allocatedStudentsCount || 1)) * 100}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                  title={`No-Shows (Parents marked present, failed to board): ${noShowRecords.length}`}
                >
                  {noShowRecords.length} No-Shows
                </div>
              )}
              {/* Parents Declared Absents */}
              {parentAbsentCount > 0 && (
                <div 
                  style={{ width: `${(parentAbsentCount / (allocatedStudentsCount || 1)) * 100}%`, background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                  title={`Parent Excused Absents: ${parentAbsentCount}`}
                >
                  {parentAbsentCount} Absents
                </div>
              )}
              {/* Remaining / Undeclared */}
              {Math.max(0, allocatedStudentsCount - parentPresentCount - parentAbsentCount) > 0 && (
                <div 
                  style={{ width: `${(Math.max(0, allocatedStudentsCount - parentPresentCount - parentAbsentCount) / (allocatedStudentsCount || 1)) * 100}%`, background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '11px', fontWeight: 700 }}
                  title={`Not Declared: ${Math.max(0, allocatedStudentsCount - parentPresentCount - parentAbsentCount)}`}
                >
                  {Math.max(0, allocatedStudentsCount - parentPresentCount - parentAbsentCount)} Not Marked
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'block' }} />
                <span style={{ fontSize: '13px', color: '#475569' }}><strong>{confirmedBoardedCount}</strong> Boarded / Dropped</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
                <span style={{ fontSize: '13px', color: '#475569' }}><strong>{Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecords.length)}</strong> Declared (Not Boarded)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'block' }} />
                <span style={{ fontSize: '13px', color: '#475569' }}><strong>{noShowRecords.length}</strong> Unexcused No-Shows</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#64748b', display: 'block' }} />
                <span style={{ fontSize: '13px', color: '#475569' }}><strong>{parentAbsentCount}</strong> Parent Logged Absents</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMN ANALYTICS VIEW */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
            
            {/* COLUMN 1: LIVE BOARDING DISCREPANCIES LOG */}
            <div className="dashboard-panel" style={{ height: '100%', margin: 0 }}>
              <div className="panel-header">
                <h2 className="panel-title" style={{ color: '#ef4444' }}>
                  <AlertCircle size={18} style={{ color: '#ef4444' }} />
                  <span>Verified Boarding Discrepancies & Accountability Alerts</span>
                </h2>
                <span className="badge danger" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  {activeNoShows.length} Pending Actions
                </span>
              </div>

              <div className="table-container" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Student Details</th>
                      <th>Transit Details</th>
                      <th>Accountability Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noShowRecords.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontStyle: 'italic' }}>
                          ✓ No boarding discrepancies verified today. All present students boarded successfully.
                        </td>
                      </tr>
                    ) : (
                      noShowRecords.map((rec) => {
                        const sRecord = students.find(s => s.studentId === rec.studentId);
                        const parentPhone = sRecord?.parentContact || 'Contact Not Found';
                        const accStatus = rec.accountabilityStatus || 'Pending';
                        
                        return (
                          <tr key={rec.id} style={{ borderLeft: accStatus === 'Pending' ? '4px solid #f59e0b' : accStatus === 'Warned' ? '4px solid #f97316' : '4px solid #10b981' }}>
                            <td>
                              <strong style={{ display: 'block', fontSize: '13.5px', color: '#0f172a' }}>{rec.studentName}</strong>
                              <span style={{ fontSize: '11.5px', color: '#64748b', fontFamily: 'monospace' }}>ID: {rec.studentId} · Mob: {parentPhone}</span>
                            </td>
                            <td>
                              <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>{rec.route}</span>
                              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Bus: {rec.bus}</span>
                            </td>
                            <td>
                              <span className={`badge ${
                                accStatus === 'Pending' ? 'warning'
                                : accStatus === 'Warned' ? 'danger'
                                : 'active'
                              }`} style={{ fontSize: '11px' }}>
                                {accStatus === 'Pending' ? 'Pending Inquiry'
                                 : accStatus === 'Warned' ? 'Warning Notice Dispatched'
                                 : 'Resolved & Excused'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-action-group" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                                {accStatus === 'Pending' && (
                                  <button
                                    className="btn-add"
                                    style={{ padding: '6px 10px', fontSize: '11px', background: '#f97316', borderColor: '#f97316', color: '#fff' }}
                                    onClick={() => setWarningModal({ open: true, recordId: rec.id, studentName: rec.studentName })}
                                  >
                                    Warn Parent
                                  </button>
                                )}
                                {(accStatus === 'Pending' || accStatus === 'Warned') && (
                                  <button
                                    className="btn-add"
                                    style={{ padding: '6px 10px', fontSize: '11px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                                    onClick={() => handleUpdateDiscrepancy(rec.id, 'resolve')}
                                  >
                                    Excuse / Resolve
                                  </button>
                                )}
                                {accStatus === 'Resolved' && (
                                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>Resolved ✓</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COLUMN 2: FLEET CAPACITY & UTILIZATION GRAPHICS */}
            <div className="dashboard-panel" style={{ height: '100%', margin: 0 }}>
              <div className="panel-header">
                <h2 className="panel-title">
                  <Bus size={18} style={{ color: '#2563eb' }} />
                  <span>Route Seats Occupancy & Load</span>
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {routes.map((r) => {
                  const linkedBus = vehicles.find(v => v.vehicleNumber === r.assignedVehicle);
                  const busCapacity = linkedBus?.seatingCapacity || 0;
                  const allocatedCount = students.filter(s => s.route === r.routeName).length;
                  const percentage = busCapacity > 0 ? Math.min(100, Math.round((allocatedCount / busCapacity) * 100)) : 0;
                  
                  let loadColor = '#10b981'; // green
                  if (percentage > 90) loadColor = '#ef4444'; // overcapacity / red
                  else if (percentage > 70) loadColor = '#f59e0b'; // warning orange

                  return (
                    <div key={r.routeName} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>{r.routeName}</strong>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Plate: {r.assignedVehicle} · Driver: {r.assignedDriver}</span>
                        </div>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: loadColor }}>{allocatedCount} / {busCapacity} Seats ({percentage}%)</span>
                      </div>
                      
                      <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, background: loadColor, height: '100%', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }} />
                      </div>
                    </div>
                  );
                })}
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
              <button 
                className="btn-secondary"
                onClick={() => setIsBulkStudentModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: 600 }}
              >
                <Upload size={16} />
                <span>Upload CSV / Excel</span>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
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
                        <div className="btn-action-group student-actions">
                          <button
                            className="btn-add"
                            onClick={() => {
                              setModalOpen({ open: true, type: 'allocate', mode: 'edit', data: s });
                              setSelectedAllocRoute(s.route || 'None');
                              setSelectedAllocBus(s.bus || 'None');
                              setSelectedPickupStop(s.pickupStop || 'None');
                              setSelectedDropStop(s.dropStop || 'None');
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
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label">Select Route</label>
                        <select 
                          name="route" 
                          className="form-select" 
                          value={selectedAllocRoute}
                          onChange={(e) => {
                            const rVal = e.target.value;
                            setSelectedAllocRoute(rVal);
                            const linkedRoute = routes.find((r) => r.routeName === rVal);
                            if (linkedRoute) {
                              if (linkedRoute.assignedVehicle !== 'None') {
                                setSelectedAllocBus(linkedRoute.assignedVehicle);
                              } else {
                                setSelectedAllocBus('None');
                              }
                            } else {
                              setSelectedAllocBus('None');
                            }
                            setSelectedPickupStop('None');
                            setSelectedDropStop('None');
                          }}
                        >
                          <option value="None">None</option>
                          {routes.map((r) => (
                            <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label">Select Bus</label>
                        <select 
                          name="bus" 
                          className="form-select" 
                          value={selectedAllocBus}
                          onChange={(e) => setSelectedAllocBus(e.target.value)}
                        >
                          <option value="None">None</option>
                          {vehicles.filter((v) => v.status === 'Active').map((v) => (
                            <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber} ({v.vehicleModel})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label">Pickup Stop</label>
                        <select 
                          name="pickupStop" 
                          className="form-select" 
                          value={selectedPickupStop}
                          onChange={(e) => setSelectedPickupStop(e.target.value)}
                        >
                          <option value="None">None</option>
                          {routes.find((r) => r.routeName === selectedAllocRoute)?.stops.map((stop) => (
                            <option key={stop.stopName} value={stop.stopName}>{stop.stopName} ({stop.arrivalTime})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: '14px' }}>
                        <label className="form-label">Drop Stop</label>
                        <select 
                          name="dropStop" 
                          className="form-select" 
                          value={selectedDropStop}
                          onChange={(e) => setSelectedDropStop(e.target.value)}
                        >
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
        </>
      )}


      {/* ── ATTENDANCE MANAGEMENT TAB ── */}
      {activeTab === 'attendance' && (
        <>
          <div className="search-filter-container">
            <div className="filters-group" style={{ flexGrow: 1, justifyContent: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
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
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', minWidth: '180px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, paddingBottom: '8px' }}>
                  <input
                    type="checkbox"
                    checked={viewDiscrepanciesOnly}
                    onChange={(e) => setViewDiscrepanciesOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>Discrepancies Only (No-Shows)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Route & Bus</th>
                  <th>Parent Declared</th>
                  <th>Driver Verified</th>
                  <th>Accountability Status</th>
                  <th style={{ textAlign: 'right' }}>Discrepancy Controls</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No attendance records logged for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((a) => {
                    const isNoShow = a.status === 'No-Show';
                    const parentDecl = a.parentDeclaration || (a.status === 'Absent' ? 'Absent' : 'Present');
                    const driverStat = a.status === 'Present' ? 'Pending' : a.status;
                    const accStatus = a.accountabilityStatus || 'Pending';

                    return (
                      <tr key={a.id} style={{ backgroundColor: isNoShow ? '#fff5f5' : 'inherit' }}>
                        <td style={{ fontWeight: 700 }}>{a.studentName}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.studentId}</td>
                        <td>
                          <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>{a.route || '-'}</span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Plate: {a.bus}</span>
                        </td>
                        <td>
                          <span className={`badge ${parentDecl === 'Absent' ? 'absent' : 'active'}`}>
                            {parentDecl}
                          </span>
                          {a.dropOffTime && parentDecl !== 'Absent' && (
                            <span style={{ display: 'block', fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '4px' }}>
                              Drop-off: {a.dropOffTime}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            driverStat === 'Absent' ? 'absent'
                            : driverStat === 'No-Show' ? 'danger'
                            : driverStat === 'Boarded' ? 'active'
                            : driverStat === 'Dropped' ? 'info'
                            : 'warning'
                          }`}>
                            {driverStat === 'Pending' ? 'Declared Present' : driverStat}
                          </span>
                        </td>
                        <td>
                          {isNoShow ? (
                            <span className={`badge ${
                              accStatus === 'Pending' ? 'warning'
                              : accStatus === 'Warned' ? 'danger'
                              : 'active'
                            }`} style={{ fontSize: '10.5px' }}>
                              {accStatus === 'Pending' ? 'Pending Inquiry'
                               : accStatus === 'Warned' ? 'Warning Dispatched'
                               : 'Resolved & Excused'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-action-group" style={{ justifyContent: 'flex-end', gap: '6px' }}>
                            {isNoShow && accStatus === 'Pending' && (
                              <button
                                type="button"
                                className="btn-add"
                                style={{ padding: '5px 10px', fontSize: '11px', background: '#f97316', borderColor: '#f97316', color: '#fff' }}
                                onClick={() => setWarningModal({ open: true, recordId: a.id, studentName: a.studentName })}
                              >
                                Warn Parent
                              </button>
                            )}
                            {isNoShow && (accStatus === 'Pending' || accStatus === 'Warned') && (
                              <button
                                type="button"
                                className="btn-add"
                                style={{ padding: '5px 10px', fontSize: '11px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                                onClick={() => handleUpdateDiscrepancy(a.id, 'resolve')}
                              >
                                Excuse
                              </button>
                            )}
                            {isNoShow && accStatus === 'Resolved' && (
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981' }}>Resolved ✓</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── FLEET TELEMATICS & SECURITY TAB ── */}
      {activeTab === 'telematics' && (
        <div className="parent-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* LEFT COLUMN: LIVE DASHCAM & CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Live Camera Grid */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: '#2563eb' }} />
                  <span>AI Dashcam Safety Streaming Feed</span>
                </h2>
                
                {/* Vehicle Selector */}
                <select
                  className="search-input"
                  style={{ width: '180px', padding: '6px 12px' }}
                  value={selectedTelematicsVehicle}
                  onChange={(e) => setSelectedTelematicsVehicle(e.target.value)}
                >
                  <option value="">Select Vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.vehicleNumber} value={v.vehicleNumber}>
                      {v.vehicleNumber} ({v.driverAssigned})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedTelematicsVehicle ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <Shield size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <h3>No Vehicle Selected</h3>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>Select an active fleet vehicle from the dropdown to initialize dashcam telematics feeds.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Streaming feeds */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Feed 1: Road View */}
                    <div style={{ background: '#0f172a', borderRadius: '12px', padding: '8px', border: '1px solid #334155', overflow: 'hidden', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, background: 'rgba(15, 23, 42, 0.75)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, fontFamily: 'monospace' }}>
                        CAM 01: FRONT VIEW
                      </span>
                      <canvas 
                        ref={canvasRef} 
                        width="320" 
                        height="180" 
                        style={{ width: '100%', height: '180px', background: '#1e293b', borderRadius: '8px', display: 'block' }} 
                      />
                    </div>

                    {/* Feed 2: Cabin View */}
                    <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '198px' }}>
                      <span style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, background: 'rgba(15, 23, 42, 0.75)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, fontFamily: 'monospace' }}>
                        CAM 02: CABIN SENSOR VIEW
                      </span>
                      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                        {/* Interactive Seating Layout Mock */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', background: 'rgba(51, 65, 85, 0.3)', padding: '12px', borderRadius: '8px' }}>
                          {/* Driver seat */}
                          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Driver Seat (Occupied)">
                            <span style={{ fontSize: '7px', color: '#fff', fontWeight: 900 }}>D</span>
                          </div>
                          <div style={{ width: '16px', height: '16px' }}></div> {/* gap */}
                          {/* Passenger seats */}
                          {[...Array(13)].map((_, idx) => {
                            const isOccupied = idx < 8; // mock 8 seats filled
                            return (
                              <div 
                                key={idx} 
                                style={{ width: '14px', height: '14px', borderRadius: '3px', background: isOccupied ? '#10b981' : '#64748b', border: '1px solid #cbd5e1' }}
                                title={isOccupied ? 'Occupied Seat' : 'Vacant Seat'}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        <span>Occupants: 9 / 15 Seats</span>
                        <span>Safety Belts: 100% OK</span>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Status Details */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>DRIVER IN CHARGE</span>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{drivers.find(d => d.assignedVehicle === selectedTelematicsVehicle)?.name || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>DRIVER ASSIST SAFETY STATUS</span>
                      <strong style={{ fontSize: '14px', color: safetyAlerts.some(a => a.vehicleNumber === selectedTelematicsVehicle && !a.resolved && a.severity === 'Critical') ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: safetyAlerts.some(a => a.vehicleNumber === selectedTelematicsVehicle && !a.resolved && a.severity === 'Critical') ? '#ef4444' : '#10b981' }}></span>
                        {safetyAlerts.some(a => a.vehicleNumber === selectedTelematicsVehicle && !a.resolved && a.severity === 'Critical') ? 'ATTENTION REQUIRED' : 'DRIVING SAFE'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>VEHICLE TELEMATICS CONNECTION</span>
                      <strong style={{ fontSize: '14px', color: vehicles.find(v => v.vehicleNumber === selectedTelematicsVehicle)?.status === 'Active' ? '#10b981' : '#64748b' }}>
                        {vehicles.find(v => v.vehicleNumber === selectedTelematicsVehicle)?.status === 'Active' ? 'LIVE TELEMETRY OK' : 'STANDBY'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fastag Scan simulation trigger card */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={18} style={{ color: '#eab308' }} />
                  <span>Interactive Fastag Gate Access Simulator</span>
                </h2>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const vNum = data.get('vehicleNumber') as string;
                  const gate = data.get('gateName') as string;
                  const dir = data.get('direction') as 'Entry' | 'Exit';
                  if (!vNum || !gate || !dir) return;
                  handleTriggerFastagScan(vNum, gate, dir);
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', alignItems: 'end' }}
              >
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>Select Bus</label>
                  <select name="vehicleNumber" className="search-input" style={{ width: '100%', height: '38px' }} required>
                    {vehicles.map((v) => (
                      <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>Gate Location</label>
                  <select name="gateName" className="search-input" style={{ width: '100%', height: '38px' }} required>
                    <option value="North Main Gate">North Main Gate</option>
                    <option value="South Gate 2">South Gate 2</option>
                    <option value="West Campus Gate">West Campus Gate</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>Scan Direction</label>
                  <select name="direction" className="search-input" style={{ width: '100%', height: '38px' }} required>
                    <option value="Entry">Entry (Entering Campus)</option>
                    <option value="Exit">Exit (Leaving Campus)</option>
                  </select>
                </div>
                <button type="submit" className="btn-add" style={{ height: '38px', justifyContent: 'center' }}>
                  Trigger Fastag Scan
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: ACCESS LOGS & SAFETY ALERTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Safety Alerts Log */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ color: '#ef4444' }} />
                  <span>AI Dashcam Safety Violations ({safetyAlerts.filter(a => !a.resolved).length})</span>
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }}>
                {safetyAlerts.filter(a => !a.resolved).length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No active safety warnings. All drivers compliant.</div>
                ) : (
                  safetyAlerts.filter(a => !a.resolved).map((alert) => (
                    <div 
                      key={alert.id} 
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fecdd3', background: alert.severity === 'Critical' ? '#fff1f2' : '#fffbeb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: alert.severity === 'Critical' ? '#e11d48' : '#d97706' }}>{alert.type}</span>
                          <span className={`badge ${alert.severity === 'Critical' ? 'danger' : 'warning'}`}>{alert.severity}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#475569' }}>Vehicle: <strong>{alert.vehicleNumber}</strong></span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <button 
                        onClick={() => handleResolveSafetyAlert(alert.id)}
                        className="modern-btn-secondary" 
                        style={{ fontSize: '10px', padding: '4px 8px', color: '#10b981', borderColor: '#10b981' }}
                      >
                        Resolve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fastag Access Gate History Log */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} style={{ color: '#10b981' }} />
                  <span>Campus Fastag Access History</span>
                </h2>
              </div>

              <div style={{ maxHeight: '310px', overflowY: 'auto' }}>
                <table className="roster-table" style={{ width: '100%', fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 12px' }}>Bus</th>
                      <th style={{ padding: '8px 12px' }}>Gate</th>
                      <th style={{ padding: '8px 12px' }}>Type</th>
                      <th style={{ padding: '8px 12px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fastagLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '16px' }}>No gate scans logged yet today.</td>
                      </tr>
                    ) : (
                      fastagLogs.map((log) => (
                        <tr key={log.id}>
                          <td style={{ padding: '8px 12px', fontWeight: 700 }}>{log.vehicleNumber}</td>
                          <td style={{ padding: '8px 12px' }}>{log.gateName}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span className={`badge ${log.direction === 'Entry' ? 'active' : 'inactive'}`}>
                              {log.direction === 'Entry' ? 'Campus Entry' : 'Campus Exit'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#64748b', fontSize: '10px' }}>
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENTS / NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <>
          {/* FCM Push Notification Panel */}
          <AdminNotifications />

          <div className="search-filter-container" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              className="btn-add"
              onClick={() => setModalOpen({ open: true, type: 'announcement', mode: 'add' })}
            >
              <Plus size={18} />
              <span>Broadcast In-App Announcement</span>
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
        </>
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

      {/* ── Bulk Student Upload Modal ─────────────────────────── */}
      <BulkStudentUploadModal
        isOpen={isBulkStudentModalOpen}
        onClose={() => setIsBulkStudentModalOpen(false)}
        onSuccess={(count) => {
          toast.success(`${count} student(s) imported successfully!`);
          fetchData();
        }}
      />
    </div>
  );
};
export default TransportHeadDashboard;
