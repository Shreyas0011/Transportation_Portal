// src/pages/superadmin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Shield, RefreshCw, ShieldAlert, PieChart, X, BarChart3, ClipboardList, UserCheck,
  Bus, Users, Upload
} from 'lucide-react';
import { transportApi } from '../../api/transportApi';
import { useToast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { BulkStudentUploadModal } from '../../components/BulkStudentUploadModal';
import { AdminNotifications } from '../admin/AdminNotifications';
import type { User, Vehicle, Route, Student, Attendance, FastagLog, SafetyAlert } from '../../utils/db';

interface SuperAdminDashboardProps {
  activeTab: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // States
  const [usersList, setUsersList] = useState<Omit<User, 'password'>[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [fastagLogs, setFastagLogs] = useState<FastagLog[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Attendance filter state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceBusFilter, setAttendanceBusFilter] = useState('');
  const [attendanceRouteFilter, setAttendanceRouteFilter] = useState('');

  // Dialog & Modal state
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; email: string }>({
    open: false,
    email: '',
  });

  const [modalOpen, setModalOpen] = useState<{ open: boolean; type: 'user'; email?: string }>({
    open: false,
    type: 'user',
  });

  // Role selections for parent mapping
  const [selectedRole, setSelectedRole] = useState<'Transport Head' | 'Parent' | 'Driver' | 'Super Admin'>('Parent');

  const [studentModalOpen, setStudentModalOpen] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: Student }>({
    open: false,
    mode: 'add'
  });
  const [isBulkStudentModalOpen, setIsBulkStudentModalOpen] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uData, vData, rData, sData, aData, ftData, saData] = await Promise.all([
        transportApi.getUsers(),
        transportApi.getVehicles(),
        transportApi.getRoutes(),
        transportApi.getStudents(),
        transportApi.getAttendance(),
        transportApi.getFastagLogs(),
        transportApi.getSafetyAlerts(),
      ]);
      setUsersList(uData);
      setVehicles(vData);
      setRoutes(rData);
      setStudents(sData);
      setAttendance(aData);
      setFastagLogs(ftData);
      setSafetyAlerts(saData);
    } catch (err: any) {
      toast.error('Failed to retrieve system database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  // Actions: User creation
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as User['role'];
    const employeeId = formData.get('employeeId') as string;
    const studentId = formData.get('studentId') as string;

    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }

    const payload: User = {
      name,
      email,
      role,
      isActive: true,
      employeeId: role !== 'Parent' ? employeeId : undefined,
      studentId: role === 'Parent' ? studentId : undefined,
    };

    setLoading(true);
    try {
      await transportApi.createUser(payload);
      toast.success(`User account for ${name} registered successfully`);
      setModalOpen({ open: false, type: 'user' });
      fetchAdminData();
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
      if (studentModalOpen.mode === 'add') {
        await transportApi.addStudent(payload);
        toast.success(`Student ${studentName} registered successfully`);
      } else {
        await transportApi.updateStudent(payload);
        toast.success(`Student ${studentName} details modified`);
      }
      setStudentModalOpen({ open: false, mode: 'add' });
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actions: Toggle status
  const handleToggleUserStatus = async (email: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      await transportApi.toggleUserStatus(email, !currentStatus);
      toast.success(`Account status for ${email} modified`);
      fetchAdminData();
    } catch (err: any) {
      toast.error('Failed to change user status');
    } finally {
      setLoading(false);
    }
  };

  // Actions: Deletion trigger
  const executeUserDelete = async () => {
    const email = confirmDelete.email;
    setConfirmDelete({ open: false, email: '' });
    setLoading(true);
    try {
      await transportApi.deleteUser(email);
      toast.success(`User ${email} deleted from database`);
      fetchAdminData();
    } catch (err: any) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Action: Hard reset database
  const executeReseed = () => {
    setLoading(true);
    localStorage.removeItem('transport_db_version');
    localStorage.removeItem('transport_users');
    localStorage.removeItem('transport_vehicles');
    localStorage.removeItem('transport_drivers');
    localStorage.removeItem('transport_routes');
    localStorage.removeItem('transport_students');
    localStorage.removeItem('transport_notifications');
    localStorage.removeItem('transport_attendance');
    
    toast.success('Database reseeded to defaults');
    setTimeout(() => {
      fetchAdminData();
      setLoading(false);
    }, 500);
  };

  const filteredUsers = usersList.filter((u) => {
    return u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           u.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- ANALYTICS CALCULATIONS ---
  // 1. Vehicle status counts
  const activeVehicles = vehicles.filter((v) => v.status === 'Active').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'Under Maintenance').length;
  const inactiveVehicles = vehicles.filter((v) => v.status === 'Inactive').length;
  const totalVehiclesCount = vehicles.length || 1; // avoid divide by zero

  // SVG pie/donut segments coordinates
  // Circle perimeter = 2 * PI * r = 2 * 3.14159 * 50 = 314
  const activePct = (activeVehicles / totalVehiclesCount) * 314;
  const maintPct = (maintenanceVehicles / totalVehiclesCount) * 314;
  const inactivePct = (inactiveVehicles / totalVehiclesCount) * 314;

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete the user account (${confirmDelete.email})? This action cannot be undone.`}
        onConfirm={executeUserDelete}
        onCancel={() => setConfirmDelete({ open: false, email: '' })}
      />

      {/* ── USER MANAGEMENT TAB ── */}
      {activeTab === 'users' && (
        <>
          <div className="search-filter-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-add"
              onClick={() => {
                setSelectedRole('Parent');
                setModalOpen({ open: true, type: 'user' });
              }}
            >
              <Plus size={18} />
              <span>Create User</span>
            </button>
          </div>

          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>User Profile Name</th>
                  <th>Registered Email</th>
                  <th>Assigned Role</th>
                  <th>Staff / Parent ID</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                      No user accounts found matching parameters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.email}>
                      <td style={{ fontWeight: 700 }}>{u.name}</td>
                      <td style={{ fontWeight: 500 }}>{u.email}</td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>
                        {u.role === 'Parent' ? u.studentId : u.employeeId || '-'}
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'Active' : 'Inactive'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-action-group">

                          <button
                            className={`btn-icon ${u.isActive ? 'delete' : 'edit'}`}
                            title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                            onClick={() => handleToggleUserStatus(u.email, u.isActive)}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            className="btn-icon delete"
                            title="Delete Account"
                            onClick={() => setConfirmDelete({ open: true, email: u.email })}
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

          {/* User Form Modal */}
          {modalOpen.open && modalOpen.type === 'user' && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Create User Account</h3>
                  <button className="modal-close" onClick={() => setModalOpen({ open: false, type: 'user' })}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleUserSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          name="name"
                          type="text"
                          className="form-input"
                          placeholder="e.g. Ramesh Nair"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          name="email"
                          type="email"
                          className="form-input"
                          placeholder="e.g. ramesh@transcend.org"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Assigned Role</label>
                        <select
                          name="role"
                          className="form-select"
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as any)}
                        >
                          <option value="Parent">Parent</option>
                          <option value="Driver">Driver</option>
                          <option value="Transport Head">Transport Head</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </div>

                      {/* Staff Specific Fields */}
                      {selectedRole !== 'Parent' && (
                        <div className="form-group form-group-full">
                          <label className="form-label">Employee ID</label>
                          <input
                            name="employeeId"
                            type="text"
                            className="form-input"
                            placeholder="e.g. EMP-DRV-101"
                          />
                        </div>
                      )}

                      {/* Parent Specific Fields */}
                      {selectedRole === 'Parent' && (
                        <div className="form-group form-group-full">
                          <label className="form-label">Linked Student ID</label>
                          <input
                            name="studentId"
                            type="text"
                            className="form-input"
                            placeholder="e.g. STU001"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setModalOpen({ open: false, type: 'user' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ANALYTICS DASHBOARD TAB ── */}
      {activeTab === 'analytics' && (() => {
        // Calculate counts
        const totalUsers = usersList.length;
        const totalVehicles = vehicles.length;
        const totalStudents = students.length;
        const allocatedCount = students.filter((s) => s.bus !== 'None').length;

        // Boarding funnel breakdown counts for today
        const todayStr = new Date().toISOString().split('T')[0];
        const todayAttendance = attendance.filter((a) => a.date === todayStr);
        const parentPresentCount = todayAttendance.filter((a) => a.parentDeclaration === 'Present').length;
        const confirmedBoardedCount = todayAttendance.filter((a) => a.status === 'Boarded' || a.status === 'Dropped').length;
        const noShowRecordsCount = todayAttendance.filter((a) => a.status === 'No-Show').length;
        const parentAbsentCount = todayAttendance.filter((a) => a.parentDeclaration === 'Absent').length;

        // Boarding accuracy (Accountability score)
        const boardingAccuracyRate = parentPresentCount > 0 
          ? Math.round(((parentPresentCount - noShowRecordsCount) / parentPresentCount) * 100)
          : 100;

        // Route utilization: students per route
        const routeUtilization = routes.map((r) => {
          const studentCount = students.filter((s) => s.route === r.routeName).length;
          return {
            routeName: r.routeName,
            count: studentCount,
          };
        });
        const maxRouteCount = Math.max(...routeUtilization.map((u) => u.count), 1);

        return (
          <>
            {/* Visual Stats Highlights */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon primary"><Users /></div>
                <div className="stat-details">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{totalUsers} <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Registered</span></span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon success" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Bus /></div>
                <div className="stat-details">
                  <span className="stat-label">Fleet Vehicles</span>
                  <span className="stat-value">{totalVehicles} <span style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>({activeVehicles} Active)</span></span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon warning" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><ClipboardList /></div>
                <div className="stat-details">
                  <span className="stat-label">Allocated Students</span>
                  <span className="stat-value">{allocatedCount} / {totalStudents}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accent" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Boarding Accuracy</span>
                  <span className="stat-value" style={{ color: boardingAccuracyRate < 90 ? '#f97316' : '#10b981' }}>{boardingAccuracyRate}%</span>
                </div>
              </div>
            </div>

            {/* Today's Transit Funnel Visual */}
            <div className="dashboard-panel" style={{ padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} style={{ color: '#2563eb' }} />
                <span>Today's Transit Boarding & Verification Funnel</span>
              </h3>
              
              <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '16px' }}>
                {confirmedBoardedCount > 0 && (
                  <div 
                    style={{ width: `${(confirmedBoardedCount / (allocatedCount || 1)) * 100}%`, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                    title={`Boarded: ${confirmedBoardedCount}`}
                  >
                    {confirmedBoardedCount} Boarded
                  </div>
                )}
                {Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecordsCount) > 0 && (
                  <div 
                    style={{ width: `${(Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecordsCount) / (allocatedCount || 1)) * 100}%`, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                    title={`Pending Boarding: ${Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecordsCount)}`}
                  >
                    {Math.max(0, parentPresentCount - confirmedBoardedCount - noShowRecordsCount)} Pending
                  </div>
                )}
                {noShowRecordsCount > 0 && (
                  <div 
                    style={{ width: `${(noShowRecordsCount / (allocatedCount || 1)) * 100}%`, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                    title={`No-Shows: ${noShowRecordsCount}`}
                  >
                    {noShowRecordsCount} No-Shows
                  </div>
                )}
                {parentAbsentCount > 0 && (
                  <div 
                    style={{ width: `${(parentAbsentCount / (allocatedCount || 1)) * 100}%`, background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700 }}
                    title={`Absent: ${parentAbsentCount}`}
                  >
                    {parentAbsentCount} Absents
                  </div>
                )}
              </div>
            </div>

            {/* Charts Double Column Layout */}
            <div className="analytics-section">
              {/* Pie chart */}
              <div className="chart-card" style={{ width: '100%', margin: '0' }}>
                <h3 className="chart-header">
                  <PieChart size={18} />
                  <span>Vehicle Fleet Operations Status</span>
                </h3>
                <div className="chart-body">
                  <svg className="visual-pie-chart" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={`${activePct} 314`}
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray={`${maintPct} 314`}
                      strokeDashoffset={`-${activePct}`}
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeDasharray={`${inactivePct} 314`}
                      strokeDashoffset={`-${activePct + maintPct}`}
                    />
                  </svg>
                  
                  <div className="pie-legend">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                      <span>Active ({activeVehicles})</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                      <span>Maintenance ({maintenanceVehicles})</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                      <span>Inactive ({inactiveVehicles})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Utilization Bar Chart */}
              <div className="chart-card" style={{ width: '100%', margin: '0' }}>
                <h3 className="chart-header">
                  <BarChart3 size={18} />
                  <span>Institutional Route Utilization</span>
                </h3>
                <div className="chart-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', justifyContent: 'flex-start', minHeight: '200px' }}>
                  {routeUtilization.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No routes registered in the system.</div>
                  ) : (
                    routeUtilization.map((item) => {
                      const percentage = (item.count / maxRouteCount) * 100;
                      return (
                        <div key={item.routeName} style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                            <span style={{ color: '#334155' }}>{item.routeName}</span>
                            <span style={{ color: '#2563eb' }}>{item.count} Wards Allocated</span>
                          </div>
                          <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: '5px', transition: 'width 0.5s ease-out' }}></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Fleet IoT Gate & Safety Monitor */}
            <div className="dashboard-panel" style={{ marginTop: '24px' }}>
              <div className="panel-header">
                <h2 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: '#2563eb' }} />
                  <span>Fleet IoT Gate & Security Monitor</span>
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Active Safety Alerts */}
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>AI Safety Violations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {safetyAlerts.filter((a) => !a.resolved).length === 0 ? (
                      <div style={{ padding: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>
                        All driver feeds normal. No safety alerts.
                      </div>
                    ) : (
                      safetyAlerts.filter((a) => !a.resolved).map((a) => (
                        <div key={a.id} style={{ padding: '10px 14px', background: a.severity === 'Critical' ? '#fff1f2' : '#fffbeb', border: `1px solid ${a.severity === 'Critical' ? '#fecdd3' : '#fef3c7'}`, borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: a.severity === 'Critical' ? '#be123c' : '#b45309', display: 'block' }}>{a.type}</span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>Vehicle: {a.vehicleNumber} | {new Date(a.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <span className={`badge ${a.severity === 'Critical' ? 'danger' : 'warning'}`}>{a.severity}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Gate Scans History */}
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>Recent Fastag Access Scans</h3>
                  <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <table className="roster-table" style={{ width: '100%', fontSize: '12px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '6px 10px' }}>Bus</th>
                          <th style={{ padding: '6px 10px' }}>Gate</th>
                          <th style={{ padding: '6px 10px' }}>Access</th>
                          <th style={{ padding: '6px 10px' }}>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fastagLogs.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>No gate scans recorded yet.</td>
                          </tr>
                        ) : (
                          fastagLogs.slice(0, 5).map((log) => (
                            <tr key={log.id}>
                              <td style={{ padding: '6px 10px', fontWeight: 700 }}>{log.vehicleNumber}</td>
                              <td style={{ padding: '6px 10px' }}>{log.gateName}</td>
                              <td style={{ padding: '6px 10px' }}>
                                <span className={`badge ${log.direction === 'Entry' ? 'active' : 'inactive'}`}>
                                  {log.direction === 'Entry' ? 'Entry' : 'Exit'}
                                </span>
                              </td>
                              <td style={{ padding: '6px 10px', color: '#64748b', fontSize: '10px' }}>
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
          </>
        );
      })()}

      {/* ── STUDENT DIRECTORY TAB ── */}
      {activeTab === 'students' && (
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <ClipboardList size={18} />
              <span>Student Passengers Directory ({students.length})</span>
            </h2>
          </div>
          
          <div className="search-filter-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="search-input-wrapper" style={{ flexGrow: 1, marginRight: '16px' }}>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '14px' }}
                placeholder="Search students by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-add"
              onClick={() => setStudentModalOpen({ open: true, mode: 'add' })}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
            >
              <Plus size={16} />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => setIsBulkStudentModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', height: '38px', background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#1e293b', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              <Upload size={15} />
              <span>Upload CSV / Excel</span>
            </button>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filtered = students.filter(s => 
                    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  if (filtered.length === 0) {
                    return (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                          No student records found matching search.
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
                      <td>
                        <button
                          className="btn-add"
                          onClick={() => setStudentModalOpen({ open: true, mode: 'edit', data: s })}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit Profile
                        </button>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Student profile form modal */}
          {studentModalOpen.open && (
            <div className="modal-overlay">
              <div className="modal" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h3>{studentModalOpen.mode === 'add' ? 'Register New Student Passenger' : 'Modify Student Passenger'}</h3>
                  <button className="modal-close" onClick={() => setStudentModalOpen({ open: false, mode: 'add' })}>
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
                        defaultValue={studentModalOpen.data?.studentName || ''}
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
                        defaultValue={studentModalOpen.data?.studentId || ''}
                        readOnly={studentModalOpen.mode === 'edit'}
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
                        defaultValue={studentModalOpen.data?.parentContact || ''}
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Parent Email (Optional)</label>
                      <input
                        type="email"
                        name="parentEmail"
                        className="form-input"
                        defaultValue={studentModalOpen.data?.parentEmail || ''}
                        placeholder="e.g. parent@example.com"
                      />
                    </div>
                    
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Assigned Route</label>
                      <select name="route" className="form-select" defaultValue={studentModalOpen.data?.route || 'None'}>
                        <option value="None">None (Unassigned)</option>
                        {routes.map((r) => (
                          <option key={r.routeName} value={r.routeName}>{r.routeName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Assigned Bus</label>
                      <select name="bus" className="form-select" defaultValue={studentModalOpen.data?.bus || 'None'}>
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
                        defaultValue={studentModalOpen.data?.pickupStop || 'None'}
                        placeholder="e.g. Sector 4 Gate"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">Drop Stop</label>
                      <input
                        type="text"
                        name="dropStop"
                        className="form-input"
                        defaultValue={studentModalOpen.data?.dropStop || 'None'}
                        placeholder="e.g. Sector 4 Gate"
                      />
                    </div>
                  </div>
                  <div className="form-actions" style={{ padding: '0 24px 24px' }}>
                    <button type="button" className="btn-cancel" onClick={() => setStudentModalOpen({ open: false, mode: 'add' })}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      {studentModalOpen.mode === 'add' ? 'Register Student' : 'Save Details'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ATTENDANCE OVERVIEW TAB ── */}
      {activeTab === 'attendance' && (() => {
        const filteredAttendance = attendance.filter((a) => {
          const matchDate = attendanceDate ? a.date === attendanceDate : true;
          const matchBus = attendanceBusFilter ? a.bus === attendanceBusFilter : true;
          const matchRoute = attendanceRouteFilter ? a.route === attendanceRouteFilter : true;
          return matchDate && matchBus && matchRoute;
        });

        const todayRecords = attendance.filter(a => a.date === attendanceDate);
        const presentCount = todayRecords.filter(a => a.status !== 'Absent').length;
        const absentCount = todayRecords.filter(a => a.status === 'Absent').length;

        return (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="stat-card">
                <div className="stat-icon success"><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Present Today</span>
                  <span className="stat-value">{presentCount} Students</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Absent Today</span>
                  <span className="stat-value">{absentCount} Students</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}><UserCheck /></div>
                <div className="stat-details">
                  <span className="stat-label">Total Logged</span>
                  <span className="stat-value">{todayRecords.length} Records</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="search-filter-container" style={{ marginBottom: '12px' }}>
              <div className="filters-group" style={{ flexGrow: 1, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Date</label>
                  <input
                    type="date"
                    className="filter-select"
                    style={{ width: '100%' }}
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Route</label>
                  <select className="filter-select" style={{ width: '100%' }} value={attendanceRouteFilter} onChange={(e) => setAttendanceRouteFilter(e.target.value)}>
                    <option value="">All Routes</option>
                    {routes.map((r) => <option key={r.routeName} value={r.routeName}>{r.routeName}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ minWidth: '150px' }}>
                  <label className="form-label" style={{ fontSize: '11px', margin: 0 }}>Bus</label>
                  <select className="filter-select" style={{ width: '100%' }} value={attendanceBusFilter} onChange={(e) => setAttendanceBusFilter(e.target.value)}>
                    <option value="">All Buses</option>
                    {vehicles.map((v) => <option key={v.vehicleNumber} value={v.vehicleNumber}>{v.vehicleNumber}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Route</th>
                    <th>Bus Plate</th>
                    <th>Parent-Set Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                        No attendance records found for the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((a) => (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 600 }}>{a.date}</td>
                          <td style={{ fontWeight: 700 }}>{a.studentName}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{a.studentId}</td>
                          <td style={{ fontWeight: 600, color: '#2563eb' }}>{a.route || '-'}</td>
                          <td style={{ fontWeight: 600 }}>{a.bus}</td>
                          <td>
                            <span className={`badge ${a.status === 'Absent' ? 'absent' : a.status === 'Dropped' ? 'info' : 'active'}`}>
                              {a.status}
                            </span>
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
        );
      })()}

      {/* ── DATABASE SYSTEM CONTROL TAB ── */}
      {activeTab === 'database' && (
        <div className="dashboard-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="panel-header" style={{ borderBottomColor: '#fca5a5' }}>
            <h2 className="panel-title" style={{ color: '#ef4444' }}>
              <ShieldAlert size={20} />
              <span>System Integrity & Storage Control</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
              Warning: Resetting the database will restore all users, routes, buses, and student assignments to their default seeded state. This will erase any new records added during this test session.
            </p>
            <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldAlert size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b', display: 'block' }}>DANGER ZONE</span>
                <span style={{ fontSize: '12px', color: '#b91c1c' }}>This operation will flush and re-initialize localStorage tables immediately.</span>
              </div>
            </div>
            <button 
              className="btn-danger" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
              onClick={executeReseed}
            >
              <RefreshCw size={16} />
              <span>Reseed LocalStorage Database</span>
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS / FCM PUSH TAB (Super Admin) ── */}
      {activeTab === 'notifications' && (
        <AdminNotifications />
      )}

      {/* ── Bulk Student Upload Modal ─────────────────────── */}
      <BulkStudentUploadModal
        isOpen={isBulkStudentModalOpen}
        onClose={() => setIsBulkStudentModalOpen(false)}
        onSuccess={(count) => {
          toast.success(`${count} student(s) imported successfully!`);
          fetchAdminData();
        }}
      />
    </div>
  );
};
export default SuperAdminDashboard;
